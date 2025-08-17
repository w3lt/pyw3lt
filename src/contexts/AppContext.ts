import View from "@/types/views";
import { createContext, Dispatch, SetStateAction } from "react";

export const AppContext = createContext<{
  homeDir: string
  view: View
  setView: (view: View) => void
  newProjectDialogOpen: boolean
  setNewProjectDialogOpen: Dispatch<SetStateAction<boolean>>
}>({
  homeDir: "",
  view: "greeting",
  setView: () => null,
  newProjectDialogOpen: false,
  setNewProjectDialogOpen: () => null
})

export const AppContextProvider = AppContext.Provider;
