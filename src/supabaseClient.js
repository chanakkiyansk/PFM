import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qtlbsnwhrwgdxsfqnsam.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0bGJzbndocndnZHhzZnFuc2FtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5MjExMzEsImV4cCI6MjA5MDQ5NzEzMX0.De1wGIEv9x68RIZJ3Xtb_XfpAuUTRZyAto04ijJ6iJc";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;