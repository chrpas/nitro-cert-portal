import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Book, Award, Zap } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  
  return (
    <nav className="glass-card" style={{ 
      position: 'fixed', 
      top: '1.5rem', 
      left: '50%', 
      transform: 'translateX(-50%)', 
      width: 'max-content',
      padding: '0.6rem 2rem',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      gap: '2.5rem'
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.2rem' }}>
        <Zap className="gradient-text" fill="currentColor" size={24} />
        <span className="gradient-text">NITRO</span>
      </Link>
      
      <div style={{ display: 'flex', gap: '1.5rem', fontWeight: 500, color: 'var(--text-muted)' }}>
        <Link to="/" style={{ color: location.pathname === '/' ? 'var(--text)' : 'inherit' }}>Home</Link>
        <Link to="/study-guide" style={{ color: location.pathname === '/study-guide' ? 'var(--text)' : 'inherit' }}>Study Guide</Link>
        <Link to="/exam" style={{ color: location.pathname === '/exam' ? 'var(--text)' : 'inherit' }}>Take Exam</Link>
      </div>
      
      <button className="btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem' }}>
        <Shield size={16} />
        Certify
      </button>
    </nav>
  );
};
