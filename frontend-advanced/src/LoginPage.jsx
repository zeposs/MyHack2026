import { useState } from 'react';
import { BrainCircuit, ShieldCheck } from 'lucide-react';
import { login } from './api';

const DEMO_ACCOUNTS = [
  { role: 'Admin',   name: 'Siti Rahimah',  email: 'admin@cradle.com.my',       password: 'admin1234',   accent: 'teal'   },
  { role: 'Founder', name: 'Ali Hassan',     email: 'ali@foodtech.my',           password: 'founder1234', accent: 'amber'  },
  { role: 'Mentor',  name: 'Priya Nair',     email: 'priya@nexusventures.my',    password: 'mentor1234',  accent: 'violet' },
  { role: 'Mentor',  name: 'Farid Rahman',   email: 'farid@growthpartners.my',   password: 'mentor1234',  accent: 'violet' },
  { role: 'Mentor',  name: 'Kevin Tan',      email: 'kevin@deeptechlab.my',      password: 'mentor1234',  accent: 'violet' },
];

function initials(name) {
  return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
}

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function doLogin(em, pw) {
    setLoading(true);
    setError('');
    try {
      const user = await login(em, pw);
      onLogin(user);
    } catch (err) {
      setError(err.message || 'Login failed. Check credentials and try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    doLogin(email, password);
  }

  function quickLogin(account) {
    setEmail(account.email);
    setPassword(account.password);
    doLogin(account.email, account.password);
  }

  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="brand-lockup">
          <div className="brand-mark">SC</div>
          <div>
            <p className="eyebrow">Cradle ecosystem command centre</p>
            <h1>StarsConnector</h1>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="field-stack">
            <label className="login-label">
              <span>Email</span>
              <input
                className="login-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </label>
            <label className="login-label">
              <span>Password</span>
              <input
                className="login-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </label>
          </div>

          {error && <p className="login-error">{error}</p>}

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? <BrainCircuit size={18} className="spin" /> : <ShieldCheck size={18} />}
            <span>{loading ? 'Signing in…' : 'Sign in'}</span>
          </button>
        </form>

        <div className="login-divider">Quick login</div>

        <div className="login-accounts">
          {DEMO_ACCOUNTS.map((account) => (
            <button
              key={account.email}
              className="login-account-btn"
              onClick={() => quickLogin(account)}
              disabled={loading}
              type="button"
            >
              <div className={`account-avatar ${account.accent}`}>{initials(account.name)}</div>
              <div className="account-info">
                <strong>{account.name}</strong>
                <span>{account.email}</span>
              </div>
              <span className="account-role">{account.role}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
