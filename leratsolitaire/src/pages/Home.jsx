import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import s from './Home.module.css';

const MISSIONS = [
  { icon: '🛸', title: 'Explorez', label: 'Parcourez les articles et découvrez tout l\'univers de l\'événement.' },
  { icon: '⚙️', title: 'Apprenez', label: 'Comprenez les mécanismes et optimisez vos installations.' },
  { icon: '🏗️', title: 'Créez', label: 'Inspirez-vous des créations et bâtissez votre civilisation.' },
  { icon: '🤝', title: 'Participez', label: 'Rejoignez la communauté et partagez vos idées et vos créations.' },
];

export default function Home({ categories }) {
  useEffect(() => { document.title = 'Accueil – Civilisation Céleste II'; }, []);
  return (
    <div>
      <motion.div className={s.hero} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.16,1,0.3,1] }}>
        <h1 className={s.ht}>Bienvenue sur le wiki<br />de Civilisation Céleste II !</h1>
        <p className={s.hd}>
          Votre source complète d'informations sur l'événement <strong>Civilisation Céleste II</strong>.<br />
          Explorez les mécanismes, découvrez de nouvelles créations et rejoignez une communauté passionnée !
        </p>
      </motion.div>

      <motion.div className={s.mgrid} initial="h" animate="v" variants={{ v: { transition: { staggerChildren: 0.06 } } }}>
        {MISSIONS.map((m) => (
          <motion.div key={m.label} className={s.mc} variants={{ h: { opacity: 0, y: 14 }, v: { opacity: 1, y: 0 } }} transition={{ duration: 0.28, ease: [0.16,1,0.3,1] }}>
            <div className={s.mimg}><span className={s.mico}>{m.icon}</span></div>
            <div className={s.mtbar}>{m.title}</div>
            <p className={s.mdesc}>{m.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {categories && categories.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.35 }}>
          <div className={s.stitle}>
            <span className={s.sdeco} /><span className={s.slabel}>Catégories</span><span className={s.sdeco} />
          </div>
          <div className={s.cgrid}>
            {categories.map((cat, i) => (
              <motion.div key={cat.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 + i * 0.05, duration: 0.28, ease: [0.16,1,0.3,1] }}>
                <Link to={`/categorie/${cat.slug}`} className={s.cc}>
                  <div className={s.ctl}/><div className={s.ctr}/><div className={s.cbl}/><div className={s.cbr}/>
                  <span className={s.cci}>{cat.icon}</span>
                  <span className={s.ccn}>{cat.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <p className={s.disc}>Civilisation Céleste II Wiki · Cet événement n'est pas affilié à Mojang AB.</p>
    </div>
  );
}