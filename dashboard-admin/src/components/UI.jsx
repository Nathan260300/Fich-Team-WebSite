import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ToastContext } from '../hooks/useToast';
import styles from './UI.module.css';

export function Spinner({ size = 16 }) {
  return <span className={styles.spinner} style={{ width: size, height: size }} aria-hidden="true" />;
}

export function Pill({ tone = 'idle', children }) {
  return (
    <span className={`${styles.pill} ${styles[`pill_${tone}`]}`}>
      <span className={styles.pillDot} />
      {children}
    </span>
  );
}

export function Switch({ checked, onChange, disabled = false, busy = false, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      aria-busy={busy}
      disabled={disabled || busy}
      onClick={() => onChange(!checked)}
      className={`${styles.switch} ${checked ? styles.switchOn : ''}`}
    >
      <span className={styles.switchThumb}>{busy && <Spinner size={11} />}</span>
    </button>
  );
}

export function Button({ children, tone = 'primary', busy = false, disabled = false, ...rest }) {
  return (
    <button
      type="button"
      {...rest}
      disabled={disabled || busy}
      aria-busy={busy}
      className={`${styles.button} ${styles[`button_${tone}`]}`}
    >
      {busy && <Spinner size={13} />}
      {children}
    </button>
  );
}

export function ConfirmDialog({ open, title, children, confirmLabel = 'Confirmer', tone = 'primary', busy = false, onConfirm, onCancel }) {
  const cancelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    cancelRef.current?.focus();
    const onKey = (event) => {
      if (event.key === 'Escape' && !busy) onCancel();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, busy, onCancel]);

  if (!open) return null;

  return (
    <div className={styles.overlay} onMouseDown={() => !busy && onCancel()}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2 id="confirm-title" className={styles.dialogTitle}>{title}</h2>
        <div className={styles.dialogBody}>{children}</div>
        <div className={styles.dialogActions}>
          <button ref={cancelRef} type="button" className={`${styles.button} ${styles.button_ghost}`} onClick={onCancel} disabled={busy}>
            Annuler
          </button>
          <Button tone={tone} busy={busy} onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts(current => current.filter(toast => toast.id !== id));
  }, []);

  const push = useCallback((tone, text) => {
    counter.current += 1;
    const id = counter.current;
    setToasts(current => [...current, { id, tone, text }]);
    setTimeout(() => dismiss(id), tone === 'bad' ? 7000 : 4000);
  }, [dismiss]);

  const api = useMemo(() => ({
    success: (text) => push('ok', text),
    error: (text) => push('bad', text),
    info: (text) => push('idle', text),
  }), [push]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className={styles.toasts} aria-live="polite">
        {toasts.map(toast => (
          <div key={toast.id} className={`${styles.toast} ${styles[`toast_${toast.tone}`]}`} role={toast.tone === 'bad' ? 'alert' : 'status'}>
            <span>{toast.text}</span>
            <button type="button" className={styles.toastClose} onClick={() => dismiss(toast.id)} aria-label="Fermer">×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function ErrorState({ failure, onRetry, compact = false }) {
  return (
    <div className={`${styles.errorState} ${compact ? styles.errorCompact : ''}`} role="alert">
      <div>
        <p className={styles.errorTitle}>{failure.title}</p>
        <p className={styles.errorText}>{failure.message}</p>
        <p className={styles.errorCode}>
          {failure.code}
          {failure.httpStatus ? ` · HTTP ${failure.httpStatus}` : ''}
        </p>
      </div>
      {onRetry && <Button tone="ghost" onClick={onRetry}>Réessayer</Button>}
    </div>
  );
}

export function LoadingBlock({ label = 'Chargement…' }) {
  return (
    <div className={styles.loading} role="status">
      <Spinner size={18} />
      <span>{label}</span>
    </div>
  );
}

export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className={styles.pageHeader}>
      <div>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <h1 className={styles.pageTitle}>{title}</h1>
        {description && <p className={styles.pageDesc}>{description}</p>}
      </div>
      {actions && <div className={styles.pageActions}>{actions}</div>}
    </div>
  );
}
