import { useState } from "react";
import "./App.css";
import { Editor } from "@monaco-editor/react";
import { useBackendEventListener } from "./hooks/backendEventListener";
import FileTree from "./components/FileTree";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { invoke } from "@tauri-apps/api/core";

function App() {
  const [code, setCode] = useState("# Write your Python code here");
  const [rootPath, setRootPath] = useState<string>();

  useBackendEventListener<string>("project-selected", (event) => {
    void invoke("log", { message: event.payload })
    setRootPath(event.payload);
  });

  return (
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
            value={code}
            theme="vs-light"
            onChange={(value) => setCode(value ?? "")}
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
  );
}

export default App;
