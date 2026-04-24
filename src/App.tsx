import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Shell } from './components/layout/Shell';
import { HomePage } from './pages/HomePage';
import { ModulePage } from './pages/ModulePage';
import { StudyGuidePage } from './pages/StudyGuidePage';
import { ExamPage } from './pages/ExamPage';
import { ModuleExamPage } from './pages/ModuleExamPage';
import { db } from './db/db';
import { curriculumHierarchy } from './data/curriculum';

const App: React.FC = () => {
  useEffect(() => {
    const seedDb = async () => {
      try {
        // Seed Wiki Articles
        const articleCount = await db.articles.count();
        if (articleCount === 0) {
          const res = await fetch('/NitroCertification.json');
          if (res.ok) {
            const data = await res.json();
            // NitroCertification.json is an array of WikiArticle
            await db.articles.bulkAdd(data);
            console.log('Seeded Articles to NitroCertification DB');
          }
        }

        // Seed Curriculum & Exams
        const moduleCount = await db.modules.count();
        const firstModule = await db.modules.toCollection().first();
        if (moduleCount === 0 || (firstModule && firstModule.order === undefined)) {
          if (moduleCount > 0) await db.modules.clear();
          const mappedCurriculum = curriculumHierarchy.map((m, i) => ({ ...m, order: i }));
          await db.modules.bulkAdd(mappedCurriculum);
          console.log('Seeded Curriculum & Exams with Order to NitroCertification DB');
        }
      } catch (err) {
        console.error('Database seeding error:', err);
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
          <Route path="/module-exam/:moduleId" element={<ModuleExamPage />} />
          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
