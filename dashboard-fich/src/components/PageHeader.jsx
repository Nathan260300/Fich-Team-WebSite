import styles from './PageHeader.module.css';

export default function PageHeader({ title, desc, action }) {
  return (
    <div className={styles.header}>
      <div>
        <h1 className={styles.title}>{title}</h1>
        {desc && <p className={styles.desc}>{desc}</p>}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
