import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "react-router-dom";
import { 
  Shield, 
  Target, 
  Eye, 
  Workflow, 
  FileText, 
  Settings, 
  Activity,
  Zap,
  Lock,
  Users,
  Database,
  AlertTriangle,
  Home,
  ChevronDown
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  className?: string;
}

const navigationItems = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/",
    badge: null,
  },
  {
    title: "Projects",
    icon: Database,
    href: "/projects",
    badge: "3",
  },
  {
    title: "Offensive",
    icon: Target,
    href: "/offensive",
    badge: null,
    children: [
      { title: "Reconnaissance", href: "/offensive/recon" },
      { title: "Vulnerability Assessment", href: "/offensive/vuln" },
      { title: "Exploitation", href: "/offensive/exploit", badge: "Lab Only" },
      { title: "Post-Exploitation", href: "/offensive/post-exploit", badge: "Lab Only" },
    ],
  },
  {
    title: "Defensive",
    icon: Shield,
    href: "/defensive",
    badge: "2",
    children: [
      { title: "Monitoring", href: "/defensive/monitoring" },
      { title: "Incident Response", href: "/defensive/ir" },
      { title: "Threat Hunting", href: "/defensive/hunting" },
      { title: "Forensics", href: "/defensive/forensics" },
    ],
  },
  {
    title: "Workflows",
    icon: Workflow,
    href: "/workflows",
    badge: "5",
  },
  {
    title: "Jobs",
    icon: Activity,
    href: "/jobs",
    badge: "12",
  },
  {
    title: "Reports",
    icon: FileText,
    href: "/reports",
    badge: null,
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
    badge: null,
  },
];

export function Sidebar({ className }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const location = useLocation();

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <div className={cn(
      "flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border",
      className
    )}>
      {/* Logo Header */}
      <div className="flex h-16 items-center justify-center border-b border-sidebar-border px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-sidebar-foreground">AEGIS</span>
            <span className="text-xs text-sidebar-foreground/60">Cyber Platform</span>
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="mx-4 mt-4 rounded-lg bg-sidebar-accent p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse-glow"></div>
            <span className="text-sm font-medium text-sidebar-foreground">System Status</span>
          </div>
          <Badge variant="outline" className="text-xs border-success text-success">
            Operational
          </Badge>
        </div>
        <div className="mt-2 text-xs text-sidebar-foreground/70">
          All services running normally
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigationItems.map((item) => (
          <div key={item.title}>
            {item.children ? (
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 h-10 px-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  "pr-2"
                )}
                onClick={() => toggleExpanded(item.title)}
              >
                <item.icon className="h-4 w-4" />
                <span className="flex-1 text-left">{item.title}</span>
                {item.badge && (
                  <Badge 
                    variant={item.badge === "Lab Only" ? "destructive" : "secondary"} 
                    className="text-xs h-5 px-2"
                  >
                    {item.badge}
                  </Badge>
                )}
                <ChevronDown 
                  className={cn(
                    "h-4 w-4 transition-transform",
                    expandedItems.includes(item.title) && "rotate-180"
                  )} 
                />
              </Button>
            ) : (
              <Link to={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 h-10 px-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive(item.href) && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{item.title}</span>
                  {item.badge && (
                    <Badge 
                      variant={item.badge === "Lab Only" ? "destructive" : "secondary"} 
                      className="text-xs h-5 px-2"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}
            
            {/* Submenu */}
            {item.children && expandedItems.includes(item.title) && (
              <div className="ml-6 mt-1 space-y-1">
                {item.children.map((child) => (
                  <Link key={child.title} to={child.href}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-start gap-3 text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        isActive(child.href) && "bg-sidebar-accent text-sidebar-accent-foreground"
                      )}
                    >
                      <div className="h-1 w-1 rounded-full bg-sidebar-foreground/40"></div>
                      <span className="flex-1 text-left text-xs">{child.title}</span>
                      {child.badge && (
                        <Badge variant="destructive" className="text-xs h-4 px-1.5">
                          {child.badge}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Lab Mode Toggle */}
      <div className="border-t border-sidebar-border p-4">
        <div className="rounded-lg bg-sidebar-accent p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-warning" />
              <span className="text-sm font-medium text-sidebar-foreground">Lab Mode</span>
            </div>
            <Badge variant="outline" className="text-xs border-warning text-warning">
              Disabled
            </Badge>
          </div>
          <p className="mt-2 text-xs text-sidebar-foreground/70">
            Enable to access destructive tools
          </p>
          <Button variant="warning" size="sm" className="w-full mt-2">
            <Zap className="h-3 w-3 mr-1" />
            Enable Lab Mode
          </Button>
        </div>
      </div>

      {/* User Info */}
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
            <Users className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-sidebar-foreground">Security Analyst</div>
            <div className="text-xs text-sidebar-foreground/60">Purple Team</div>
          </div>
        </div>
      </div>
    </div>
  );
}