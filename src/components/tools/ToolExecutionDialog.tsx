import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileUpload, HashFileUpload, WordlistUpload, MalwareUpload, EvidenceUpload } from "@/components/ui/file-upload";
import { useCreateJob } from "@/hooks/useJobs";
import { useProjects } from "@/hooks/useProjects";
import { useToast } from "@/hooks/use-toast";
import { validationSchemas, validateUserInput, sanitizeInput } from "@/lib/validation";
import { getToolDisplayName } from "@/lib/toolMappings";
import { LucideIcon, Play, AlertTriangle, Info, Target, Settings } from "lucide-react";

interface ToolExecutionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tool: {
    name: string;
    description: string;
    icon: LucideIcon;
    category: string;
    version: string;
    status: string;
  };
}

interface ToolConfig {
  name: string;
  parameters: Record<string, any>;
  presets: Array<{
    name: string;
    description: string;
    parameters: Record<string, any>;
  }>;
}

const toolConfigs: Record<string, ToolConfig> = {
  // Offensive Tools
  "Nmap": {
    name: "Nmap",
    parameters: {
      target: "",
      scanType: "syn",
      ports: "1-1000",
      timing: "T3",
      outputFormat: "xml",
      additionalFlags: ""
    },
    presets: [
      {
        name: "Quick Scan",
        description: "Fast port scan of common ports",
        parameters: {
          target: "",
          scanType: "syn",
          ports: "22,80,443,3389,8080",
          timing: "T4",
          outputFormat: "xml",
          additionalFlags: "-sV"
        }
      },
      {
        name: "Comprehensive Scan",
        description: "Full port scan with service detection",
        parameters: {
          target: "",
          scanType: "syn",
          ports: "1-65535",
          timing: "T3",
          outputFormat: "xml",
          additionalFlags: "-sV -sC -A"
        }
      },
      {
        name: "Stealth Scan",
        description: "Slow, stealthy scan to avoid detection",
        parameters: {
          target: "",
          scanType: "syn",
          ports: "1-1000",
          timing: "T1",
          outputFormat: "xml",
          additionalFlags: "-f -D RND:10"
        }
      }
    ]
  },
  "Nuclei": {
    name: "Nuclei",
    parameters: {
      target: "",
      templates: "all",
      severity: "all",
      rate: "150",
      timeout: "5",
      outputFormat: "json"
    },
    presets: [
      {
        name: "Safe Scan",
        description: "Safe templates only, no intrusive checks",
        parameters: {
          target: "",
          templates: "safe-defaults",
          severity: "low,medium",
          rate: "100",
          timeout: "10",
          outputFormat: "json"
        }
      },
      {
        name: "Comprehensive Scan",
        description: "All templates including intrusive checks",
        parameters: {
          target: "",
          templates: "all",
          severity: "all",
          rate: "150",
          timeout: "5",
          outputFormat: "json"
        }
      },
      {
        name: "Critical Only",
        description: "Only critical and high severity templates",
        parameters: {
          target: "",
          templates: "all",
          severity: "critical,high",
          rate: "200",
          timeout: "3",
          outputFormat: "json"
        }
      }
    ]
  },
  "Amass": {
    name: "Amass",
    parameters: {
      domain: "",
      mode: "passive",
      sources: "all",
      outputFormat: "json",
      timeout: "30"
    },
    presets: [
      {
        name: "Passive Recon",
        description: "Passive information gathering only",
        parameters: {
          domain: "",
          mode: "passive",
          sources: "all",
          outputFormat: "json",
          timeout: "30"
        }
      },
      {
        name: "Active Recon",
        description: "Active DNS enumeration and brute forcing",
        parameters: {
          domain: "",
          mode: "active",
          sources: "all",
          outputFormat: "json",
          timeout: "60"
        }
      }
    ]
  },
  "theHarvester": {
    name: "theHarvester",
    parameters: {
      domain: "",
      sources: "all",
      limit: "500",
      outputFormat: "json"
    },
    presets: [
      {
        name: "Email Discovery",
        description: "Find email addresses for the domain",
        parameters: {
          domain: "",
          sources: "google,bing,yahoo",
          limit: "500",
          outputFormat: "json"
        }
      },
      {
        name: "Subdomain Discovery",
        description: "Find subdomains and hosts",
        parameters: {
          domain: "",
          sources: "all",
          limit: "1000",
          outputFormat: "json"
        }
      }
    ]
  },
  "SQLMap": {
    name: "SQLMap",
    parameters: {
      url: "",
      method: "GET",
      data: "",
      level: "1",
      risk: "1",
      additionalFlags: ""
    },
    presets: [
      {
        name: "Basic SQL Injection Test",
        description: "Basic SQL injection detection",
        parameters: {
          url: "",
          method: "GET",
          data: "",
          level: "1",
          risk: "1",
          additionalFlags: "--batch"
        }
      },
      {
        name: "Comprehensive SQL Test",
        description: "Comprehensive SQL injection testing",
        parameters: {
          url: "",
          method: "GET",
          data: "",
          level: "5",
          risk: "3",
          additionalFlags: "--batch --dump"
        }
      }
    ]
  },
  "Metasploit": {
    name: "Metasploit",
    parameters: {
      exploit: "",
      payload: "",
      target: "",
      lhost: "",
      lport: "4444",
      additionalFlags: ""
    },
    presets: [
      {
        name: "Exploit Scan",
        description: "Scan for available exploits",
        parameters: {
          exploit: "",
          payload: "",
          target: "",
          lhost: "",
          lport: "4444",
          additionalFlags: "--check"
        }
      }
    ]
  },
  "Hydra": {
    name: "Hydra",
    parameters: {
      service: "",
      target: "",
      username: "",
      passwordList: "",
      additionalFlags: ""
    },
    presets: [
      {
        name: "SSH Brute Force",
        description: "Brute force SSH login",
        parameters: {
          service: "ssh",
          target: "",
          username: "root",
          passwordList: "/usr/share/wordlists/rockyou.txt",
          additionalFlags: "-t 4"
        }
      }
    ]
  },
  "Hashcat": {
    name: "Hashcat",
    parameters: {
      hashType: "0",
      hashFile: "",
      wordlist: "",
      additionalFlags: ""
    },
    presets: [
      {
        name: "MD5 Hash Cracking",
        description: "Crack MD5 hashes",
        parameters: {
          hashType: "0",
          hashFile: "",
          wordlist: "/usr/share/wordlists/rockyou.txt",
          additionalFlags: "-a 0"
        }
      }
    ]
  },
  "Bettercap": {
    name: "Bettercap",
    parameters: {
      interface: "wlan0",
      target: "",
      mode: "passive",
      additionalFlags: ""
    },
    presets: [
      {
        name: "WiFi Reconnaissance",
        description: "Passive WiFi reconnaissance",
        parameters: {
          interface: "wlan0",
          target: "",
          mode: "passive",
          additionalFlags: "--no-discovery"
        }
      }
    ]
  },
  
  // Defensive Tools
  "SIEM Dashboard": {
    name: "SIEM Dashboard",
    parameters: {
      timeRange: "24h",
      severity: "all",
      source: "all",
      additionalFilters: ""
    },
    presets: [
      {
        name: "Security Overview",
        description: "General security dashboard view",
        parameters: {
          timeRange: "24h",
          severity: "all",
          source: "all",
          additionalFilters: ""
        }
      },
      {
        name: "Critical Alerts",
        description: "View only critical security alerts",
        parameters: {
          timeRange: "7d",
          severity: "critical,high",
          source: "all",
          additionalFilters: "status:open"
        }
      }
    ]
  },
  "Threat Hunter": {
    name: "Threat Hunter",
    parameters: {
      query: "",
      timeRange: "7d",
      dataSource: "all",
      additionalFilters: ""
    },
    presets: [
      {
        name: "Malware Detection",
        description: "Search for malware indicators",
        parameters: {
          query: "process_name:* AND file_hash:*",
          timeRange: "7d",
          dataSource: "endpoint",
          additionalFilters: "threat_level:high"
        }
      },
      {
        name: "Lateral Movement",
        description: "Detect lateral movement patterns",
        parameters: {
          query: "event_type:network AND protocol:smb",
          timeRange: "24h",
          dataSource: "network",
          additionalFilters: "unusual_activity:true"
        }
      }
    ]
  },
  "Incident Response Platform": {
    name: "Incident Response Platform",
    parameters: {
      incidentType: "",
      severity: "medium",
      assignee: "",
      additionalTags: ""
    },
    presets: [
      {
        name: "Security Incident",
        description: "Create a new security incident",
        parameters: {
          incidentType: "security_breach",
          severity: "high",
          assignee: "",
          additionalTags: "urgent,investigation"
        }
      },
      {
        name: "Malware Analysis",
        description: "Create malware analysis case",
        parameters: {
          incidentType: "malware",
          severity: "medium",
          assignee: "",
          additionalTags: "analysis,quarantine"
        }
      }
    ]
  },
  "Network Monitor": {
    name: "Network Monitor",
    parameters: {
      interface: "eth0",
      captureFilter: "",
      analysisType: "traffic",
      timeRange: "1h"
    },
    presets: [
      {
        name: "Traffic Analysis",
        description: "Monitor network traffic patterns",
        parameters: {
          interface: "eth0",
          captureFilter: "tcp or udp",
          analysisType: "traffic",
          timeRange: "1h"
        }
      },
      {
        name: "Anomaly Detection",
        description: "Detect network anomalies",
        parameters: {
          interface: "eth0",
          captureFilter: "",
          analysisType: "anomaly",
          timeRange: "24h"
        }
      }
    ]
  },
  "Log Analyzer": {
    name: "Log Analyzer",
    parameters: {
      logSource: "all",
      timeRange: "24h",
      searchQuery: "",
      outputFormat: "json"
    },
    presets: [
      {
        name: "Security Events",
        description: "Analyze security-related log events",
        parameters: {
          logSource: "security",
          timeRange: "24h",
          searchQuery: "failed OR denied OR blocked",
          outputFormat: "json"
        }
      },
      {
        name: "Error Analysis",
        description: "Find and analyze system errors",
        parameters: {
          logSource: "system",
          timeRange: "7d",
          searchQuery: "error OR exception OR critical",
          outputFormat: "json"
        }
      }
    ]
  },
  "Digital Forensics Kit": {
    name: "Digital Forensics Kit",
    parameters: {
      evidenceType: "disk",
      target: "",
      analysisType: "basic",
      outputFormat: "json"
    },
    presets: [
      {
        name: "Disk Analysis",
        description: "Basic disk forensics analysis",
        parameters: {
          evidenceType: "disk",
          target: "",
          analysisType: "basic",
          outputFormat: "json"
        }
      },
      {
        name: "Memory Analysis",
        description: "Memory dump analysis",
        parameters: {
          evidenceType: "memory",
          target: "",
          analysisType: "advanced",
          outputFormat: "json"
        }
      }
    ]
  },
  "Endpoint Detection": {
    name: "Endpoint Detection",
    parameters: {
      endpoint: "",
      scanType: "full",
      timeRange: "24h",
      additionalFilters: ""
    },
    presets: [
      {
        name: "Full Scan",
        description: "Complete endpoint security scan",
        parameters: {
          endpoint: "",
          scanType: "full",
          timeRange: "24h",
          additionalFilters: "include_quarantine:true"
        }
      },
      {
        name: "Quick Scan",
        description: "Fast endpoint security check",
        parameters: {
          endpoint: "",
          scanType: "quick",
          timeRange: "1h",
          additionalFilters: "critical_only:true"
        }
      }
    ]
  },
  "Malware Sandbox": {
    name: "Malware Sandbox",
    parameters: {
      sampleFile: "",
      analysisTime: "300",
      environment: "windows10",
      additionalFlags: ""
    },
    presets: [
      {
        name: "Basic Analysis",
        description: "Basic malware behavior analysis",
        parameters: {
          sampleFile: "",
          analysisTime: "300",
          environment: "windows10",
          additionalFlags: "--basic"
        }
      },
      {
        name: "Advanced Analysis",
        description: "Comprehensive malware analysis",
        parameters: {
          sampleFile: "",
          analysisTime: "600",
          environment: "windows10",
          additionalFlags: "--advanced --network"
        }
      }
    ]
  }
};

export function ToolExecutionDialog({ open, onOpenChange, tool }: ToolExecutionDialogProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const [parameters, setParameters] = useState<Record<string, any>>({});
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [jobName, setJobName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  const createJob = useCreateJob();
  const { data: projects } = useProjects();
  const { toast } = useToast();
  
  const config = toolConfigs[tool.name] || {
    name: tool.name,
    parameters: { target: "" },
    presets: []
  };

  const handlePresetChange = (presetName: string) => {
    setSelectedPreset(presetName);
    const preset = config.presets.find(p => p.name === presetName);
    if (preset) {
      setParameters(preset.parameters);
    }
  };

  const handleParameterChange = (key: string, value: any) => {
    try {
      let sanitizedValue = value;
      
      // Apply appropriate validation and sanitization based on parameter type
      if (typeof value === 'string') {
        if (key === 'target' || key === 'domain') {
          sanitizedValue = validateUserInput(value, 'domain');
        } else if (key === 'url') {
          sanitizedValue = validateUserInput(value, 'url');
        } else if (key === 'ports') {
          sanitizedValue = validateUserInput(value, 'port');
        } else {
          sanitizedValue = sanitizeInput(value);
        }
      }
      
      setParameters(prev => ({ ...prev, [key]: sanitizedValue }));
    } catch (error) {
      toast({
        title: "Validation Error",
        description: error instanceof Error ? error.message : "Invalid input format",
        variant: "destructive"
      });
    }
  };

  const handleFilesSelected = (files: File[]) => {
    setUploadedFiles(files);
    // Update parameters with file paths for tools that need them
    if (files.length > 0) {
      setParameters(prev => ({ 
        ...prev, 
        filePaths: files.map(f => f.name),
        files: files 
      }));
    }
  };

  const getFileUploadComponent = () => {
    const toolName = tool.name.toLowerCase();
    
    if (toolName.includes('hashcat') || toolName.includes('hash')) {
      return <HashFileUpload onFilesSelected={handleFilesSelected} maxFiles={5} />;
    }
    
    if (toolName.includes('hydra') || toolName.includes('brute') || toolName.includes('wordlist')) {
      return <WordlistUpload onFilesSelected={handleFilesSelected} maxFiles={3} />;
    }
    
    if (toolName.includes('malware') || toolName.includes('sandbox')) {
      return <MalwareUpload onFilesSelected={handleFilesSelected} maxFiles={1} maxSize={50 * 1024 * 1024} />;
    }
    
    if (toolName.includes('forensics') || toolName.includes('evidence')) {
      return <EvidenceUpload onFilesSelected={handleFilesSelected} maxFiles={3} maxSize={100 * 1024 * 1024} />;
    }
    
    // Default file upload for other tools
    return <FileUpload onFilesSelected={handleFilesSelected} maxFiles={5} />;
  };

  const needsFileUpload = () => {
    const toolName = tool.name.toLowerCase();
    return toolName.includes('hashcat') || 
           toolName.includes('hydra') || 
           toolName.includes('malware') || 
           toolName.includes('forensics') ||
           toolName.includes('evidence') ||
           toolName.includes('wordlist') ||
           toolName.includes('hash');
  };

  const handleSubmit = async () => {
    if (!jobName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a job name.",
        variant: "destructive"
      });
      return;
    }

    // Validate parameters based on tool type
    try {
      const toolName = tool.name.toLowerCase();
      let validationSchema;
      
      if (toolName.includes('nmap')) {
        validationSchema = validationSchemas.nmap;
      } else if (toolName.includes('nuclei')) {
        validationSchema = validationSchemas.nuclei;
      } else if (toolName.includes('amass')) {
        validationSchema = validationSchemas.amass;
      } else if (toolName.includes('sqlmap')) {
        validationSchema = validationSchemas.sqlmap;
      } else if (toolName.includes('hydra')) {
        validationSchema = validationSchemas.hydra;
      } else if (toolName.includes('hashcat')) {
        validationSchema = validationSchemas.hashcat;
      }
      
      if (validationSchema) {
        validationSchema.parse(parameters);
      }
    } catch (error) {
      toast({
        title: "Validation Error",
        description: error instanceof Error ? error.message : "Invalid parameters",
        variant: "destructive"
      });
      return;
    }

    // If no project is selected, create a default one or use a placeholder
    const projectId = selectedProject || "default-project";

    setIsSubmitting(true);
    try {
      const jobData = {
        engagement_id: projectId,
        name: jobName,
        tool: tool.name,
        category: tool.category,
        target: parameters.target || parameters.domain || parameters.url || parameters.endpoint || "Unknown",
        parameters,
        status: 'queued' as const,
        progress: 0,
        started_at: null,
        completed_at: null,
        logs: null,
        artifacts: []
      };

      console.log("Creating job with data:", jobData);
      
      await createJob.mutateAsync(jobData);

      toast({
        title: "Job Created Successfully!",
        description: `Job "${jobName}" has been queued for execution. You can monitor its progress in the Jobs section.`,
      });

      onOpenChange(false);
      // Reset form
      setSelectedPreset("");
      setParameters({});
      setJobName("");
      setSelectedProject("");
    } catch (error) {
      console.error("Job creation error:", error);
      toast({
        title: "Error Creating Job",
        description: error instanceof Error ? error.message : "Failed to create job. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLabOnly = tool.status === "lab-only";
  const canRun = tool.status === "ready" || tool.status === "running";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <tool.icon className="h-6 w-6" />
            Execute {getToolDisplayName(tool.name)}
          </DialogTitle>
          <DialogDescription>
            Configure and run {getToolDisplayName(tool.name)} v{tool.version}
          </DialogDescription>
        </DialogHeader>

        {isLabOnly && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This tool requires Lab Mode to be enabled. Only use in authorized testing environments.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Configuration Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Job Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="project">Project (Optional)</Label>
                  <Select value={selectedProject} onValueChange={setSelectedProject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a project (or leave blank for default)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Default Project</SelectItem>
                      {projects?.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!projects || projects.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      No projects found. A default project will be used.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobName">Job Name</Label>
                  <Input
                    id="jobName"
                    placeholder={`${getToolDisplayName(tool.name)} scan`}
                    value={jobName}
                    onChange={(e) => setJobName(e.target.value)}
                  />
                </div>

                {config.presets.length > 0 && (
                  <div className="space-y-2">
                    <Label>Preset Configuration</Label>
                    <Select value={selectedPreset} onValueChange={handlePresetChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a preset" />
                      </SelectTrigger>
                      <SelectContent>
                        {config.presets.map((preset) => (
                          <SelectItem key={preset.name} value={preset.name}>
                            {preset.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedPreset && (
                      <p className="text-sm text-muted-foreground">
                        {config.presets.find(p => p.name === selectedPreset)?.description}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Tool Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(config.parameters).map(([key, defaultValue]) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
                    {key === "target" || key === "domain" ? (
                      <Input
                        id={key}
                        placeholder={`Enter ${key}...`}
                        value={parameters[key] || ""}
                        onChange={(e) => handleParameterChange(key, e.target.value)}
                      />
                    ) : key === "additionalFlags" ? (
                      <Textarea
                        id={key}
                        placeholder="Additional command line flags..."
                        value={parameters[key] || ""}
                        onChange={(e) => handleParameterChange(key, e.target.value)}
                        rows={2}
                      />
                    ) : (
                      <Input
                        id={key}
                        placeholder={String(defaultValue)}
                        value={parameters[key] || ""}
                        onChange={(e) => handleParameterChange(key, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {needsFileUpload() && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    File Upload
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {getFileUploadComponent()}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Command Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                  <div className="text-muted-foreground mb-2">Generated command:</div>
                  <div className="text-foreground">
                    {tool.name.toLowerCase()} {Object.entries(parameters)
                      .filter(([_, value]) => value)
                      .map(([key, value]) => {
                        if (key === "target" || key === "domain") return value;
                        if (key === "additionalFlags") return value;
                        return `--${key} ${value}`;
                      })
                      .join(" ")}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tool Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Version</span>
                  <Badge variant="outline">v{tool.version}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Category</span>
                  <Badge variant="secondary">{tool.category}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge 
                    variant={tool.status === "ready" ? "default" : "destructive"}
                    className={tool.status === "ready" ? "bg-success/10 text-success" : ""}
                  >
                    {tool.status}
                  </Badge>
                </div>
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!canRun || isSubmitting || !jobName.trim()}
            className="gap-2"
          >
            <Play className="h-4 w-4" />
            {isSubmitting ? "Creating Job..." : "Execute Tool"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
