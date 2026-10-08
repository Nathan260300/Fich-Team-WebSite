import s from '../pages/shared.module.css';

export default function RowActions({ onUp, onDown, isFirst, isLast, onEdit, onDelete }) {
  return (
    <div className={s.rowActions}>
      {onUp && <button type="button" className={s.iconBtn} onClick={onUp} disabled={isFirst} title="Monter">↑</button>}
      {onDown && <button type="button" className={s.iconBtn} onClick={onDown} disabled={isLast} title="Descendre">↓</button>}
      {onEdit && <button type="button" className={s.iconBtn} onClick={onEdit} title="Modifier">✏️</button>}
      {onDelete && (
        <button type="button" className={`${s.iconBtn} ${s.iconBtnDanger}`} onClick={onDelete} title="Supprimer">🗑️</button>
      )}
    </div>
  );
}
