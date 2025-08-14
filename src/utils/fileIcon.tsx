import TypeScriptReact from "@/assets/latte/typescript-react.svg?react"
import TypeScript from "@/assets/latte/typescript.svg?react"
import JavaScriptReact from "@/assets/latte/javascript-react.svg?react"
import JavaScript from "@/assets/latte/javascript.svg?react"
import Python from "@/assets/latte/python.svg?react"
import File from "@/assets/latte/_file.svg?react"
import Markdown from "@/assets/latte/markdown.svg?react"
import Json from "@/assets/latte/json.svg?react"
import Gitignore from "@/assets/latte/git.svg?react"
import PythonConfig from "@/assets/latte/python-config.svg?react"
import Readme from "@/assets/latte/readme.svg?react"

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
