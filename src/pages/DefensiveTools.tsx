import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ToolCard } from "@/components/tools/ToolCard";
import { ToolExecutionDialog } from "@/components/tools/ToolExecutionDialog";
import { JobMonitor } from "@/components/jobs/JobMonitor";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Shield, AlertTriangle, Eye, Activity, Database, Filter, Settings } from "lucide-react";

const DefensiveTools = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showJobMonitor, setShowJobMonitor] = useState(false);
  const [executionDialog, setExecutionDialog] = useState<{
    open: boolean;
    tool: any;
  }>({ open: false, tool: null });

  const defensiveTools = [
    {
      name: "SIEM Dashboard",
      description: "Security Information and Event Management platform for real-time monitoring",
      icon: Eye,
      category: "monitoring",
      version: "2.1.0",
      lastUsed: "2024-01-15",
      status: "active"
    },
    {
      name: "Threat Hunter",
      description: "Advanced threat hunting platform for proactive security analysis",
      icon: Search,
      category: "threat-hunting",
      version: "1.8.2",
      lastUsed: "2024-01-14",
      status: "active"
    },
    {
      name: "Incident Response Platform",
      description: "Comprehensive incident response and case management system",
      icon: AlertTriangle,
      category: "incident-response",
      version: "3.0.1",
      lastUsed: "2024-01-13",
      status: "active"
    },
    {
      name: "Network Monitor",
      description: "Real-time network traffic analysis and anomaly detection",
      icon: Activity,
      category: "monitoring",
      version: "2.5.0",
      lastUsed: "2024-01-12",
      status: "active"
    },
    {
      name: "Log Analyzer",
      description: "Advanced log analysis and correlation engine",
      icon: Database,
      category: "monitoring",
      version: "1.9.3",
      lastUsed: "2024-01-11",
      status: "active"
    },
    {
      name: "Digital Forensics Kit",
      description: "Complete digital forensics investigation toolkit",
      icon: Search,
      category: "forensics",
      version: "4.2.1",
      lastUsed: "2024-01-10",
      status: "active"
    },
    {
      name: "Endpoint Detection",
      description: "Advanced endpoint detection and response system",
      icon: Shield,
      category: "monitoring",
      version: "2.3.4",
      lastUsed: "2024-01-09",
      status: "active"
    },
    {
      name: "Malware Sandbox",
      description: "Isolated malware analysis and behavioral monitoring",
      icon: Shield,
      category: "forensics",
      version: "1.7.0",
      lastUsed: "2024-01-08",
      status: "active"
    }
  ];

  const categories = [
    { id: "all", name: "All Categories", count: defensiveTools.length },
    { id: "monitoring", name: "Monitoring", count: defensiveTools.filter(t => t.category === "monitoring").length },
    { id: "incident-response", name: "Incident Response", count: defensiveTools.filter(t => t.category === "incident-response").length },
    { id: "threat-hunting", name: "Threat Hunting", count: defensiveTools.filter(t => t.category === "threat-hunting").length },
    { id: "forensics", name: "Forensics", count: defensiveTools.filter(t => t.category === "forensics").length }
  ];

  const filteredTools = defensiveTools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                  <Shield className="h-8 w-8 text-success" />
                  Defensive Security Tools
                </h1>
                <p className="text-muted-foreground">Monitor, detect, and respond to security threats</p>
              </div>
              <Button 
                onClick={() => setShowJobMonitor(!showJobMonitor)}
                variant="outline" 
                className="gap-2"
              >
                <Activity className="h-4 w-4" />
                Job Monitor
              </Button>
            </div>

            {/* System Status Card */}
            <Card className="mb-6 border-success/20 bg-success/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-success">
                  <Shield className="h-5 w-5" />
                  Defensive Posture: Strong
                </CardTitle>
                <CardDescription>
                  All defensive systems operational and monitoring actively
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">98%</div>
                    <div className="text-sm text-muted-foreground">System Health</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">24/7</div>
                    <div className="text-sm text-muted-foreground">Monitoring</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-warning">3</div>
                    <div className="text-sm text-muted-foreground">Active Alerts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">&lt; 2min</div>
                    <div className="text-sm text-muted-foreground">Response Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search defensive tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Advanced Filters
              </Button>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="gap-2"
                >
                  {category.name}
                  <Badge variant="secondary" className="text-xs">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>

            {/* Tools Grid */}
            {filteredTools.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredTools.map((tool, index) => (
                  <ToolCard 
                    key={index} 
                    tool={tool} 
                    onRun={() => setExecutionDialog({ open: true, tool })}
                    onConfigure={() => setExecutionDialog({ open: true, tool })}
                    onLaunch={() => setShowJobMonitor(true)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <div className="text-muted-foreground mb-4">
                  {searchQuery ? 'No tools found matching your search.' : 'No defensive tools available.'}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Job Monitor */}
      {showJobMonitor && (
        <JobMonitor onClose={() => setShowJobMonitor(false)} />
      )}

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

export default DefensiveTools;