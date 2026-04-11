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

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div style={{ color: 'var(--muted)', padding: '2rem' }}>Loading...</div>;

  const successRate = stats?.total > 0 ? Math.round(((stats.interview + stats.offer) / stats.total) * 100) : 0;
  const offerRate = stats?.total > 0 ? Math.round((stats.offer / stats.total) * 100) : 0;

  const pieData = stats ? Object.entries(STATUS_COLORS).map(([name, color]) => ({ name, value: stats[name.toLowerCase()] || 0, color })).filter(d => d.value > 0) : [];
  const barData = stats ? Object.entries(STATUS_COLORS).map(([name, color]) => ({ name, count: stats[name.toLowerCase()] || 0, color })) : [];

  const statCards = [
    { label: 'Total Applied', value: stats?.total || 0, color: '#6c63ff', icon: '📋' },
    { label: 'Interviews', value: stats?.interview || 0, color: '#00d4aa', icon: '🎯' },
    { label: 'Offers', value: stats?.offer || 0, color: '#2ed573', icon: '🏆' },
    { label: 'Rejected', value: stats?.rejected || 0, color: '#ff4757', icon: '❌' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.8rem', marginBottom: '.3rem' }}>
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '.9rem' }}>Here's your job search overview</p>
      </div>

      {/* Success Rate Banner */}
      {stats?.total > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.25)', borderRadius: 'var(--radius)', padding: '1.2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: '2.5rem', color: '#6c63ff' }}>{successRate}%</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '.95rem' }}>Interview Rate</div>
              <div style={{ color: 'var(--muted)', fontSize: '.8rem' }}>Applications reaching interview stage</div>
            </div>
          </div>
          <div style={{ background: 'rgba(46,213,115,0.08)', border: '1px solid rgba(46,213,115,0.25)', borderRadius: 'var(--radius)', padding: '1.2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: '2.5rem', color: '#2ed573' }}>{offerRate}%</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '.95rem' }}>Offer Rate</div>
              <div style={{ color: 'var(--muted)', fontSize: '.8rem' }}>Applications converted to offers</div>
            </div>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {statCards.map(card => (
          <div key={card.label} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', borderLeft: `3px solid ${card.color}` }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '.5rem' }}>{card.icon}</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '2rem', color: card.color }}>{card.value}</div>
            <div style={{ fontSize: '.82rem', color: 'var(--muted)', marginTop: '.2rem' }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 600, marginBottom: '1.5rem', fontSize: '1rem' }}>Applications by Status</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '3rem 0' }}>No data yet</div>
          )}
        </div>

        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 600, marginBottom: '1.5rem', fontSize: '1rem' }}>Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: '#8b8a99', fontSize: 11 }} />
              <YAxis tick={{ fill: '#8b8a99', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {barData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Applications */}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontWeight: 600, fontSize: '1rem' }}>Recent Applications</h3>
          <a href="/jobs" style={{ color: 'var(--accent)', fontSize: '.82rem', fontWeight: 500 }}>View all →</a>
        </div>
        {jobs.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.8rem' }}>
            {jobs.map(job => (
              <div key={job._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg3)', borderRadius: 'var(--radius-sm)', flexWrap: 'wrap', gap: '.5rem' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '.95rem' }}>{job.position}</div>
                  <div style={{ color: 'var(--muted)', fontSize: '.82rem' }}>{job.company}{job.location && ` · ${job.location}`}</div>
                </div>
                <span style={{ padding: '.3rem .8rem', borderRadius: '100px', background: STATUS_COLORS[job.status] + '22', color: STATUS_COLORS[job.status], fontSize: '.78rem', fontWeight: 600, border: `1px solid ${STATUS_COLORS[job.status]}44` }}>
                  {job.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '2rem' }}>
            No applications yet. <a href="/jobs" style={{ color: 'var(--accent)' }}>Add your first one!</a>
          </div>
        )}
      </div>
    </div>
  );
}