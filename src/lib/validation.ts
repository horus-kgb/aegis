import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email('Invalid email address');
export const urlSchema = z.string().url('Invalid URL format');
export const ipAddressSchema = z.string().regex(
  /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  'Invalid IP address format'
);
export const domainSchema = z.string().regex(
  /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  'Invalid domain format'
);
export const portSchema = z.number().min(1).max(65535);
export const hashSchema = z.string().regex(
  /^[a-fA-F0-9]{32,64}$/,
  'Invalid hash format (must be 32-64 hex characters)'
);

// Tool-specific validation schemas
export const nmapValidationSchema = z.object({
  target: z.string().min(1, 'Target is required').refine(
    (val) => {
      // Allow IP addresses, domains, or CIDR ranges
      return ipAddressSchema.safeParse(val).success || 
             domainSchema.safeParse(val).success ||
             /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\/[0-9]{1,2}$/.test(val);
    },
    'Target must be a valid IP address, domain, or CIDR range'
  ),
  scanType: z.enum(['syn', 'tcp', 'udp', 'ack', 'fin', 'null', 'xmas']),
  ports: z.string().regex(
    /^([0-9]+(-[0-9]+)?)(,([0-9]+(-[0-9]+)?))*$/,
    'Invalid port format (use comma-separated ports or ranges like 80,443,1000-2000)'
  ),
  timing: z.enum(['T0', 'T1', 'T2', 'T3', 'T4', 'T5']),
  outputFormat: z.enum(['xml', 'json', 'txt']),
  additionalFlags: z.string().optional()
});

export const nucleiValidationSchema = z.object({
  target: z.string().min(1, 'Target is required'),
  templates: z.string().min(1, 'Templates are required'),
  severity: z.enum(['low', 'medium', 'high', 'critical', 'all']),
  rate: z.string().regex(/^[0-9]+$/, 'Rate must be a number'),
  timeout: z.string().regex(/^[0-9]+$/, 'Timeout must be a number'),
  outputFormat: z.enum(['json', 'yaml', 'txt'])
});

export const amassValidationSchema = z.object({
  domain: domainSchema,
  mode: z.enum(['passive', 'active']),
  sources: z.string().min(1, 'Sources are required'),
  outputFormat: z.enum(['json', 'yaml', 'txt']),
  timeout: z.string().regex(/^[0-9]+$/, 'Timeout must be a number')
});

export const sqlmapValidationSchema = z.object({
  url: urlSchema,
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE']),
  data: z.string().optional(),
  level: z.string().regex(/^[1-5]$/, 'Level must be between 1 and 5'),
  risk: z.string().regex(/^[1-3]$/, 'Risk must be between 1 and 3'),
  additionalFlags: z.string().optional()
});

export const hydraValidationSchema = z.object({
  service: z.string().min(1, 'Service is required'),
  target: z.string().min(1, 'Target is required'),
  username: z.string().min(1, 'Username is required'),
  passwordList: z.string().min(1, 'Password list is required'),
  additionalFlags: z.string().optional()
});

export const hashcatValidationSchema = z.object({
  hashType: z.string().regex(/^[0-9]+$/, 'Hash type must be a number'),
  hashFile: z.string().min(1, 'Hash file is required'),
  wordlist: z.string().min(1, 'Wordlist is required'),
  additionalFlags: z.string().optional()
});

// Input sanitization functions
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>\"'&]/g, (match) => {
      const escapeMap: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
      };
      return escapeMap[match];
    });
};

export const sanitizeUrl = (url: string): string => {
  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('Invalid protocol');
    }
    return parsed.toString();
  } catch {
    throw new Error('Invalid URL format');
  }
};

export const sanitizeIpAddress = (ip: string): string => {
  const sanitized = sanitizeInput(ip);
  if (!ipAddressSchema.safeParse(sanitized).success) {
    throw new Error('Invalid IP address format');
  }
  return sanitized;
};

export const sanitizeDomain = (domain: string): string => {
  const sanitized = sanitizeInput(domain).toLowerCase();
  if (!domainSchema.safeParse(sanitized).success) {
    throw new Error('Invalid domain format');
  }
  return sanitized;
};

export const sanitizePort = (port: string): number => {
  const portNum = parseInt(port, 10);
  if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
    throw new Error('Port must be a number between 1 and 65535');
  }
  return portNum;
};

export const sanitizePortRange = (ports: string): string => {
  const sanitized = sanitizeInput(ports);
  if (!/^([0-9]+(-[0-9]+)?)(,([0-9]+(-[0-9]+)?))*$/.test(sanitized)) {
    throw new Error('Invalid port range format');
  }
  return sanitized;
};

// File validation
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.some(type => {
    if (type === '*') return true;
    if (type.startsWith('.')) {
      return file.name.toLowerCase().endsWith(type.toLowerCase());
    }
    return file.type.includes(type);
  });
};

export const validateFileSize = (file: File, maxSize: number): boolean => {
  return file.size <= maxSize;
};

export const sanitizeFileName = (fileName: string): string => {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '');
};

// Job validation
export const jobValidationSchema = z.object({
  name: z.string().min(1, 'Job name is required').max(100, 'Job name too long'),
  tool: z.string().min(1, 'Tool is required'),
  category: z.string().min(1, 'Category is required'),
  target: z.string().min(1, 'Target is required'),
  parameters: z.record(z.any()),
  engagement_id: z.string().min(1, 'Engagement ID is required')
});

// Project validation
export const projectValidationSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Project name too long'),
  description: z.string().max(500, 'Description too long').optional()
});

// User input validation
export const validateUserInput = (input: string, type: 'general' | 'url' | 'ip' | 'domain' | 'port'): string => {
  const sanitized = sanitizeInput(input);
  
  switch (type) {
    case 'url':
      return sanitizeUrl(sanitized);
    case 'ip':
      return sanitizeIpAddress(sanitized);
    case 'domain':
      return sanitizeDomain(sanitized);
    case 'port':
      return sanitizePort(sanitized).toString();
    default:
      return sanitized;
  }
};

// Command injection prevention
export const sanitizeCommand = (command: string): string => {
  return command
    .replace(/[;&|`$(){}[\]]/g, '') // Remove dangerous characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
};

// SQL injection prevention (basic)
export const sanitizeSqlInput = (input: string): string => {
  return input
    .replace(/[';]/g, '') // Remove SQL injection characters (fixed regex)
    .replace(/--/g, '') // Remove SQL comments
    .replace(/union/gi, '') // Remove UNION keyword
    .replace(/select/gi, '') // Remove SELECT keyword
    .replace(/insert/gi, '') // Remove INSERT keyword
    .replace(/update/gi, '') // Remove UPDATE keyword
    .replace(/delete/gi, '') // Remove DELETE keyword
    .replace(/drop/gi, '') // Remove DROP keyword
    .trim();
};

// XSS prevention
export const sanitizeHtml = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Rate limiting validation
export const validateRateLimit = (requests: number, limit: number, windowMs: number): boolean => {
  // This would typically be implemented with a proper rate limiting library
  // For now, just a simple check
  return requests <= limit;
};

// Export all validation schemas
export const validationSchemas = {
  nmap: nmapValidationSchema,
  nuclei: nucleiValidationSchema,
  amass: amassValidationSchema,
  sqlmap: sqlmapValidationSchema,
  hydra: hydraValidationSchema,
  hashcat: hashcatValidationSchema,
  job: jobValidationSchema,
  project: projectValidationSchema
};
