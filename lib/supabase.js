import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Frontend client (safe to use in components)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client (only use in API routes, never in frontend!)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);