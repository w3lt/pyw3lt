import { CompletionList, Diagnostic, DidChangeTextDocumentParams, DidOpenTextDocumentParams } from "vscode-languageserver-protocol"
import * as monaco from "monaco-editor"
import { listen } from "@tauri-apps/api/event"
import { invoke } from "@tauri-apps/api/core"

interface PendingRequest<T> {
  resolve: (res: T) => void
  reject: (err: Error) => void
  timestamp: number
  method: string
}

export default class LspClient {
  private requestId = 0
  public unlisten: () => void = () => { }
  private pending: Record<number, PendingRequest<CompletionList>> = {}
  public diagnosticsMap: Record<string, monaco.editor.IMarkerData[]> = {}
  public onDiagnosticsCallback?: ((uri: string, diagnostics: monaco.editor.IMarkerData[]) => void) = undefined

  /**
   * Creates an instance of the LspClient.
   * @param url The WebSocket URL to connect to.
   */
  constructor() { }

  /**
   * Sends a string message to the LSP server, the message doesn't contain the header.
   * @param message The message to send.
   */
  private async send(message: object) {
    await invoke("send_lsp_message", {
      msg: JSON.stringify(message),
    })
  }

  public async initListener() {
    this.unlisten = await listen<string>("lsp-message", (event) => {
      const raw = event.payload
      const msg = JSON.parse(raw) // raw doesnt content the header, it's just the jsonrpc body, the rest is handled by the backend

      // Handle response to a request
      if (msg.id && this.pending[msg.id]) {
        const { resolve, reject } = this.pending[msg.id]
        delete this.pending[msg.id]
        if (msg.error) {
          reject(new Error(msg.error.message))
        } else {
          resolve(msg.result)
        }
        return
      }

      // Handle notifications
      if (msg.method === "textDocument/publishDiagnostics") {
        const params = msg.params
        const uri = params.uri
        const diagnostics: monaco.editor.IMarkerData[] = params.diagnostics.map(
          (d: Diagnostic) => ({
            severity:
              d.severity === 1
                ? monaco.MarkerSeverity.Error
                : d.severity === 2
                  ? monaco.MarkerSeverity.Warning
                  : monaco.MarkerSeverity.Info,
            startLineNumber: d.range.start.line + 1,
            startColumn: d.range.start.character + 1,
            endLineNumber: d.range.end.line + 1,
            endColumn: d.range.end.character + 1,
            message: d.message,
            code: d.code,
          })
        )
        this.diagnosticsMap[uri] = diagnostics
        this.onDiagnosticsCallback?.(uri, diagnostics)
      }
    })
  }

  public sendRequest<T>(
    method: string,
    params: T,
    timeout = 5000
  ): Promise<CompletionList> {
    return new Promise((resolve, reject) => {
      const id = ++this.requestId
      this.pending[id] = { resolve, reject, timestamp: Date.now(), method }

      const payload = {
        jsonrpc: "2.0",
        id,
        method,
        params,
      }
      this.send(payload)

      if (timeout > 0) {
        setTimeout(() => {
          if (this.pending[id]) {
            delete this.pending[id]
            reject(new Error(`LSP request "${method}" timed out`))
          }
        }, timeout)
      }
    })
  }

  public updateMarkers(editor: monaco.editor.IStandaloneCodeEditor, uri: string) {
    const model = editor.getModel()
    if (model && model.uri.toString() === uri) {
      const markers = this.diagnosticsMap[uri] || []
      monaco.editor.setModelMarkers(model, "python-lsp", markers)
    }
  }

  /** Notify the language server about a newly opened in-memory document */
  public async didOpen(uri: string, text: string) {
    const params: DidOpenTextDocumentParams = {
      textDocument: { uri, languageId: "python", version: 1, text }
    }
    await this.send({ jsonrpc: "2.0", method: "textDocument/didOpen", params })
  }

  /** Notify server about document content change */
  public async didChange(uri: string, text: string, version: number) {
    const params: DidChangeTextDocumentParams = {
      textDocument: { uri, version },
      contentChanges: [{ text }]
    }
    await this.send({ jsonrpc: "2.0", method: "textDocument/didChange", params })
  }

  public dispose() {
    this.unlisten?.()
  }
}
