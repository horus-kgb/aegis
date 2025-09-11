// Mock job executor for simulating tool execution
export interface JobExecutionResult {
  success: boolean;
  logs: string[];
  artifacts: Array<{
    name: string;
    size: string;
    type: string;
    hash: string;
  }>;
  findings: Array<{
    id: string;
    severity: "low" | "medium" | "high" | "critical";
    title: string;
    description: string;
  }>;
}

export class JobExecutor {
  private static instance: JobExecutor;
  private runningJobs: Map<string, NodeJS.Timeout> = new Map();

  static getInstance(): JobExecutor {
    if (!JobExecutor.instance) {
      JobExecutor.instance = new JobExecutor();
    }
    return JobExecutor.instance;
  }

  async executeJob(jobId: string, tool: string, parameters: Record<string, any>): Promise<JobExecutionResult> {
    return new Promise((resolve) => {
      // Simulate job execution with different durations based on tool
      const duration = this.getToolDuration(tool);
      const logs = this.generateLogs(tool, parameters);
      const artifacts = this.generateArtifacts(tool);
      const findings = this.generateFindings(tool, parameters);

      // Simulate progress updates
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          this.runningJobs.delete(jobId);
          resolve({
            success: true,
            logs,
            artifacts,
            findings
          });
        }
      }, duration / 5);

      this.runningJobs.set(jobId, interval);
    });
  }

  private getToolDuration(tool: string): number {
    const durations: Record<string, number> = {
      "Nmap": 30000, // 30 seconds
      "Nuclei": 45000, // 45 seconds
      "Amass": 60000, // 1 minute
      "theHarvester": 20000, // 20 seconds
      "SQLMap": 90000, // 1.5 minutes
      "Metasploit": 120000, // 2 minutes
      "Hydra": 180000, // 3 minutes
      "Hashcat": 300000, // 5 minutes
      "Bettercap": 60000, // 1 minute
      "SIEM Dashboard": 10000, // 10 seconds
      "Threat Hunter": 30000, // 30 seconds
      "Incident Response Platform": 15000, // 15 seconds
      "Network Monitor": 20000, // 20 seconds
      "Log Analyzer": 25000, // 25 seconds
      "Digital Forensics Kit": 180000, // 3 minutes
      "Endpoint Detection": 40000, // 40 seconds
      "Malware Sandbox": 300000, // 5 minutes
    };
    return durations[tool] || 30000;
  }

  private generateLogs(tool: string, parameters: Record<string, any>): string[] {
    const baseLogs = [
      `[${new Date().toISOString()}] Starting ${tool} execution`,
      `[${new Date().toISOString()}] Parameters: ${JSON.stringify(parameters)}`,
      `[${new Date().toISOString()}] Initializing tool environment...`,
    ];

    const toolSpecificLogs: Record<string, string[]> = {
      "Nmap": [
        "[INFO] Starting Nmap scan",
        "[INFO] Scanning target: " + (parameters.target || "unknown"),
        "[INFO] Port scan in progress...",
        "[INFO] Service detection running...",
        "[INFO] OS detection completed",
        "[INFO] Scan completed successfully"
      ],
      "Nuclei": [
        "[INFO] Loading Nuclei templates",
        "[INFO] Target: " + (parameters.target || "unknown"),
        "[INFO] Running vulnerability scans...",
        "[INFO] Template execution in progress",
        "[INFO] Results analysis completed"
      ],
      "Amass": [
        "[INFO] Starting subdomain enumeration",
        "[INFO] Domain: " + (parameters.domain || "unknown"),
        "[INFO] Passive reconnaissance active",
        "[INFO] DNS enumeration running...",
        "[INFO] Subdomain discovery completed"
      ],
      "SIEM Dashboard": [
        "[INFO] Loading security dashboard",
        "[INFO] Time range: " + (parameters.timeRange || "24h"),
        "[INFO] Aggregating security events...",
        "[INFO] Dashboard updated successfully"
      ],
      "Threat Hunter": [
        "[INFO] Starting threat hunting query",
        "[INFO] Query: " + (parameters.query || "default"),
        "[INFO] Searching threat intelligence...",
        "[INFO] Analysis completed"
      ]
    };

    return [...baseLogs, ...(toolSpecificLogs[tool] || ["[INFO] Tool execution completed"])];
  }

  private generateArtifacts(tool: string): Array<{name: string; size: string; type: string; hash: string}> {
    const artifacts: Record<string, Array<{name: string; size: string; type: string; hash: string}>> = {
      "Nmap": [
        { name: "nmap_scan.xml", size: "245 KB", type: "XML", hash: "sha256:abc123..." },
        { name: "nmap_scan.json", size: "182 KB", type: "JSON", hash: "sha256:def456..." },
        { name: "ports_summary.csv", size: "12 KB", type: "CSV", hash: "sha256:ghi789..." }
      ],
      "Nuclei": [
        { name: "nuclei_results.json", size: "156 KB", type: "JSON", hash: "sha256:jkl012..." },
        { name: "vulnerabilities.csv", size: "8 KB", type: "CSV", hash: "sha256:mno345..." }
      ],
      "Amass": [
        { name: "subdomains.json", size: "89 KB", type: "JSON", hash: "sha256:pqr678..." },
        { name: "dns_records.txt", size: "23 KB", type: "TXT", hash: "sha256:stu901..." }
      ],
      "SIEM Dashboard": [
        { name: "dashboard_export.json", size: "67 KB", type: "JSON", hash: "sha256:vwx234..." },
        { name: "security_metrics.csv", size: "15 KB", type: "CSV", hash: "sha256:yza567..." }
      ],
      "Threat Hunter": [
        { name: "threat_intel.json", size: "134 KB", type: "JSON", hash: "sha256:bcd890..." },
        { name: "hunting_results.csv", size: "19 KB", type: "CSV", hash: "sha256:efg123..." }
      ]
    };

    return artifacts[tool] || [
      { name: `${tool.toLowerCase()}_results.json`, size: "50 KB", type: "JSON", hash: "sha256:default..." }
    ];
  }

  private generateFindings(tool: string, parameters: Record<string, any>): Array<{id: string; severity: "low" | "medium" | "high" | "critical"; title: string; description: string}> {
    const findings: Record<string, Array<{id: string; severity: "low" | "medium" | "high" | "critical"; title: string; description: string}>> = {
      "Nmap": [
        {
          id: "nmap-001",
          severity: "medium",
          title: "Open SSH Service Detected",
          description: "SSH service running on port 22 with potential weak configuration"
        },
        {
          id: "nmap-002",
          severity: "low",
          title: "HTTP Service on Non-Standard Port",
          description: "HTTP service detected on port 8080"
        }
      ],
      "Nuclei": [
        {
          id: "nuclei-001",
          severity: "high",
          title: "SQL Injection Vulnerability",
          description: "SQL injection vulnerability detected in login form"
        },
        {
          id: "nuclei-002",
          severity: "medium",
          title: "Information Disclosure",
          description: "Sensitive information exposed in error messages"
        }
      ],
      "Amass": [
        {
          id: "amass-001",
          severity: "low",
          title: "Subdomain Discovery",
          description: "Multiple subdomains discovered for the target domain"
        }
      ],
      "SIEM Dashboard": [
        {
          id: "siem-001",
          severity: "high",
          title: "Suspicious Login Activity",
          description: "Multiple failed login attempts detected from external IP"
        },
        {
          id: "siem-002",
          severity: "medium",
          title: "Unusual Network Traffic",
          description: "Abnormal network traffic patterns detected"
        }
      ],
      "Threat Hunter": [
        {
          id: "threat-001",
          severity: "critical",
          title: "Malware Indicator Detected",
          description: "Known malware hash detected in system files"
        }
      ]
    };

    return findings[tool] || [
      {
        id: `${tool.toLowerCase()}-001`,
        severity: "low",
        title: "Tool Execution Completed",
        description: `${tool} execution completed successfully`
      }
    ];
  }

  cancelJob(jobId: string): void {
    const interval = this.runningJobs.get(jobId);
    if (interval) {
      clearInterval(interval);
      this.runningJobs.delete(jobId);
    }
  }
}
