/* eslint-disable */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const STATUSES = ['Applied', 'Screening', 'Interview', 'Offer', 'Rejected'];

const STATUS_COLORS = {
  Applied: '#6c63ff',
  Screening: '#ffa502',
  Interview: '#00d4aa',
  Offer: '#2ed573',
  Rejected: '#ff4757',
};

const emptyForm = {
  company: '', position: '', location: '', status: 'Applied',
  salary: '', jobUrl: '', notes: '',
  appliedDate: new Date().toISOString().split('T')[0],
  interviewDate: '',
};

function exportToCSV(jobs) {
  const headers = ['Company', 'Position', 'Location', 'Status', 'Salary', 'Applied Date', 'Interview Date', 'Job URL', 'Notes'];
  const rows = jobs.map(j => [
    j.company, j.position, j.location, j.status, j.salary,
    j.appliedDate ? j.appliedDate.split('T')[0] : '',
    j.interviewDate ? j.interviewDate.split('T')[0] : '',
    j.jobUrl, j.notes
  ]);
  const csv = [headers, ...rows].map(r => r.map(v => `"${v || ''}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'job-applications.csv'; a.click();
  URL.revokeObjectURL(url);
  toast.success('CSV Downloaded!');
}

function getUpcomingInterviews(jobs) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return jobs.filter(j => {
    if (!j.interviewDate) return false;
    const d = new Date(j.interviewDate);
    d.setHours(0, 0, 0, 0);
    return d >= today;
  }).sort((a, b) => new Date(a.interviewDate) - new Date(b.interviewDate));
}

function getDaysUntil(dateStr) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr); d.setHours(0, 0, 0, 0);
  const diff = Math.round((d - today) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Today!';
  if (diff === 1) return 'Tomorrow!';
  return `In ${diff} days`;
}

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [view, setView] = useState('list');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get('/api/jobs');
      setJobs(res.data);
    } catch { toast.error('Failed to fetch jobs'); }
    setLoading(false);
  };

  const openAdd = () => { setForm(emptyForm); setEditJob(null); setShowModal(true); };
  const openEdit = (job) => {
    setForm({
      ...job,
      appliedDate: job.appliedDate?.split('T')[0] || '',
      interviewDate: job.interviewDate?.split('T')[0] || '',
    });
    setEditJob(job._id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editJob) {
        const res = await axios.put(`/api/jobs/${editJob}`, form);
        setJobs(jobs.map(j => j._id === editJob ? res.data : j));
        toast.success('Updated!');
      } else {
        const res = await axios.post('/api/jobs', form);
        setJobs([res.data, ...jobs]);
        toast.success('Added!');
      }
      setShowModal(false);
    } catch { toast.error('Something went wrong'); }
    setSaving(false);
  };

  const deleteJob = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    try {
      await axios.delete(`/api/jobs/${id}`);
      setJobs(jobs.filter(j => j._id !== id));
      toast.success('Deleted!');
    } catch { toast.error('Delete failed'); }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await axios.put(`/api/jobs/${id}`, { status });
      setJobs(jobs.map(j => j._id === id ? res.data : j));
      toast.success('Status updated!');
    } catch { toast.error('Update failed'); }
  };

  const filtered = jobs.filter(j => {
    const matchSearch = j.company.toLowerCase().includes(search.toLowerCase()) || j.position.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || j.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const upcomingInterviews = getUpcomingInterviews(jobs);
  const inputStyle = { width: '100%', padding: '.7rem 1rem', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: '.88rem', outline: 'none' };

  if (loading) return <div style={{ color: 'var(--muted)', padding: '2rem' }}>Loading...</div>;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.8rem' }}>Applications</h1>
          <p style={{ color: 'var(--muted)', fontSize: '.88rem' }}>{jobs.length} total applications</p>
        </div>
        <div style={{ display: 'flex', gap: '.8rem', flexWrap: 'wrap' }}>
          <button onClick={() => exportToCSV(jobs)}
            style={{ padding: '.75rem 1.2rem', background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.3)', borderRadius: 'var(--radius-sm)', color: '#00d4aa', fontWeight: 600, fontSize: '.88rem' }}>
            ↓ Export CSV
          </button>
          <button onClick={openAdd}
            style={{ padding: '.75rem 1.5rem', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: '.9rem' }}>
            + Add Application
          </button>
        </div>
      </div>

      {/* Upcoming Interviews Banner */}
      {upcomingInterviews.length > 0 && (
        <div style={{ background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.25)', borderRadius: 'var(--radius)', padding: '1rem 1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ fontWeight: 600, fontSize: '.88rem', color: '#00d4aa', marginBottom: '.6rem' }}>🗓 Upcoming Interviews</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.8rem' }}>
            {upcomingInterviews.map(j => (
              <div key={j._id} style={{ background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.2)', borderRadius: 'var(--radius-sm)', padding: '.5rem 1rem', fontSize: '.82rem' }}>
                <span style={{ fontWeight: 600, color: '#e8e8f0' }}>{j.position}</span>
                <span style={{ color: 'var(--muted)' }}> @ {j.company}</span>
                <span style={{ color: '#00d4aa', marginLeft: '.5rem', fontWeight: 600 }}>— {getDaysUntil(j.interviewDate)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input placeholder="Search company or role..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ ...inputStyle, flex: 1, minWidth: '200px' }} />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ ...inputStyle, width: 'auto' }}>
          <option>All</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <div style={{ display: 'flex', gap: '.5rem' }}>
          {['list', 'kanban'].map(v => (
            <button key={v} onClick={() => setView(v)}
              style={{ padding: '.6rem 1rem', background: view === v ? 'var(--accent)' : 'var(--bg2)', color: view === v ? '#fff' : 'var(--muted)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '.85rem', fontWeight: 500, textTransform: 'capitalize' }}>
              {v === 'list' ? '☰ List' : '⊞ Kanban'}
            </button>
          ))}
        </div>
      </div>

      {/* List View */}
      {view === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.8rem' }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '3rem', background: 'var(--bg2)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              No applications found!
            </div>
          )}
          {filtered.map(job => (
            <div key={job._id} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.2rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderLeft: `3px solid ${STATUS_COLORS[job.status]}` }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem', flexWrap: 'wrap' }}>
                  <div style={{ fontWeight: 600, fontSize: '1rem' }}>{job.position}</div>
                  {job.interviewDate && new Date(job.interviewDate) >= new Date(new Date().setHours(0,0,0,0)) && (
                    <span style={{ background: 'rgba(0,212,170,0.15)', border: '1px solid rgba(0,212,170,0.3)', borderRadius: '100px', padding: '.15rem .6rem', fontSize: '.72rem', color: '#00d4aa', fontWeight: 600 }}>
                      🗓 {getDaysUntil(job.interviewDate)}
                    </span>
                  )}
                </div>
                <div style={{ color: 'var(--muted)', fontSize: '.85rem', marginTop: '.2rem' }}>
                  {job.company}
                  {job.location && <span> · {job.location}</span>}
                  {job.salary && <span> · {job.salary}</span>}
                  {job.interviewDate && <span style={{ color: '#00d4aa' }}> · Interview: {job.interviewDate.split('T')[0]}</span>}
                </div>
                {job.notes && <div style={{ color: 'var(--muted)', fontSize: '.78rem', marginTop: '.3rem', fontStyle: 'italic' }}>{job.notes.substring(0, 80)}{job.notes.length > 80 ? '...' : ''}</div>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem', flexWrap: 'wrap' }}>
                <select value={job.status} onChange={e => updateStatus(job._id, e.target.value)}
                  style={{ padding: '.4rem .8rem', background: STATUS_COLORS[job.status] + '22', border: `1px solid ${STATUS_COLORS[job.status]}44`, borderRadius: '100px', color: STATUS_COLORS[job.status], fontSize: '.78rem', fontWeight: 600, outline: 'none', cursor: 'pointer' }}>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <div style={{ display: 'flex', gap: '.5rem' }}>
                  {job.jobUrl && <a href={job.jobUrl} target="_blank" rel="noreferrer" style={{ padding: '.4rem .8rem', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--muted)', fontSize: '.78rem' }}>🔗</a>}
                  <button onClick={() => openEdit(job)} style={{ padding: '.4rem .8rem', background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 'var(--radius-sm)', color: 'var(--accent)', fontSize: '.78rem' }}>Edit</button>
                  <button onClick={() => deleteJob(job._id)} style={{ padding: '.4rem .8rem', background: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.2)', borderRadius: 'var(--radius-sm)', color: 'var(--danger)', fontSize: '.78rem' }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Kanban View */}
      {view === 'kanban' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'start' }}>
          {STATUSES.map(status => {
            const statusJobs = filtered.filter(j => j.status === status);
            return (
              <div key={status} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '.88rem', color: STATUS_COLORS[status] }}>{status}</span>
                  <span style={{ background: STATUS_COLORS[status] + '22', color: STATUS_COLORS[status], borderRadius: '100px', padding: '.15rem .5rem', fontSize: '.75rem', fontWeight: 700 }}>{statusJobs.length}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.7rem' }}>
                  {statusJobs.map(job => (
                    <div key={job._id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '1rem', cursor: 'pointer' }} onClick={() => openEdit(job)}>
                      <div style={{ fontWeight: 600, fontSize: '.88rem', marginBottom: '.2rem' }}>{job.position}</div>
                      <div style={{ color: 'var(--muted)', fontSize: '.78rem' }}>{job.company}</div>
                      {job.salary && <div style={{ color: 'var(--accent)', fontSize: '.75rem', marginTop: '.3rem' }}>{job.salary}</div>}
                      {job.interviewDate && (
                        <div style={{ color: '#00d4aa', fontSize: '.72rem', marginTop: '.3rem' }}>🗓 {getDaysUntil(job.interviewDate)}</div>
                      )}
                    </div>
                  ))}
                  {statusJobs.length === 0 && <div style={{ color: 'var(--muted)', fontSize: '.78rem', textAlign: 'center', padding: '1rem 0' }}>Empty</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setShowModal(false)}>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '2rem', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '1.2rem' }}>{editJob ? 'Edit Application' : 'Add Application'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: '1.3rem', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '.8rem', color: 'var(--muted)', marginBottom: '.3rem' }}>Company *</label>
                  <input required placeholder="Google" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '.8rem', color: 'var(--muted)', marginBottom: '.3rem' }}>Position *</label>
                  <input required placeholder="Frontend Developer" value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '.8rem', color: 'var(--muted)', marginBottom: '.3rem' }}>Location</label>
                  <input placeholder="Bangalore" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '.8rem', color: 'var(--muted)', marginBottom: '.3rem' }}>Salary</label>
                  <input placeholder="8-12 LPA" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '.8rem', color: 'var(--muted)', marginBottom: '.3rem' }}>Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inputStyle}>
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '.8rem', color: 'var(--muted)', marginBottom: '.3rem' }}>Applied Date</label>
                  <input type="date" value={form.appliedDate} onChange={e => setForm({ ...form, appliedDate: e.target.value })} style={inputStyle} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '.8rem', color: 'var(--muted)', marginBottom: '.3rem' }}>🗓 Interview Date</label>
                <input type="date" value={form.interviewDate} onChange={e => setForm({ ...form, interviewDate: e.target.value })} style={{ ...inputStyle, borderColor: form.interviewDate ? 'rgba(0,212,170,0.4)' : 'var(--border)' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '.8rem', color: 'var(--muted)', marginBottom: '.3rem' }}>Job URL</label>
                <input placeholder="https://jobs.google.com/..." value={form.jobUrl} onChange={e => setForm({ ...form, jobUrl: e.target.value })} style={inputStyle} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '.8rem', color: 'var(--muted)', marginBottom: '.3rem' }}>Notes</label>
                <textarea placeholder="Interview notes, contacts, etc..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '.8rem', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--muted)', fontWeight: 500 }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ flex: 1, padding: '.8rem', background: 'var(--accent)', border: 'none', borderRadius: 'var(--radius-sm)', color: '#fff', fontWeight: 600, opacity: saving ? 0.7 : 1 }}>
                  {saving ? 'Saving...' : editJob ? 'Update' : 'Add Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}