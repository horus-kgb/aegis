import { MetricsCard } from "./MetricsCard";
import { RecentActivity } from "./RecentActivity";
import { ActiveJobs } from "./ActiveJobs";
import { ProjectCard } from "../projects/ProjectCard";
import { CreateProjectDialog } from "../projects/CreateProjectDialog";
import { useJobs } from "@/hooks/useJobs";
import { useProjects, useEngagements } from "@/hooks/useProjects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Folder,
  Play,
  CheckCircle,
  AlertTriangle,
  Activity,
  Target, 
  Shield, 
  TrendingUp,
  Eye,
  Zap,
  Database,
  Clock,
  CheckCircle2,
  BarChart3,
  Globe,
  Server,
  Users
} from "lucide-react";

export function Dashboard() {
  const { data: jobs = [] } = useJobs();
  const { data: projects = [] } = useProjects();
  const { data: engagements = [] } = useEngagements();

  const runningJobs = jobs.filter(job => job.status === 'running');
  const completedJobs = jobs.filter(job => job.status === 'completed');
  const activeEngagements = engagements.filter(eng => eng.status === 'active');
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Welcome to Aegis</h1>
          <p className="text-muted-foreground">
            Your unified cybersecurity platform for offensive testing, defensive monitoring, and automated workflows.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="premium" className="gap-2">
            <Zap className="h-4 w-4" />
            Quick Scan
          </Button>
          <Button variant="outline" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          title="Active Jobs"
          value={runningJobs.length}
          change={{ value: `+${runningJobs.length}`, trend: "up" }}
          icon={Play}
        />
        <MetricsCard
          title="Completed Scans"
          value={completedJobs.length}
          change={{ value: `+${completedJobs.length}`, trend: "up" }}
          icon={CheckCircle}
        />
        <MetricsCard
          title="Active Engagements"
          value={activeEngagements.length}
          change={{ value: `+${activeEngagements.length}`, trend: "up" }}
          icon={AlertTriangle}
        />
        <MetricsCard
          title="Projects"
          value={projects.length}
          change={{ value: `+${projects.length}`, trend: "up" }}
          icon={Folder}
        />
      </div>

      {/* Security Status Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="cyber-grid">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-destructive" />
              Offensive Operations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Running Scans</span>
              <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                8 Active
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Network Discovery</span>
                <span className="text-success">Complete</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Vulnerability Assessment</span>
                <span className="text-warning">In Progress</span>
              </div>
              <Progress value={64} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Exploitation Testing</span>
                <span className="text-muted-foreground">Queued</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="cyber-grid">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-success" />
              Defensive Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Sensors Status</span>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                All Online
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse-glow"></div>
                <span>Suricata IDS</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse-glow"></div>
                <span>Zeek NSM</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse-glow"></div>
                <span>SIEM Platform</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-warning animate-pulse"></div>
                <span>Honeypots</span>
              </div>
            </div>
            <div className="pt-2">
              <Button variant="outline" size="sm" className="w-full">
                <BarChart3 className="h-3 w-3 mr-2" />
                View Dashboards
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="cyber-grid">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CPU</span>
                  <span>23%</span>
                </div>
                <Progress value={23} className="h-1" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Memory</span>
                  <span>45%</span>
                </div>
                <Progress value={45} className="h-1" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Storage</span>
                  <span>67%</span>
                </div>
                <Progress value={67} className="h-1" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Network</span>
                  <span>12%</span>
                </div>
                <Progress value={12} className="h-1" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span className="text-success">All services operational</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Folder className="h-5 w-5 text-primary" />
              Projects
            </CardTitle>
            <CreateProjectDialog />
          </div>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No projects yet. Create your first project to get started.</p>
            </div>
          ) : (
            <ScrollArea className="h-64">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {projects.slice(0, 6).map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Activity and Jobs */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentActivity />
        <ActiveJobs />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Quick Actions & Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="cyber" size="lg" className="h-20 flex-col gap-2">
              <Target className="h-6 w-6" />
              <div className="text-center">
                <div className="font-semibold">Port Scan</div>
                <div className="text-xs text-muted-foreground">Nmap Discovery</div>
              </div>
            </Button>
            
            <Button variant="cyber" size="lg" className="h-20 flex-col gap-2">
              <Globe className="h-6 w-6" />
              <div className="text-center">
                <div className="font-semibold">Web Scan</div>
                <div className="text-xs text-muted-foreground">Nuclei Templates</div>
              </div>
            </Button>
            
            <Button variant="cyber" size="lg" className="h-20 flex-col gap-2">
              <Shield className="h-6 w-6" />
              <div className="text-center">
                <div className="font-semibold">Monitor Traffic</div>
                <div className="text-xs text-muted-foreground">Start Zeek/Suricata</div>
              </div>
            </Button>
            
            <Button variant="cyber" size="lg" className="h-20 flex-col gap-2">
              <Activity className="h-6 w-6" />
              <div className="text-center">
                <div className="font-semibold">Run Workflow</div>
                <div className="text-xs text-muted-foreground">Automated Assessment</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}