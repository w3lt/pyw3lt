import { useState } from "react";
import { Editor } from "@monaco-editor/react";
import { useBackendEventListener } from "@/hooks/backendEventListener";
import FileTree from "@/components/FileTree";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { invoke } from "@tauri-apps/api/core";
import { ProjectContextProvider, Buffer } from "@/contexts/ProjectContext";
import Bufferline from "@/components/Bufferline";
import { UtilityTabId } from "@/components/UtilityBar/utilityTabs";
import { UtilitiesBar } from "@/components/UtilityBar";
import PypiManager from "@/components/PypiManager";

interface Props {
  projectRootPath: string;
}

export default function MainView({ projectRootPath }: Props) {
  const [buffers, setBuffers] = useState<Buffer[]>([]);
  const [activeTab, setActiveTab] = useState<UtilityTabId>("explorer");

  const currentBuffer = buffers.find(b => b.active)

  useBackendEventListener("save-file", () => {
    if (!currentBuffer || currentBuffer?.file.path.trim().length === 0) return;
    void invoke("save_file", {
      path: currentBuffer.file.path,
      content: buffers,
    })
      .catch((error) => {
        void invoke("log", { message: `Error saving file: ${error}` });
      });
  })

  return (
    <ProjectContextProvider
      value={{
        currentDirectory: projectRootPath,
        buffers,
        setBuffers,
        activeTab,
        setActiveTab
      }}
    >
      <div style={{ width: "100vw", height: "100vh" }}>
        <PanelGroup direction="horizontal">
          {/* Left pane = File tree */}
          <Panel defaultSize={22}>
            <div className="flex flex-row h-full w-full">
              <UtilitiesBar />
              {activeTab === "explorer" && <FileTree rootPath={projectRootPath} />}
              {activeTab === "packages" && <PypiManager />}
            </div>
          </Panel>

          <PanelResizeHandle className="bg-blue-500 hover:bg-blue-600 cursor-col-resize transition-colors duration-150 w-0.5" />

          {/* Right pane = Editor */}
          <Panel>
            <div className="h-full">
              {buffers.length > 0 && <Bufferline />}
              <Editor
                height="100%"
                width="100%"
                defaultLanguage="python"
                value={currentBuffer?.bufferContent}
                theme="vs-light"
                onChange={(value) => setBuffers(prev => {
                  const newPrev = [...prev];
                  const index = newPrev.findIndex(b => b.active);
                  if (index !== -1) {
                    newPrev[index] = {
                      ...newPrev[index],
                      bufferContent: value ?? "",
                      isDirty: true
                    };
                  }
                  return newPrev;
                })}
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                }}
              />
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </ProjectContextProvider>
  );
}