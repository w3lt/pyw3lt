import { useState } from "react";
import "./App.css";
import { Editor } from "@monaco-editor/react";
import { useBackendEventListener } from "./hooks/backendEventListener";
import FileTree from "./components/FileTree";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { invoke } from "@tauri-apps/api/core";
import { PymonContextProvider } from "./contexts/PymonContext";
import FileNode from "./models/FileNode";
import NewProjectDialog from "./components/dialogs/NewProjectDialog";
import useHomeDirectory from "./hooks/useHomeDirectory";

function App() {
  const [buffer, setBuffer] = useState("# Write your Python code here");
  const [currentFile, setCurrentFile] = useState<FileNode>();
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false);

  const [rootPath, setRootPath] = useState<string>();

  const { homeDir, isLoading } = useHomeDirectory();

  useBackendEventListener<string>("project-selected", (event) => {
    void invoke("log", { message: event.payload })
    setRootPath(event.payload);
  });

  useBackendEventListener("new-project", () => {
    void invoke("log", { message: "New project dialog opened" });
    setNewProjectDialogOpen(true);
  })

  if (isLoading || homeDir === undefined) return null
  return (
    <PymonContextProvider
      value={{
        homeDir,
        currentDirectory: rootPath,
        currentFile,
        setCurrentFile,
        buffer,
        setBuffer,
        newProjectDialogOpen,
        setNewProjectDialogOpen
      }}
    >
      {/* Dialogs */}
      {newProjectDialogOpen && <NewProjectDialog />}

      <div style={{ width: "100vw", height: "100vh" }}>
        <PanelGroup direction="horizontal">
          {/* Left pane = File tree */}
          <Panel defaultSize={20}>
            {rootPath && <FileTree rootPath={rootPath} />}
          </Panel>

          <PanelResizeHandle className="bg-blue-500 hover:bg-blue-600 cursor-col-resize transition-colors duration-150 w-0.5" />

          {/* Right pane = Editor */}
          <Panel>
            <Editor
              height="100%"
              width="100%"
              defaultLanguage="python"
              value={buffer}
              theme="vs-light"
              onChange={(value) => setBuffer(value ?? "")}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: "on",
              }}
            />
          </Panel>
        </PanelGroup>
      </div>
    </PymonContextProvider>
  );
}

export default App;
