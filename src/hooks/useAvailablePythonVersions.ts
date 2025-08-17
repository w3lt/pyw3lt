import { invoke } from "@tauri-apps/api/core"
import { useEffect, useState } from "react"

export default function useAvailablePythonVersions() {
  const [versions, setVersions] = useState<string[]>([])

  useEffect(() => {
    invoke("list_versions")
      .then(res => {
        setVersions(res as string[])
      })
  }, [])

  return versions
}