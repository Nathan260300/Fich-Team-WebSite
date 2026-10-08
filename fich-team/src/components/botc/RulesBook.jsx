import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from '../../pages/Botc.module.css';

function formatPoints(points) {
  return points > 0 ? `+${points} pts` : `${points} pts`;
}

export default function RulesBook({ rules }) {
  if (rules.length === 0) {
    return <p className={styles.empty}>Les règles seront bientôt disponibles.</p>;
  }

  return (
    <div className={styles.book}>
      <div className={styles.bookCover}>
        <span className={styles.bookTitle}>Livre des règles &amp; des points</span>
        <span className={styles.bookCount}>{rules.length} article{rules.length > 1 ? 's' : ''}</span>
      </div>

      <div className={styles.bookPages}>
        {rules.map((rule, i) => (
          <article key={rule.id} className={styles.rule}>
            <header className={styles.ruleHead}>
              <span className={styles.ruleNum}>{String(i + 1).padStart(2, '0')}</span>
              <h4 className={styles.ruleTitle}>{rule.title}</h4>
              {rule.points !== null && rule.points !== undefined && (
                <span className={`${styles.rulePoints} ${rule.points < 0 ? styles.rulePointsNeg : ''}`}>
                  {formatPoints(rule.points)}
                </span>
              )}
            </header>
            <div className={styles.ruleBody}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{rule.content}</ReactMarkdown>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
