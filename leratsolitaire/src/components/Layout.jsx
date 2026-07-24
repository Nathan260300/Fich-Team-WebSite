import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import RightPanel from './RightPanel';
import s from './Layout.module.css';

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  return (
    <div className={s.root}>
      <Header onBurger={() => setOpen(v => !v)} />
      <div className={s.body}>
        <div className={`${s.sw} ${open ? s.so : ''}`}>
          <Sidebar onClose={() => setOpen(false)} />
        </div>
        {open && <div className={s.ov} onClick={() => setOpen(false)} />}
        <main className={s.main}>
          <div className={s.mp}>
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
