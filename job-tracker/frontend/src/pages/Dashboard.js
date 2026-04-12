/* eslint-disable */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useAuth } from '../context/AuthContext';

const STATUS_COLORS = {
  Applied: '#6c63ff',
  Screening: '#ffa502',
  Interview: '#00d4aa',
  Offer: '#2ed573',
  Rejected: '#ff4757',
};

const Icons = {
  briefcase: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
  target: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  trophy: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>,
  x: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>,
  calendar: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  arrowRight: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  edit: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  check: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
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
      <div style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTop: '3px solid var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <div style={{ color: 'var(--muted)', fontSize: '.9rem' }}>Loading dashboard...</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const successRate = stats?.total > 0 ? Math.round(((stats.interview + stats.offer) / stats.total) * 100) : 0;
  const offerRate = stats?.total > 0 ? Math.round((stats.offer / stats.total) * 100) : 0;

  const allJobs = jobs;
  const thisMonthApps = allJobs.filter ? (() => {
    const now = new Date();
    return allJobs.filter(j => {
      const d = new Date(j.createdAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
  })() : 0;

  const goalProgress = Math.min(Math.round((thisMonthApps / goal) * 100), 100);

  const pieData = stats ? Object.entries(STATUS_COLORS)
    .map(([name, color]) => ({ name, value: stats[name.toLowerCase()] || 0, color }))
    .filter(d => d.value > 0) : [];

  const barData = stats ? Object.entries(STATUS_COLORS)
    .map(([name, color]) => ({ name, count: stats[name.toLowerCase()] || 0, color })) : [];

  const statCards = [
    { label: 'Total Applied', value: stats?.total || 0, color: '#6c63ff', icon: Icons.briefcase },
    { label: 'Interviews', value: stats?.interview || 0, color: '#00d4aa', icon: Icons.target },
    { label: 'Offers', value: stats?.offer || 0, color: '#2ed573', icon: Icons.trophy },
    { label: 'Rejected', value: stats?.rejected || 0, color: '#ff4757', icon: Icons.x },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.8rem', marginBottom: '.3rem' }}>
          Welcome back, {user?.name?.split(' ')[0]}
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '.9rem' }}>Here's your job search overview</p>
      </div>

      {/* Success Rate Banners */}
      {stats?.total > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 'var(--radius)', padding: '1.2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: '2.5rem', color: '#6c63ff', lineHeight: 1 }}>{successRate}%</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '.95rem' }}>Interview Rate</div>
              <div style={{ color: 'var(--muted)', fontSize: '.78rem', marginTop: '.2rem' }}>Applications reaching interview</div>
            </div>
          </div>
          <div style={{ background: 'rgba(46,213,115,0.08)', border: '1px solid rgba(46,213,115,0.2)', borderRadius: 'var(--radius)', padding: '1.2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: '2.5rem', color: '#2ed573', lineHeight: 1 }}>{offerRate}%</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '.95rem' }}>Offer Rate</div>
              <div style={{ color: 'var(--muted)', fontSize: '.78rem', marginTop: '.2rem' }}>Applications converted to offers</div>
            </div>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {statCards.map(card => (
          <div key={card.label} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.4rem', borderLeft: `3px solid ${card.color}` }}>
            <div style={{ color: card.color, marginBottom: '.8rem' }}>{card.icon}</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '2rem', color: card.color, lineHeight: 1 }}>{card.value}</div>
            <div style={{ fontSize: '.8rem', color: 'var(--muted)', marginTop: '.3rem' }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Monthly Goal */}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
              <span style={{ color: 'var(--accent)' }}>{Icons.target}</span>
              Monthly Goal
            </div>
            <div style={{ color: 'var(--muted)', fontSize: '.82rem', marginTop: '.2rem' }}>{thisMonthApps} of {goal} applications this month</div>
          </div>
          {!editGoal ? (
            <button onClick={() => setEditGoal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '.4rem', padding: '.4rem .8rem', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--muted)', fontSize: '.78rem', cursor: 'pointer' }}>
              {Icons.edit} Edit
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
              <input type="number" min="1" max="100" value={tempGoal}
                onChange={e => setTempGoal(e.target.value)}
                style={{ width: '64px', padding: '.4rem .6rem', background: 'var(--bg3)', border: '1px solid var(--accent)', borderRadius: '6px', color: 'var(--text)', fontSize: '.88rem', outline: 'none', textAlign: 'center' }} />
              <button onClick={() => { setGoal(parseInt(tempGoal)); localStorage.setItem('monthlyGoal', tempGoal); setEditGoal(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: '.3rem', padding: '.4rem .8rem', background: 'var(--accent)', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '.78rem', cursor: 'pointer' }}>
                {Icons.check} Save
              </button>
            </div>
          )}
        </div>
        <div style={{ height: '8px', background: 'var(--bg3)', borderRadius: '100px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: goalProgress + '%', background: goalProgress >= 100 ? '#2ed573' : 'linear-gradient(90deg, var(--accent), #00d4aa)', borderRadius: '100px', transition: 'width 1s cubic-bezier(.16,1,.3,1)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '.6rem' }}>
          <span style={{ fontSize: '.75rem', color: 'var(--muted)' }}>{goalProgress}% complete</span>
          {goalProgress >= 100 && <span style={{ fontSize: '.75rem', color: '#2ed573', fontWeight: 600 }}>Goal achieved!</span>}
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 600, marginBottom: '1.5rem', fontSize: '1rem' }}>Applications by Status</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '.82rem' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '3rem 0', fontSize: '.9rem' }}>No data yet — add your first application!</div>
          )}
        </div>

        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 600, marginBottom: '1.5rem', fontSize: '1rem' }}>Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={{ fill: '#8b8a99', fontSize: 10 }} />
              <YAxis tick={{ fill: '#8b8a99', fontSize: 10 }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '.82rem' }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {barData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Applications */}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <h3 style={{ fontWeight: 600, fontSize: '1rem' }}>Recent Applications</h3>
          <a href="/jobs" style={{ display: 'flex', alignItems: 'center', gap: '.3rem', color: 'var(--accent)', fontSize: '.82rem', fontWeight: 500 }}>
            View all {Icons.arrowRight}
          </a>
        </div>
        {jobs.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.7rem' }}>
            {jobs.map(job => (
              <div key={job._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.9rem 1rem', background: 'var(--bg3)', borderRadius: 'var(--radius-sm)', flexWrap: 'wrap', gap: '.5rem', borderLeft: `2px solid ${STATUS_COLORS[job.status]}` }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '.92rem' }}>{job.position}</div>
                  <div style={{ color: 'var(--muted)', fontSize: '.8rem', marginTop: '.1rem' }}>{job.company}{job.location && ` · ${job.location}`}</div>
                </div>
                <span style={{ padding: '.25rem .75rem', borderRadius: '100px', background: STATUS_COLORS[job.status] + '22', color: STATUS_COLORS[job.status], fontSize: '.75rem', fontWeight: 600, border: `1px solid ${STATUS_COLORS[job.status]}33`, whiteSpace: 'nowrap' }}>
                  {job.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '2rem', fontSize: '.9rem' }}>
            No applications yet.{' '}
            <a href="/jobs" style={{ color: 'var(--accent)', fontWeight: 500 }}>Add your first one</a>
          </div>
        )}
      </div>
    </div>
  );
}