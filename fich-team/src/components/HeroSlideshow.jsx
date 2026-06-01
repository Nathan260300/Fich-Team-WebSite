import { useEffect, useRef, useState } from 'react';
import { useSupabase } from '../hooks/useSupabase';
import { storageUrl } from '../lib/supabase';
import styles from './HeroSlideshow.module.css';

export default function HeroSlideshow() {
  const { data: rows } = useSupabase('hero_slideshow');
  const images = rows ? rows.map(r => storageUrl(r.path)) : null;

  const [index, setIndex] = useState(0);
  const [prev,  setPrev]  = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!images || images.length < 2) return;
    timerRef.current = setInterval(() => {
      setIndex(i => {
        const next = (i + 1) % images.length;
        setPrev(i);
        return next;
      });
    }, 8500);
    return () => clearInterval(timerRef.current);
  }, [images]);

  useEffect(() => {
    if (prev === null) return;
    const t = setTimeout(() => setPrev(null), 900);
    return () => clearTimeout(t);
  }, [prev]);

  if (!images || images.length === 0) return null;

  return (
    <>
      {prev !== null && (
        <div
          className={`${styles.slide} ${styles.slideOut}`}
          style={{ backgroundImage: `url(${images[prev]})` }}
        />
      )}
      <div
        key={index}
        className={`${styles.slide} ${styles.slideIn}`}
        style={{ backgroundImage: `url(${images[index]})` }}
      />
    </>
  );
}