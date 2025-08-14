import FileNode from "@/models/FileNode";
import { createContext, Dispatch, SetStateAction } from "react";

export const PymonContext = createContext<{
  homeDir: string
  currentDirectory?: string
  currentFile?: FileNode
  setCurrentFile: Dispatch<SetStateAction<FileNode | undefined>>
  buffer: string
  setBuffer: Dispatch<SetStateAction<string>>
  // Dialog state
  newProjectDialogOpen: boolean
  setNewProjectDialogOpen: Dispatch<SetStateAction<boolean>>
}>({
  homeDir: "",
  currentDirectory: undefined,
  currentFile: undefined,
  setCurrentFile: () => null,
  buffer: "print(\"Welcome to Pymon\")",
  setBuffer: () => null,
  newProjectDialogOpen: false,
  setNewProjectDialogOpen: () => null
})

export const PymonContextProvider = PymonContext.Provider;