import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qtlbsnwhrwgdxsfqnsam.supabase.co";
const supabaseKey = "sb_publishable_JsDSzL_8ig8PFUw5GtH5IA_uhKSmHAD";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;