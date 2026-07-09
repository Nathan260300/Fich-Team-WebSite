import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import RightPanel from './RightPanel';
import s from './Layout.module.css';

export default function Layout({ categories, children }) {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  return (
    <div className={s.root}>
      <Header categories={categories} />
      <div className={s.body}>
        <button className={s.burger} onClick={() => setOpen(v => !v)} aria-label="Menu">
          <span className={s.bar}/><span className={s.bar}/><span className={s.bar}/>
        </button>
        <div className={`${s.sw} ${open ? s.so : ''}`}>
          <Sidebar categories={categories} onClose={() => setOpen(false)} />
        </div>
        {open && <div className={s.ov} onClick={() => setOpen(false)} />}
        <main className={s.main}>
          <div className={s.mp}>
            <div className={s.rv}>
              <div className={s.r}/><div className={s.r}/><div className={s.r}/><div className={s.r}/>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={loc.pathname}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: [0.16,1,0.3,1] }}>
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
        <RightPanel />
      </div>
      <footer className={s.footer}>
        Civilisation Céleste II Wiki · Cet événement n'est pas affilié à Mojang AB
      </footer>
    </div>
  );
}
