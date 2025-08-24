import { CompletionList } from "vscode-languageserver-protocol"

let ws: WebSocket
let requestId = 0
const pending: Record<number, (res: any) => void> = {}

export function connectLsp(): Promise<void> {
  return new Promise((resolve, reject) => {
    ws = new WebSocket("ws://localhost:30000")

    ws.onopen = () => {
      console.log("LSP connected")
      resolve()
    }

    ws.onerror = (err) => reject(err)

    ws.onmessage = (event) => {
      const raw = event.data as string
      const json = raw.substring(raw.indexOf("{"))
      const msg = JSON.parse(json)

      if (msg.id && pending[msg.id]) {
        pending[msg.id](msg.result)
        delete pending[msg.id]
      }
      if (msg.method === "textDocument/publishDiagnostics") {
        // TODO: handle diagnostics here
      }
    }
  })
}

export function sendLspRequest(method: string, params: object): Promise<CompletionList> {
  return new Promise((resolve) => {
    const id = ++requestId
    pending[id] = resolve

    const payload = JSON.stringify({ jsonrpc: "2.0", id, method, params })

    ws.send(payload)
  })
}
