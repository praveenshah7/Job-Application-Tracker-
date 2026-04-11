import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/jobs', label: 'Applications', icon: '💼' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{ width: '240px', background: 'var(--bg2)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', padding: '1.5rem 1rem', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50 }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.3rem', color: 'var(--accent)', marginBottom: '2.5rem', paddingLeft: '.5rem' }}>
          JobTracker
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
          {navLinks.map(link => (
            <Link key={link.path} to={link.path} style={{ display: 'flex', alignItems: 'center', gap: '.8rem', padding: '.75rem 1rem', borderRadius: 'var(--radius-sm)', background: location.pathname === link.path ? 'rgba(108,99,255,0.15)' : 'transparent', color: location.pathname === link.path ? 'var(--accent)' : 'var(--muted)', fontSize: '.9rem', fontWeight: 500, transition: 'all 0.2s', border: location.pathname === link.path ? '1px solid rgba(108,99,255,0.3)' : '1px solid transparent' }}>
              <span>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem', marginBottom: '1rem', padding: '.5rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '.9rem', color: '#fff', flexShrink: 0 }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '.85rem', fontWeight: 600 }}>{user?.name}</div>
              <div style={{ fontSize: '.72rem', color: 'var(--muted)' }}>{user?.email}</div>
            </div>
          </div>
          <button onClick={logout} style={{ width: '100%', padding: '.6rem', background: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.2)', borderRadius: 'var(--radius-sm)', color: 'var(--danger)', fontSize: '.85rem', fontWeight: 500, transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,71,87,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,71,87,0.1)'}
          >Logout</button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, marginLeft: '240px', padding: '2rem', minHeight: '100vh', background: 'var(--bg)' }}>
        {children}
      </main>
    </div>
  );
}
