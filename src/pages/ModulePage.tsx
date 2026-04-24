import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, List, ArrowLeft } from 'lucide-react';
import { curriculumHierarchy } from '../data/curriculum';
import { useProgress } from '../hooks/useProgress';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const ModulePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isItemCompleted, toggleItem, getModuleProgress } = useProgress();
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  
  const module = curriculumHierarchy.find(m => m.id === id);

  if (!module) return <div>Module not found</div>;

  const totalModuleItems = module.sections.reduce((acc, s) => acc + s.items.length, 0);
  const currentModuleProgress = getModuleProgress(module.id, totalModuleItems);

  const activeContent = useLiveQuery(() => {
    if (!selectedArticle) return null;
    return db.articles.get(selectedArticle.replace(/\//g, ' '));
  }, [selectedArticle]);

  return (
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '4rem' }}>
        {/* Main Content */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            <Link to="/" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Curriculum</Link>
            <ChevronRight size={14} color="var(--text-muted)" />
            <span style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 600 }}>{module.title}</span>
          </div>

          <h1 style={{ fontSize: '3rem', marginBottom: '3rem' }}>{module.title}</h1>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
            {module.sections.map((section, sIdx) => (
              <div key={sIdx}>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                   <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--primary)' }} />
                   {section.title}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {section.items.map((item, iIdx) => {
                    const globalIdx = module.sections.slice(0, sIdx).reduce((acc, s) => acc + s.items.length, 0) + iIdx;
                    const isDone = isItemCompleted(module.id, globalIdx);
                    return (
                      <div key={iIdx} style={{ display: 'flex', gap: '1rem' }}>
                        <button 
                          onClick={() => toggleItem(module.id, globalIdx)}
                          style={{ background: 'transparent', padding: '0.5rem' }}
                        >
                           <CheckCircle2 
                            color={isDone ? "var(--primary)" : "var(--text-muted)"} 
                            size={20} 
                            style={{ opacity: isDone ? 1 : 0.3 }} 
                          />
                        </button>
                        <button 
                          onClick={() => setSelectedArticle(item)}
                          className="glass-card" 
                          style={{ 
                            flex: 1,
                            padding: '1.25rem', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            textAlign: 'left',
                            color: 'inherit',
                            border: isDone ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid var(--glass-border)',
                            background: isDone ? 'rgba(99, 102, 241, 0.05)' : 'var(--glass)'
                          }}
                        >
                          <span style={{ fontWeight: 500, fontSize: '1.05rem', opacity: isDone ? 0.7 : 1 }}>{item}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--primary)' }}>
                             Read Detail <ChevronRight size={14} />
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Sidebar - Full Hierarchy & Progress */}
        <aside>
          <div style={{ position: 'sticky', top: '8rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="glass-card" style={{ padding: '1.5rem' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Progress</h4>
                  <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem' }}>{currentModuleProgress}%</span>
               </div>
               <div style={{ height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${currentModuleProgress}%` }}
                    style={{ height: '100%' }} 
                    className="gradient-bg" 
                  />
               </div>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.1em', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <List size={14} /> Curriculum Links
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {curriculumHierarchy.map(m => (
                  <Link 
                    key={m.id} 
                    to={`/module/${m.id}`}
                    onClick={() => setSelectedArticle(null)}
                    style={{ 
                      fontSize: '0.85rem', 
                      color: m.id === id ? 'var(--text)' : 'var(--text-muted)',
                      fontWeight: m.id === id ? 700 : 500,
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: m.id === id ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                      border: m.id === id ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent'
                    }}
                  >
                    {m.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Article Detail Overlay */}
      <AnimatePresence>
        {activeContent && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArticle(null)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 2000 }}
            />
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '600px', background: 'var(--surface)', borderLeft: '1px solid var(--border)', zIndex: 2001, padding: '4rem', overflowY: 'auto' }}
            >
              <button 
                onClick={() => setSelectedArticle(null)}
                style={{ position: 'absolute', top: '2rem', left: '2rem', color: 'var(--text-muted)', background: 'transparent' }}
              >
                <ArrowLeft size={24} />
              </button>

              <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Nitro technical Guide</span>
              <h2 style={{ fontSize: '2.5rem', marginTop: '1rem', marginBottom: '2rem' }}>{activeContent.title}</h2>
              
              <div className="markdown-body" style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {activeContent.content}
                </ReactMarkdown>
              </div>
              
              <div style={{ marginTop: '4rem', padding: '2rem', borderRadius: 'var(--radius-md)', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid var(--primary)', textAlign: 'center' }}>
                <p style={{ fontWeight: 600, marginBottom: '1rem' }}>Done with this topic?</p>
                <button 
                  onClick={() => {
                    // Logic to mark as done and close
                    setSelectedArticle(null);
                  }}
                  className="btn-primary"
                >
                  Confirm Understanding
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
