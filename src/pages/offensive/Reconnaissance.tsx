import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ToolCard } from "@/components/tools/ToolCard";
import { JobMonitor } from "@/components/jobs/JobMonitor";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Radar, Globe, Network, Target, Settings, Filter, Eye } from "lucide-react";

const Reconnaissance = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showJobMonitor, setShowJobMonitor] = useState(false);

  const reconTools = [
    {
      name: "Nmap",
      description: "Network discovery and security auditing tool",
      icon: Network,
      category: "network",
      version: "7.94",
      lastUsed: "2024-01-15",
      status: "active"
    },
    {
      name: "Shodan",
      description: "Internet-connected device search engine",
      icon: Globe,
      category: "osint",
      version: "1.28.0",
      lastUsed: "2024-01-14",
      status: "active"
    },
    {
      name: "Subfinder",
      description: "Subdomain discovery tool for passive reconnaissance",
      icon: Search,
      category: "subdomain",
      version: "2.6.3",
      lastUsed: "2024-01-13",
      status: "active"
    },
    {
      name: "Amass",
      description: "In-depth DNS enumeration and network mapping",
      icon: Radar,
      category: "subdomain",
      version: "4.2.0",
      lastUsed: "2024-01-12",
      status: "active"
    },
    {
      name: "TheHarvester",
      description: "Email, subdomain and people names harvester",
      icon: Search,
      category: "osint",
      version: "4.5.1",
      lastUsed: "2024-01-11",
      status: "active"
    },
    {
      name: "Masscan",
      description: "High-speed TCP port scanner",
      icon: Target,
      category: "network",
      version: "1.3.2",
      lastUsed: "2024-01-10",
      status: "active"
    },
    {
      name: "DNSRecon",
      description: "DNS enumeration and network reconnaissance",
      icon: Network,
      category: "dns",
      version: "1.1.6",
      lastUsed: "2024-01-09",
      status: "active"
    },
    {
      name: "Recon-ng",
      description: "Web reconnaissance framework with modules",
      icon: Eye,
      category: "framework",
      version: "5.1.2",
      lastUsed: "2024-01-08",
      status: "active"
    }
  ];

  const categories = [
    { id: "all", name: "All Tools", count: reconTools.length },
    { id: "network", name: "Network", count: reconTools.filter(t => t.category === "network").length },
    { id: "osint", name: "OSINT", count: reconTools.filter(t => t.category === "osint").length },
    { id: "subdomain", name: "Subdomain", count: reconTools.filter(t => t.category === "subdomain").length },
    { id: "dns", name: "DNS", count: reconTools.filter(t => t.category === "dns").length },
    { id: "framework", name: "Framework", count: reconTools.filter(t => t.category === "framework").length }
  ];

  const filteredTools = reconTools.filter(tool => {
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
                  <Radar className="h-8 w-8 text-primary" />
                  Reconnaissance Tools
                </h1>
                <p className="text-muted-foreground">Information gathering and target enumeration</p>
              </div>
              <Button 
                onClick={() => setShowJobMonitor(!showJobMonitor)}
                variant="outline" 
                className="gap-2"
              >
                <Eye className="h-4 w-4" />
                Job Monitor
              </Button>
            </div>

            {/* Recon Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">127</div>
                  <div className="text-sm text-muted-foreground">Active Scans</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-success">2,451</div>
                  <div className="text-sm text-muted-foreground">Hosts Discovered</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-warning">89</div>
                  <div className="text-sm text-muted-foreground">Open Ports</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-foreground">15</div>
                  <div className="text-sm text-muted-foreground">Services Identified</div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reconnaissance tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
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
                    onLaunch={() => setShowJobMonitor(true)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Radar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <div className="text-muted-foreground mb-4">
                  {searchQuery ? 'No tools found matching your search.' : 'No reconnaissance tools available.'}
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
    </div>
  );
};

export default Reconnaissance;