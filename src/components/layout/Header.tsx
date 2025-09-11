import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  Bell, 
  Search, 
  AlertTriangle, 
  Shield, 
  Activity,
  Settings,
  User,
  LogOut,
  Menu
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onMenuToggle?: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-6">
        
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon-sm" 
            className="md:hidden"
            onClick={onMenuToggle}
          >
            <Menu className="h-4 w-4" />
          </Button>
          
          {/* Search */}
          <div className="relative w-80 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search jobs, findings, artifacts..."
              className="pl-10 bg-muted/50 border-border/50 focus:border-primary/50"
            />
          </div>
        </div>

        {/* Center Section - Quick Stats */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-success" />
            <span className="text-sm text-muted-foreground">Jobs:</span>
            <Badge variant="outline" className="text-success border-success/30">
              12 Active
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <span className="text-sm text-muted-foreground">Alerts:</span>
            <Badge variant="outline" className="text-warning border-warning/30">
              3 High
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Coverage:</span>
            <Badge variant="outline" className="text-primary border-primary/30">
              87%
            </Badge>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <Badge 
                  variant="destructive" 
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                Notifications
                <Badge variant="secondary" className="text-xs">
                  3 new
                </Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem className="flex items-start gap-3 p-3">
                <div className="h-2 w-2 rounded-full bg-destructive mt-2"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Critical vulnerability detected</div>
                  <div className="text-xs text-muted-foreground">SQLi in web app - requires immediate attention</div>
                  <div className="text-xs text-muted-foreground mt-1">2 minutes ago</div>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="flex items-start gap-3 p-3">
                <div className="h-2 w-2 rounded-full bg-warning mt-2"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Nmap scan completed</div>
                  <div className="text-xs text-muted-foreground">Found 15 open ports on target network</div>
                  <div className="text-xs text-muted-foreground mt-1">5 minutes ago</div>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="flex items-start gap-3 p-3">
                <div className="h-2 w-2 rounded-full bg-info mt-2"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Workflow approval needed</div>
                  <div className="text-xs text-muted-foreground">Web recon workflow requires authorization</div>
                  <div className="text-xs text-muted-foreground mt-1">15 minutes ago</div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url || ""} />
                  <AvatarFallback>
                    {profile?.display_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{profile?.display_name || user?.email}</p>
                  <p className="text-xs leading-none text-muted-foreground capitalize">
                    {profile?.role || 'viewer'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}