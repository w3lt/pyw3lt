import { Button } from "@/components/ui/button";
import useLastSyncTime from "@/hooks/useLastSyncTime";
import useNow from "@/hooks/useNow";
import syncPackageList from "@/utils/syncPackageList";
import formatSyncTime from "@/utils/syncTime";
import { invoke } from "@tauri-apps/api/core";
import { Loader2, RefreshCw } from "lucide-react";
import { useState } from "react";

interface Props {
  /**
   * The action to perform after syncing
   */
  onPostSync?: () => void;
}

export default function SyncStatusBar({ onPostSync }: Props) {
  const { lastSyncTime, setLastSyncTime, isLoading } = useLastSyncTime()
  const now = useNow();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    syncPackageList()
      .then(() => {
        setLastSyncTime(new Date());
        onPostSync?.();
      })
      .catch(async (error) => {
        await invoke("log", { message: error })
      })
      .finally(() => {
        setIsSyncing(false)
      })
  }

  if (isLoading) return null
  return (
    <div className="flex items-center justify-between mt-2 px-1 py-1 text-xs text-muted-foreground w-full">
      {lastSyncTime && (
        <span>Last sync: {formatSyncTime(lastSyncTime, now)}</span>
      )}
      <Button
        size="sm"
        variant="ghost"
        className="h-6 px-2 text-xs hover:bg-accent/50 ml-auto"
        onClick={handleSync}
        disabled={isSyncing}
        title="Sync package list"
      >
        {isSyncing ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <RefreshCw className="w-3 h-3 mr-1" />}
        Sync
      </Button>
    </div>
  )
}