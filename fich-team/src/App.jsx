import { useState, createContext, useContext, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import Background from './components/Background';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Membres from './pages/Membres';
import Projets from './pages/Projets';
import Partenaires from './pages/Partenaires';
import Rejoindre from './pages/Rejoindre';
import NotFound from './pages/NotFound';
import { usePageTitle } from './hooks/usePageTitle';
import styles from './App.module.css';

export const AppReadyCtx = createContext(false);
export function useAppReady() { return useContext(AppReadyCtx); }

function PageLoader({ onStart, onDone }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => onStart(), 400);
    const t2 = setTimeout(() => setExiting(true), 600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return createPortal(
    <AnimatePresence onExitComplete={onDone}>
      {!exiting && (
        <motion.div
          className={styles.loader}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } }}
        >
          <div className={styles.loaderContent}>
            <motion.img
              src="/logo.png"
              alt="FICH Team"
              className={styles.loaderLogo}
              initial={{ opacity: 0, scale: 0.7, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            />
            <motion.p
              className={styles.loaderName}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}
            >
              FICH <span>TEAM</span>
            </motion.p>
            <motion.div
              className={styles.loaderBar}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                className={styles.loaderBarFill}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.35, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

function AppContent({ ready }) {
  const location = useLocation();
  usePageTitle(location.pathname);

  return (
    <AppReadyCtx.Provider value={ready}>
      <div className={styles.app}>
        <Background />
        <Header />
        <ScrollToTop />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/"            element={<Home />} />
            <Route path="/membres"     element={<Membres />} />
            <Route path="/projets"     element={<Projets />} />
            <Route path="/partenaires" element={<Partenaires />} />
            <Route path="/rejoindre"   element={<Rejoindre />} />
            <Route path="*"            element={<NotFound />} />
          </Routes>
        </AnimatePresence>
        <Footer />
      </div>
    </AppReadyCtx.Provider>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);
  return (
    <>
      <AppContent ready={ready} />
      <PageLoader onStart={() => setReady(true)} onDone={() => {}} />
    </>
  );
}