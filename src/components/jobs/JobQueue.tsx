import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useJobs } from "@/hooks/useJobs";
import { 
  Clock, 
  Play, 
  Pause, 
  Square, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Eye,
  Download,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface JobQueueProps {
  onJobSelect?: (jobId: string) => void;
}

export function JobQueue({ onJobSelect }: JobQueueProps) {
  const { data: jobs, isLoading } = useJobs();
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "queued":
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      case "running":
        return <Play className="h-4 w-4 text-success animate-pulse" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "cancelled":
        return <Square className="h-4 w-4 text-muted-foreground" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-warning" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      queued: "bg-muted text-muted-foreground",
      running: "bg-success/10 text-success border-success/20",
      completed: "bg-success/10 text-success border-success/20",
      failed: "bg-destructive/10 text-destructive border-destructive/20",
      cancelled: "bg-muted text-muted-foreground"
    };

    return (
      <Badge variant="outline" className={variants[status as keyof typeof variants]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleJobClick = (jobId: string) => {
    setSelectedJob(jobId);
    onJobSelect?.(jobId);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Job Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeJobs = jobs?.filter(job => 
    job.status === "queued" || job.status === "running"
  ) || [];
  
  const completedJobs = jobs?.filter(job => 
    job.status === "completed" || job.status === "failed" || job.status === "cancelled"
  ) || [];

  return (
    <div className="space-y-6">
      {/* Active Jobs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-success" />
            Active Jobs ({activeJobs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeJobs.length > 0 ? (
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {activeJobs.map((job) => (
                  <div
                    key={job.id}
                    className={cn(
                      "p-4 rounded-lg border cursor-pointer transition-colors",
                      selectedJob === job.id 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:bg-muted/20"
                    )}
                    onClick={() => handleJobClick(job.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(job.status)}
                        <h4 className="font-medium">{job.name}</h4>
                      </div>
                      {getStatusBadge(job.status)}
                    </div>
                    
                    <div className="text-sm text-muted-foreground mb-2">
                      <div>Tool: {job.tool}</div>
                      <div>Target: {job.target}</div>
                      <div>Started: {job.started_at ? new Date(job.started_at).toLocaleString() : "Not started"}</div>
                    </div>

                    {job.status === "running" && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{job.progress}%</span>
                        </div>
                        <Progress value={job.progress} className="h-2" />
                      </div>
                    )}

                    <div className="flex items-center gap-2 mt-3">
                      <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      {job.status === "running" && (
                        <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                          <Pause className="h-3 w-3 mr-1" />
                          Pause
                        </Button>
                      )}
                      {job.status === "queued" && (
                        <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                          <Square className="h-3 w-3 mr-1" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No active jobs</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Jobs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-muted-foreground" />
            Recent Jobs ({completedJobs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {completedJobs.length > 0 ? (
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {completedJobs.slice(0, 10).map((job) => (
                  <div
                    key={job.id}
                    className={cn(
                      "p-3 rounded-lg border cursor-pointer transition-colors",
                      selectedJob === job.id 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:bg-muted/20"
                    )}
                    onClick={() => handleJobClick(job.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(job.status)}
                        <h4 className="font-medium text-sm">{job.name}</h4>
                      </div>
                      {getStatusBadge(job.status)}
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      <div>Tool: {job.tool} • Target: {job.target}</div>
                      <div>Completed: {job.completed_at ? new Date(job.completed_at).toLocaleString() : "N/A"}</div>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      {job.artifacts && job.artifacts.length > 0 && (
                        <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No completed jobs</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
