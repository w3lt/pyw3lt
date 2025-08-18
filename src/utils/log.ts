import { invoke } from "@tauri-apps/api/core"

const log = async (message: string) => {
  await invoke("log", { message })
}

export default log
