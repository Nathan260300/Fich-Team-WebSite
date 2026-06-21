import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import styles from './WikiContent.module.css';

export default function WikiContent({ content }) {
  return (
    <div className={styles.content}>
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{content}</ReactMarkdown>
    </div>
  );
}