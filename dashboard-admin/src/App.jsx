import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Overview from './pages/Overview';
import Maintenance from './pages/Maintenance';
import Settings from './pages/Settings';
import Users from './pages/Users';
import Logs from './pages/Logs';

export default function App() {
  return (
    <BrowserRouter basename="/app/admin">
      <Layout>
        <Routes>
          <Route path="/"              element={<Overview />} />
          <Route path="/maintenance"   element={<Maintenance />} />
          <Route path="/configuration" element={<Settings />} />
          <Route path="/utilisateurs"  element={<Users />} />
          <Route path="/journaux"      element={<Logs />} />
          <Route path="*"              element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
