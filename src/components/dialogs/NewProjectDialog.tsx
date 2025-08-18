import { useContext, useState } from "react"
import { FolderOpen, Loader2Icon, PiIcon as Python } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

import { open } from "@tauri-apps/plugin-dialog"
import createProject from "@/utils/createProject"
import useAvailablePythonVersions from "@/hooks/useAvailablePythonVersions"
import { AppContext } from "@/contexts/AppContext"
import log from "@/utils/log"

export default function NewProjectDialog() {
  const { newProjectDialogOpen, setNewProjectDialogOpen, homeDir } = useContext(AppContext)

  const pythonVersions = useAvailablePythonVersions()

  const [pythonVersion, setPythonVersion] = useState("")
  const [projectPath, setProjectPath] = useState(`${homeDir.replace(/[\\/]+$/, "")}/Pymon Projects`)
  const [projectName, setProjectName] = useState("Untitled")

  const [isCreating, setIsCreating] = useState(false)

  const handleCreate = async () => {
    setIsCreating(true)
    try {
      await createProject({
        name: projectName,
        location: projectPath,
        pythonVersion
      })
    } catch (error) {
      log(`Error creating project: ${error}`)
    } finally {
      if (pythonVersion && projectPath && projectName) {
        // Reset form
        setIsCreating(false)
        setPythonVersion("")
        setProjectPath("")
        setProjectName("")
        setNewProjectDialogOpen(false)
      }
    }
    
  }

  const isFormValid = pythonVersion && projectPath && projectName

  return (
    <Dialog open={newProjectDialogOpen} onOpenChange={setNewProjectDialogOpen}>
      <DialogContent className="sm:max-w-md font-mono">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Python className="w-5 h-5 text-blue-500" />
            Create New Python Project
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Configure your new Python project settings
          </DialogDescription>
        </DialogHeader>

        <Card className="shadow-sm">
          <CardContent className="pt-6 space-y-4">
            {/* Project Name */}
            <div className="space-y-2">
              <Label htmlFor="project-name" className="text-xs uppercase tracking-wide font-semibold text-foreground">
                Project Name
              </Label>
              <Input
                id="project-name"
                placeholder="my-python-project"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className={cn(
                  "font-medium text-sm",
                  "hover:bg-accent/50 focus:bg-accent/50",
                  "text-foreground/90 placeholder:text-muted-foreground",
                )}
              />
            </div>

            {/* Project Path */}
            <div className="space-y-2">
              <Label htmlFor="project-path" className="text-xs uppercase tracking-wide font-semibold text-foreground">
                Project Path
              </Label>
              <div className="relative">
                <Input
                  id="project-path"
                  placeholder="/path/to/projects"
                  value={projectPath}
                  onChange={(e) => setProjectPath(e.target.value)}
                  className={cn(
                    "font-medium text-sm pr-10",
                    "hover:bg-accent/50 focus:bg-accent/50",
                    "text-foreground/90 placeholder:text-muted-foreground",
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    open({
                      multiple: false,
                      directory: true
                    })
                      .then(selected => {
                        if (typeof selected === "string") {
                          setProjectPath(selected)
                        }
                      })
                      .catch(async error => {
                        log(`File picker error: ${error}`)
                      })
                  }}
                  className={cn(
                    "absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0",
                    "hover:bg-accent/50 active:bg-accent/70",
                    "text-foreground/60 hover:text-foreground",
                  )}
                >
                  <FolderOpen className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Python Version */}
            <div className="space-y-2">
              <Label htmlFor="python-version" className="text-xs uppercase tracking-wide font-semibold text-foreground">
                Python Version
              </Label>
              <Select value={pythonVersion} onValueChange={setPythonVersion}>
                <SelectTrigger
                  id="python-version"
                  className={cn("font-medium text-sm", "hover:bg-accent/50 focus:bg-accent/50", "text-foreground/90")}
                >
                  <SelectValue placeholder="Select Python version" />
                </SelectTrigger>
                <SelectContent>
                  {pythonVersions.map((version) => (
                    <SelectItem key={version} value={version} className="font-medium text-sm">
                      Python {version}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            onClick={() => setNewProjectDialogOpen(false)}
            className={cn(
              "font-medium text-sm",
              "hover:bg-accent/50 active:bg-accent/70",
              "text-foreground/90 hover:text-foreground",
            )}
          >
            Cancel
          </Button>
          <Button
            onClick={() => void handleCreate()}
            disabled={!isFormValid || isCreating}
            className={cn("font-medium text-sm", "bg-primary hover:bg-primary/90", "text-primary-foreground")}
          >
            {isCreating && <Loader2Icon className="animate-spin" />}
            Create Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}