import { useContext } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ProjectContext } from "@/contexts/ProjectContext"
import utilityTabs from "./utilityTabs"

export function UtilitiesBar() {
  const { activeTab, setActiveTab } = useContext(ProjectContext)

  return (
    <div className="h-full bg-card flex flex-col w-12">
      {utilityTabs.map((tab) => {
        const Icon = tab.icon
        return (
          <Button
            key={tab.id}
            variant="ghost"
            size="sm"
            className={cn(
              "w-12 h-12 rounded-none border-r-2 border-transparent p-0 flex-shrink-0",
              "hover:bg-accent/50 hover:text-foreground transition-colors",
              "text-muted-foreground",
              activeTab === tab.id && "border-blue-500 bg-accent/30 text-foreground",
            )}
            onClick={() => setActiveTab(tab.id)}
            title={tab.label}
          >
            <Icon className="w-4 h-4" />
          </Button>
        )
      })}
    </div>
  )
}
