import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link, NavLink } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { PageHero } from '../components/UI';
import { useLegalPage } from '../hooks/useLegalPage';
import { LEGAL_PAGES } from '../data/legalPages';
import styles from './Legal.module.css';

function formatDate(iso) {
  const d = new Date(iso);
  return {
    short: d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
    full:  d.toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' }),
  };
}

const mdComponents = {
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

export default function Legal({ slug }) {
  const meta = LEGAL_PAGES.find(p => p.slug === slug);
  const { page, status } = useLegalPage(slug);
  const date = page?.updated_at ? formatDate(page.updated_at) : null;

  return (
    <PageWrapper>
      <PageHero
        badge="Informations légales"
        badgeColor="gold"
        title={meta?.label ?? page?.title ?? 'Document légal'}
      />

      <nav className={styles.tabs} aria-label="Documents légaux">
        {LEGAL_PAGES.map(p => (
          <NavLink
            key={p.slug}
            to={p.path}
            className={({ isActive }) => `${styles.tab} ${isActive ? styles.tabActive : ''}`}
          >
            {p.short ?? p.label}
          </NavLink>
        ))}
      </nav>

      <article className={styles.card}>
        {status === 'loading' && (
          <div className={styles.skeleton} aria-busy="true" aria-live="polite">
            <span /><span /><span /><span />
            <span className="sr-only">Chargement…</span>
          </div>
        )}

        {status === 'error' && (
          <p className={styles.state}>
            Impossible de charger ce document pour le moment. Réessaie dans quelques instants.
          </p>
        )}

        {status === 'empty' && (
          <p className={styles.state}>Ce document n'est pas encore disponible.</p>
        )}

        {status === 'ok' && (
          <>
            <p className={styles.updated}>
              <span className={styles.updatedDot} aria-hidden="true" />
              Dernière modification :{' '}
              <time dateTime={page.updated_at} title={date.full}>{date.short}</time>
            </p>
            <div className={styles.prose}>
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                {page.content}
              </ReactMarkdown>
            </div>
          </>
        )}
      </article>
    </PageWrapper>
  );
}
