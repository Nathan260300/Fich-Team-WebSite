import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { fetchMyAccess, isSessionFailure } from '../lib/access';

const POLL_INTERVAL_MS = 60000;

function clearAccessDeniedParam() {
  const url = new URL(window.location.href);
  url.searchParams.delete('accessDenied');
  window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}

export function useAuth() {
  const [session, setSession] = useState(undefined);
  const [access, setAccess] = useState(null);
  const [accessFailure, setAccessFailure] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s ?? null);
      if (!s) {
        setAccess(null);
        setAccessFailure(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return undefined;

    let cancelled = false;

    const run = async (silent) => {
      const result = await fetchMyAccess();

      if (cancelled) return;

      if (!result.ok) {
        if (silent) return;
        if (isSessionFailure(result.failure)) {
          await supabase.auth.signOut();
          return;
        }
        setAccess(null);
        setAccessFailure(result.failure);
        return;
      }

      const allowed = result.access.has_row;

      clearAccessDeniedParam();

      if (!allowed) {
        setAccessDenied(true);
        setAccess(null);
        setAccessFailure(null);
        await supabase.auth.signOut();
        return;
      }

      setAccessDenied(false);
      setAccessFailure(null);
      setAccess(result.access);
    };

    run(false);

    const poll = () => {
      if (document.visibilityState === 'visible') run(true);
    };

    const interval = setInterval(poll, POLL_INTERVAL_MS);
    document.addEventListener('visibilitychange', poll);

    return () => {
      cancelled = true;
      clearInterval(interval);
      document.removeEventListener('visibilitychange', poll);
    };
  }, [session, attempt]);

  const retry = useCallback(() => {
    setAccess(null);
    setAccessFailure(null);
    setAttempt(value => value + 1);
  }, []);

  const logout = () => supabase.auth.signOut();

  const permissions = access ? { fich: access.fich, admin: access.admin } : null;

  return { session, access, permissions, accessFailure, accessDenied, attempt, retry, logout };
}
