import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPERBASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPERBASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);
