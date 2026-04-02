// ─── pages/index.js ────────────────────────────────────────
// Point d'entrée unique pour toutes les pages.
// Le router importe depuis ici, pas depuis chaque fichier.
// ────────────────────────────────────────────────────────────

export * as home     from './home.js';
export * as partners from './partners.js';
export * as projects from './projects.js';
export * as join     from './join.js';

// '404' n'est pas un identifiant JS valide — import séparé
import * as _404 from './404.js';
export { _404 as page404 };
