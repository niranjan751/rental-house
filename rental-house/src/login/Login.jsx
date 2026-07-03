import { useState } from 'react';
import './Login.css';

/* ── helpers ──────────────────────────────────────── */
const EMAIL_RE = /^\S+@\S+\.\S+$/;

function useField(initial = '') {
  const [value, setValue] = useState(initial);
  const onChange = (e) => setValue(e.target.value);
  return { value, onChange, reset: () => setValue(initial) };
}

/* ── Sub-form: Log In ─────────────────────────────── */
function LoginForm({ onSuccess, onSwitch }) {
  const email    = useField('');
  const password = useField('');
  const [showPw, setShowPw]     = useState(false);
  const [errors, setErrors]     = useState({});
  const [busy, setBusy]         = useState(false);

  const validate = () => {
    const e = {};
    if (!email.value.trim())            e.email    = 'Enter your email address';
    else if (!EMAIL_RE.test(email.value)) e.email  = "That email doesn't look right";
    if (!password.value)                e.password = 'Enter your password';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setBusy(true);
    try {
      await new Promise((r) => setTimeout(r, 900));
      onSuccess({ name: email.value.split('@')[0], email: email.value, avatar: null });
    } finally { setBusy(false); }
  };

  return (
    <form className="login-form" onSubmit={submit} noValidate>
      {/* Email */}
      <div className="field">
        <label htmlFor="li-email">Email address</label>
        <input id="li-email" type="email" autoComplete="email"
          placeholder="you@example.com" {...email}
          aria-invalid={!!errors.email} />
        {errors.email && <span className="field__error">{errors.email}</span>}
      </div>

      {/* Password */}
      <div className="field">
        <div className="field__row">
          <label htmlFor="li-password">Password</label>
          <a href="#forgot" className="field__link">Forgot password?</a>
        </div>
        <div className="field__password">
          <input id="li-password" type={showPw ? 'text' : 'password'}
            autoComplete="current-password" placeholder="Enter your password"
            {...password} aria-invalid={!!errors.password} />
          <button type="button" className="field__toggle"
            onClick={() => setShowPw(s => !s)}
            aria-label={showPw ? 'Hide password' : 'Show password'}>
            {showPw ? 'Hide' : 'Show'}
          </button>
        </div>
        {errors.password && <span className="field__error">{errors.password}</span>}
      </div>

      <button type="submit" className="btn btn-primary login-form__submit" disabled={busy}>
        {busy ? 'Logging in…' : 'Log in'}
      </button>

      <OAuthRow />

      <p className="login-form__footer">
        New to RentalHub?{' '}
        <button type="button" className="auth-link" onClick={onSwitch}>Create an account</button>
      </p>
    </form>
  );
}

/* ── Sub-form: Sign Up ────────────────────────────── */
function SignupForm({ onSuccess, onSwitch }) {
  const name     = useField('');
  const email    = useField('');
  const password = useField('');
  const confirm  = useField('');
  const [showPw, setShowPw]   = useState(false);
  const [errors, setErrors]   = useState({});
  const [busy, setBusy]       = useState(false);

  const validate = () => {
    const e = {};
    if (!name.value.trim())               e.name     = 'Enter your full name';
    if (!email.value.trim())              e.email    = 'Enter your email address';
    else if (!EMAIL_RE.test(email.value)) e.email    = "That email doesn't look right";
    if (password.value.length < 8)        e.password = 'Password must be at least 8 characters';
    if (confirm.value !== password.value) e.confirm  = 'Passwords do not match';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setBusy(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      onSuccess({ name: name.value, email: email.value, avatar: null });
    } finally { setBusy(false); }
  };

  return (
    <form className="login-form" onSubmit={submit} noValidate>
      {/* Full name */}
      <div className="field">
        <label htmlFor="su-name">Full name</label>
        <input id="su-name" type="text" autoComplete="name"
          placeholder="Jane Smith" {...name} aria-invalid={!!errors.name} />
        {errors.name && <span className="field__error">{errors.name}</span>}
      </div>

      {/* Email */}
      <div className="field">
        <label htmlFor="su-email">Email address</label>
        <input id="su-email" type="email" autoComplete="email"
          placeholder="you@example.com" {...email} aria-invalid={!!errors.email} />
        {errors.email && <span className="field__error">{errors.email}</span>}
      </div>

      {/* Password */}
      <div className="field">
        <label htmlFor="su-password">Password</label>
        <div className="field__password">
          <input id="su-password" type={showPw ? 'text' : 'password'}
            autoComplete="new-password" placeholder="At least 8 characters"
            {...password} aria-invalid={!!errors.password} />
          <button type="button" className="field__toggle"
            onClick={() => setShowPw(s => !s)}
            aria-label={showPw ? 'Hide password' : 'Show password'}>
            {showPw ? 'Hide' : 'Show'}
          </button>
        </div>
        {errors.password && <span className="field__error">{errors.password}</span>}
      </div>

      {/* Confirm */}
      <div className="field">
        <label htmlFor="su-confirm">Confirm password</label>
        <input id="su-confirm" type={showPw ? 'text' : 'password'}
          autoComplete="new-password" placeholder="Repeat your password"
          {...confirm} aria-invalid={!!errors.confirm} />
        {errors.confirm && <span className="field__error">{errors.confirm}</span>}
      </div>

      <button type="submit" className="btn btn-primary login-form__submit" disabled={busy}>
        {busy ? 'Creating account…' : 'Create account'}
      </button>

      <OAuthRow label="or sign up with" />

      <p className="login-form__footer">
        Already have an account?{' '}
        <button type="button" className="auth-link" onClick={onSwitch}>Log in</button>
      </p>
    </form>
  );
}

/* ── Shared OAuth row ─────────────────────────────── */
function OAuthRow({ label = 'or continue with' }) {
  return (
    <>
      <div className="divider"><span>{label}</span></div>
      <div className="oauth-row">
        <button type="button" className="oauth-btn">
          <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9C16.66 14.2 17.64 11.9 17.64 9.2z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.55-1.84.87-3.06.87-2.35 0-4.34-1.59-5.05-3.72H.95v2.33A9 9 0 0 0 9 18z"/>
            <path fill="#FBBC05" d="M3.95 10.71a5.4 5.4 0 0 1 0-3.42V4.96H.95a9 9 0 0 0 0 8.08l3-2.33z"/>
            <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.9 11.42 0 9 0A9 9 0 0 0 .95 4.96l3 2.33C4.66 5.17 6.65 3.58 9 3.58z"/>
          </svg>
          Google
        </button>
        <button type="button" className="oauth-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.36 2 11.7c0 4.8 3.66 8.79 8.44 9.53v-6.74H7.9v-2.79h2.54V9.53c0-2.5 1.5-3.89 3.8-3.89 1.1 0 2.24.2 2.24.2v2.44h-1.26c-1.24 0-1.63.77-1.63 1.55v1.86h2.78l-.44 2.79h-2.34V21.2C18.34 20.5 22 16.5 22 11.7 22 6.36 17.52 2 12 2z"/>
          </svg>
          Facebook
        </button>
      </div>
    </>
  );
}

/* ── Main modal ───────────────────────────────────── */
export default function AuthModal({ defaultTab = 'login', onClose, onSuccess }) {
  const [tab, setTab] = useState(defaultTab);

  const handleSuccess = (user) => {
    onSuccess?.(user);
    onClose?.();
  };

  return (
    <div
      className="login-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div className="login-modal" role="dialog" aria-modal="true"
        aria-label={tab === 'login' ? 'Log in' : 'Create account'}>

        <button className="login-modal__close" onClick={onClose} aria-label="Close">✕</button>

        {/* Header */}
        <p className="login-modal__eyebrow">
          {tab === 'login' ? 'Welcome back' : 'Get started'}
        </p>
        <h2 className="login-modal__title">
          {tab === 'login' ? 'Log in to RentalHub' : 'Create your account'}
        </h2>
        <p className="login-modal__subtitle">
          {tab === 'login'
            ? 'Pick up your search, message owners, or manage listings.'
            : 'Join thousands finding their perfect rental home.'}
        </p>

        {/* Tabs */}
        <div className="auth-tabs" role="tablist">
          <button
            role="tab" aria-selected={tab === 'login'}
            className={`auth-tab ${tab === 'login' ? 'auth-tab--active' : ''}`}
            onClick={() => setTab('login')}
          >Log in</button>
          <button
            role="tab" aria-selected={tab === 'signup'}
            className={`auth-tab ${tab === 'signup' ? 'auth-tab--active' : ''}`}
            onClick={() => setTab('signup')}
          >Sign up</button>
        </div>

        {/* Forms */}
        {tab === 'login'
          ? <LoginForm onSuccess={handleSuccess} onSwitch={() => setTab('signup')} />
          : <SignupForm onSuccess={handleSuccess} onSwitch={() => setTab('login')} />
        }
      </div>
    </div>
  );
}