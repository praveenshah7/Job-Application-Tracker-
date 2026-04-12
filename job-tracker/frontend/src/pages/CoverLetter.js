/* eslint-disable */
import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Icons = {
  sparkle: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>,
  copy: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>,
  download: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  refresh: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>,
  briefcase: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
};

export default function CoverLetter() {
  const [form, setForm] = useState({
    jobTitle: '',
    company: '',
    jobDescription: '',
    skills: 'React JS, Node.js, MongoDB, Python, JavaScript, Tailwind CSS',
  });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!form.jobTitle || !form.company) {
      toast.error('Job title and company are required!');
      return;
    }
    setLoading(true);
    setResult('');
    try {
      const res = await axios.post('/api/ai/cover-letter', form);
      setResult(res.data.coverLetter);
      toast.success('Cover letter generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate. Check your API key.');
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cover-letter-${form.company}-${form.jobTitle}.txt`.replace(/\s+/g, '-');
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded!');
  };

  const inputStyle = {
    width: '100%', padding: '.75rem 1rem',
    background: 'var(--bg3)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)', color: 'var(--text)',
    fontSize: '.88rem', outline: 'none', fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem', marginBottom: '.4rem' }}>
          <div style={{ color: 'var(--accent)' }}>{Icons.sparkle}</div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.8rem' }}>
            AI Cover Letter Generator
          </h1>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '.9rem' }}>
          Generate a personalized cover letter in seconds using AI
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: '2rem', alignItems: 'start' }}>

        {/* Form */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '2rem' }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            {Icons.briefcase} Job Details
          </h2>

          <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '.8rem', color: 'var(--muted)', marginBottom: '.4rem', fontWeight: 500 }}>Job Title *</label>
                <input
                  placeholder="Frontend Developer"
                  value={form.jobTitle}
                  onChange={e => setForm({ ...form, jobTitle: e.target.value })}
                  required style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '.8rem', color: 'var(--muted)', marginBottom: '.4rem', fontWeight: 500 }}>Company *</label>
                <input
                  placeholder="Google"
                  value={form.company}
                  onChange={e => setForm({ ...form, company: e.target.value })}
                  required style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '.8rem', color: 'var(--muted)', marginBottom: '.4rem', fontWeight: 500 }}>
                Job Description
                <span style={{ color: 'var(--muted)', fontWeight: 400, marginLeft: '.3rem' }}>(paste for better results)</span>
              </label>
              <textarea
                placeholder="Paste the job description here for a more personalized cover letter..."
                value={form.jobDescription}
                onChange={e => setForm({ ...form, jobDescription: e.target.value })}
                rows={5} style={{ ...inputStyle, resize: 'vertical' }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '.8rem', color: 'var(--muted)', marginBottom: '.4rem', fontWeight: 500 }}>Your Skills</label>
              <input
                value={form.skills}
                onChange={e => setForm({ ...form, skills: e.target.value })}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
              <div style={{ fontSize: '.73rem', color: 'var(--muted)', marginTop: '.3rem' }}>Comma separated — edit to match your actual skills</div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '.9rem', background: loading ? 'var(--bg4)' : 'var(--accent)',
                color: loading ? 'var(--muted)' : '#fff',
                border: 'none', borderRadius: 'var(--radius-sm)',
                fontWeight: 700, fontSize: '.95rem', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.6rem',
                cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
              }}
            >
              {loading ? (
                <>
                  <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Generating...
                </>
              ) : (
                <>{Icons.sparkle} Generate Cover Letter</>
              )}
            </button>
          </form>
        </div>

        {/* Result */}
        {result && (
          <div style={{ background: 'var(--bg2)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 'var(--radius)', padding: '2rem', position: 'sticky', top: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '.8rem' }}>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '1.1rem', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                {Icons.sparkle} Generated Cover Letter
              </h2>
              <div style={{ display: 'flex', gap: '.6rem' }}>
                <button
                  onClick={handleGenerate}
                  style={{ display: 'flex', alignItems: 'center', gap: '.4rem', padding: '.5rem .9rem', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--muted)', fontSize: '.78rem', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  {Icons.refresh} Regenerate
                </button>
                <button
                  onClick={handleCopy}
                  style={{ display: 'flex', alignItems: 'center', gap: '.4rem', padding: '.5rem .9rem', background: copied ? 'rgba(46,213,115,0.1)' : 'var(--bg3)', border: `1px solid ${copied ? 'rgba(46,213,115,0.3)' : 'var(--border)'}`, borderRadius: 'var(--radius-sm)', color: copied ? '#2ed573' : 'var(--muted)', fontSize: '.78rem', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  {Icons.copy} {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={handleDownload}
                  style={{ display: 'flex', alignItems: 'center', gap: '.4rem', padding: '.5rem .9rem', background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.25)', borderRadius: 'var(--radius-sm)', color: 'var(--accent)', fontSize: '.78rem', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  {Icons.download} Download
                </button>
              </div>
            </div>

            <div style={{ background: 'var(--bg3)', borderRadius: 'var(--radius-sm)', padding: '1.5rem', maxHeight: '520px', overflowY: 'auto', border: '1px solid var(--border)' }}>
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: "'Inter', sans-serif", fontSize: '.88rem', lineHeight: 1.8, color: 'var(--text)', margin: 0 }}>
                {result}
              </pre>
            </div>

            <div style={{ marginTop: '1rem', padding: '.8rem 1rem', background: 'rgba(108,99,255,0.06)', border: '1px solid rgba(108,99,255,0.15)', borderRadius: 'var(--radius-sm)', fontSize: '.78rem', color: 'var(--muted)', lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--accent)', display: 'block', marginBottom: '.3rem' }}>Pro tip:</strong>
              Review and personalize before sending. Add specific achievements and numbers where possible.
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media(max-width:900px) {
          #cover-letter-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}