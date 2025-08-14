import { useFileTree } from "../../hooks/useFileTree";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import FileTreeItem from "./FileTreeItem";

interface Props {
  rootPath: string;
}

export default function FileTree({ rootPath }: Props) {
  const { fileTree, isLoading, error } = useFileTree(rootPath)

  if (isLoading || error) return null
  return (
    <Card className="shadow-sm font-mono text-sm h-full border-none gap-0 py-2">
      <CardHeader className="px-7 flex items-center py-2">
        <h3 className="font-semibold text-foreground text-xs uppercase tracking-wide">
          Explorer
        </h3>
      </CardHeader>

      <CardContent className="px-0">
        <ScrollArea className="h-full">
          <FileTreeItem node={fileTree} />
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
