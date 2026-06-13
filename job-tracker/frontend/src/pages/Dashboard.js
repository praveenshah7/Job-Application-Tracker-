/* eslint-disable */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useAuth } from '../context/AuthContext';

const STATUS_COLORS = {
  Applied: '#7c6cfc',
  Screening: '#ffd60a',
  Interview: '#06d6a0',
  Offer: '#06d6a0',
  Rejected: '#ff4d6d',
};

const Icons = {
  briefcase: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
  target: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  trophy: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>,
  x: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>,
  arrowRight: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  edit: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  check: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  sparkle: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>,
};

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [goal, setGoal] = useState(() => parseInt(localStorage.getItem('monthlyGoal') || '20'));
  const [editGoal, setEditGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(goal);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, jobsRes] = await Promise.all([
          axios.get('/api/jobs/stats'),
          axios.get('/api/jobs'),
        ]);
        setStats(statsRes.data);
        setJobs(jobsRes.data.slice(0, 5));
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ width: '44px', height: '44px', border: '3px solid var(--border)', borderTop: '3px solid var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <div style={{ color: 'var(--muted)', fontSize: '.88rem', fontFamily: "'Space Grotesk', sans-serif" }}>Loading your dashboard...</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const successRate = stats?.total > 0 ? Math.round(((stats.interview + stats.offer) / stats.total) * 100) : 0;
  const offerRate = stats?.total > 0 ? Math.round((stats.offer / stats.total) * 100) : 0;
  const thisMonthApps = jobs.filter(j => {
    const now = new Date();
    const d = new Date(j.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  const goalProgress = Math.min(Math.round((thisMonthApps / goal) * 100), 100);

  const pieData = stats ? Object.entries(STATUS_COLORS)
    .map(([name, color]) => ({ name, value: stats[name.toLowerCase()] || 0, color }))
    .filter(d => d.value > 0) : [];

  const statCards = [
    { label: 'Total Applied', value: stats?.total || 0, color: '#7c6cfc', bg: 'rgba(124,108,252,0.1)', border: 'rgba(124,108,252,0.2)', icon: Icons.briefcase },
    { label: 'Interviews', value: stats?.interview || 0, color: '#06d6a0', bg: 'rgba(6,214,160,0.1)', border: 'rgba(6,214,160,0.2)', icon: Icons.target },
    { label: 'Offers', value: stats?.offer || 0, color: '#ffd60a', bg: 'rgba(255,214,10,0.1)', border: 'rgba(255,214,10,0.2)', icon: Icons.trophy },
    { label: 'Rejected', value: stats?.rejected || 0, color: '#ff4d6d', bg: 'rgba(255,77,109,0.1)', border: 'rgba(255,77,109,0.2)', icon: Icons.x },
  ];

  const card = (children, style = {}) => (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', ...style }}>
      {children}
    </div>
  );

  return (
    <div style={{ maxWidth: '1200px' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: '1.9rem', letterSpacing: '-0.5px', marginBottom: '.3rem' }}>
            Welcome back, <span style={{ background: 'linear-gradient(135deg, #7c6cfc, #06d6a0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user?.name?.split(' ')[0]}</span>
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '.9rem' }}>Here's what's happening with your job search</p>
        </div>
        <a href="/cover-letter" style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', padding: '.6rem 1.2rem', background: 'linear-gradient(135deg, rgba(124,108,252,0.15), rgba(6,214,160,0.1))', border: '1px solid rgba(124,108,252,0.25)', borderRadius: '100px', color: '#a89cfc', fontSize: '.82rem', fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(124,108,252,0.2)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
        >
          {Icons.sparkle} Generate Cover Letter
        </a>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {statCards.map(card => (
          <div key={card.label} style={{ background: card.bg, border: `1px solid ${card.border}`, borderRadius: 'var(--radius)', padding: '1.4rem', position: 'relative', overflow: 'hidden', transition: 'transform 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
          >
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: card.color, opacity: 0.06, filter: 'blur(20px)' }} />
            <div style={{ color: card.color, marginBottom: '.8rem', opacity: 0.9 }}>{card.icon}</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: '2.2rem', color: card.color, lineHeight: 1 }}>{card.value}</div>
            <div style={{ fontSize: '.78rem', color: 'var(--muted)', marginTop: '.3rem', fontWeight: 500 }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Success Rate + Goal */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* Interview Rate */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <svg width="72" height="72" viewBox="0 0 72 72">
              <circle cx="36" cy="36" r="28" fill="none" stroke="var(--bg3)" strokeWidth="6" />
              <circle cx="36" cy="36" r="28" fill="none" stroke="#7c6cfc" strokeWidth="6" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (1 - successRate / 100)}`}
                transform="rotate(-90 36 36)" />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: '1rem', color: '#7c6cfc' }}>{successRate}%</div>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '.3rem' }}>Interview Rate</div>
            <div style={{ color: 'var(--muted)', fontSize: '.8rem', lineHeight: 1.5 }}>Applications reaching interview stage</div>
          </div>
        </div>

        {/* Offer Rate */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <svg width="72" height="72" viewBox="0 0 72 72">
              <circle cx="36" cy="36" r="28" fill="none" stroke="var(--bg3)" strokeWidth="6" />
              <circle cx="36" cy="36" r="28" fill="none" stroke="#06d6a0" strokeWidth="6" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (1 - offerRate / 100)}`}
                transform="rotate(-90 36 36)" />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: '1rem', color: '#06d6a0' }}>{offerRate}%</div>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '.3rem' }}>Offer Rate</div>
            <div style={{ color: 'var(--muted)', fontSize: '.8rem', lineHeight: 1.5 }}>Applications converted to offers</div>
          </div>
        </div>
      </div>

      {/* Monthly Goal + Pie Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* Monthly Goal */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                <span style={{ color: 'var(--accent)' }}>{Icons.target}</span> Monthly Goal
              </div>
              <div style={{ color: 'var(--muted)', fontSize: '.78rem', marginTop: '.2rem' }}>{thisMonthApps} of {goal} this month</div>
            </div>
            {!editGoal ? (
              <button onClick={() => setEditGoal(true)} style={{ display: 'flex', alignItems: 'center', gap: '.3rem', padding: '.35rem .7rem', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--muted)', fontSize: '.75rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                {Icons.edit} Edit
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
                <input type="number" min="1" max="100" value={tempGoal} onChange={e => setTempGoal(e.target.value)}
                  style={{ width: '56px', padding: '.3rem .5rem', background: 'var(--bg3)', border: '1px solid var(--accent)', borderRadius: '6px', color: 'var(--text)', fontSize: '.82rem', outline: 'none', textAlign: 'center' }} />
                <button onClick={() => { setGoal(parseInt(tempGoal)); localStorage.setItem('monthlyGoal', tempGoal); setEditGoal(false); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '.3rem', padding: '.35rem .7rem', background: 'var(--accent)', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '.75rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                  {Icons.check} Save
                </button>
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div style={{ height: '8px', background: 'var(--bg3)', borderRadius: '100px', overflow: 'hidden', marginBottom: '.6rem' }}>
            <div style={{ height: '100%', width: goalProgress + '%', background: goalProgress >= 100 ? '#06d6a0' : 'linear-gradient(90deg, #7c6cfc, #06d6a0)', borderRadius: '100px', transition: 'width 1s cubic-bezier(.16,1,.3,1)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '.72rem', color: 'var(--muted)' }}>{goalProgress}% complete</span>
            {goalProgress >= 100 && <span style={{ fontSize: '.72rem', color: '#06d6a0', fontWeight: 700 }}>Goal achieved!</span>}
          </div>

          {/* Mini status breakdown */}
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
            {Object.entries(STATUS_COLORS).map(([status, color]) => {
              const val = stats?.[status.toLowerCase()] || 0;
              const pct = stats?.total > 0 ? Math.round((val / stats.total) * 100) : 0;
              return (
                <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '.8rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                  <div style={{ fontSize: '.78rem', color: 'var(--muted)', flex: 1 }}>{status}</div>
                  <div style={{ flex: 2, height: '4px', background: 'var(--bg3)', borderRadius: '100px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: pct + '%', background: color, borderRadius: '100px', transition: 'width 1s ease' }} />
                  </div>
                  <div style={{ fontSize: '.72rem', color: 'var(--muted)', width: '24px', textAlign: 'right' }}>{val}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pie Chart */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1.2rem', fontSize: '.95rem' }}>Applications by Status</h3>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={3}>
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '.8rem', boxShadow: 'var(--shadow)' }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', justifyContent: 'center', marginTop: '.5rem' }}>
                {pieData.map((d, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '.3rem', fontSize: '.72rem', color: 'var(--muted)' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: d.color }} />
                    {d.name}: {d.value}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '3rem 0', fontSize: '.88rem' }}>Add applications to see stats</div>
          )}
        </div>
      </div>

      {/* Recent Applications */}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <h3 style={{ fontWeight: 700, fontSize: '.95rem' }}>Recent Applications</h3>
          <a href="/jobs" style={{ display: 'flex', alignItems: 'center', gap: '.3rem', color: 'var(--accent)', fontSize: '.8rem', fontWeight: 600, textDecoration: 'none', opacity: 0.8, transition: 'opacity 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0.8'}
          >View all {Icons.arrowRight}</a>
        </div>
        {jobs.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
            {jobs.map(job => (
              <div key={job._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.9rem 1.1rem', background: 'var(--bg3)', borderRadius: 'var(--radius-sm)', flexWrap: 'wrap', gap: '.5rem', borderLeft: `2px solid ${STATUS_COLORS[job.status]}`, transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg4)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--bg3)'}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '.9rem' }}>{job.position}</div>
                  <div style={{ color: 'var(--muted)', fontSize: '.78rem', marginTop: '.1rem' }}>{job.company}{job.location && ` · ${job.location}`}</div>
                </div>
                <span style={{ padding: '.25rem .75rem', borderRadius: '100px', background: STATUS_COLORS[job.status] + '18', color: STATUS_COLORS[job.status], fontSize: '.72rem', fontWeight: 700, border: `1px solid ${STATUS_COLORS[job.status]}30` }}>
                  {job.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '2.5rem', fontSize: '.9rem' }}>
            No applications yet.{' '}
            <a href="/jobs" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Add your first one</a>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media(max-width:768px){ .dashboard-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}