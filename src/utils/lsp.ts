import { CompletionList, Diagnostic, DidChangeTextDocumentParams, DidOpenTextDocumentParams } from "vscode-languageserver-protocol"
import * as monaco from "monaco-editor"

interface PendingRequest<T> {
  resolve: (res: T) => void
  timestamp: number
  method: string
}

export default class LspClient {
  private ws!: WebSocket
  private requestId = 0
  private pending: Record<number, PendingRequest<CompletionList>> = {}
  public diagnosticsMap: Record<string, monaco.editor.IMarkerData[]> = {}

  /**
   * Creates an instance of the LspClient.
   * @param url The WebSocket URL to connect to.
   */
  constructor(private url: string) { }

  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.url)

      this.ws.onopen = () => resolve()
      this.ws.onerror = (err) => reject(err)

      this.ws.onmessage = (event: MessageEvent<string>) => {
        const raw = event.data
        const msg = JSON.parse(raw)

        if (msg.id && this.pending[msg.id]) {
          this.pending[msg.id].resolve(msg.result)
          delete this.pending[msg.id]
        }
      }
    })
  }

  public onDiagnostics(
    callback: (
      uri: string,
      diagnostics: monaco.editor.IMarkerData[]
    ) => void
  ) {
    this.ws.onmessage = (event: MessageEvent<string>) => {
      const raw = event.data
      const msg = JSON.parse(raw)

      if (msg.method !== "textDocument/publishDiagnostics") return
      const params = msg.params
      const uri = params.uri
      const diagnostics: monaco.editor.IMarkerData[] = params.diagnostics.map((d: Diagnostic) => ({
        severity: d.severity === 1
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
      }))

      this.diagnosticsMap[uri] = diagnostics
      callback(uri, diagnostics)
    }
  }

  public sendRequest<T>(method: string, params: T, timeout = 5000): Promise<CompletionList> {
    return new Promise((resolve, reject) => {
      const id = ++this.requestId
      this.pending[id] = { resolve, timestamp: Date.now(), method }

      const payload = JSON.stringify({ jsonrpc: "2.0", id, method, params })
      this.ws.send(payload)

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
  public didOpen(uri: string, text: string) {
    const params: DidOpenTextDocumentParams = {
      textDocument: { uri, languageId: "python", version: 1, text }
    }
    this.ws.send(JSON.stringify({ jsonrpc: "2.0", method: "textDocument/didOpen", params }))
  }

  /** Notify server about document content change */
  didChange(uri: string, text: string, version: number) {
    const params: DidChangeTextDocumentParams = {
      textDocument: { uri, version },
      contentChanges: [{ text }]
    }
    this.ws.send(JSON.stringify({ jsonrpc: "2.0", method: "textDocument/didChange", params }))
  }
}
