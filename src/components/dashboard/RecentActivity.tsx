import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Activity,
  Target, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  ExternalLink,
  Eye
} from "lucide-react";

interface ActivityItem {
  id: string;
  type: "job" | "alert" | "workflow" | "finding";
  title: string;
  description: string;
  timestamp: string;
  status: "completed" | "running" | "failed" | "pending";
  severity?: "low" | "medium" | "high" | "critical";
  tool?: string;
}

const mockActivities: ActivityItem[] = [
  {
    id: "1",
    type: "finding",
    title: "Critical SQL Injection discovered",
    description: "SQLMap detected SQL injection vulnerability in login form",
    timestamp: "2 minutes ago",
    status: "completed",
    severity: "critical",
    tool: "SQLMap"
  },
  {
    id: "2", 
    type: "job",
    title: "Nmap port scan in progress",
    description: "Scanning 203.0.113.0/24 network range",
    timestamp: "5 minutes ago", 
    status: "running",
    tool: "Nmap"
  },
  {
    id: "3",
    type: "workflow",
    title: "Web recon workflow completed",
    description: "Amass + Nuclei scan finished successfully",
    timestamp: "15 minutes ago",
    status: "completed",
    tool: "Workflow"
  },
  {
    id: "4",
    type: "alert",
    title: "Suspicious network activity",
    description: "Suricata detected potential data exfiltration",
    timestamp: "23 minutes ago",
    status: "pending",
    severity: "high"
  },
  {
    id: "5",
    type: "job",
    title: "Nuclei vulnerability scan failed",
    description: "Target host unreachable during scan",
    timestamp: "35 minutes ago",
    status: "failed",
    tool: "Nuclei"
  },
  {
    id: "6",
    type: "finding",
    title: "Open SSH service detected",
    description: "Port 22 open with weak authentication",
    timestamp: "1 hour ago",
    status: "completed", 
    severity: "medium",
    tool: "Nmap"
  }
];

const getStatusIcon = (status: string, type: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-success" />;
    case "running":
      return <Clock className="h-4 w-4 text-warning animate-pulse" />;
    case "failed":
      return <AlertTriangle className="h-4 w-4 text-destructive" />;
    case "pending":
      return <Clock className="h-4 w-4 text-muted-foreground" />;
    default:
      return <Activity className="h-4 w-4 text-muted-foreground" />;
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "job":
      return <Target className="h-3 w-3" />;
    case "alert":
      return <AlertTriangle className="h-3 w-3" />;
    case "workflow": 
      return <Activity className="h-3 w-3" />;
    case "finding":
      return <Eye className="h-3 w-3" />;
    default:
      return <Activity className="h-3 w-3" />;
  }
};

const getSeverityBadge = (severity?: string) => {
  if (!severity) return null;
  
  const variants = {
    low: "bg-info/10 text-info border-info/20",
    medium: "bg-warning/10 text-warning border-warning/20", 
    high: "bg-destructive/10 text-destructive border-destructive/20",
    critical: "bg-destructive text-destructive-foreground"
  };

  return (
    <Badge variant="outline" className={variants[severity as keyof typeof variants]}>
      {severity.toUpperCase()}
    </Badge>
  );
};

export function RecentActivity() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {mockActivities.map((activity) => (
              <div 
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors group"
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getStatusIcon(activity.status, activity.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs h-5 px-2">
                          {getTypeIcon(activity.type)}
                          <span className="ml-1 capitalize">{activity.type}</span>
                        </Badge>
                        {activity.tool && (
                          <Badge variant="secondary" className="text-xs h-5 px-2">
                            {activity.tool}
                          </Badge>
                        )}
                        {getSeverityBadge(activity.severity)}
                      </div>
                      
                      <p className="text-sm font-medium text-foreground line-clamp-1">
                        {activity.title}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {activity.timestamp}
                      </p>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="icon-sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="flex items-center justify-center pt-4">
          <Button variant="outline" size="sm">
            View All Activity
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}