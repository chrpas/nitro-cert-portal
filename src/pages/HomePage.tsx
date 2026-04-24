import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { curriculumHierarchy } from '../data/curriculum';
import { useProgress } from '../hooks/useProgress';

export const HomePage: React.FC = () => {
  const { getModuleProgress, getTotalProgress } = useProgress();
  
  const totalItems = curriculumHierarchy.reduce((acc, m) => 
    acc + m.sections.reduce((sAcc, s) => sAcc + s.items.length, 0), 0
  );
  const totalPercentage = getTotalProgress(totalItems);

  return (
    <div className="container" style={{ paddingBottom: '8rem' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', margin: '4rem 0 8rem' }}>
        <motion.div
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '2rem', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--primary)', color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 700, marginBottom: '2rem', textTransform: 'uppercase' }}
        >
          <Zap size={16} /> Nitro5 Certification Portal
        </motion.div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{ fontSize: '4.5rem', marginBottom: '1.5rem', letterSpacing: '-0.02em', maxWidth: '900px', margin: '0 auto 1.5rem' }}
        >
          Scale Your Knowledge with the <span className="gradient-text">Master Curriculum</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto 3rem' }}
        >
          The ultimate technical roadmap for Avensia Nitro5 developers. 
          Master everything from dev setup to complex B2B commerce logic.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}
        >
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/study-guide" className="btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
              Study Guide <ArrowRight size={20} />
            </Link>
            <Link to="/exam" className="glass-card" style={{ padding: '1rem 2rem', fontWeight: 600, color: 'white' }}>
              Certification Exam
            </Link>
          </div>

          <div style={{ width: '400px', maxWidth: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <span>Total Mastery Progress</span>
              <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{totalPercentage}%</span>
            </div>
            <div style={{ height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${totalPercentage}%` }}
                className="gradient-bg" 
                style={{ height: '100%' }} 
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Modules Grid */}
      <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>Learning Modules</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {curriculumHierarchy.map((module) => {
          const totalModuleItems = module.sections.reduce((acc, s) => acc + s.items.length, 0);
          const moduleProgress = getModuleProgress(module.id, totalModuleItems);
          
          return (
              <Link 
                to={`/module/${module.id}`} 
                style={{ display: 'block' }}
              >
                <motion.div
                  whileHover={{ scale: 1.02, translateY: -5 }}
                  className="glass-card"
                  style={{ padding: '2.5rem', border: moduleProgress === 100 ? '1px solid var(--primary)' : '1px solid var(--glass-border)', cursor: 'pointer', height: '100%' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div style={{ padding: '0.6rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'var(--primary)' }}>
                      <BookOpen size={24} />
                    </div>
                    {moduleProgress > 0 && (
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', background: 'rgba(99, 102, 241, 0.1)', padding: '2px 8px', borderRadius: '10px' }}>{moduleProgress}%</span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{module.title}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {module.sections.map((s, i) => (
                      <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--primary)', opacity: 0.6 }} />
                        {s.title}
                      </span>
                    ))}
                  </div>
                  <div 
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 600 }}
                  >
                    {moduleProgress === 100 ? "Review Content" : "Start Learning"} <ArrowRight size={16} />
                  </div>
                </motion.div>
              </Link>
          );
        })}
      </div>
    </div>
  );
};
