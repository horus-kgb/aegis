import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Eye, Share, Calendar, Search, Filter, Plus } from "lucide-react";

const Reports = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock report data
  const reports = [
    {
      id: 1,
      title: "Quarterly Security Assessment",
      description: "Comprehensive security assessment report for Q4 2024",
      type: "Assessment",
      status: "completed",
      createdAt: "2024-01-15",
      size: "2.4 MB",
      findings: 23,
      severity: "medium"
    },
    {
      id: 2,
      title: "Penetration Test Report",
      description: "External penetration testing results",
      type: "Pentest",
      status: "draft",
      createdAt: "2024-01-12",
      size: "1.8 MB",
      findings: 15,
      severity: "high"
    },
    {
      id: 3,
      title: "Vulnerability Scan Results",
      description: "Weekly vulnerability scan summary",
      type: "Vulnerability",
      status: "completed",
      createdAt: "2024-01-10",
      size: "3.2 MB",
      findings: 45,
      severity: "low"
    },
    {
      id: 4,
      title: "Incident Response Summary",
      description: "Summary of security incidents from December 2024",
      type: "Incident",
      status: "completed",
      createdAt: "2024-01-08",
      size: "1.1 MB",
      findings: 8,
      severity: "medium"
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      'draft': 'secondary',
      'completed': 'success',
      'processing': 'default',
      'failed': 'destructive'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getSeverityBadge = (severity: string) => {
    const variants = {
      'low': 'secondary',
      'medium': 'warning',
      'high': 'destructive',
      'critical': 'destructive'
    } as const;
    
    return (
      <Badge variant={variants[severity as keyof typeof variants] || 'secondary'}>
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </Badge>
    );
  };

  const filteredReports = reports.filter(report =>
    report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                <h1 className="text-2xl font-bold text-foreground">Reports</h1>
                <p className="text-muted-foreground">Generate and manage security reports</p>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Generate Report
              </Button>
            </div>

            {/* Report Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-card p-4 rounded-lg border">
                <div className="text-2xl font-bold text-foreground">{reports.length}</div>
                <div className="text-sm text-muted-foreground">Total Reports</div>
              </div>
              <div className="bg-card p-4 rounded-lg border">
                <div className="text-2xl font-bold text-success">
                  {reports.filter(r => r.status === 'completed').length}
                </div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="bg-card p-4 rounded-lg border">
                <div className="text-2xl font-bold text-warning">
                  {reports.filter(r => r.status === 'draft').length}
                </div>
                <div className="text-sm text-muted-foreground">Draft</div>
              </div>
              <div className="bg-card p-4 rounded-lg border">
                <div className="text-2xl font-bold text-destructive">
                  {reports.filter(r => r.severity === 'high').length}
                </div>
                <div className="text-sm text-muted-foreground">High Severity</div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                Date Range
              </Button>
            </div>

            {/* Reports List */}
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <Card key={report.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <FileText className="h-5 w-5 text-primary" />
                          {report.title}
                        </CardTitle>
                        <CardDescription>{report.description}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(report.status)}
                        {getSeverityBadge(report.severity)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs">
                            {report.type}
                          </Badge>
                        </span>
                        <span>{report.findings} findings</span>
                        <span>{report.size}</span>
                        <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" className="gap-1">
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                        <Button size="sm" variant="ghost" className="gap-1">
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                        <Button size="sm" variant="ghost" className="gap-1">
                          <Share className="h-4 w-4" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredReports.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <div className="text-muted-foreground mb-4">
                  {searchQuery ? 'No reports found matching your search.' : 'No reports generated yet.'}
                </div>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Generate Your First Report
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;