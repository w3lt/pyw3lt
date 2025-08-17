import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function UtilityContent({ title, children }: Props) {
  return (
    <Card className="shadow-sm font-mono text-sm h-full gap-0 py-2 flex-1 border-none rounded-none flex flex-col">
      <CardHeader className="px-7 flex items-center py-2 border-b-1">
        <h3 className="font-semibold text-foreground text-xs uppercase tracking-wide">
          {title}
        </h3>
      </CardHeader>

      <CardContent className="px-0 flex-1 h-full overflow-hidden">
        {children}
      </CardContent>
    </Card>
  );
}