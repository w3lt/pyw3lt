import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

export default function useHomeDirectory() {
  const [homeDir, setHomeDir] = useState<string>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    invoke("get_home_dir")
      .then(res => {
        setHomeDir(res as string)
      })
      .catch(async error => {
        await invoke("log", { message: `Error getting current directory: ${error}` })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  return { homeDir, isLoading }
}