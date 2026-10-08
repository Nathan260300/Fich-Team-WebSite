import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import styles from './UI.module.css';

export function Badge({ children, color = 'blue' }) {
  return (
    <div className={`${styles.badge} ${styles[`badge_${color}`]}`}>
      <span className={`${styles.dot} ${styles[`dot_${color}`]}`} />
      {children}
    </div>
  );
}

export function Btn({ children, href, to, onClick, variant = 'primary', size = '', className = '' }) {
  const cls = `${styles.btn} ${styles[`btn_${variant}`]} ${size ? styles[`btn_${size}`] : ''} ${className}`;
  if (to) return <Link to={to} className={cls}>{children}</Link>;
  if (href) {
    const isExternal = href.startsWith('http');
    if (isExternal) return <a href={href} className={cls} target="_blank" rel="noopener noreferrer">{children}</a>;
    return <Link to={href} className={cls}>{children}</Link>;
  }
  return <button onClick={onClick} className={cls}>{children}</button>;
}

export function SectionLabel({ children }) {
  return <p className={styles.sectionLabel}>{children}</p>;
}

export function SectionTitle({ children }) {
  return (
    <motion.div
      className={styles.partnerSectionHeader}
      initial={{ opacity: 0, x: -14 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <h2 className={styles.partnerSectionBadge}>{children}</h2>
      <span className={styles.partnerSectionLine} />
    </motion.div>
  );
}

export function SectionHeading({ children }) {
  return <h2 className={styles.sectionHeading}>{children}</h2>;
}

export function PageHero({ badge, badgeColor, title, accentTitle, desc, children }) {
  return (
    <div className={styles.pageHero}>
      {badge && <Badge color={badgeColor}>{badge}</Badge>}
      <h1 className={styles.pageTitle}>
        {title}
        {accentTitle && <> <span className={styles.accent}>{accentTitle}</span></>}
      </h1>
      {desc && <p className={styles.pageDesc}>{desc}</p>}
      {children}
    </div>
  );
}
