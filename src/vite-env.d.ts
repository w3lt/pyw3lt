/// <reference types="vite/client" />

declare global {
  interface Window {
    __TAURI__: {
      convertFileSrc: (filePath: string, protocol?: string) => string
      invoke: (cmd: string, args?: Record<string, any>) => Promise<any>
      transformCallback: (callback?: (response: any) => void, once?: boolean) => number
    }
    __TAURI_METADATA__: {
      __currentWindow: {
        label: string
      }
      __windows: Array<{
        label: string
      }>
    }
  }
}

export {}