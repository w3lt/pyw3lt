import { Files, GitBranch, Package, Search } from "lucide-react"

type UtilityTabId = "explorer" | "packages" | "search" | "git";

const utilityTabs: Array<{
  id: UtilityTabId;
  icon: React.ElementType;
  label: string;
}> = [
  {
    id: "explorer",
    icon: Files,
    label: "Explorer",
  },
  {
    id: "packages",
    icon: Package,
    label: "Packages",
  },
  {
    id: "search",
    icon: Search,
    label: "Search",
  },
  {
    id: "git",
    icon: GitBranch,
    label: "Git",
  }
]

export type { UtilityTabId }
export default utilityTabs