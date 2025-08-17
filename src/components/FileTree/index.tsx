import { useFileTree } from "../../hooks/useFileTree"
import FileTreeItem from "./FileTreeItem"
import UtilityContent from "../UtilityContent"

interface Props {
  rootPath: string;
}

export default function FileTree({ rootPath }: Props) {
  const { fileTree, isLoading, error } = useFileTree(rootPath)

  if (isLoading || error) return null
  return (
    <UtilityContent title="Explorer">
      <FileTreeItem node={fileTree} />
    </UtilityContent>
  )
}
