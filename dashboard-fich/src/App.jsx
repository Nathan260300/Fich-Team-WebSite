import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Members from './pages/Members';
import Projects from './pages/Projects';
import FutureProjects from './pages/FutureProjects';
import OtherProjects from './pages/OtherProjects';
import NextProject from './pages/NextProject';
import Videos from './pages/Videos';
import Channels from './pages/Channels';
import HeroSlideshow from './pages/HeroSlideshow';

export default function App() {
  return (
    <BrowserRouter basename="/app/fich">
      <Layout>
        <Routes>
          <Route path="/"                element={<Home />} />
          <Route path="/members"         element={<Members />} />
          <Route path="/projects"        element={<Projects />} />
          <Route path="/future-projects" element={<FutureProjects />} />
          <Route path="/other-projects"  element={<OtherProjects />} />
          <Route path="/next-project"    element={<NextProject />} />
          <Route path="/videos"          element={<Videos />} />
          <Route path="/channels"        element={<Channels />} />
          <Route path="/hero-slideshow"  element={<HeroSlideshow />} />
          <Route path="*"                element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}