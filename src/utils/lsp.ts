import { CompletionList } from "vscode-languageserver-protocol"

interface PendingRequest<T> {
  resolve: (res: T) => void
  timestamp: number
  method: string
}

export default class LspClient {
  private ws!: WebSocket
  private requestId = 0
  private pending: Record<number, PendingRequest<CompletionList>> = {}

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

      this.ws.onmessage = (event) => {
        const raw = event.data as string
        const json = raw.substring(raw.indexOf("{"))
        const msg = JSON.parse(json)

        if (msg.id && this.pending[msg.id]) {
          this.pending[msg.id].resolve(msg.result)
          delete this.pending[msg.id]
        }

        if (msg.method === "textDocument/publishDiagnostics") {
          // handle diagnostics
        }
      }
    })
  }

  public sendRequest(method: string, params: object, timeout = 5000): Promise<CompletionList> {
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
}
