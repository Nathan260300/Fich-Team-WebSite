import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import RightPanel from './RightPanel';
import styles from './Layout.module.css';

export default function Layout({ categories, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className={styles.root}>
      <Header categories={categories} />
      <div className={styles.body}>
        <button className={styles.burger} onClick={() => setSidebarOpen(v => !v)} aria-label="Menu">
          <span className={styles.bar} /><span className={styles.bar} /><span className={styles.bar} />
        </button>
        <div className={`${styles.sidebarWrap} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
          <Sidebar categories={categories} onClose={() => setSidebarOpen(false)} />
        </div>
        {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}

        <main className={styles.main}>
          <div className={styles.mainPanel}>
            <div className={styles.mainPanelRivets}>
              <div className={styles.rivet} /><div className={styles.rivet} />
              <div className={styles.rivet} /><div className={styles.rivet} />
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={location.pathname}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.16,1,0.3,1] }}>
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        <RightPanel />
      </div>
      <footer className={styles.footer}>
        <span>Civilisation Céleste II Wiki · Cet événement n'est pas affilié à Mojang AB</span>
      </footer>
    </div>
  );
}
