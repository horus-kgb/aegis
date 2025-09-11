// Tool name mappings for operational security
// Only recognizable tools are disguised with Greek letter code names
// This file should only be modified by authorized personnel

export interface ToolMapping {
  displayName: string;
  internalName: string;
  description: string;
  category: string;
}

// Greek letter code name mappings for recognizable tools
export const toolMappings: Record<string, ToolMapping> = {
  // Offensive Tools - Reconnaissance
  "Nmap": {
    displayName: "Alpha Scanner",
    internalName: "Nmap",
    description: "Network discovery and security auditing tool for port scanning and host enumeration",
    category: "recon"
  },
  
  // Offensive Tools - Vulnerability Assessment
  "Nuclei": {
    displayName: "Beta Engine",
    internalName: "Nuclei", 
    description: "Fast vulnerability scanner with community-powered templates for web applications",
    category: "vuln"
  },
  
  "SQLMap": {
    displayName: "Gamma Analyzer",
    internalName: "SQLMap",
    description: "Automatic SQL injection detection and exploitation tool",
    category: "vuln"
  },
  
  // Offensive Tools - Exploitation
  "Metasploit": {
    displayName: "Delta Framework",
    internalName: "Metasploit",
    description: "Comprehensive penetration testing framework for exploit development and execution",
    category: "exploit"
  },
  
  "Hydra": {
    displayName: "Epsilon Engine",
    internalName: "Hydra",
    description: "Fast network logon cracker supporting multiple protocols and services",
    category: "exploit"
  },
  
  "Hashcat": {
    displayName: "Zeta Processor",
    internalName: "Hashcat",
    description: "Advanced password recovery tool supporting multiple hash types and attack modes",
    category: "exploit"
  },
  
  // Defensive Tools - Vulnerability Assessment
  "Nessus": {
    displayName: "Eta Scanner",
    internalName: "Nessus",
    description: "Comprehensive vulnerability scanner with extensive plugin database",
    category: "scanner"
  },
  
  "Burp Suite": {
    displayName: "Theta Platform",
    internalName: "Burp Suite",
    description: "Web application security testing platform with advanced scanning capabilities",
    category: "web"
  }
};

// Helper function to get display name for a tool
export const getToolDisplayName = (internalName: string): string => {
  return toolMappings[internalName]?.displayName || internalName;
};

// Helper function to get full tool mapping
export const getToolMapping = (internalName: string): ToolMapping | null => {
  return toolMappings[internalName] || null;
};

// Helper function to get internal name from display name
export const getInternalName = (displayName: string): string => {
  const mapping = Object.values(toolMappings).find(m => m.displayName === displayName);
  return mapping?.internalName || displayName;
};

// Helper function to check if a tool has a code name
export const hasCodeName = (internalName: string): boolean => {
  return internalName in toolMappings;
};

// Get all tools with their mappings (for display purposes)
export const getAllToolMappings = (): ToolMapping[] => {
  return Object.values(toolMappings);
};

// Get tools by category with mappings
export const getToolsByCategory = (category: string): ToolMapping[] => {
  return Object.values(toolMappings).filter(tool => tool.category === category);
};
