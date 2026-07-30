import { createClient } from "@supabase/supabase-js";

// Menggunakan fallback URL yang valid agar aplikasi tidak crash 
// sebelum environment variables diatur.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http') 
  ? process.env.NEXT_PUBLIC_SUPABASE_URL 
  : "https://placeholder-project.supabase.co";

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

