import { Editor, useMonaco } from "@monaco-editor/react"
import { Buffer } from "@/contexts/ProjectContext"
import { Dispatch, SetStateAction, useEffect } from "react"
import latte from "@/assets/themes/catppuccin-latte.json"
import * as monaco from "monaco-editor"

interface Props {
  buffer: Buffer
  setBuffers: Dispatch<SetStateAction<Buffer[]>>
}

export default function BufferEditor({ buffer, setBuffers }: Props) {
  const monaco = useMonaco()
  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme("catppuccin-latte", latte as monaco.editor.IStandaloneThemeData)
      monaco.editor.setTheme("catppuccin-latte")
    }
  }, [monaco])

  return (
    <Editor
      height="100%"
      width="100%"
      defaultLanguage="python"
      value={buffer.bufferContent}
      theme="catppuccin-latte"
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
    />
  )
}