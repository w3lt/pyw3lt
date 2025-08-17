import { Button } from "@/components/ui/button"
import { Download, RotateCw } from "lucide-react"

interface Props {
  onClick?: () => void
  isInstalling: boolean
}

export default function InstallButton({
  onClick,
  isInstalling
}: Props) {
  return (
    <Button
      size="sm"
      variant="ghost"
      className="h-8 w-full sm:w-8 p-0 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/50 sm:flex-shrink-0 sm:mt-0.5 flex items-center justify-center gap-2 sm:gap-0"
      title="Install package"
      onClick={onClick}
      disabled={isInstalling}
    >
      {isInstalling ? (
        <RotateCw className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
    </Button>
  )
}