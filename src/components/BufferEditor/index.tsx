import { Editor } from "@monaco-editor/react"
import { Buffer, ProjectContext } from "@/contexts/ProjectContext"
import { Dispatch, SetStateAction, useContext } from "react"
import LspClient from "@/utils/lsp"
import {
  CompletionList,
  CompletionTriggerKind
} from "vscode-languageserver-protocol"
import langOfFile from "@/utils/langOfFile"

interface Props {
  buffer: Buffer
  setBuffers: Dispatch<SetStateAction<Buffer[]>>
}

export default function BufferEditor({ buffer, setBuffers }: Props) {
  const { currentDirectory } = useContext(ProjectContext)
  const lspClient = new LspClient("ws://localhost:30000")

  return (
    <Editor
      height="100%"
      width="100%"
      language={langOfFile(buffer.file.path) || "plaintext"}
      value={buffer.bufferContent}
      theme="vs"
      onChange={(value) => setBuffers(prev => {
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
      })}
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
          await lspClient.connect()

          await lspClient.sendRequest("initialize", {
            rootUri: currentDirectory,
            workspaceFolders: [
              { uri: currentDirectory, name: "workspace" }
            ],
            capabilities: {
              textDocument: {
                synchronization: {
                  didSave: true,
                  willSave: false,
                  willSaveWaitUntil: false,
                  didChange: true,
                },
                completion: {
                  completionItem: {
                    snippetSupport: true
                  }
                },
                hover: {
                  dynamicRegistration: false
                }
              },
              workspace: {
                workspaceFolders: true
              }
            }
          })

          await lspClient.sendRequest("initialized", {})
        }
        onLsConnect()
          .then(() => {
            monaco.languages.registerCompletionItemProvider("python", {
              provideCompletionItems: async (model, position) => {
                const items: CompletionList = await lspClient.sendRequest("textDocument/completion", {
                  textDocument: { uri: buffer.file.path },
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