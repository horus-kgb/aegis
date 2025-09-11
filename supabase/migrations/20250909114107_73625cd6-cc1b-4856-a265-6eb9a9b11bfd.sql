-- Insert sample data for demonstration
-- First, let's get the user ID from the first user (or create a placeholder)
DO $$
DECLARE
    sample_user_id UUID;
BEGIN
    -- Try to get an existing user, if none exists, skip sample data insertion
    SELECT id INTO sample_user_id FROM auth.users LIMIT 1;
    
    IF sample_user_id IS NULL THEN
        -- No users exist yet, skip sample data insertion
        -- Sample data will be inserted when the first user registers
        RETURN;
    END IF;

    -- Insert sample projects
    INSERT INTO public.projects (name, description, created_by) VALUES 
        ('ACME Corp Security Assessment', 'Comprehensive security assessment for ACME Corporation web applications and network infrastructure.', sample_user_id),
        ('Internal Red Team Exercise', 'Quarterly red team exercise to test defensive capabilities and incident response procedures.', sample_user_id),
        ('Cloud Security Audit', 'Security audit of AWS cloud infrastructure including IAM, S3, and EC2 configurations.', sample_user_id)
    ON CONFLICT DO NOTHING;

    -- Insert sample engagements
    INSERT INTO public.engagements (project_id, name, description, scope_yaml, lab_mode, status, created_by) 
    SELECT 
        p.id,
        'Web Application Testing',
        'Testing of customer-facing web applications',
        'engagement: "acme-web-test"
lab_mode: false
allowlist:
  domains: ["acme.com", "app.acme.com"]
  hosts: ["203.0.113.10", "203.0.113.11"]
blocklist:
  cidrs: ["10.0.0.0/8"]
notes: "External web only. No brute force attacks."',
        false,
        'active',
        sample_user_id
    FROM public.projects p 
    WHERE p.name = 'ACME Corp Security Assessment'
    ON CONFLICT DO NOTHING;

    INSERT INTO public.engagements (project_id, name, description, scope_yaml, lab_mode, status, created_by) 
    SELECT 
        p.id,
        'Network Penetration Test',
        'Internal network security assessment',
        'engagement: "internal-pentest"
lab_mode: true
allowlist:
  cidrs: ["192.168.1.0/24", "10.10.0.0/16"]
blocklist: []
notes: "Full internal network testing authorized."',
        true,
        'active',
        sample_user_id
    FROM public.projects p 
    WHERE p.name = 'Internal Red Team Exercise'
    ON CONFLICT DO NOTHING;

    -- Insert sample jobs
    INSERT INTO public.jobs (engagement_id, name, tool, category, target, parameters, status, progress, started_at, created_by) 
    SELECT 
        e.id,
        'Port Scan - ACME Web Servers',
        'nmap',
        'offensive.recon',
        '203.0.113.10-11',
        '{"flags": ["-sV", "-T3"]}',
        'running',
        67,
        now() - interval '5 minutes',
        sample_user_id
    FROM public.engagements e 
    WHERE e.name = 'Web Application Testing'
    ON CONFLICT DO NOTHING;

    INSERT INTO public.jobs (engagement_id, name, tool, category, target, parameters, status, progress, created_by) 
    SELECT 
        e.id,
        'Web Vulnerability Scan',
        'nuclei',
        'offensive.webapp',
        'https://acme.com',
        '{"templates": ["safe-defaults"]}',
        'queued',
        0,
        sample_user_id
    FROM public.engagements e 
    WHERE e.name = 'Web Application Testing'
    ON CONFLICT DO NOTHING;

    INSERT INTO public.jobs (engagement_id, name, tool, category, target, parameters, status, progress, started_at, completed_at, created_by) 
    SELECT 
        e.id,
        'Network Discovery',
        'nmap',
        'offensive.recon',
        '192.168.1.0/24',
        '{"flags": ["-sn"]}',
        'completed',
        100,
        now() - interval '1 hour',
        now() - interval '30 minutes',
        sample_user_id
    FROM public.engagements e 
    WHERE e.name = 'Network Penetration Test'
    ON CONFLICT DO NOTHING;

    -- Insert sample findings
    INSERT INTO public.findings (job_id, title, description, severity, category, cwe, mitre_attack) 
    SELECT 
        j.id,
        'Open SSH Service Detected',
        'SSH service running on port 22 with default configuration',
        'medium',
        'Network Services',
        'CWE-16',
        'T1021.004'
    FROM public.jobs j 
    WHERE j.name = 'Network Discovery'
    ON CONFLICT DO NOTHING;

    INSERT INTO public.findings (job_id, title, description, severity, category, cwe, mitre_attack) 
    SELECT 
        j.id,
        'HTTP Service on Non-Standard Port',
        'HTTP service detected on port 8080',
        'low',
        'Network Services',
        'CWE-16',
        'T1040'
    FROM public.jobs j 
    WHERE j.name = 'Port Scan - ACME Web Servers'
    ON CONFLICT DO NOTHING;

    -- Insert sample workflows
    INSERT INTO public.workflows (name, description, yaml_definition, approvals_required, created_by) VALUES 
        ('Web Recon Safe', 'Safe web reconnaissance workflow using passive techniques', 'name: "web_recon_safe"
description: "Passive recon and safe Nuclei templates"
steps:
  - plugin: "amass"
    with: { domain: "{{ target }}", mode: "passive" }
    save_as: "subs"
  - plugin: "nuclei"
    with:
      targets_from: "{{ steps.subs.output.subdomains }}"
      templates_pack: "safe-defaults"
approvals_required: 0', 0, sample_user_id),
        ('Full Security Assessment', 'Comprehensive security assessment workflow', 'name: "full_assessment"
description: "Complete security assessment with multiple tools"
steps:
  - plugin: "nmap"
    with: { target: "{{ target }}", flags: ["-sV", "-T3"] }
    save_as: "ports"
  - plugin: "nuclei"
    with: { target: "{{ target }}", templates_pack: "comprehensive" }
    save_as: "vulns"
approvals_required: 2', 2, sample_user_id)
    ON CONFLICT DO NOTHING;

END $$;