import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface Props {
  onClick?: () => void
  isUpdating: boolean
}

export default function UpdateButton({
  onClick,
  isUpdating
}: Props) {
  return (
    <Button
      size="sm"
      variant="ghost"
      className="h-8 px-2 sm:px-1 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/50 flex items-center justify-center gap-1 transition-all duration-200 rounded-md"
      onClick={onClick}
      disabled={isUpdating}
      title="Update package"
    >
      {isUpdating ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z"
          />
        </svg>
      )}
      <span className="sm:hidden text-xs">Update</span>
    </Button>
  )
}