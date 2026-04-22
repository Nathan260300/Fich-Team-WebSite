import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';

export function useModal() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const activeModal = searchParams.get('modal');

  const openModal = useCallback((modalId) => {
    const params = new URLSearchParams(searchParams);
    params.set('modal', modalId);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  }, [navigate, location.pathname, searchParams]);

  const closeModal = useCallback(() => {
    navigate(location.pathname, { replace: true });
  }, [navigate, location.pathname]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && activeModal) closeModal();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeModal, closeModal]);

  useEffect(() => {
    document.body.style.overflow = activeModal ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [activeModal]);

  return { activeModal, openModal, closeModal };
}

export function useChannels() {
  return {
    fetchChannels: async () => {
      const res = await fetch('/channels.json');
      if (!res.ok) throw new Error('Failed to fetch channels');
      return res.json();
    }
  };
}

export function useScrollHeader() {
  return {
    onScroll: (setScrolled) => {
      const handler = () => setScrolled(window.scrollY > 10);
      window.addEventListener('scroll', handler, { passive: true });
      return () => window.removeEventListener('scroll', handler);
    }
  };
}
