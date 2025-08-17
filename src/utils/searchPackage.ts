import PackageInfo from "@/types/backend/PackageInfo"
import { invoke } from "@tauri-apps/api/core"

const searchPackages = async (query: string, resultNumber: number): Promise<PackageInfo[]> => {
  const res = await invoke("search_packages", { query, resultNumber })
  return res as PackageInfo[]
}

export default searchPackages