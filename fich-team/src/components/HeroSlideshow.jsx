import { useEffect, useRef, useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import styles from './HeroSlideshow.module.css';

export default function HeroSlideshow() {
  const { data: images } = useFetch('/hero-slideshow.json');
  const [index, setIndex] = useState(0);
  const [prev,  setPrev]  = useState(null);
  const [dir,   setDir]   = useState(1);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!images || images.length < 2) return;
    timerRef.current = setInterval(() => {
      setIndex(i => {
        const next = (i + 1) % images.length;
        setPrev(i);
        setDir(1);
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
      {}
      {prev !== null && (
        <div
          className={`${styles.slide} ${styles.slideOut}`}
          style={{ backgroundImage: `url(/${images[prev]})` }}
        />
      )}
      {}
      <div
        key={index}
        className={`${styles.slide} ${styles.slideIn}`}
        style={{ backgroundImage: `url(/${images[index]})` }}
      />
    </>
  );
}