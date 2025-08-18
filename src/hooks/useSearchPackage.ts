import PackageInfo from "@/types/frontend/PackageInfo"
import log from "@/utils/log"
import searchPackages from "@/utils/searchPackage"
import { useEffect, useState } from "react"

const useSearchPackage = (query: string, projectPath: string) => {
  const [packages, setPackages] = useState<PackageInfo[]>([])
  const [isSearching, setIsSearching] = useState(true)

  useEffect(() => {
    if (query.trim().length === 0) {
      setIsSearching(false)
      setPackages([])
      return
    }

    searchPackages(query, 10, projectPath)
      .then((results) => {
        setPackages(results)
      })
      .catch(async (error) => {
        log(error)
      })
      .finally(() => {
        setIsSearching(false)
      })
  }, [query])

  return { packages, isSearching }
}

export default useSearchPackage