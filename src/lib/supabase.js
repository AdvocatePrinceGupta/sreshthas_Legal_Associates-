// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase credentials (or set them in a `.env` file)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://znveklnjsldiriohmeiu.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'process.env.SUPABASE_KEY';

const isConfigured = /^https?:\/\//i.test(supabaseUrl) && supabaseAnonKey && supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY';

export let supabase = null;
if (isConfigured) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('Supabase not configured. Some features will be disabled. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env to enable.');
}

// Helper functions for database operations

// Cases
export const getCases = async () => {
  if (!isConfigured) return { data: [], error: null };
  const { data, error } = await supabase
    .from('cases')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
};

export const getCaseById = async (caseId) => {
  if (!isConfigured) return { data: null, error: null };
  const { data, error } = await supabase
    .from('cases')
    .select('*')
    .eq('case_id', caseId)
    .single();
  return { data, error };
};

export const createCase = async (caseData) => {
  if (!isConfigured) return { data: null, error: null };
  const { data, error } = await supabase
    .from('cases')
    .insert([caseData])
    .select();
  return { data, error };
};

export const updateCase = async (id, updates) => {
  if (!isConfigured) return { data: null, error: null };
  const { data, error } = await supabase
    .from('cases')
    .update({ ...updates, last_update: new Date().toISOString() })
    .eq('id', id)
    .select();
  return { data, error };
};

// Blog Posts
export const getBlogPosts = async (publishedOnly = true) => {
  if (!isConfigured) return { data: [], error: null };
  let query = supabase
    .from('blog_posts')
    .select('*')
    .order('published_date', { ascending: false });
  
  if (publishedOnly) {
    query = query.eq('is_published', true);
  }
  
  const { data, error } = await query;
  return { data, error };
};

export const getBlogPostById = async (id) => {
  if (!isConfigured) return { data: null, error: null };
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();
  return { data, error };
};

export const createBlogPost = async (postData) => {
  if (!isConfigured) return { data: null, error: null };
  const { data, error } = await supabase
    .from('blog_posts')
    .insert([postData])
    .select();
  return { data, error };
};

export const updateBlogPost = async (id, updates) => {
  if (!isConfigured) return { data: null, error: null };
  const { data, error } = await supabase
    .from('blog_posts')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select();
  return { data, error };
};

export const deleteBlogPost = async (id) => {
  if (!isConfigured) return { data: null, error: null };
  const { data, error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);
  return { data, error };
};

// Contact Inquiries
export const createContactInquiry = async (inquiryData) => {
  if (!isConfigured) return { data: null, error: null };
  const { data, error } = await supabase
    .from('contact_inquiries')
    .insert([inquiryData])
    .select();
  return { data, error };
};

export const getContactInquiries = async () => {
  if (!isConfigured) return { data: [], error: null };
  const { data, error } = await supabase
    .from('contact_inquiries')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
};

export const updateInquiryStatus = async (id, status) => {
  if (!isConfigured) return { data: null, error: null };
  const { data, error } = await supabase
    .from('contact_inquiries')
    .update({ status })
    .eq('id', id)
    .select();
  return { data, error };
};

// Trademark Applications
export const createTrademarkApplication = async (appData) => {
  if (!isConfigured) return { data: null, error: null };
  const { data, error } = await supabase
    .from('trademark_applications')
    .insert([appData])
    .select();
  return { data, error };
};

export const getTrademarkApplications = async () => {
  if (!isConfigured) return { data: [], error: null };
  const { data, error } = await supabase
    .from('trademark_applications')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
};

export const updateTrademarkStatus = async (id, status) => {
  if (!isConfigured) return { data: null, error: null };
  const { data, error } = await supabase
    .from('trademark_applications')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select();
  return { data, error };
};

// Authentication
export const signIn = async (email, password) => {
  if (!isConfigured) return { data: null, error: null };
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  if (!isConfigured) return { error: null };
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  if (!isConfigured) return null;
  try {
    const result = await supabase.auth.getUser();
    return result?.data?.user ?? null;
  } catch (err) {
    console.error('getCurrentUser error', err);
    return null;
  }
};

// Statistics (for admin dashboard)
export const getDashboardStats = async () => {
  if (!isConfigured) {
    return { totalCases: 0, totalInquiries: 0, totalTrademarks: 0, totalBlogs: 0 };
  }

  const [cases, inquiries, trademarks, blogs] = await Promise.all([
    supabase.from('cases').select('*', { count: 'exact', head: true }),
    supabase.from('contact_inquiries').select('*', { count: 'exact', head: true }),
    supabase.from('trademark_applications').select('*', { count: 'exact', head: true }),
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
  ]);

  return {
    totalCases: cases.count || 0,
    totalInquiries: inquiries.count || 0,
    totalTrademarks: trademarks.count || 0,
    totalBlogs: blogs.count || 0,
  };
};