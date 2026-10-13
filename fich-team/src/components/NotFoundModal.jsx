import Modal from './Modal';
import styles from './NotFoundModal.module.css';

export default function NotFoundModal({ isOpen, onClose, title = 'Introuvable', message }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth={460}>
      <div className={styles.wrap}>
        <span className={styles.code}>404</span>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>
        <button type="button" className={styles.button} onClick={onClose}>Fermer</button>
      </div>
    </Modal>
  );
}
