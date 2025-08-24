import { Editor } from "@monaco-editor/react"
import { Buffer, ProjectContext } from "@/contexts/ProjectContext"
import { Dispatch, SetStateAction, useContext } from "react"
import { connectLsp, sendLspRequest } from "@/utils/lsp"
import {
  CompletionList,
  CompletionTriggerKind
} from "vscode-languageserver-protocol"

interface Props {
  buffer: Buffer
  setBuffers: Dispatch<SetStateAction<Buffer[]>>
}

export default function BufferEditor({ buffer, setBuffers }: Props) {
  const { currentDirectory } = useContext(ProjectContext)

  return (
    <Editor
      height="100%"
      width="100%"
      language="python"
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
      onMount={(_, monaco) => {
        const onLsConnect = async () => {
          await connectLsp()

          await sendLspRequest("initialize", {
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

          await sendLspRequest("initialized", {})
        }
        onLsConnect()
          .then(() => {
            monaco.languages.registerCompletionItemProvider("python", {
              provideCompletionItems: async (model, position) => {
                const items: CompletionList = await sendLspRequest("textDocument/completion", {
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