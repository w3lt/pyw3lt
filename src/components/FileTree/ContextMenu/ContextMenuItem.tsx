export interface ContextMenuItemProps {
  label: string
  onClick: () => void
}

export default function ContextMenuItem({ label, onClick }: ContextMenuItemProps) {
  return (
    <div onClick={onClick}>
      {label}
    </div>
  )
}