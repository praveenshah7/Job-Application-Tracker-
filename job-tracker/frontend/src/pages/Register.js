import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/register', form);
      login(res.data.token, res.data.user);
      toast.success('Account created!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  const inputStyle = { width: '100%', padding: '.75rem 1rem', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: '.9rem', outline: 'none', transition: 'border-color 0.2s' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '2rem', color: 'var(--accent)', marginBottom: '.5rem' }}>JobTracker</div>
          <div style={{ color: 'var(--muted)', fontSize: '.9rem' }}>Start tracking your applications</div>
        </div>

        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '2rem' }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '1.3rem', marginBottom: '1.5rem' }}>Create Account</h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Praveen Shah' },
              { label: 'Email', key: 'email', type: 'email', placeholder: 'praveen@gmail.com' },
              { label: 'Password', key: 'password', type: 'password', placeholder: '••••••••' },
            ].map(field => (
              <div key={field.key}>
                <label style={{ display: 'block', fontSize: '.82rem', color: 'var(--muted)', marginBottom: '.4rem', fontWeight: 500 }}>{field.label}</label>
                <input type={field.type} placeholder={field.placeholder} value={form[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })} required
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
            ))}
            <button type="submit" disabled={loading}
              style={{ padding: '.85rem', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '.95rem', fontWeight: 600, opacity: loading ? 0.7 : 1, marginTop: '.5rem' }}>
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--muted)', fontSize: '.85rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 500 }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
