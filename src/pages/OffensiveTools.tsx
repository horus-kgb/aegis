import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ToolCard } from "@/components/tools/ToolCard";
import { ToolExecutionDialog } from "@/components/tools/ToolExecutionDialog";
import { JobMonitor } from "@/components/jobs/JobMonitor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getToolDisplayName, getToolMapping } from "@/lib/toolMappings";
import { 
  Target, 
  Search, 
  Globe, 
  Shield, 
  Database,
  Key,
  Wifi,
  Terminal,
  Bug,
  Lock,
  AlertTriangle,
  Play,
  Settings
} from "lucide-react";

const offensiveTools = [
  {
    name: "Nmap",
    displayName: "Alpha Scanner",
    description: "Network discovery and security auditing tool for port scanning and host enumeration",
    icon: Target,
    category: "recon" as const,
    version: "7.94",
    lastUsed: "2 hours ago",
    status: "ready" as const,
  },
  {
    name: "Nuclei",
    displayName: "Beta Engine", 
    description: "Fast vulnerability scanner with community-powered templates for web applications",
    icon: Bug,
    category: "vuln" as const,
    version: "3.1.5",
    lastUsed: "1 day ago", 
    status: "ready" as const,
  },
  {
    name: "Amass",
    description: "In-depth attack surface mapping and asset discovery using OSINT techniques",
    icon: Globe,
    category: "recon" as const,
    version: "4.2.0",
    lastUsed: "3 hours ago",
    status: "running" as const,
  },
  {
    name: "theHarvester",
    description: "Information gathering tool for collecting emails, subdomains, hosts, and URLs",
    icon: Search,
    category: "recon" as const,
    version: "4.5.1",
    lastUsed: "1 week ago",
    status: "ready" as const,
  },
  {
    name: "SQLMap",
    displayName: "Gamma Analyzer",
    description: "Automatic SQL injection detection and exploitation tool with database takeover features",
    icon: Database,
    category: "exploit" as const,
    version: "1.7.11",
    lastUsed: "Never",
    status: "lab-only" as const,
  },
  {
    name: "Metasploit",
    displayName: "Delta Framework",
    description: "Advanced penetration testing framework with extensive exploit and payload collection",
    icon: Terminal,
    category: "exploit" as const,
    version: "6.3.45",
    lastUsed: "Never",
    status: "lab-only" as const,
  },
  {
    name: "Hydra",
    displayName: "Epsilon Engine",
    description: "Parallelized login cracker supporting numerous protocols and services",
    icon: Key,
    category: "exploit" as const, 
    version: "9.5",
    lastUsed: "Never",
    status: "lab-only" as const,
  },
  {
    name: "Hashcat",
    displayName: "Zeta Processor",
    description: "Advanced password recovery tool supporting various hash algorithms and attack modes",
    icon: Lock,
    category: "post-exploit" as const,
    version: "6.2.6",
    lastUsed: "2 weeks ago",
    status: "ready" as const,
  },
  {
    name: "Bettercap", 
    description: "Complete network reconnaissance and MITM attack framework with WiFi capabilities",
    icon: Wifi,
    category: "exploit" as const,
    version: "2.32.0",
    lastUsed: "Never",
    status: "lab-only" as const,
  },
];

const OffensiveTools = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showJobMonitor, setShowJobMonitor] = useState(false);
  const [executionDialog, setExecutionDialog] = useState<{
    open: boolean;
    tool: any;
  }>({ open: false, tool: null });

  const filteredTools = offensiveTools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: "all", name: "All Tools", count: offensiveTools.length },
    { id: "recon", name: "Reconnaissance", count: offensiveTools.filter(t => t.category === "recon").length },
    { id: "vuln", name: "Vulnerability", count: offensiveTools.filter(t => t.category === "vuln").length },
    { id: "exploit", name: "Exploitation", count: offensiveTools.filter(t => t.category === "exploit").length },
    { id: "post-exploit", name: "Post-Exploitation", count: offensiveTools.filter(t => t.category === "post-exploit").length },
  ];

  if (showJobMonitor) {
    return (
      <div className="flex h-screen bg-background">
        <aside className={cn("hidden lg:flex transition-all duration-300", sidebarCollapsed ? "w-16" : "w-64")}>
          <Sidebar />
        </aside>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-6">
              <div className="flex items-center gap-4 mb-6">
                <Button variant="outline" onClick={() => setShowJobMonitor(false)}>
                  ← Back to Tools
                </Button>
                <h1 className="text-2xl font-bold">Job Monitor</h1>
              </div>
              <JobMonitor />
            </div>
          </main>
        </div>
      </div>
    );
  }

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
                  <Target className="h-8 w-8 text-destructive" />
                  Offensive Tools
                </h1>
                <p className="text-muted-foreground">
                  Reconnaissance, vulnerability assessment, and penetration testing tools
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Configure Tools
                </Button>
                <Button variant="premium" className="gap-2">
                  <Play className="h-4 w-4" />
                  Quick Scan
                </Button>
              </div>
            </div>

            {/* Lab Mode Warning */}
            <Card className="border-warning/20 bg-warning/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  <div>
                    <h3 className="font-semibold text-warning">Lab Mode Required</h3>
                    <p className="text-sm text-muted-foreground">
                      Some tools require Lab Mode to be enabled for safety. Only use destructive tools in authorized environments.
                    </p>
                  </div>
                  <Button variant="warning" size="sm" className="ml-auto">
                    Enable Lab Mode
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search tools..."
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

            {/* Tools Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredTools.map((tool) => (
                <ToolCard
                  key={tool.name}
                  tool={{
                    ...tool,
                    name: tool.displayName || tool.name // Use display name if available
                  }}
                  onRun={() => {
                    if (tool.status === "running") {
                      setShowJobMonitor(true);
                    } else {
                      setExecutionDialog({ open: true, tool });
                    }
                  }}
                  onConfigure={() => {
                    setExecutionDialog({ open: true, tool });
                  }}
                />
              ))}
            </div>

            {filteredTools.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No tools found</h3>
                  <p className="text-muted-foreground text-center">
                    Try adjusting your search query or category filter
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>

      {/* Tool Execution Dialog */}
      {executionDialog.open && executionDialog.tool && (
        <ToolExecutionDialog
          open={executionDialog.open}
          onOpenChange={(open) => setExecutionDialog({ open, tool: null })}
          tool={executionDialog.tool}
        />
      )}
      
    </div>
  );
};

export default OffensiveTools;