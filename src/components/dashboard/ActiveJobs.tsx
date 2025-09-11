import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Play,
  Pause, 
  Square,
  ExternalLink,
  Clock,
  Target,
  Shield,
  Workflow
} from "lucide-react";
import { useJobs } from "@/hooks/useJobs";
import { formatDistanceToNow } from "date-fns";


const getCategoryIcon = (category: string) => {
  switch (category) {
    case "offensive":
      return <Target className="h-3 w-3 text-destructive" />;
    case "defensive":
      return <Shield className="h-3 w-3 text-success" />;
    case "workflow":
      return <Workflow className="h-3 w-3 text-primary" />;
    default:
      return <Target className="h-3 w-3" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "running":
      return <Badge className="bg-success/10 text-success border-success/20">Running</Badge>;
    case "queued":
      return <Badge variant="outline">Queued</Badge>;
    case "paused":
      return <Badge className="bg-warning/10 text-warning border-warning/20">Paused</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export function ActiveJobs() {
  const { data: allJobs = [] } = useJobs();
  const activeJobs = allJobs.filter(job => ['running', 'queued'].includes(job.status));
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5 text-primary" />
          Active Jobs
          <Badge variant="secondary" className="ml-auto">
            {activeJobs.filter(job => job.status === "running").length} Running
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {activeJobs.map((job) => (
              <div 
                key={job.id}
                className="p-4 rounded-lg border border-border bg-card hover:bg-muted/20 transition-colors group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(job.category)}
                    <span className="font-medium text-sm">{job.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {getStatusBadge(job.status)}
                    <Button 
                      variant="ghost" 
                      size="icon-sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Tool:</span>
                    <Badge variant="outline" className="text-xs h-5 px-2">
                      {job.tool}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Target:</span>
                    <span className="font-mono text-foreground">{job.target}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Started:</span>
                    <span>{job.started_at ? formatDistanceToNow(new Date(job.started_at), { addSuffix: true }) : 'Not started'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="capitalize">{job.status}</span>
                  </div>
                </div>

                {job.status === "running" && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{job.progress}%</span>
                    </div>
                    <Progress value={job.progress} className="h-2" />
                  </div>
                )}

                <div className="flex items-center justify-end gap-1 mt-3">
                  {job.status === "running" && (
                    <Button variant="outline" size="sm">
                      <Pause className="h-3 w-3 mr-1" />
                      Pause
                    </Button>
                  )}
                  {job.status === ("paused" as any) && (
                    <Button variant="outline" size="sm">
                      <Play className="h-3 w-3 mr-1" />
                      Resume
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Square className="h-3 w-3 mr-1" />
                    Stop
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex items-center justify-center pt-4">
          <Button variant="outline" size="sm">
            View All Jobs
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}