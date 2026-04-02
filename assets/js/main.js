import './modules/events.js';
import { initRouter } from './modules/router.js';

console.log('%c© 2026 - FICH Team',           'background:#282c34;color:#98c379;padding:.5em 1em;border-radius:5px;font-weight:bold;');
console.log('%cFICH Team',                     'background:#282c34;color:#61afef;padding:.5em 1em;border-radius:5px;font-weight:bold;');
console.log('%cFICH Team : communauté de joueurs passionnés, force, intelligence, charisme et honneur.', 'background:#282c34;color:#61dafb;padding:.5em 1em;border-radius:5px;font-weight:bold;');
console.log('%chttps://fich-team.netlify.app', 'background:#282c34;color:#e06c75;padding:.5em 1em;border-radius:5px;font-weight:bold;');
console.log('%cMade with 🕑 and 💖 by Nathan The Coder – Last update : 02/04/2026', 'background:#282c34;color:#c678dd;padding:.5em 1em;border-radius:5px;font-weight:bold;');

document.getElementById('year').textContent = new Date().getFullYear();

initRouter();