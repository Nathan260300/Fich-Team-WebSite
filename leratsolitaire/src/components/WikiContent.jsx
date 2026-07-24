import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import s from './WikiContent.module.css';

export default function WikiContent({ content, toc }) {
  let index = 0;
  const withId = (Tag) => (props) => {
    const item = toc?.[index];
    index += 1;
    return <Tag id={item?.slug} {...props} />;
  };
  const components = {
    h2: withId('h2'),
    h3: withId('h3'),
  };
  return (
    <div className={s.c}>
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={components}>{content}</ReactMarkdown>
    </div>
  );
}
