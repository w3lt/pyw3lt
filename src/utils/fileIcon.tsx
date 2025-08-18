import TypeScriptReact from "@/assets/latte-icons/typescript-react.svg?react"
import TypeScript from "@/assets/latte-icons/typescript.svg?react"
import JavaScriptReact from "@/assets/latte-icons/javascript-react.svg?react"
import JavaScript from "@/assets/latte-icons/javascript.svg?react"
import Python from "@/assets/latte-icons/python.svg?react"
import File from "@/assets/latte-icons/_file.svg?react"
import Markdown from "@/assets/latte-icons/markdown.svg?react"
import Json from "@/assets/latte-icons/json.svg?react"
import Gitignore from "@/assets/latte-icons/git.svg?react"
import PythonConfig from "@/assets/latte-icons/python-config.svg?react"
import Readme from "@/assets/latte-icons/readme.svg?react"

export default function getFileIcon(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase()

  switch (fileName) {
    case "requirements.txt":
      return PythonConfig
    case "README.md":
      return Readme
  }

  switch (extension) {
    case "py":
      return Python
    case "tsx":
      return TypeScriptReact
    case "jsx":
      return JavaScriptReact
    case "ts":
      return TypeScript
    case "js":
      return JavaScript
    case "json":
      return Json
    case "md":
      return Markdown
    case "gitignore":
      return Gitignore
    default:
      return File
  }
}
