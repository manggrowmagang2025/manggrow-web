import { createClient } from "@supabase/supabase-js";

// Pastikan membuat file .env di root front-end dengan variabel berikut:
// VITE_SUPABASE_URL=https://your-project.supabase.co
// VITE_SUPABASE_ANON_KEY=your-anon-key

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase environment variables are missing!");
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");
