import { invoke } from "@tauri-apps/api/core"

/**
 * Sync the local index with Pypi. This is kind of same as `apt update` or `brew update`
 */
const syncPackageList = async () => {
  await invoke("sync_package_list")
}

export default syncPackageList