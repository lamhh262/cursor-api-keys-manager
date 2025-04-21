import { createClient } from '@supabase/supabase-js';

// These environment variables need to be set in your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Type for API keys
export interface ApiKey {
  id: string;
  name: string;
  key: string;
  created_at: string;
  type?: string;
  usage?: number;
  user_id?: string;
  monthly_limit?: number;
}

// Type for users
export interface User {
  id: string;
  email: string;
  name: string;
  type: string;
  created_at: string;
  updated_at: string;
}
