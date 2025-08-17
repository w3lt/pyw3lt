import { useState } from "react";
import "./App.css";
import View from "@/types/views";
import GreetingView from "./views/GreetingView";
import MainView from "./views/MainView";
import { AppContextProvider } from "@/contexts/AppContext";
import { useBackendEventListener } from "./hooks/backendEventListener";
import NewProjectDialog from "@/components/dialogs/NewProjectDialog";
import useHomeDirectory from "./hooks/useHomeDirectory";


function App() {
  const [view, setView] = useState<View>("greeting");
  const [rootPath, setRootPath] = useState<string>();
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false);

  const { homeDir, isLoading } = useHomeDirectory();

  useBackendEventListener<string>("project-selected", (event) => {
    setRootPath(event.payload);
    setView("main");
  });

  useBackendEventListener("new-project", () => {
    setNewProjectDialogOpen(true);
  });

  if (isLoading || homeDir === undefined) return null
  return (
    <AppContextProvider
      value={{
        homeDir,
        view,
        setView,
        newProjectDialogOpen,
        setNewProjectDialogOpen
      }}
    >
      {/* Dialogs */}
      {newProjectDialogOpen && <NewProjectDialog />}

      {view === "greeting" && <GreetingView />}
      {view === "main" && rootPath && <MainView projectRootPath={rootPath} />}
    </AppContextProvider>
  )
}

export default App;
