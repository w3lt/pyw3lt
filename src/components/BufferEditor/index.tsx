import { Editor } from "@monaco-editor/react"
import { Buffer, ProjectContext } from "@/contexts/ProjectContext"
import { Dispatch, SetStateAction, useContext, useRef } from "react"
import LspClient from "@/utils/lsp"
import {
  CompletionList,
  CompletionTriggerKind,
  InitializeParams
} from "vscode-languageserver-protocol"
import langOfFile from "@/utils/langOfFile"

interface Props {
  buffer: Buffer
  setBuffers: Dispatch<SetStateAction<Buffer[]>>
}

export default function BufferEditor({ buffer, setBuffers }: Props) {
  const { currentDirectory } = useContext(ProjectContext)
  const lspClientRef = useRef(new LspClient("ws://localhost:30000"))
  const versionRef = useRef(1)

  const bufferUri = `inmemory://model${buffer.file.path}`

  return (
    <Editor
      height="100%"
      width="100%"
      language={langOfFile(buffer.file.path) || "plaintext"}
      value={buffer.bufferContent}
      theme="vs"
      onChange={(value) => {
        setBuffers(prev => {
          const newPrev = [...prev]
          const index = newPrev.findIndex(b => b.active)
          if (index !== -1) {
            newPrev[index] = {
              ...newPrev[index],
              bufferContent: value ?? "",
              isDirty: true
            }
          }
          return newPrev
        })

        versionRef.current++
        lspClientRef.current.didChange(bufferUri, value ?? "", versionRef.current)
      }}
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: "on",
      }}
      onMount={(editor, monaco) => {
        const lang = editor.getModel()?.getLanguageId()
        if (lang !== "python") return // Currently only Python is supported

        const onLsConnect = async () => {
          await lspClientRef.current.connect()

          await lspClientRef.current.sendRequest<InitializeParams>("initialize", {
            processId: null,
            rootUri: currentDirectory,
            workspaceFolders: [
              { uri: currentDirectory, name: "workspace" }
            ],
            capabilities: {
              textDocument: {
                synchronization: { didSave: true, willSave: false, willSaveWaitUntil: false },
                completion: { completionItem: { snippetSupport: true } },
                hover: { dynamicRegistration: false }
              },
              workspace: { workspaceFolders: true }
            }
          })

          await lspClientRef.current.sendRequest("initialized", {})

          // Open in-memory document
          lspClientRef.current.didOpen(bufferUri, buffer.bufferContent)

          lspClientRef.current.onDiagnostics((uri, diagnostics) => {
            const model = editor.getModel()
            if (model && bufferUri === uri) {
              monaco.editor.setModelMarkers(model, "python-lsp", diagnostics)
            }
          })
        }

        onLsConnect()
          .then(() => {
            monaco.languages.registerCompletionItemProvider("python", {
              provideCompletionItems: async (model, position) => {
                const items: CompletionList = await lspClientRef.current.sendRequest("textDocument/completion", {
                  textDocument: { uri: bufferUri },
                  position: { line: position.lineNumber - 1, character: position.column - 1 },
                  context: { triggerKind: CompletionTriggerKind.Invoked },
                })

                const wordUntil = model.getWordUntilPosition(position)
                const suggestions = (items.items ?? []).map(item => ({
                  label: item.label,
                  kind: item.kind ?? monaco.languages.CompletionItemKind.Text, // default fallback
                  insertText: item.insertText ?? item.label,
                  range: new monaco.Range(
                    position.lineNumber,
                    wordUntil.startColumn,
                    position.lineNumber,
                    wordUntil.endColumn
                  ),
                  sortText: item.sortText,
                  detail: item.detail,
                  documentation: item.documentation,
                }))

                return { suggestions }
              }
            })
          })
          .catch(err => console.error("LSP connection error:", err))
      }}
    />
  )
}