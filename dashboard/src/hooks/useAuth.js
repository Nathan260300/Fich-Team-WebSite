import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [session, setSession] = useState(undefined);
  const [permissions, setPermissions] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);

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

    let cancelled = false;

    const checkPermissions = async () => {
      const { data, error } = await supabase
        .from('user_permissions')
        .select('fich')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (cancelled) return;

      if (error || !data) {
        const url = new URL(window.location.href);
        url.searchParams.delete('accessDenied');
        window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
        setAccessDenied(true);
        setPermissions(null);
        await supabase.auth.signOut();
        return;
      }

      const url = new URL(window.location.href);
      url.searchParams.delete('accessDenied');
      window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
      setAccessDenied(false);
      setPermissions(data);
    };

    checkPermissions();

    return () => {
      cancelled = true;
    };
  }, [session]);

  const logout = () => supabase.auth.signOut();

  return { session, permissions, logout, accessDenied };
}
