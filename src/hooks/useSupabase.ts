import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";

export function useSupabase() {
  return {
    supabase,
    isSupabaseConfigured,
  };
}
