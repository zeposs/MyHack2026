import { useState } from 'react';
import { BrainCircuit, ShieldCheck } from 'lucide-react';
import { login } from './api';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('admin@cradle.com.my');
  const [password, setPassword] = useState('admin1234');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(email, password);
      onLogin(user);
    } catch (err) {
      setError(err.message || 'Login failed. Check credentials and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="brand-lockup">
          <div className="brand-mark">SC</div>
          <div>
            <p className="eyebrow">Cradle ecosystem command centre</p>
            <h1>StartConnector</h1>
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
            {loading ? <BrainCircuit size={18} /> : <ShieldCheck size={18} />}
            <span>{loading ? 'Signing in…' : 'Sign in to Cradle'}</span>
          </button>
        </form>

        <p className="login-hint">
          Demo · admin@cradle.com.my / admin1234
        </p>
      </div>
    </div>
  );
}
