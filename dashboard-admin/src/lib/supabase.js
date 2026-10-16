import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://unhfpfhsidmyxwcfdnek.supabase.co';
const SUPABASE_ANON = 'sb_publishable_5cDdiGYwiRn619gA9shx0A_tuyM1ipK';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);
