import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useSession() {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return session;
}
