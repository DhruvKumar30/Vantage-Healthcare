import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, register } = useAuth();
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [key, setKey] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      if (tab === 'login') {
        login(email, password);
      } else {
        register(email, password, key);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: 6,
    border: '1px solid #d0d5dd', fontSize: 14, marginBottom: 14,
    boxSizing: 'border-box', outline: 'none',
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#f4f6fb',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
        padding: '40px 36px', width: 380,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e' }}>Vantage Healthcare</div>
          <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>Cancer Immunology Dashboard</div>
        </div>

        <div style={{ display: 'flex', marginBottom: 24, borderBottom: '2px solid #eee' }}>
          {['login', 'register'].map(t => (
            <button key={t} onClick={() => { setTab(t); setError(''); }}
              style={{
                flex: 1, padding: '10px 0', border: 'none', background: 'none',
                fontWeight: tab === t ? 700 : 400, fontSize: 14, cursor: 'pointer',
                color: tab === t ? '#1A7A6E' : '#888',
                borderBottom: tab === t ? '2px solid #1A7A6E' : '2px solid transparent',
                marginBottom: -2,
              }}>
              {t === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#444', marginBottom: 4 }}>Email</div>
          <input style={inputStyle} type="email" required placeholder="you@example.com"
            value={email} onChange={e => setEmail(e.target.value)} />

          <div style={{ fontSize: 12, fontWeight: 600, color: '#444', marginBottom: 4 }}>Password</div>
          <input style={inputStyle} type="password" required placeholder="••••••••"
            value={password} onChange={e => setPassword(e.target.value)} />

          {tab === 'register' && (
            <>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#444', marginBottom: 4 }}>Registration Key</div>
              <input style={inputStyle} type="text" required placeholder="e.g. DRMC-X7K2-PALM"
                value={key} onChange={e => setKey(e.target.value)} />
            </>
          )}

          {error && (
            <div style={{ color: '#c62828', fontSize: 13, marginBottom: 12, padding: '8px 12px', background: '#fdecea', borderRadius: 6 }}>
              {error}
            </div>
          )}

          <button type="submit" style={{
            width: '100%', padding: '11px 0', background: '#1A7A6E', color: '#fff',
            border: 'none', borderRadius: 7, fontSize: 15, fontWeight: 600, cursor: 'pointer',
            marginTop: 4,
          }}>
            {tab === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}