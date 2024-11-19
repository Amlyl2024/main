import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Project types
export interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string;
  target_amount: number;
  funded_amount: number;
  deadline: string;
  category: string;
  image_urls: string[];
  backers_count: number;
  created_at: string;
}

export interface ProjectInvestment {
  id: string;
  project_id: string;
  investor_id: string;
  amount: number;
  created_at: string;
}

// Project functions
export async function createProject(projectData: Omit<Project, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('projects')
    .insert([projectData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getProject(id: string) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function investInProject(projectId: string, amount: number, userId: string) {
  const { data, error } = await supabase
    .from('project_investments')
    .insert([
      {
        project_id: projectId,
        investor_id: userId,
        amount: amount,
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function uploadProjectImage(file: File) {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('project-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('project-images')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image. Please try again.');
  }
}