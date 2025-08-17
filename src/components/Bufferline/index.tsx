import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useContext } from "react";
import { ProjectContext } from "@/contexts/ProjectContext";
import BufferTab from "./BufferTab";

export default function Bufferline() {
  const { buffers, setBuffers } = useContext(ProjectContext)
  return (
    <Card className="shadow-sm font-mono text-sm rounded-none border-x-0 border-t-0 py-0">
      <div className="flex items-center">
        {/* Buffer Tabs */}
        <ScrollArea className="flex-1">
          <div className="flex items-center">
            {buffers.map(buffer => (
              <BufferTab
                key={buffer.file.path}
                buffer={buffer}
                onSelect={buffer => {
                  setBuffers(prev => {
                    const newPrev = [...prev];
                    newPrev.forEach(b => b.active = false); // Deactivate all buffers
                    const index = newPrev.findIndex(b => b.file.path === buffer.file.path);
                    if (index !== -1) {
                      newPrev[index] = {
                        ...newPrev[index],
                        active: true
                      };
                    }
                    return newPrev;
                  });
                }}
                onClose={() => {
                  setBuffers(prev => {
                    const newPrev = [...prev];
                    const index = newPrev.findIndex(b => b.file.path === buffer.file.path);
                    if (index !== -1) {
                      if (newPrev[index].active && newPrev.length > 1) {
                        // If the closed buffer is active, activate the next one
                        const nextIndex = (index + 1) % newPrev.length;
                        newPrev[nextIndex].active = true;
                      }
                      newPrev.splice(index, 1);
                    }
                    return newPrev;
                  });
                }}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  )
}