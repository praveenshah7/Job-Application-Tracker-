/* eslint-disable */
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6c63ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
    title: 'Track Applications', desc: 'Never lose track of where you applied. All in one place.'
  },
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6c63ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    title: 'Kanban Board', desc: 'Visualize your pipeline from Applied to Offer.'
  },
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6c63ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    title: 'Analytics Dashboard', desc: 'See your success rate, interview rate, and progress charts.'
  },
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6c63ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    title: 'Interview Reminders', desc: 'Set interview dates and get visual reminders.'
  },
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6c63ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    title: 'Monthly Goals', desc: 'Set application goals and track your streak.'
  },
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6c63ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    title: 'Export to CSV', desc: 'Download all your data anytime.'
  },
];

export default function Landing() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let dots = [], animId;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      dots = Array.from({ length: 60 }, () => ({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3, vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3, o: Math.random() * 0.4 + 0.1,
      }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
        if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(108,99,255,${d.o})`; ctx.fill();
      });
      dots.forEach((a, i) => dots.slice(i + 1).forEach(b => {
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 120) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(108,99,255,${0.05 * (1 - dist / 120)})`; ctx.lineWidth = 0.5; ctx.stroke();
        }
      }));
      animId = requestAnimationFrame(draw);
    };
    resize(); draw();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: "'Inter', sans-serif" }}>
      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem 5rem', borderBottom: '1px solid var(--border)', background: 'rgba(15,15,19,0.9)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.3rem', color: 'var(--accent)' }}>JobTracker</div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/login" style={{ padding: '.6rem 1.4rem', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontWeight: 500, fontSize: '.9rem', transition: 'border-color 0.2s' }}>Sign In</Link>
          <Link to="/register" style={{ padding: '.6rem 1.4rem', background: 'var(--accent)', borderRadius: '8px', color: '#fff', fontWeight: 600, fontSize: '.9rem' }}>Get Started Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: 'relative', minHeight: '88vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '4rem 2rem', overflow: 'hidden' }}>
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '680px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.6rem', padding: '.4rem 1.2rem', background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.25)', borderRadius: '100px', fontSize: '.78rem', color: 'var(--accent)', marginBottom: '2rem', fontFamily: "'Space Grotesk', sans-serif" }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            Free Forever · No Credit Card Required
          </div>

          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(2.2rem, 5.5vw, 4rem)', lineHeight: 1.15, marginBottom: '1.5rem', letterSpacing: '-1px' }}>
            Your Job Search,<br />
            <span style={{ color: 'var(--accent)' }}>Finally Organized</span>
          </h1>

          <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.8, maxWidth: '500px', margin: '0 auto 2.5rem' }}>
            Stop using messy spreadsheets. Track every application, interview, and offer in one clean dashboard built for serious job seekers.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{ padding: '.9rem 2.2rem', background: 'var(--accent)', color: '#fff', borderRadius: '10px', fontWeight: 700, fontSize: '.95rem', boxShadow: '0 0 32px rgba(108,99,255,0.25)', transition: 'opacity 0.2s' }}>
              Start Tracking Free
            </Link>
            <Link to="/login" style={{ padding: '.9rem 2.2rem', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '10px', fontWeight: 500, fontSize: '.95rem', transition: 'border-color 0.2s' }}>
              Sign In
            </Link>
          </div>

          <p style={{ color: 'var(--muted)', fontSize: '.78rem', marginTop: '2rem', opacity: 0.7 }}>Built by Praveen Shah · React + Node.js + MongoDB</p>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '5rem 5rem', background: 'var(--bg2)' }}>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.9rem', textAlign: 'center', marginBottom: '.8rem' }}>Everything you need</h2>
        <p style={{ color: 'var(--muted)', textAlign: 'center', marginBottom: '3rem', fontSize: '.92rem' }}>All the tools to supercharge your job search</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.2rem', maxWidth: '960px', margin: '0 auto' }}>
          {features.map((f, i) => (
            <div key={i}
              style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.8rem', transition: 'border-color 0.2s, transform 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(108,99,255,0.4)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ marginBottom: '1rem', width: '44px', height: '44px', background: 'rgba(108,99,255,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '.95rem', marginBottom: '.5rem', fontFamily: "'Space Grotesk', sans-serif" }}>{f.title}</div>
              <div style={{ color: 'var(--muted)', fontSize: '.85rem', lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '5rem 2rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: '2rem', marginBottom: '1rem' }}>Ready to land your dream job?</h2>
        <p style={{ color: 'var(--muted)', marginBottom: '2rem', fontSize: '.92rem' }}>Start organizing your job search today — completely free.</p>
        <Link to="/register" style={{ padding: '.9rem 2.5rem', background: 'var(--accent)', color: '#fff', borderRadius: '10px', fontWeight: 700, fontSize: '.95rem', display: 'inline-block' }}>
          Get Started Free
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '1.5rem 5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--muted)', fontSize: '.8rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: 'var(--accent)', fontSize: '1rem' }}>JobTracker</div>
        <div>Built by Praveen Shah · React + Node.js + MongoDB</div>
      </footer>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @media(max-width:768px){
          nav { padding: 1rem 1.5rem !important; }
          section { padding: 3rem 1.5rem !important; }
        }
      `}</style>
    </div>
  );
}