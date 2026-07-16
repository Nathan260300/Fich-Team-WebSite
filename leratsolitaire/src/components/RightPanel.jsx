import s from './RightPanel.module.css';

const LINKS = [
  { icon: '📦', label: 'Liste des objets', href: '#' },
  { icon: '🎬', label: 'Tutoriels vidéos', href: 'https://youtube.com' },
  { icon: '🎬', label: 'Site de la FICH Team', href: 'https://fich-team.netlify.app' },
  { icon: '💬', label: 'Discord de la FICH Team', href: 'https://discord.gg/ACRZ4zK2uD' },
];

export default function RightPanel() {
  return (
    <aside className={s.panel}>
      <div className={s.block}>
        <div className={s.rivets}><div className={s.r}/><div className={s.r}/><div className={s.r}/><div className={s.r}/></div>
        <div className={s.sh}><span className={s.st}>Liens utiles</span></div>
        <div className={s.links}>
          {LINKS.map((l, i) => (
            <a key={i} href={l.href} className={s.li}><span>{l.icon}</span> {l.label}</a>
          ))}
        </div>
      </div>
    </aside>
  );
}