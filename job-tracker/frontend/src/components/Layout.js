/* eslint-disable */
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  {
    path: '/dashboard', label: 'Dashboard',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
  },
  {
    path: '/jobs', label: 'Applications',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
  },
  {
    path: '/cover-letter', label: 'AI Cover Letter',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>,
    badge: 'AI'
  },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div style={{ display: 'flex', minHeight: '100vh' }}>

        {/* Sidebar */}
        <aside style={{ width: '250px', background: 'var(--bg2)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', padding: '1.5rem 1rem', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50 }} className="sidebar-desktop">

          {/* Logo */}
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: '1.3rem', background: 'linear-gradient(135deg, #7c6cfc, #06d6a0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '2rem', paddingLeft: '.5rem' }}>
            JobTracker
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '.3rem' }}>
            {navLinks.map(link => {
              const isActive = location.pathname === link.path;
              return (
                <Link key={link.path} to={link.path}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '.8rem', padding: '.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    background: isActive ? 'rgba(124,108,252,0.12)' : 'transparent',
                    color: isActive ? '#a89cfc' : 'var(--muted)',
                    fontSize: '.88rem', fontWeight: isActive ? 600 : 400,
                    transition: 'all 0.2s',
                    border: isActive ? '1px solid rgba(124,108,252,0.25)' : '1px solid transparent',
                    textDecoration: 'none', position: 'relative',
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'var(--text)'; } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--muted)'; } }}
                >
                  {isActive && <div style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: '3px', background: 'linear-gradient(180deg, #7c6cfc, #06d6a0)', borderRadius: '0 3px 3px 0' }} />}
                  <span style={{ flexShrink: 0, marginLeft: isActive ? '4px' : '0' }}>{link.icon}</span>
                  <span style={{ flex: 1 }}>{link.label}</span>
                  {link.badge && (
                    <span style={{ fontSize: '.6rem', padding: '.15rem .5rem', background: 'linear-gradient(135deg, rgba(124,108,252,0.3), rgba(6,214,160,0.2))', border: '1px solid rgba(124,108,252,0.3)', color: '#a89cfc', borderRadius: '100px', fontWeight: 700, letterSpacing: '.5px' }}>{link.badge}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem', marginBottom: '1rem', padding: '.6rem .8rem', background: 'var(--bg3)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(135deg, #7c6cfc, #5b4cdb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '.9rem', color: '#fff', flexShrink: 0 }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div style={{ overflow: 'hidden', flex: 1 }}>
                <div style={{ fontSize: '.82rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
                <div style={{ fontSize: '.68rem', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
              </div>
            </div>
            <button onClick={logout}
              style={{ width: '100%', padding: '.6rem', background: 'rgba(255,77,109,0.08)', border: '1px solid rgba(255,77,109,0.15)', borderRadius: 'var(--radius-sm)', color: 'var(--danger)', fontSize: '.82rem', fontWeight: 500, transition: 'all 0.2s', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,77,109,0.15)'; e.currentTarget.style.borderColor = 'rgba(255,77,109,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,77,109,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,77,109,0.15)'; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Logout
            </button>
          </div>
        </aside>

        {/* Mobile topbar */}
        <div style={{ display: 'none', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 60, background: 'rgba(14,14,26,0.95)', borderBottom: '1px solid var(--border)', backdropFilter: 'blur(20px)', padding: '.9rem 1.2rem', alignItems: 'center', justifyContent: 'space-between' }} className="mobile-topbar">
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: '1.1rem', background: 'linear-gradient(135deg, #7c6cfc, #06d6a0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>JobTracker</div>
          <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '8px', padding: '.4rem .6rem', color: 'var(--text)', cursor: 'pointer' }}>
            {mobileOpen
              ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            }
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{ display: 'none', position: 'fixed', top: '52px', left: 0, right: 0, zIndex: 59, background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '1rem', flexDirection: 'column', gap: '.4rem' }} className="mobile-menu">
            {navLinks.map(link => {
              const isActive = location.pathname === link.path;
              return (
                <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: '.8rem', padding: '.75rem 1rem', borderRadius: 'var(--radius-sm)', background: isActive ? 'rgba(124,108,252,0.12)' : 'transparent', color: isActive ? '#a89cfc' : 'var(--muted)', fontSize: '.88rem', fontWeight: isActive ? 600 : 400, border: isActive ? '1px solid rgba(124,108,252,0.25)' : '1px solid transparent', textDecoration: 'none' }}
                >
                  <span>{link.icon}</span>
                  <span style={{ flex: 1 }}>{link.label}</span>
                  {link.badge && <span style={{ fontSize: '.6rem', padding: '.15rem .5rem', background: 'rgba(124,108,252,0.2)', color: '#a89cfc', borderRadius: '100px', fontWeight: 700 }}>{link.badge}</span>}
                </Link>
              );
            })}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '.8rem', marginTop: '.4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'linear-gradient(135deg, #7c6cfc, #5b4cdb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '.8rem', color: '#fff' }}>{user?.name?.charAt(0).toUpperCase()}</div>
                <div style={{ fontSize: '.82rem', fontWeight: 600 }}>{user?.name}</div>
              </div>
              <button onClick={logout} style={{ padding: '.4rem .8rem', background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.2)', borderRadius: '6px', color: 'var(--danger)', fontSize: '.78rem', cursor: 'pointer', fontFamily: 'inherit' }}>Logout</button>
            </div>
          </div>
        )}

        {/* Main */}
        <main style={{ flex: 1, marginLeft: '250px', padding: '2.5rem', minHeight: '100vh', background: 'var(--bg)' }} className="main-content">
          {children}
        </main>
      </div>

      <style>{`
        @media(max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .mobile-topbar { display: flex !important; }
          .mobile-menu { display: flex !important; }
          .main-content { margin-left: 0 !important; padding: 5rem 1rem 2rem !important; }
        }
      `}</style>
    </>
  );
}