import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [session, setSession] = useState(undefined);
  const [permissions, setPermissions] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s ?? null);
      if (!s) setPermissions(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;

    supabase
      .from('user_permissions')
      .select('fich, leratsolitaire')
      .eq('user_id', session.user.id)
      .single()
      .then(({ data }) => setPermissions(data ?? { fich: false, leratsolitaire: false }));
  }, [session]);

  const logout = () => supabase.auth.signOut();

  return { session, permissions, logout };
}
