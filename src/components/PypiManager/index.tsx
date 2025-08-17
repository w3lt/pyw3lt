import UtilityContent from "../UtilityContent";
import { useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import searchPackages from "@/utils/searchPackage";
import PackageInfo from "@/types/backend/PackageInfo";
import { invoke } from "@tauri-apps/api/core";
import PackageListItem from "./PackageListItem";
import { Button } from "@/components/ui/button";
import formatSyncTime from "@/utils/syncTime";
import { ScrollArea } from "@radix-ui/react-scroll-area";

export default function PypiManager() {
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [packages, setPackages] = useState<PackageInfo[]>([]);

  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSearch = () => {
    if (query.trim().length === 0) {
      setPackages([]);
      return;
    }

    setIsSearching(true);
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
  }

  const handleSync = async () => {
    setIsSyncing(true)
    // Simulate sync delay
    setTimeout(() => {
      setLastSyncTime(new Date())
      setIsSyncing(false)
    }, 1500)
  }

  return (
    <UtilityContent title="Python Packages">
      <div className="p-2 flex flex-col h-full">
        <div className="relative">
          <input
            placeholder="Search packages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            className="w-full h-8 px-3 text-sm bg-background border border-border rounded-md"
          />
          {isSearching && <Loader2 className="absolute right-2 top-2 w-4 h-4 animate-spin text-muted-foreground" />}
        </div>
        <div className="flex items-center justify-between mt-2 px-1 py-1 text-xs text-muted-foreground w-full">
          <span>Last sync: {formatSyncTime(lastSyncTime)}</span>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 px-2 text-xs hover:bg-accent/50"
            onClick={handleSync}
            disabled={isSyncing}
            title="Sync package list"
          >
            {isSyncing ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <RefreshCw className="w-3 h-3 mr-1" />}
            Sync
          </Button>
        </div>
        <ScrollArea className="mt-4 space-y-2 flex-1 overflow-y-auto w-full scrollbar-hide">
          {isSearching ? (
            <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Searching packages...
            </div>
          ) : (
            packages
              .map((pkg) => (
                <PackageListItem key={pkg.name} info={pkg} />
              ))
          )}
        </ScrollArea>
      </div>
    </UtilityContent>
  )
}