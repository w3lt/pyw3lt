import { Event, listen } from "@tauri-apps/api/event"
import { useEffect, useRef } from "react"

export const useBackendEventListener = <T>(
  name: string,
  callback: (event: Event<T>) => void
) => {
  const savedCallback = useRef(callback)

  // Always keep the latest callback
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    const unlistenPromise = listen<T>(name, (event) => savedCallback.current(event))

    return () => {
      unlistenPromise.then(unlisten => unlisten())
    }
  }, [name])
}
