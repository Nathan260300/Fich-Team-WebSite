import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.inner}>
        <div className={styles.brand}>
          <img src="/logo.png" alt="FICH Team" width="26" height="26" className={styles.logoImg} />
          <span>FICH Team</span>
        </div>
        <p className={styles.copy}>
          &copy;{new Date().getFullYear()} <strong>FICH Team.</strong> Tous droits réservés.
        </p>
        <p className={styles.credit}>
          Made with 🕑 and 💖 by{' '}
          <a href="https://nathan-the-coder.netlify.app" target="_blank" rel="noopener noreferrer">
            Nathan The Coder
          </a>
        </p>
      </div>
    </footer>
  );
}
