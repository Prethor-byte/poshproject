import { supabase } from './supabase';

export interface AutomationTask {
  id: string;
  type: string;
  target: string;
  quantity: number;
  schedule: string;
  status: string;
  created_at?: string;
}

export async function fetchAutomationTasks(): Promise<AutomationTask[]> {
  const { data, error } = await supabase
    .from('automation_tasks')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as AutomationTask[];
}

export async function createAutomationTask(task: Omit<AutomationTask, 'id' | 'status' | 'created_at'>): Promise<AutomationTask> {
  const { data, error } = await supabase
    .from('automation_tasks')
    .insert({ ...task, status: 'Scheduled' })
    .select()
    .single();
  if (error) throw error;
  return data as AutomationTask;
}

export async function updateAutomationTaskStatus(id: string, status: string): Promise<void> {
  const { error } = await supabase
    .from('automation_tasks')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteAutomationTask(id: string): Promise<void> {
  const { error } = await supabase
    .from('automation_tasks')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
