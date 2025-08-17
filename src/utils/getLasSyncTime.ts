import { invoke } from "@tauri-apps/api/core"

const getLastSyncTime = async () => {
  return await invoke("get_last_sync_time") as number;
}

export default getLastSyncTime;
