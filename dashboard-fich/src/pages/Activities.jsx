import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePageTitle } from '../hooks/usePageTitle';
import PageHeader from '../components/PageHeader';
import Tabs from '../components/Tabs';
import ActivitiesManager from '../components/activities/ActivitiesManager';
import PlanningManager from '../components/activities/PlanningManager';

const TABS = [
  { id: 'activities', label: '🎮 Activités' },
  { id: 'planning', label: '📅 Planning' },
];

export default function Activities() {
  usePageTitle('Activités');
  const [tab, setTab] = useState('activities');

  return (
    <div>
      <PageHeader
        title="Activités"
        desc="Gérer les cartes d’activités et le planning affichés sur la page Activités du site."
      />
      <Tabs tabs={TABS} value={tab} onChange={setTab} group="activities" />
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        >
          {tab === 'activities' ? <ActivitiesManager /> : <PlanningManager />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
