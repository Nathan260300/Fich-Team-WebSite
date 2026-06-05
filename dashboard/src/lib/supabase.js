import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://unhfpfhsidmyxwcfdnek.supabase.co';
const SUPABASE_ANON = 'sb_publishable_60BMiOljgHuEmR4UN1sHhg_zG1zaZWG';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);
