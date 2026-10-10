import { Link } from 'react-router-dom';
import styles from '../../pages/Botc.module.css';

export const mdComponents = {
  a({ href = '', children }) {
    if (href.startsWith('/')) return <Link to={href}>{children}</Link>;
    const external = /^https?:\/\//.test(href);
    return (
      <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {children}
      </a>
    );
  },
  table({ children }) {
    return <div className={styles.tableWrap}><table>{children}</table></div>;
  },
};