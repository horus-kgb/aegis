import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useJobs } from "@/hooks/useJobs";
import { JobQueue } from "./JobQueue";
import { 
  Terminal,
  Download,
  Pause,
  Play,
  Square,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Eye,
  ExternalLink,
  List,
  Activity
} from "lucide-react";
import { useState, useEffect } from "react";

interface JobMonitorProps {
  onClose?: () => void;
  selectedJobId?: string;
}

// Mock data for demonstration
const mockLogs = [
  "[14:30:22] Starting Nmap 7.94 scan at 2024-01-15 14:30",
  "[14:30:22] Initiating Ping Scan at 14:30",
  "[14:30:23] Scanning 256 hosts [4 ports/host]",
  "[14:30:25] Completed Ping Scan at 14:30, 2.41s elapsed (256 total hosts)",
  "[14:30:25] Initiating Parallel DNS resolution of 23 hosts at 14:30", 
  "[14:30:26] Completed Parallel DNS resolution of 23 hosts at 14:30, 0.52s elapsed",
  "[14:30:26] Initiating SYN Stealth Scan at 14:30",
  "[14:30:26] Scanning 23 hosts [1000 ports/host]",
  "[14:31:15] Discovered open port 22/tcp on 203.0.113.10",
  "[14:31:15] Discovered open port 80/tcp on 203.0.113.10",
  "[14:31:15] Discovered open port 443/tcp on 203.0.113.10",
  "[14:31:28] Discovered open port 3389/tcp on 203.0.113.15",
  "[14:31:45] Completed SYN Stealth Scan at 14:31, 78.23s elapsed (23000 total ports)",
  "[14:31:45] Initiating Service scan at 14:31",
  "[14:31:45] Scanning 7 services on 4 hosts",
  "[14:32:10] Service scan Timing: About 67.00% done; ETC: 14:32 (0:00:15 remaining)"
];

const mockArtifacts = [
  { name: "nmap_scan.xml", size: "245 KB", type: "XML", hash: "sha256:abc123..." },
  { name: "nmap_scan.json", size: "182 KB", type: "JSON", hash: "sha256:def456..." },
  { name: "ports_summary.csv", size: "12 KB", type: "CSV", hash: "sha256:ghi789..." }
];

const mockFindings = [
  {
    id: "finding-001",
    severity: "medium",
    title: "SSH Service Detected",
    description: "SSH service running on port 22 with potential weak configuration"
  },
  {
    id: "finding-002", 
    severity: "low",
    title: "HTTP Service Detected",
    description: "Web server running on port 80 without HTTPS redirect"
  },
  {
    id: "finding-003",
    severity: "high",
    title: "RDP Service Exposed",
    description: "Remote Desktop Protocol exposed on port 3389 to internet"
  }
];

const getSeverityBadge = (severity: string) => {
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

export function JobMonitor({ onClose, selectedJobId }: JobMonitorProps) {
  const [activeTab, setActiveTab] = useState<"queue" | "logs" | "findings" | "artifacts">("queue");
  const [selectedJob, setSelectedJob] = useState<string | null>(selectedJobId || null);
  const { data: jobs } = useJobs();
  
  const job = jobs?.find(j => j.id === selectedJob);
  
  // Use mock data if no real job is selected
  const logs = job?.logs ? job.logs.split('\n') : mockLogs;
  const artifacts = job?.artifacts || mockArtifacts;
  const findings = mockFindings; // TODO: Implement findings from database

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="h-6 w-6" />
            Job Monitor
          </h1>
          <p className="text-muted-foreground">Monitor and manage security tool executions</p>
        </div>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        )}
      </div>

      {/* Job Header - Only show if a job is selected */}
      {job && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl">{job.name}</CardTitle>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span>Job ID: {job.id}</span>
                  <span>Tool: {job.tool}</span>
                  <span>Target: {job.target}</span>
                  <span>Started: {job.started_at ? new Date(job.started_at).toLocaleString() : "Not started"}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={job.status === "running" ? "default" : "outline"}
                  className={
                    job.status === "running" ? "bg-success/10 text-success border-success/20" : ""
                  }
                >
                  {job.status === "running" && <Clock className="h-3 w-3 mr-1 animate-pulse" />}
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{job.progress}%</span>
              </div>
              <Progress value={job.progress} className="h-3" />
              
              <div className="flex items-center gap-2">
                {job.status === "running" && (
                  <>
                    <Button variant="outline" size="sm">
                      <Pause className="h-3 w-3 mr-2" />
                      Pause
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Square className="h-3 w-3 mr-2" />
                      Stop
                    </Button>
                  </>
                )}
                {job.status === "queued" && (
                  <Button variant="destructive" size="sm">
                    <Square className="h-3 w-3 mr-2" />
                    Cancel
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-3 w-3 mr-2" />
                  Open in New Tab
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="queue" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Job Queue
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2" disabled={!job}>
            <Terminal className="h-4 w-4" />
            Live Logs
          </TabsTrigger>
          <TabsTrigger value="findings" className="flex items-center gap-2" disabled={!job}>
            <Eye className="h-4 w-4" />
            Findings ({findings.length})
          </TabsTrigger>
          <TabsTrigger value="artifacts" className="flex items-center gap-2" disabled={!job}>
            <FileText className="h-4 w-4" />
            Artifacts ({artifacts.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        <TabsContent value="queue" className="mt-6">
          <JobQueue onJobSelect={setSelectedJob} />
        </TabsContent>

        <TabsContent value="logs" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <div className="h-96">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-1 font-mono text-sm">
                    {logs.map((log, index) => (
                      <div 
                        key={index}
                        className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-muted/20"
                      >
                        {log}
                      </div>
                    ))}
                    {job?.status === "running" && (
                      <div className="flex items-center gap-2 text-success animate-pulse">
                        <div className="h-2 w-2 rounded-full bg-success"></div>
                        <span>Scanning in progress...</span>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="findings" className="mt-6">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                {findings.map((finding) => (
                  <Card key={finding.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{finding.title}</h4>
                          {getSeverityBadge(finding.severity)}
                        </div>
                        <Button variant="ghost" size="icon-sm">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {finding.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="artifacts" className="mt-6">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                {artifacts.map((artifact, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{artifact.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {artifact.type} • {artifact.size} • {artifact.hash.substring(0, 16)}...
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-3 w-3 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}