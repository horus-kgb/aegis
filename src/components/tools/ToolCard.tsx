import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LucideIcon, Play, Settings, Info } from "lucide-react";

interface ToolCardProps {
  name?: string;
  description?: string;
  icon?: LucideIcon;
  category?: string;
  version?: string;
  lastUsed?: string;
  status?: string;
  tool?: {
    name: string;
    description: string;
    icon: LucideIcon;
    category: string;
    version: string;
    lastUsed?: string;
    status: string;
  };
  onRun?: () => void;
  onConfigure?: () => void;
  onLaunch?: () => void;
  restricted?: boolean;
  className?: string;
}

const categoryStyles = {
  recon: "border-info/20 bg-info/5",
  vuln: "border-warning/20 bg-warning/5",
  exploit: "border-destructive/20 bg-destructive/5",
  "post-exploit": "border-destructive/20 bg-destructive/5",
  monitoring: "border-success/20 bg-success/5",
  forensics: "border-primary/20 bg-primary/5",
};

const statusBadges = {
  ready: { variant: "outline" as const, text: "Ready", className: "border-success/30 text-success" },
  running: { variant: "default" as const, text: "Running", className: "bg-warning/10 text-warning border-warning/20" },
  disabled: { variant: "secondary" as const, text: "Disabled", className: "" },
  "lab-only": { variant: "destructive" as const, text: "Lab Only", className: "" },
};

export function ToolCard({
  name: propName,
  description: propDescription,
  icon: propIcon,
  category: propCategory,
  version: propVersion,
  lastUsed: propLastUsed,
  status: propStatus,
  tool,
  onRun,
  onConfigure,
  onLaunch,
  restricted,
  className
}: ToolCardProps) {
  // Use tool object if provided, otherwise use individual props
  const name = tool?.name || propName || "Unknown Tool";
  const description = tool?.description || propDescription || "";
  const icon: LucideIcon = tool?.icon || propIcon || Info;
  const category = tool?.category || propCategory || "unknown";
  const version = tool?.version || propVersion || "1.0.0";
  const lastUsed = tool?.lastUsed || propLastUsed;
  const status = tool?.status || propStatus || "ready";
  
  const Icon = icon;
  const statusConfig = statusBadges[status as keyof typeof statusBadges] || statusBadges.ready;
  const canRun = status === "ready" || status === "running";
  
  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-200 hover:shadow-lg group",
      categoryStyles[category],
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
              <Icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg">{name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs h-5 px-2">
                  v{version}
                </Badge>
                <Badge 
                  variant={statusConfig.variant}
                  className={cn("text-xs h-5 px-2", statusConfig.className)}
                >
                  {statusConfig.text}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
        
        {lastUsed && (
          <div className="text-xs text-muted-foreground">
            Last used: {lastUsed}
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <Button
            variant={canRun ? "premium" : "outline"}
            size="sm"
            className="flex-1"
            disabled={!canRun}
            onClick={onRun || onLaunch}
          >
            <Play className="h-3 w-3 mr-2" />
            {status === "running" ? "View Logs" : "Run Tool"}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onConfigure}
          >
            <Settings className="h-3 w-3" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
          >
            <Info className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 pointer-events-none" />
      
      {/* Running indicator */}
      {status === "running" && (
        <div className="absolute top-2 right-2">
          <div className="h-3 w-3 rounded-full bg-success animate-pulse-glow"></div>
        </div>
      )}
    </Card>
  );
}