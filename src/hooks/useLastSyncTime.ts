import getLastSyncTime from "@/utils/getLasSyncTime"
import { useEffect, useState } from "react"

const useLastSyncTime = () => {
  const [lastSyncTime, setLastSyncTime] = useState<Date>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    getLastSyncTime()
      .then(t => {
        setLastSyncTime(new Date(t))
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  return { lastSyncTime, setLastSyncTime, isLoading }
}

export default useLastSyncTime