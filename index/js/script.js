console.log("%c© 2026 - FICH Team", "background: #282c34; color: #98c379; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%cAccueil - FICH Team", "background: #282c34; color: #61afef; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%cFICH Team : communauté de joueurs passionnés, force, intelligence, charisme et honneur.","background: #282c34; color: #61dafb; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%chttps://fich-team.netlify.app", "background: #282c34; color: #e06c75; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%cMade with 🕑 and 💖 by Nathan The Coder – Last update : 14/02/2026","background: #282c34; color: #c678dd; padding: .5em 1em; border-radius: 5px; font-weight: bold;")

document.getElementById('year').textContent = new Date().getFullYear();

document.addEventListener('click', function (e) {
    const toggle = document.getElementById('nav-toggle');
    if (!toggle) return;
    const target = e.target;
    if (target.matches('.nav-menu a') && toggle.checked) {
        toggle.checked = false;
    }
});