import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Settings as SettingsIcon, User, Shield, Bell, Key, Database, Globe } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";

const Settings = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { data: profile } = useProfile();

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
          <div className="container mx-auto p-6 max-w-4xl">
            {/* Page Header */}
            <div className="flex items-center gap-3 mb-6">
              <SettingsIcon className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Settings</h1>
                <p className="text-muted-foreground">Manage your account and application preferences</p>
              </div>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="api">API Keys</TabsTrigger>
                <TabsTrigger value="database">Database</TabsTrigger>
                <TabsTrigger value="general">General</TabsTrigger>
              </TabsList>

              {/* Profile Settings */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>
                      Update your profile information and personal details.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input 
                          id="displayName" 
                          defaultValue={profile?.display_name || ""} 
                          placeholder="Your display name" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{profile?.role || "viewer"}</Badge>
                          <span className="text-sm text-muted-foreground">Contact admin to change role</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="avatar">Avatar URL</Label>
                      <Input 
                        id="avatar" 
                        defaultValue={profile?.avatar_url || ""} 
                        placeholder="https://example.com/avatar.jpg" 
                      />
                    </div>
                    <Button>Save Changes</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Settings */}
              <TabsContent value="security">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Lab Mode
                      </CardTitle>
                      <CardDescription>
                        Control access to destructive security tools and operations.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="labMode">Enable Lab Mode</Label>
                          <p className="text-sm text-muted-foreground">
                            Allows access to exploitation and post-exploitation tools
                          </p>
                        </div>
                        <Switch id="labMode" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="autoLogout">Auto Logout</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically log out after 30 minutes of inactivity
                          </p>
                        </div>
                        <Switch id="autoLogout" defaultChecked />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Two-Factor Authentication</CardTitle>
                      <CardDescription>
                        Add an extra layer of security to your account.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Authenticator App</div>
                          <div className="text-sm text-muted-foreground">Not configured</div>
                        </div>
                        <Button variant="outline">Setup</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Notifications */}
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notification Preferences
                    </CardTitle>
                    <CardDescription>
                      Choose what notifications you want to receive.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="jobComplete">Job Completion</Label>
                        <p className="text-sm text-muted-foreground">
                          Notify when security jobs complete
                        </p>
                      </div>
                      <Switch id="jobComplete" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="highSeverity">High Severity Findings</Label>
                        <p className="text-sm text-muted-foreground">
                          Notify for high and critical severity findings
                        </p>
                      </div>
                      <Switch id="highSeverity" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="weeklyReports">Weekly Reports</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive weekly security summary reports
                        </p>
                      </div>
                      <Switch id="weeklyReports" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="systemAlerts">System Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          System maintenance and downtime notifications
                        </p>
                      </div>
                      <Switch id="systemAlerts" defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* API Keys */}
              <TabsContent value="api">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Key className="h-5 w-5" />
                      API Keys
                    </CardTitle>
                    <CardDescription>
                      Manage API keys for integrations and external access.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">Personal Access Token</div>
                        <div className="text-sm text-muted-foreground">Created 2 days ago</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="success">Active</Badge>
                        <Button variant="outline" size="sm">Revoke</Button>
                      </div>
                    </div>
                    <Button>Generate New Token</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Database */}
              <TabsContent value="database">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Database Settings
                    </CardTitle>
                    <CardDescription>
                      Configure database connections and backup settings.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Connection Status</Label>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-success"></div>
                          <span className="text-sm">Connected</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Last Backup</Label>
                        <div className="text-sm text-muted-foreground">2 hours ago</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="autoBackup">Automatic Backups</Label>
                        <p className="text-sm text-muted-foreground">
                          Create daily backups of your data
                        </p>
                      </div>
                      <Switch id="autoBackup" defaultChecked />
                    </div>
                    <Button variant="outline">Create Manual Backup</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* General */}
              <TabsContent value="general">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      General Settings
                    </CardTitle>
                    <CardDescription>
                      Application preferences and display settings.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="theme">Theme</Label>
                        <select className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm">
                          <option value="system">System</option>
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <select className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm">
                          <option value="UTC">UTC</option>
                          <option value="America/New_York">Eastern Time</option>
                          <option value="America/Los_Angeles">Pacific Time</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="analytics">Analytics</Label>
                        <p className="text-sm text-muted-foreground">
                          Help improve the platform by sharing usage data
                        </p>
                      </div>
                      <Switch id="analytics" defaultChecked />
                    </div>
                    <Button>Save Preferences</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;