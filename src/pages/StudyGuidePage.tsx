import React from 'react';
import { motion } from 'framer-motion';
import { Download, FileText } from 'lucide-react';
import { curriculumHierarchy } from '../data/curriculum';
import { Link } from 'react-router-dom';

export const StudyGuidePage: React.FC = () => {
  return (
    <div className="container" style={{ paddingBottom: '8rem' }}>
      <header style={{ marginBottom: '6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>Nitro5 <span className="gradient-text">Study Guide</span></h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem' }}>The complete technical roadmap for Avensia Nitro5 certification.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="glass-card" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
            <Download size={18} /> Export PDF
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
        {curriculumHierarchy.map((module, index) => (
          <motion.section 
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link to={`/module/${module.id}`} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem', width: 'max-content' }}>
              <span style={{ fontSize: '4rem', fontWeight: 800, opacity: 0.1, color: 'var(--text)' }}>0{index + 1}</span>
              <h2 style={{ fontSize: '2.5rem', borderBottom: '2px solid var(--primary)', paddingBottom: '0.5rem', color: 'var(--text)' }}>{module.title}</h2>
            </Link>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              {module.sections.map((section, sIdx) => (
                <div key={sIdx}>
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '20px', height: '2px', background: 'var(--primary)', opacity: 0.5 }} />
                    {section.title}
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {section.items.map((item, iIdx) => (
                      <Link 
                        to={`/module/${module.id}`}
                        key={iIdx} 
                        className="glass-card" 
                        style={{ padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}
                      >
                        <div style={{ marginTop: '4px' }}>
                          <FileText size={18} color="var(--text-muted)" />
                        </div>
                        <p style={{ fontWeight: 500, fontSize: '1rem', color: 'var(--text)' }}>{item}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  );
};
