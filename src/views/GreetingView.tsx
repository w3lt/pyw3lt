import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AppContext } from "@/contexts/AppContext"
import { cn } from "@/lib/utils"
import log from "@/utils/log"
import { invoke } from "@tauri-apps/api/core"
import { Code2, FolderOpen, Plus, Sparkles } from "lucide-react"
import { useContext } from "react"

export default function GreetingView() {
  const { setNewProjectDialogOpen } = useContext(AppContext)
  const recentProjects = [
    { name: "ml-classifier", path: "/Users/dev/projects/ml-classifier", lastOpened: "2 hours ago" },
    { name: "data-pipeline", path: "/Users/dev/projects/data-pipeline", lastOpened: "1 day ago" },
    { name: "web-scraper", path: "/Users/dev/projects/web-scraper", lastOpened: "3 days ago" },
  ]

  const handleOpenProject = () => {
    invoke("open_project")
      .catch(async error => {
        log(`Error opening project: ${error}`)
      })
  }

  const handleOpenNewProjectDialog = () => setNewProjectDialogOpen(true)

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-2xl mx-4 shadow-sm border-border/50">
        <CardContent className="p-12 text-center">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
                <Code2 className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Welcome to PyW3lt!</h1>
            <p className="text-muted-foreground text-lg">Your Python development environment</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="h-12 px-8 font-medium"
              onClick={handleOpenNewProjectDialog}
            >
              <Plus className="w-5 h-5 mr-2" />
              New Project
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 font-medium bg-transparent"
              onClick={handleOpenProject}
            >
              <FolderOpen className="w-5 h-5 mr-2" />
              Open Project
            </Button>
          </div>

          {/* Recent Projects */}
          <div className="text-left">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-foreground text-sm uppercase tracking-wide">Recent Projects</h3>
            </div>

            <div className="space-y-2">
              {recentProjects.map((project, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 h-auto py-3 px-4",
                    "hover:bg-accent/50 active:bg-accent/70",
                    "text-foreground/90 hover:text-foreground",
                  )}
                  onClick={() => console.log(`Opening ${project.name}`)}
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <span className="text-sm">🐍</span>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm">{project.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{project.path}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{project.lastOpened}</div>
                </Button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              Press <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+N</kbd> for new project or{" "}
              <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+O</kbd> to open existing
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}