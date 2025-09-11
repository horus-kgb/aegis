import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { JobMonitor } from "@/components/jobs/JobMonitor";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, Square, Search, Filter } from "lucide-react";
import { useJobs } from "@/hooks/useJobs";

const Jobs = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const { data: jobs, isLoading } = useJobs();

  const filteredJobs = jobs?.filter(job => {
    const matchesSearch = job.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.tool.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.target.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || job.status === selectedStatus;
    return matchesSearch && matchesStatus;
  }) || [];

  const getStatusBadge = (status: string) => {
    const variants = {
      'queued': 'secondary',
      'running': 'default',
      'completed': 'success',
      'failed': 'destructive',
      'cancelled': 'outline'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getStatusStats = () => {
    if (!jobs) return { queued: 0, running: 0, completed: 0, failed: 0 };
    
    return jobs.reduce((acc, job) => {
      acc[job.status as keyof typeof acc] = (acc[job.status as keyof typeof acc] || 0) + 1;
      return acc;
    }, { queued: 0, running: 0, completed: 0, failed: 0 });
  };

  const stats = getStatusStats();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className={cn(
        "hidden lg:flex transition-all duration-300",
        sidebarCollapsed ? "w-16" : "w-64"
      )}>
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Job Management</h1>
                <p className="text-muted-foreground">Monitor and manage security tool executions</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Pause className="h-4 w-4" />
                  Pause All
                </Button>
                <Button variant="destructive" className="gap-2">
                  <Square className="h-4 w-4" />
                  Stop All
                </Button>
              </div>
            </div>

            {/* Job Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-card p-4 rounded-lg border">
                <div className="text-2xl font-bold text-secondary">{stats.queued}</div>
                <div className="text-sm text-muted-foreground">Queued</div>
              </div>
              <div className="bg-card p-4 rounded-lg border">
                <div className="text-2xl font-bold text-primary">{stats.running}</div>
                <div className="text-sm text-muted-foreground">Running</div>
              </div>
              <div className="bg-card p-4 rounded-lg border">
                <div className="text-2xl font-bold text-success">{stats.completed}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="bg-card p-4 rounded-lg border">
                <div className="text-2xl font-bold text-destructive">{stats.failed}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="queued">Queued</option>
                <option value="running">Running</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Jobs List */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{job.name}</CardTitle>
                          <CardDescription>
                            {job.tool} • Target: {job.target} • Category: {job.category}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(job.status)}
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost">
                              <Play className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Pause className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Square className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{job.progress}%</span>
                        </div>
                        <Progress value={job.progress} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Started: {job.started_at ? new Date(job.started_at).toLocaleString() : 'Not started'}</span>
                          <span>Completed: {job.completed_at ? new Date(job.completed_at).toLocaleString() : 'In progress'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  {searchQuery ? 'No jobs found matching your search.' : 'No jobs found.'}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Job Monitor Component */}
      <JobMonitor />
    </div>
  );
};

export default Jobs;