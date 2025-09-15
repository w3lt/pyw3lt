import { useEffect, useState } from "react"
import FileNode from "../types/frontend/FileNode"
import { loadDir } from "@/utils/project"

export const useFileTree = (rootPath: string) => {
  const [fileTree, setFileTree] = useState<FileNode>({
    name: rootPath.replace(/\/$/, "").split("/").pop()!,
    path: rootPath,
    isDirectory: true,
    open: true,
    children: []
  })
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>()

  useEffect(() => {
    loadDir(rootPath)
      .then(res => {
        setFileTree(prev => ({
          ...prev,
          children: res
        }))
      })
      .catch(err => {
        setError(err.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [rootPath])

  return { fileTree, isLoading, error, setFileTree }
}
