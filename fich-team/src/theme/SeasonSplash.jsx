import { useEffect, useState } from 'react';
import { season } from './season';
import { PumpkinIcon, TreeIcon, FishIcon, BatIcon } from './icons';
import styles from './SeasonSplash.module.css';

const MESSAGES = {
  halloween: ['Invocation des esprits…', 'Réveil des citrouilles…', 'Ne regarde pas derrière toi…', 'Les chauves-souris arrivent…'],
  noel: ['Emballage des cadeaux…', 'Allumage des guirlandes…', 'Les lutins travaillent…', 'Le père Noël vérifie sa liste…'],
  avril: ['Pêche aux données…', 'Le poisson a mangé la connexion…', 'Ceci n’est pas une blague (si)', 'Ne mords pas à l’hameçon !'],
};

const NAMES = {
  halloween: ['FICH', 'TEAM'],
  noel: ['FICH', 'TEAM'],
  avril: ['FICH', 'D’AVRIL'],
};

const FLAKES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x: (i * 37) % 100,
  size: 3 + (i % 4),
  duration: 3.2 + (i % 5) * 0.7,
  delay: -(i % 7) * 0.6,
}));

const BUBBLES = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  x: 8 + ((i * 29) % 84),
  size: 6 + (i % 4) * 3,
  duration: 2.6 + (i % 4) * 0.8,
  delay: -(i % 5) * 0.7,
}));

function Figure() {
  if (season === 'halloween') {
    return (
      <div className={styles.stage}>
        <div className={styles.pumpkin}><PumpkinIcon /></div>
        <span className={`${styles.orbit} ${styles.orbitA}`}><BatIcon /></span>
        <span className={`${styles.orbit} ${styles.orbitB}`}><BatIcon /></span>
        <span className={`${styles.orbit} ${styles.orbitC}`}><BatIcon /></span>
      </div>
    );
  }
  if (season === 'noel') {
    return (
      <div className={styles.stage}>
        <div className={styles.tree}><TreeIcon /></div>
        {FLAKES.map((flake) => (
          <span
            key={flake.id}
            className={styles.flake}
            style={{ left: `${flake.x}%`, width: flake.size, height: flake.size, animationDuration: `${flake.duration}s`, animationDelay: `${flake.delay}s` }}
          />
        ))}
      </div>
    );
  }
  return (
    <div className={`${styles.stage} ${styles.pond}`}>
      <div className={styles.fishSwim}><FishIcon /></div>
      {BUBBLES.map((bubble) => (
        <span
          key={bubble.id}
          className={styles.bubble}
          style={{ left: `${bubble.x}%`, width: bubble.size, height: bubble.size, animationDuration: `${bubble.duration}s`, animationDelay: `${bubble.delay}s` }}
        />
      ))}
    </div>
  );
}

export default function SeasonSplash({ fullscreen = false }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!season) return undefined;
    const timer = setInterval(() => setIndex((value) => value + 1), 1800);
    return () => clearInterval(timer);
  }, []);

  if (!season) return null;

  const messages = MESSAGES[season];
  const [first, second] = NAMES[season];

  return (
    <div className={`${styles.splash} ${fullscreen ? styles.fullscreen : ''}`} data-season={season} role="status" aria-label="Chargement">
      <div className={styles.glow} />
      <Figure />
      <p className={styles.name}>{first} <span>{second}</span></p>
      <p className={styles.message} key={index}>{messages[index % messages.length]}</p>
      <div className={styles.bar}><span /></div>
    </div>
  );
}
