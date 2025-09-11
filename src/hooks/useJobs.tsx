import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { JobExecutor } from '@/lib/jobExecutor';

export interface Job {
  id: string;
  engagement_id: string;
  name: string;
  tool: string;
  category: string;
  target: string;
  parameters: Record<string, any>;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  started_at: string | null;
  completed_at: string | null;
  logs: string | null;
  artifacts: any[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const useJobs = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Job[];
    },
    enabled: !!user,
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (jobData: Omit<Job, 'id' | 'created_by' | 'created_at' | 'updated_at'>) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('jobs')
        .insert({
          ...jobData,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      
      // Start job execution in the background
      if (data) {
        executeJobInBackground(data);
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Job> }) => {
      const { data, error } = await supabase
        .from('jobs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};

// Background job execution
const executeJobInBackground = async (job: Job) => {
  const jobExecutor = JobExecutor.getInstance();
  
  try {
    // Update job status to running
    await supabase
      .from('jobs')
      .update({ 
        status: 'running',
        started_at: new Date().toISOString(),
        progress: 0
      })
      .eq('id', job.id);

    // Execute the job
    const result = await jobExecutor.executeJob(job.id, job.tool, job.parameters);
    
    // Update job with results
    await supabase
      .from('jobs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        progress: 100,
        logs: result.logs.join('\n'),
        artifacts: result.artifacts
      })
      .eq('id', job.id);

    // Create findings if any
    if (result.findings.length > 0) {
      for (const finding of result.findings) {
        await supabase
          .from('findings')
          .insert({
            job_id: job.id,
            title: finding.title,
            description: finding.description,
            severity: finding.severity,
            category: job.category,
            evidence: { source: job.tool }
          });
      }
    }
  } catch (error) {
    console.error('Job execution failed:', error);
    // Update job status to failed
    await supabase
      .from('jobs')
      .update({
        status: 'failed',
        completed_at: new Date().toISOString(),
        logs: `Job execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      })
      .eq('id', job.id);
  }
};