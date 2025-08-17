import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface Props {
  onClick?: () => void
  isUninstalling: boolean
}

export default function RemoveButton({
  onClick,
  isUninstalling
}: Props) {
  return (
    <Button
      size="sm"
      variant="ghost"
      className="h-8 flex-1 sm:w-8 sm:flex-1-0 p-0 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50 flex items-center justify-center gap-2 sm:gap-0 transition-all duration-200"
      onClick={onClick}
      disabled={isUninstalling}
      title="Uninstall package"
    >
      {isUninstalling ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      )}
    </Button>
  )
}