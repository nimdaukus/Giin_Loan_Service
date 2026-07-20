import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mbtukgkzziervllwjqwv.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_FMd0NMgabdqdMwqX8toWJQ_phS7yNDD';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
