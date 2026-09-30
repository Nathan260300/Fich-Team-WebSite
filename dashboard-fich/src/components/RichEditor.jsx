import { useEffect, useRef, useState } from 'react';
import { useEditor, useEditorState, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table';
import { Markdown } from '@tiptap/markdown';
import css from './RichEditor.module.css';

const ICONS = {
  undo:    ['M3 7v6h6', 'M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13'],
  redo:    ['M21 7v6h-6', 'M3 17a9 9 0 019-9 9 9 0 016 2.3L21 13'],
  bullet:  ['M8 6h13', 'M8 12h13', 'M8 18h13', 'M3 6h.01', 'M3 12h.01', 'M3 18h.01'],
  ordered: ['M10 6h11', 'M10 12h11', 'M10 18h11', 'M4 6h1v4', 'M4 10h2', 'M6 18H4c0-1 2-2 2-3s-1-1.5-2-1'],
  quote:   ['M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z', 'M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3z'],
  link:    ['M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71', 'M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71'],
  hr:      ['M4 12h16'],
  table:   ['M3 3h18v18H3z', 'M3 9h18', 'M3 15h18', 'M9 3v18', 'M15 3v18'],
  code:    ['M16 18l6-6-6-6', 'M8 6l-6 6 6 6'],
  eye:     ['M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z', 'M12 15a3 3 0 100-6 3 3 0 000 6z'],
};

function Icon({ name }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name].map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
}

function Btn({ label, active, disabled, onClick, children, wide }) {
  return (
    <button
      type="button"
      className={`${css.btn} ${wide ? css.btnWide : ''} ${active ? css.btnActive : ''}`}
      title={label}
      aria-label={label}
      aria-pressed={active ?? undefined}
      disabled={disabled}
      onMouseDown={e => e.preventDefault()}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

const Sep = () => <span className={css.sep} aria-hidden="true" />;

function normalizeUrl(v) {
  const u = v.trim();
  if (!u) return '';
  if (/^(https?:|mailto:|tel:|\/|#)/i.test(u)) return u;
  if (/^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(u)) return `mailto:${u}`;
  return `https://${u}`;
}

function Toolbar({ editor, mode, onToggleMode }) {
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const st = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive('bold'),
      italic: e.isActive('italic'),
      strike: e.isActive('strike'),
      h2: e.isActive('heading', { level: 2 }),
      h3: e.isActive('heading', { level: 3 }),
      bullet: e.isActive('bulletList'),
      ordered: e.isActive('orderedList'),
      quote: e.isActive('blockquote'),
      link: e.isActive('link'),
      table: e.isActive('table'),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  });

  const visual = mode === 'visual';
  const run = fn => () => fn(editor.chain().focus()).run();

  const openLink = () => {
    setLinkUrl(editor.getAttributes('link').href ?? '');
    setLinkOpen(true);
  };
  const applyLink = () => {
    const href = normalizeUrl(linkUrl);
    const chain = editor.chain().focus().extendMarkRange('link');
    if (!href) chain.unsetLink().run();
    else chain.setLink({ href }).run();
    setLinkOpen(false);
  };
  const removeLink = () => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    setLinkOpen(false);
  };

  return (
    <div className={css.toolbarWrap}>
      <div className={css.toolbar} role="toolbar" aria-label="Mise en forme">
        {visual && (
          <>
            <Btn label="Annuler (Ctrl+Z)" disabled={!st.canUndo} onClick={run(c => c.undo())}><Icon name="undo" /></Btn>
            <Btn label="Rétablir (Ctrl+Y)" disabled={!st.canRedo} onClick={run(c => c.redo())}><Icon name="redo" /></Btn>
            <Sep />
            <Btn label="Texte normal" wide active={!st.h2 && !st.h3} onClick={run(c => c.setParagraph())}>Texte</Btn>
            <Btn label="Titre de section" wide active={st.h2} onClick={run(c => c.toggleHeading({ level: 2 }))}>Titre</Btn>
            <Btn label="Sous-titre" wide active={st.h3} onClick={run(c => c.toggleHeading({ level: 3 }))}>Sous-titre</Btn>
            <Sep />
            <Btn label="Gras (Ctrl+B)" active={st.bold} onClick={run(c => c.toggleBold())}><b>B</b></Btn>
            <Btn label="Italique (Ctrl+I)" active={st.italic} onClick={run(c => c.toggleItalic())}><i>I</i></Btn>
            <Btn label="Barré" active={st.strike} onClick={run(c => c.toggleStrike())}><s>S</s></Btn>
            <Sep />
            <Btn label="Liste à puces" active={st.bullet} onClick={run(c => c.toggleBulletList())}><Icon name="bullet" /></Btn>
            <Btn label="Liste numérotée" active={st.ordered} onClick={run(c => c.toggleOrderedList())}><Icon name="ordered" /></Btn>
            <Btn label="Citation / encadré" active={st.quote} onClick={run(c => c.toggleBlockquote())}><Icon name="quote" /></Btn>
            <Sep />
            <Btn label="Lien" active={st.link || linkOpen} onClick={openLink}><Icon name="link" /></Btn>
            <Btn label="Ligne de séparation" onClick={run(c => c.setHorizontalRule())}><Icon name="hr" /></Btn>
            <Btn label="Insérer un tableau" active={st.table} onClick={run(c => c.insertTable({ rows: 3, cols: 3, withHeaderRow: true }))}><Icon name="table" /></Btn>
          </>
        )}
        <span className={css.grow} />
        <Btn label={visual ? 'Voir le code Markdown' : "Retour à l'éditeur visuel"} wide onClick={onToggleMode}>
          <Icon name={visual ? 'code' : 'eye'} />
          <span>{visual ? 'Markdown' : 'Éditeur'}</span>
        </Btn>
      </div>

      {visual && linkOpen && (
        <div className={css.subbar}>
          <input
            autoFocus
            value={linkUrl}
            onChange={e => setLinkUrl(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') { e.preventDefault(); applyLink(); }
              if (e.key === 'Escape') setLinkOpen(false);
            }}
            placeholder="https://exemple.fr ou /mentions-legales"
            aria-label="Adresse du lien"
          />
          <button type="button" className={css.miniPrimary} onClick={applyLink}>Appliquer</button>
          {st.link && <button type="button" className={css.miniGhost} onClick={removeLink}>Retirer</button>}
          <button type="button" className={css.miniGhost} onClick={() => setLinkOpen(false)}>Fermer</button>
        </div>
      )}

      {visual && st.table && (
        <div className={css.subbar}>
          <span className={css.subLabel}>Tableau</span>
          <button type="button" className={css.miniGhost} onMouseDown={e => e.preventDefault()} onClick={run(c => c.addRowBefore())}>+ Ligne au-dessus</button>
          <button type="button" className={css.miniGhost} onMouseDown={e => e.preventDefault()} onClick={run(c => c.addRowAfter())}>+ Ligne en dessous</button>
          <button type="button" className={css.miniGhost} onMouseDown={e => e.preventDefault()} onClick={run(c => c.addColumnBefore())}>+ Colonne à gauche</button>
          <button type="button" className={css.miniGhost} onMouseDown={e => e.preventDefault()} onClick={run(c => c.addColumnAfter())}>+ Colonne à droite</button>
          <button type="button" className={css.miniDanger} onMouseDown={e => e.preventDefault()} onClick={run(c => c.deleteRow())}>− Ligne</button>
          <button type="button" className={css.miniDanger} onMouseDown={e => e.preventDefault()} onClick={run(c => c.deleteColumn())}>− Colonne</button>
          <button type="button" className={css.miniDanger} onMouseDown={e => e.preventDefault()} onClick={run(c => c.deleteTable())}>Supprimer le tableau</button>
        </div>
      )}
    </div>
  );
}

/**
 * Éditeur Markdown visuel.
 * - initialMarkdown : contenu de départ (Markdown)
 * - onChange(md)    : appelé à chaque modification
 * - onReady(md)     : appelé une fois, avec le Markdown normalisé de départ
 */
export default function RichEditor({ initialMarkdown, onChange, onReady }) {
  const [mode, setMode] = useState('visual');
  const [source, setSource] = useState('');

  const onChangeRef = useRef(onChange);
  const onReadyRef = useRef(onReady);
  useEffect(() => { onChangeRef.current = onChange; onReadyRef.current = onReady; });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        underline: false,
        link: { openOnClick: false },
      }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({ placeholder: 'Écris le contenu du document ici…' }),
      Markdown,
    ],
    content: initialMarkdown ?? '',
    contentType: 'markdown',
    onCreate: ({ editor: e }) => onReadyRef.current?.(e.getMarkdown()),
    onUpdate: ({ editor: e }) => onChangeRef.current?.(e.getMarkdown()),
  });

  const toggleMode = () => {
    if (!editor) return;
    if (mode === 'visual') {
      setSource(editor.getMarkdown());
      setMode('source');
    } else {
      editor.commands.setContent(source, { contentType: 'markdown', emitUpdate: false });
      onChangeRef.current?.(editor.getMarkdown());
      setMode('visual');
    }
  };

  if (!editor) return <div className={css.loading}>Chargement de l'éditeur…</div>;

  return (
    <div className={css.wrap}>
      <Toolbar editor={editor} mode={mode} onToggleMode={toggleMode} />

      <div className={mode === 'visual' ? css.area : css.hidden}>
        <EditorContent editor={editor} className={css.content} />
      </div>

      {mode === 'source' && (
        <textarea
          className={css.source}
          value={source}
          spellCheck={false}
          onChange={e => { setSource(e.target.value); onChangeRef.current?.(e.target.value); }}
          aria-label="Code Markdown"
        />
      )}
    </div>
  );
}
