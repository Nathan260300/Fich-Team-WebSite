import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useCategories } from './hooks/useWikiData';
import Layout from './components/Layout';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import WikiPage from './pages/WikiPage';

export default function App() {
  const categories = useCategories();
  return (
    <BrowserRouter basename="/leratsolitaire">
      <Layout categories={categories}>
        <Routes>
          <Route path="/" element={<Home categories={categories} />} />
          <Route path="/categorie/:categorySlug" element={<CategoryPage />} />
          <Route path="/wiki/:pageSlug" element={<WikiPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
