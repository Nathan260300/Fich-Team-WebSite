import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Members from './pages/Members';
import Projects from './pages/Projects';
import FutureProjects from './pages/FutureProjects';
import NextProject from './pages/NextProject';
import Videos from './pages/Videos';
import Channels from './pages/Channels';
import HeroSlideshow from './pages/HeroSlideshow';
import Activities from './pages/Activities';
import Botc from './pages/Botc';
const LegalPages = lazy(() => import('./pages/LegalPages'));

export default function App() {
  return (
    <BrowserRouter basename="/app/fich">
      <Layout>
        <Routes>
          <Route path="/"                element={<Home />} />
          <Route path="/members"         element={<Members />} />
          <Route path="/projects"        element={<Projects />} />
          <Route path="/future-projects" element={<FutureProjects />} />
          <Route path="/next-project"    element={<NextProject />} />
          <Route path="/activites"       element={<Activities />} />
          <Route path="/activites/botc"  element={<Botc />} />
          <Route path="/activities"      element={<Activities />} />
          <Route path="/activities/botc" element={<Botc />} />
          <Route path="/videos"          element={<Videos />} />
          <Route path="/channels"        element={<Channels />} />
          <Route path="/hero-slideshow"  element={<HeroSlideshow />} />
          <Route path="/legal"           element={<Suspense fallback={<div style={{ color: 'var(--c-muted)', fontSize: '.875rem', padding: '24px 0' }}>Chargement…</div>}><LegalPages /></Suspense>} />
          <Route path="*"                element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
