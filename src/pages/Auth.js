// src/pages/Auth.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function Field({ label, type, value, onChange, required }) {
  const [show, setShow] = useState(false);
  const isPw = type === 'password';
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'block', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, marginBottom: 8, color: '#555' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          type={isPw ? (show ? 'text' : 'password') : type}
          value={value} onChange={onChange} required={required}
          style={{ width: '100%', padding: '12px 0', border: 'none', borderBottom: '1px solid #ddd', fontSize: 15, outline: 'none', background: 'transparent', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
          onFocus={e => e.target.style.borderColor = '#ea580c'}
          onBlur={e => e.target.style.borderColor = '#ddd'}
        />
        {isPw && (
          <button type="button" onClick={() => setShow(v => !v)} style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: 12 }}>
            {show ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
    </div>
  );
}

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message?.replace('Firebase: ', '').replace(' (auth/invalid-credential).', '') || 'Login failed');
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', paddingTop: 100 }}>
      {/* Left image */}
      <div style={{ flex: 1, display: 'none' }} className="auth-img">
        <img src="https://image2url.com/r2/default/images/1772108965783-9e677225-571d-45e0-9d01-2e70956814e8.png" alt="Fashion" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      {/* Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <Link to="/" style={{ display: 'block', textAlign: 'center', marginBottom: 40 }}>
  <img
    src="https://image2url.com/r2/default/images/1772109924175-5a2755bb-6b62-47a1-a099-1d1485a20018.png"
    alt="Debit"
    style={{ height: 76, width: 'auto', objectFit: 'contain' }}
  />
</Link>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, textAlign: 'center', marginBottom: 8 }}>Sign In</h1>
          <p style={{ textAlign: 'center', color: '#888', fontSize: 13, marginBottom: 40 }}>Welcome back to Debit</p>
          <form onSubmit={handleSubmit}>
            <Field label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            <Field label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '15px', background: loading ? '#888' : '#ea580c',
              color: '#fff', border: 'none', fontSize: 11, letterSpacing: 3,
              textTransform: 'uppercase', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: 8, transition: 'background 0.2s',
            }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#16a34a'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#ea580c'; }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 28, color: '#888', fontSize: 13 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#111', fontWeight: 600, borderBottom: '1px solid #111' }}>Create one</Link>
          </p>
        </div>
      </div>
      <style>{`@media (min-width: 900px) { .auth-img { display: block !important; } }`}</style>
    </div>
  );
}

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirm) { toast.error('Passwords do not match'); return; }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(email, password, name);
      toast.success('Account created! Welcome to Debit.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message?.replace('Firebase: ', '') || 'Registration failed');
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', paddingTop: 100 }}>
      <div style={{ flex: 1, display: 'none' }} className="auth-img">
        <img src="https://image2url.com/r2/default/images/1772109203982-8d63f574-aa69-41cf-866d-5227d1cebb14.jpeg" alt="Fashion" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
<Link to="/" style={{ display: 'block', textAlign: 'center', marginBottom: 40 }}>
  <img
    src="https://image2url.com/r2/default/images/1772109924175-5a2755bb-6b62-47a1-a099-1d1485a20018.png"
    alt="Debit"
    style={{ height: 76, width: 'auto', objectFit: 'contain' }}
  />
</Link>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, textAlign: 'center', marginBottom: 8 }}>Create Account</h1>
          <p style={{ textAlign: 'center', color: '#888', fontSize: 13, marginBottom: 40 }}>Join the Debit family</p>
          <form onSubmit={handleSubmit}>
            <Field label="Full Name" type="text" value={name} onChange={e => setName(e.target.value)} required />
            <Field label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            <Field label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            <Field label="Confirm Password" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '15px', background: loading ? '#888' : '#ea580c',
              color: '#fff', border: 'none', fontSize: 11, letterSpacing: 3,
              textTransform: 'uppercase', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: 8, transition: 'background 0.2s',
            }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#16a34a'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#ea580c'; }}
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 28, color: '#888', fontSize: 13 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#111', fontWeight: 600, borderBottom: '1px solid #111' }}>Sign in</Link>
          </p>
        </div>
      </div>
      <style>{`@media (min-width: 900px) { .auth-img { display: block !important; } }`}</style>
    </div>
  );
}