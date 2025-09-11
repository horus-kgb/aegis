import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { 
  Workflow, 
  Play, 
  Pause, 
  Settings, 
  Plus, 
  Search,
  Clock,
  CheckCircle,
  AlertTriangle,
  Target,
  Shield,
  Eye,
  Calendar,
  Users,
  Edit,
  Copy,
  Trash2
} from "lucide-react";

interface WorkflowItem {
  id: string;
  name: string;
  description: string;
  category: "offensive" | "defensive" | "compliance" | "custom";
  status: "ready" | "running" | "completed" | "failed" | "scheduled";
  steps: number;
  lastRun?: string;
  nextRun?: string;
  schedule?: string;
  approvals: number;
  requiredApprovals: number;
  estimatedDuration: string;
  tags: string[];
}

const mockWorkflows: WorkflowItem[] = [
  {
    id: "wf-001",
    name: "Web Application Recon",
    description: "Comprehensive reconnaissance workflow combining subdomain enumeration, port scanning, and safe vulnerability assessment",
    category: "offensive",
    status: "ready",
    steps: 4,
    lastRun: "2 hours ago",
    schedule: "Daily at 02:00",
    nextRun: "Tomorrow 02:00",
    approvals: 1,
    requiredApprovals: 1,
    estimatedDuration: "15 minutes",
    tags: ["web", "recon", "automated"]
  },
  {
    id: "wf-002", 
    name: "Network Discovery & Assessment",
    description: "Complete network mapping including host discovery, port scanning, service enumeration, and basic vulnerability checks",
    category: "offensive",
    status: "running",
    steps: 6,
    lastRun: "Running now",
    approvals: 2,
    requiredApprovals: 2,
    estimatedDuration: "45 minutes",
    tags: ["network", "discovery", "nmap"]
  },
  {
    id: "wf-003",
    name: "Incident Response Playbook",
    description: "Automated incident response workflow including evidence collection, threat hunting, and containment procedures",
    category: "defensive", 
    status: "ready",
    steps: 8,
    lastRun: "1 week ago",
    approvals: 3,
    requiredApprovals: 2,
    estimatedDuration: "2 hours",
    tags: ["incident", "response", "forensics"]
  },
  {
    id: "wf-004",
    name: "Compliance Audit - SOC 2",
    description: "Automated compliance checking workflow for SOC 2 Type II requirements including security controls validation",
    category: "compliance",
    status: "scheduled",
    steps: 12,
    lastRun: "3 days ago",
    schedule: "Monthly",
    nextRun: "Next Monday", 
    approvals: 2,
    requiredApprovals: 3,
    estimatedDuration: "3 hours",
    tags: ["compliance", "soc2", "audit"]
  },
  {
    id: "wf-005",
    name: "Threat Hunt - APT Indicators",
    description: "Proactive threat hunting workflow using IOCs and behavioral analytics to detect advanced persistent threats",
    category: "defensive",
    status: "completed",
    steps: 5,
    lastRun: "Yesterday",
    approvals: 1,
    requiredApprovals: 1,
    estimatedDuration: "30 minutes",
    tags: ["threat-hunting", "apt", "iocs"]
  },
  {
    id: "wf-006",
    name: "Custom Pentest Framework",
    description: "Custom penetration testing workflow tailored for financial services with comprehensive OWASP Top 10 coverage",
    category: "custom",
    status: "failed",
    steps: 10,
    lastRun: "2 days ago",
    approvals: 0,
    requiredApprovals: 3,
    estimatedDuration: "4 hours", 
    tags: ["pentest", "owasp", "custom", "fintech"]
  }
];

const Workflows = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredWorkflows = mockWorkflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workflow.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || workflow.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: "all", name: "All Workflows", count: mockWorkflows.length },
    { id: "offensive", name: "Offensive", count: mockWorkflows.filter(w => w.category === "offensive").length },
    { id: "defensive", name: "Defensive", count: mockWorkflows.filter(w => w.category === "defensive").length },
    { id: "compliance", name: "Compliance", count: mockWorkflows.filter(w => w.category === "compliance").length },
    { id: "custom", name: "Custom", count: mockWorkflows.filter(w => w.category === "custom").length },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ready":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "running":
        return <Clock className="h-4 w-4 text-warning animate-pulse" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "failed":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "scheduled":
        return <Calendar className="h-4 w-4 text-info" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "offensive":
        return <Target className="h-4 w-4 text-destructive" />;
      case "defensive":
        return <Shield className="h-4 w-4 text-success" />;
      case "compliance":
        return <CheckCircle className="h-4 w-4 text-info" />;
      case "custom":
        return <Settings className="h-4 w-4 text-primary" />;
      default:
        return <Workflow className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      ready: "bg-success/10 text-success border-success/20",
      running: "bg-warning/10 text-warning border-warning/20",
      completed: "bg-success/10 text-success border-success/20", 
      failed: "bg-destructive/10 text-destructive border-destructive/20",
      scheduled: "bg-info/10 text-info border-info/20",
    };

    return (
      <Badge variant="outline" className={variants[status as keyof typeof variants]}>
        {getStatusIcon(status)}
        <span className="ml-1 capitalize">{status}</span>
      </Badge>
    );
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className={cn("hidden lg:flex transition-all duration-300", sidebarCollapsed ? "w-16" : "w-64")}>
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6 space-y-6">
            
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gradient flex items-center gap-3">
                  <Workflow className="h-8 w-8 text-primary" />
                  Workflows
                </h1>
                <p className="text-muted-foreground">
                  Automated security workflows and orchestrated playbooks
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Workflow Builder
                </Button>
                <Button variant="premium" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Workflow
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search workflows..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="whitespace-nowrap"
                  >
                    {category.name}
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {category.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>

            {/* Workflows Grid */}
            <div className="grid gap-6">
              {filteredWorkflows.map((workflow) => (
                <Card key={workflow.id} className="hover:shadow-lg transition-all duration-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {getCategoryIcon(workflow.category)}
                        <div>
                          <CardTitle className="text-lg">{workflow.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs h-5 px-2 capitalize">
                              {workflow.category}
                            </Badge>
                            {getStatusBadge(workflow.status)}
                            <Badge variant="secondary" className="text-xs h-5 px-2">
                              {workflow.steps} steps
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {workflow.status === "running" && (
                          <Button variant="outline" size="sm">
                            <Pause className="h-3 w-3 mr-1" />
                            Pause
                          </Button>
                        )}
                        {(workflow.status === "ready" || workflow.status === "completed" || workflow.status === "failed") && (
                          <Button variant="premium" size="sm">
                            <Play className="h-3 w-3 mr-1" />
                            Run
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {workflow.description}
                    </p>

                    {workflow.status === "running" && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">Step 3 of {workflow.steps}</span>
                        </div>
                        <Progress value={60} className="h-2" />
                      </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Duration:</span>
                        <div className="font-medium">{workflow.estimatedDuration}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Approvals:</span>
                        <div className="font-medium">
                          {workflow.approvals}/{workflow.requiredApprovals}
                          {workflow.approvals >= workflow.requiredApprovals && (
                            <CheckCircle className="inline h-3 w-3 ml-1 text-success" />
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Run:</span>
                        <div className="font-medium">{workflow.lastRun || "Never"}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Schedule:</span>
                        <div className="font-medium">{workflow.schedule || "Manual"}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {workflow.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredWorkflows.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No workflows found</h3>
                  <p className="text-muted-foreground text-center">
                    Try adjusting your search query or category filter
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Workflows;