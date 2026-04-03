import { getState, setState } from '../state.js';
import { syncHistoryOnOpen, syncHistoryOnClose } from './history.js';

export function openModal(content, modalPairs = [], replace = false) {
  closeModal(true);

  const overlay = _buildOverlay();
  overlay.querySelector('.modal-box-scroll').appendChild(content);

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
  setState('activeModal', overlay);

  if (replace) overlay.classList.add('modal-no-anim');
  if (modalPairs.length) syncHistoryOnOpen(overlay, modalPairs, replace);

  overlay.querySelector('.modal-close').addEventListener('click', () => closeModal());
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
}

export function closeModal(instant = false) {
  const modal = getState('activeModal');
  if (!modal) return;

  setState('activeModal', null);
  document.body.style.overflow = '';
  modal.querySelectorAll('iframe').forEach(f => { f.src = ''; });

  if (instant) { modal.remove(); return; }

  modal.classList.add('closing');
  setTimeout(() => modal.remove(), 200);

  syncHistoryOnClose(modal, _reopenFolder);
}

function _reopenFolder(folderId, name, srcs) {
  import('./index.js').then(m => m.openFolderModal(folderId, name, srcs, false));
}

function _buildOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  const box = document.createElement('div');
  box.className = 'modal-box';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');

  const closeBtn = document.createElement('button');
  closeBtn.className = 'modal-close';
  closeBtn.setAttribute('aria-label', 'Fermer');
  closeBtn.textContent = '✕';

  const scroll = document.createElement('div');
  scroll.className = 'modal-box-scroll';

  box.appendChild(closeBtn);
  box.appendChild(scroll);
  overlay.appendChild(box);
  return overlay;
}
