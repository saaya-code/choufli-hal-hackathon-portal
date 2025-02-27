import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  className?: string;
  iconClassName?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  className = "",
  iconClassName = "text-primary",
}: StatCardProps) {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {title}
            </p>
            <h3 className="text-2xl font-bold">{value}</h3>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">
                {description}
              </p>
            )}
          </div>
          <div
            className={`h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center ${iconClassName}`}
          >
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
