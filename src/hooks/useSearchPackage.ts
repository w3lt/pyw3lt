import PackageInfo from "@/types/backend/PackageInfo";
import searchPackages from "@/utils/searchPackage";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

const useSearchPackage = (query: string) => {
  const [packages, setPackages] = useState<PackageInfo[]>([]);
  const [isSearching, setIsSearching] = useState(true);

  useEffect(() => {
    if (query.trim().length === 0) {
      setIsSearching(false);
      setPackages([]);
      return;
    }

    searchPackages(query, 10)
      .then((results) => {
        setPackages(results);
      })
      .catch(async (error) => {
        await invoke("log", { message: error })
      })
      .finally(() => {
        setIsSearching(false);
      });
  }, [query]);

  return { packages, isSearching };
}

export default useSearchPackage