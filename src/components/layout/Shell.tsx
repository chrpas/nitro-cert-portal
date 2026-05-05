import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { motion, AnimatePresence } from 'framer-motion';

export const Shell: React.FC = () => {
  const location = useLocation();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--background)' }}>
      <Navbar />
      <main style={{ flex: 1, paddingTop: '8rem', paddingBottom: '4rem', position: 'relative', zIndex: 1 }}>
        <Outlet />
      </main>
      
      <footer style={{ padding: '4rem 0', borderTop: '1px solid var(--border)', textAlign: 'center', color: 'var(--text-muted)' }}>
        <div className="container">
          <p>© 2026 Nitro Certification Portal | Built for Excellence</p>
        </div>
      </footer>
    </div>
  );
};
