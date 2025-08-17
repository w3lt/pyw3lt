import { Event, listen } from "@tauri-apps/api/event"

export const useBackendEventListener = <T>(
    name: string,
    callback: (event: Event<T>) => void
) => {
    listen<T>(name, callback)
}
