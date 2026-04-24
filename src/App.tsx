import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Shell } from './components/layout/Shell';
import { HomePage } from './pages/HomePage';
import { ModulePage } from './pages/ModulePage';
import { StudyGuidePage } from './pages/StudyGuidePage';
import { ExamPage } from './pages/ExamPage';
import { db } from './db/db';

const App: React.FC = () => {
  useEffect(() => {
    const seedDb = async () => {
      try {
        const count = await db.articles.count();
        if (count === 0) {
          const res = await fetch('/NitroCertification.json');
          if (res.ok) {
            const data = await res.json();
            await db.articles.bulkAdd(data);
            console.log('Successfully seeded local NitroCertification database!');
          }
        }
      } catch (err) {
        console.log('Local database not seeded yet. Run npm run sync-db to pull the wiki.');
      }
    };
    seedDb();
  }, []);

  return (
    <Router>
      <Routes>
        <Route element={<Shell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/module/:id" element={<ModulePage />} />
          <Route path="/study-guide" element={<StudyGuidePage />} />
          <Route path="/exam" element={<ExamPage />} />
          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
