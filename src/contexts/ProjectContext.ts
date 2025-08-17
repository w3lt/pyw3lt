import { UtilityTabId } from "@/components/UtilityBar/utilityTabs"
import FileNode from "@/types/frontend/FileNode"
import { createContext, Dispatch, SetStateAction } from "react"

export interface Buffer {
  file: FileNode
  bufferContent: string
  /**
   * Whether the buffer is selected
   */
  active: boolean
  /**
   * Whether the buffer has unsaved changes
   */
  isDirty: boolean
}

export const ProjectContext = createContext<{
  currentDirectory: string
  buffers: Buffer[]
  setBuffers: Dispatch<SetStateAction<Buffer[]>>
  activeTab: UtilityTabId
  setActiveTab: Dispatch<SetStateAction<UtilityTabId>>
}>({
  currentDirectory: "",
  buffers: [],
  setBuffers: () => null,
  activeTab: "explorer",
  setActiveTab: () => null
})

export const ProjectContextProvider = ProjectContext.Provider