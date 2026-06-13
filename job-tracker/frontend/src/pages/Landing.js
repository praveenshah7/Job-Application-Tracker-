/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
    title: 'Track Applications', desc: 'Never lose track of where you applied. All in one beautiful dashboard.',
    color: '#7c6cfc',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
    title: 'Kanban Board', desc: 'Drag and visualize your pipeline from Applied to Offer.',
    color: '#06d6a0',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    title: 'Analytics Dashboard', desc: 'Track your success rate, interview rate, and monthly goals.',
    color: '#f72585',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>,
    title: 'AI Cover Letter', desc: 'Generate personalized cover letters instantly with LLaMA AI.',
    color: '#ffd60a',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    title: 'Interview Reminders', desc: 'Never miss an interview with smart date tracking.',
    color: '#06d6a0',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    title: 'Export to CSV', desc: 'Download all your application data anytime.',
    color: '#7c6cfc',
  },
];

const stats = [
  { value: '100%', label: 'Free Forever' },
  { value: 'AI', label: 'Powered' },
  { value: '5+', label: 'Features' },
  { value: '1', label: 'Dashboard' },
];

export default function Landing() {
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let dots = [], animId;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      dots = Array.from({ length: 80 }, () => ({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        r: Math.random() * 1.8 + 0.3, vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25, o: Math.random() * 0.5 + 0.1,
      }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
        if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124,108,252,${d.o})`; ctx.fill();
      });
      dots.forEach((a, i) => dots.slice(i + 1).forEach(b => {
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 140) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(124,108,252,${0.06 * (1 - dist / 140)})`; ctx.lineWidth = 0.5; ctx.stroke();
        }
      }));
      animId = requestAnimationFrame(draw);
    };
    resize(); draw();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: "'Inter', sans-serif" }} onMouseMove={handleMouseMove}>

      {/* Cursor glow */}
      <div style={{ position: 'fixed', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,108,252,0.06) 0%, transparent 70%)', left: mousePos.x - 200, top: mousePos.y - 200, pointerEvents: 'none', zIndex: 0, transition: 'left 0.1s, top 0.1s' }} />

      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem 5rem', borderBottom: '1px solid var(--border)', background: 'rgba(7,7,17,0.85)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: '1.3rem', background: 'linear-gradient(135deg, #7c6cfc, #06d6a0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          JobTracker
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/login" style={{ padding: '.6rem 1.4rem', border: '1px solid var(--border2)', borderRadius: '100px', color: 'var(--muted)', fontWeight: 500, fontSize: '.88rem', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--text)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--muted)'; }}
          >Sign In</Link>
          <Link to="/register" style={{ padding: '.6rem 1.4rem', background: 'linear-gradient(135deg, #7c6cfc, #5b4cdb)', borderRadius: '100px', color: '#fff', fontWeight: 600, fontSize: '.88rem', boxShadow: '0 0 20px rgba(124,108,252,0.3)', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 30px rgba(124,108,252,0.5)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(124,108,252,0.3)'}
          >Get Started Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: 'relative', minHeight: '92vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '4rem 2rem', overflow: 'hidden' }}>
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }} />

        {/* Gradient orbs */}
        <div style={{ position: 'absolute', top: '15%', left: '10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,108,252,0.12) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,214,160,0.1) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '750px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.6rem', padding: '.4rem 1rem .4rem .5rem', background: 'rgba(124,108,252,0.1)', border: '1px solid rgba(124,108,252,0.25)', borderRadius: '100px', fontSize: '.78rem', color: '#a89cfc', marginBottom: '2rem', fontFamily: "'Space Grotesk', sans-serif" }}>
            <span style={{ background: 'linear-gradient(135deg, #7c6cfc, #06d6a0)', borderRadius: '100px', padding: '.2rem .6rem', fontSize: '.7rem', color: '#fff', fontWeight: 700 }}>NEW</span>
            AI-Powered Cover Letter Generator
          </div>

          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-1.5px' }}>
            Your Job Search,<br />
            <span style={{ background: 'linear-gradient(135deg, #7c6cfc 0%, #06d6a0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Finally Organized</span>
          </h1>

          <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.85, maxWidth: '520px', margin: '0 auto 2.5rem' }}>
            Stop drowning in spreadsheets. Track every application, ace every interview, and land your dream job — all in one powerful dashboard.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <Link to="/register" style={{ padding: '1rem 2.5rem', background: 'linear-gradient(135deg, #7c6cfc, #5b4cdb)', color: '#fff', borderRadius: '100px', fontWeight: 700, fontSize: '1rem', boxShadow: '0 0 40px rgba(124,108,252,0.35)', transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', gap: '.5rem' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 60px rgba(124,108,252,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 0 40px rgba(124,108,252,0.35)'; }}
            >
              Start For Free
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
            <Link to="/login" style={{ padding: '1rem 2.5rem', border: '1px solid var(--border2)', color: 'var(--text)', borderRadius: '100px', fontWeight: 500, fontSize: '1rem', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'rgba(124,108,252,0.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.background = 'transparent'; }}
            >Sign In</Link>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {stats.map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: '1.6rem', background: 'linear-gradient(135deg, #7c6cfc, #06d6a0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
                <div style={{ fontSize: '.75rem', color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '.2rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '6rem 5rem', background: 'var(--bg2)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(124,108,252,0.5), transparent)' }} />
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ display: 'inline-block', padding: '.3rem .8rem', background: 'rgba(124,108,252,0.1)', border: '1px solid rgba(124,108,252,0.2)', borderRadius: '100px', fontSize: '.75rem', color: 'var(--accent)', marginBottom: '1rem', fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '1px', textTransform: 'uppercase' }}>Features</div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', letterSpacing: '-1px', marginBottom: '.8rem' }}>Everything you need to land the job</h2>
          <p style={{ color: 'var(--muted)', fontSize: '.95rem', maxWidth: '500px', margin: '0 auto' }}>Built for serious job seekers who want to stay organized and move fast.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem', maxWidth: '1000px', margin: '0 auto' }}>
          {features.map((f, i) => (
            <div key={i}
              style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '2rem', transition: 'all 0.3s', position: 'relative', overflow: 'hidden' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = f.color + '44'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 40px ${f.color}15`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, ${f.color}, transparent)`, opacity: 0, transition: 'opacity 0.3s' }} className="feature-line" />
              <div style={{ width: '48px', height: '48px', background: `${f.color}18`, border: `1px solid ${f.color}30`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem', color: f.color }}>{f.icon}</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1rem', marginBottom: '.5rem' }}>{f.title}</div>
              <div style={{ color: 'var(--muted)', fontSize: '.85rem', lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '6rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(124,108,252,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-1px', marginBottom: '1rem' }}>
            Ready to land your<br />
            <span style={{ background: 'linear-gradient(135deg, #7c6cfc, #06d6a0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>dream job?</span>
          </h2>
          <p style={{ color: 'var(--muted)', marginBottom: '2.5rem', fontSize: '.95rem' }}>Join and start organizing your job search today — completely free.</p>
          <Link to="/register" style={{ padding: '1rem 3rem', background: 'linear-gradient(135deg, #7c6cfc, #5b4cdb)', color: '#fff', borderRadius: '100px', fontWeight: 700, fontSize: '1rem', display: 'inline-block', boxShadow: '0 0 40px rgba(124,108,252,0.35)', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 60px rgba(124,108,252,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 0 40px rgba(124,108,252,0.35)'; }}
          >Get Started Free</Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem 5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: '1.1rem', background: 'linear-gradient(135deg, #7c6cfc, #06d6a0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>JobTracker</div>
        <div style={{ color: 'var(--muted)', fontSize: '.8rem' }}>Built by Praveen Shah · React + Node.js + MongoDB + AI</div>
      </footer>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @media(max-width:768px){
          nav { padding: 1rem 1.5rem !important; }
          section { padding: 3rem 1.5rem !important; }
          footer { padding: 1.5rem !important; flex-direction: column; text-align: center; }
        }
      `}</style>
    </div>
  );
}