import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PageTitle from '../components/PageTitle';

const StudentRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState(false);
  const [showPass, setShowPass]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const validate = () => {
    if (!formData.name.trim())           return 'Full name is required.';
    if (!formData.email.trim())          return 'Email address is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
                                         return 'Please enter a valid email address.';
    if (formData.password.length < 6)   return 'Password must be at least 6 characters.';
    if (formData.password !== formData.confirmPassword)
                                         return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
    setError('');
    try {
      await axios.post('/auth/register', {
        name:     formData.name.trim(),
        email:    formData.email.trim().toLowerCase(),
        password: formData.password,
        phone:    formData.phone.trim() || undefined,
        role:     'student',
      });
      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  /* ─── Strength meter ─── */
  const getStrength = (pw) => {
    let s = 0;
    if (pw.length >= 6)  s++;
    if (pw.length >= 10) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };
  const strength = getStrength(formData.password);
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strength];
  const strengthColor = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'][strength];

  /* ════════════════════ SUCCESS POPUP WILL RENDER AT THE END ════════════════════ */
  return (
    <div style={styles.page}>
      <PageTitle title="Student Registration – IftiinHub" />

      <div style={styles.container}>
        {/* Left panel */}
        <div style={styles.leftPanel}>
          <div style={styles.leftContent}>
            <div style={styles.leftLogo}>🎓</div>
            <h2 style={styles.leftTitle}>Join IftiinHub Today</h2>
            <p style={styles.leftSub}>
              Create your free student account and unlock a world of high-quality courses.
            </p>
            <ul style={styles.featureList}>
              {[
                ['📚', 'Access all available courses'],
                ['🎥', 'Watch HD video lessons'],
                ['📊', 'Track your learning progress'],
                ['🏆', 'Earn completion certificates'],
                ['💬', 'Community support & Q&A'],
              ].map(([icon, text]) => (
                <li key={text} style={styles.featureItem}>
                  <span style={styles.featureIcon}>{icon}</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <p style={styles.leftLogin}>
              Already have an account?{' '}
              <Link to="/login" style={styles.leftLoginLink}>Log in →</Link>
            </p>
          </div>
        </div>

        {/* Right panel – form */}
        <div style={styles.rightPanel}>
          <div style={styles.formCard}>
            <div style={styles.formHeader}>
              <h1 style={styles.formTitle}>Create Student Account</h1>
              <p style={styles.formSub}>Fill in your details to get started for free</p>
            </div>

            {error && (
              <div style={styles.errorBanner}>
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form} noValidate>

              {/* Full Name */}
              <div style={styles.fieldGroup}>
                <label style={styles.label} htmlFor="sr-name">Full Name <span style={styles.req}>*</span></label>
                <div style={styles.inputWrap}>
                  <span style={styles.inputIcon}>👤</span>
                  <input
                    id="sr-name"
                    name="name"
                    type="text"
                    placeholder="e.g. Abdullahi Hassan"
                    value={formData.name}
                    onChange={handleChange}
                    style={styles.input}
                    autoComplete="name"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div style={styles.fieldGroup}>
                <label style={styles.label} htmlFor="sr-email">Email Address <span style={styles.req}>*</span></label>
                <div style={styles.inputWrap}>
                  <span style={styles.inputIcon}>✉️</span>
                  <input
                    id="sr-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    style={styles.input}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Phone (optional) */}
              <div style={styles.fieldGroup}>
                <label style={styles.label} htmlFor="sr-phone">
                  Phone / WhatsApp <span style={styles.optional}>(optional)</span>
                </label>
                <div style={styles.inputWrap}>
                  <span style={styles.inputIcon}>📱</span>
                  <input
                    id="sr-phone"
                    name="phone"
                    type="tel"
                    placeholder="+252 61 000 0000"
                    value={formData.phone}
                    onChange={handleChange}
                    style={styles.input}
                    autoComplete="tel"
                  />
                </div>
              </div>

              {/* Password */}
              <div style={styles.fieldGroup}>
                <label style={styles.label} htmlFor="sr-password">Password <span style={styles.req}>*</span></label>
                <div style={styles.inputWrap}>
                  <span style={styles.inputIcon}>🔒</span>
                  <input
                    id="sr-password"
                    name="password"
                    type={showPass ? 'text' : 'password'}
                    placeholder="Min. 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    style={{ ...styles.input, paddingRight: '44px' }}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(p => !p)}
                    style={styles.eyeBtn}
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                  >
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
                {/* Strength bar */}
                {formData.password && (
                  <div style={styles.strengthWrap}>
                    <div style={styles.strengthTrack}>
                      {[1,2,3,4,5].map(i => (
                        <div key={i} style={{
                          ...styles.strengthSeg,
                          background: i <= strength ? strengthColor : '#e5e7eb',
                        }} />
                      ))}
                    </div>
                    <span style={{ ...styles.strengthLabel, color: strengthColor }}>
                      {strengthLabel}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div style={styles.fieldGroup}>
                <label style={styles.label} htmlFor="sr-confirm">Confirm Password <span style={styles.req}>*</span></label>
                <div style={styles.inputWrap}>
                  <span style={styles.inputIcon}>🔐</span>
                  <input
                    id="sr-confirm"
                    name="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    style={{ ...styles.input, paddingRight: '44px' }}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(p => !p)}
                    style={styles.eyeBtn}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? '🙈' : '👁️'}
                  </button>
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <span style={styles.matchTick}>✅</span>
                  )}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{ ...styles.submitBtn, opacity: loading ? 0.75 : 1, cursor: loading ? 'wait' : 'pointer' }}
                id="sr-submit"
              >
                {loading ? (
                  <span style={styles.spinnerWrap}>
                    <span style={styles.spinner} /> Creating account…
                  </span>
                ) : (
                  '🎓 Create My Student Account'
                )}
              </button>

              <p style={styles.terms}>
                By registering you agree to our{' '}
                <Link to="/about" style={styles.termsLink}>Terms of Service</Link> and{' '}
                <Link to="/about" style={styles.termsLink}>Privacy Policy</Link>.
              </p>
            </form>

            <div style={styles.loginPrompt}>
              Already have an account?{' '}
              <Link to="/login" style={styles.loginLink}>Sign in →</Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }
        .sr-input:focus { outline: none; border-color: #7c3aed !important; box-shadow: 0 0 0 3px rgba(124,58,237,0.12) !important; }
        .sr-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(124,58,237,0.4) !important; }
      `}</style>
      
      {/* SUCCESS MODAL POPUP */}
      {success && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.6)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: '#fff', borderRadius: '16px', padding: '40px', maxWidth: '440px', 
            width: '100%', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', marginBottom: '12px', fontFamily: "'Inter', sans-serif" }}>Registration Pending</h2>
            <p style={{ fontSize: '15px', color: '#4b5563', marginBottom: '28px', lineHeight: 1.6, fontFamily: "'Inter', sans-serif" }}>
              Your student account has been successfully created! However, an <strong>Admin must approve your registration</strong> before you can log in. Please wait for authorization.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                onClick={() => navigate('/')} 
                style={{
                  ...styles.btnOutline, flex: 1, textAlign: 'center', border: '1.5px solid #e5e7eb',
                  color: '#374151', background: '#fff', padding: '12px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer'
                }}>
                Go to Home
              </button>
              <Link to="/login" style={{...styles.btnPrimary, flex: 1, textAlign: 'center', textDecoration: 'none', background: '#4f46e5', color: '#fff', padding: '12px', borderRadius: '12px', fontWeight: 'bold'}}>
                🔑 Log In
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Styles ─── */
const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 40%, #faf5ff 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 16px',
    fontFamily: "'Inter', sans-serif",
  },

  /* Success */
  successWrap: {
    background: '#fff',
    borderRadius: '24px',
    padding: '60px 48px',
    textAlign: 'center',
    maxWidth: '480px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(124,58,237,0.12)',
    animation: 'fadeUp 0.5s ease',
  },
  successIcon:  { fontSize: '4rem', marginBottom: '16px' },
  successTitle: { fontSize: '2rem', fontWeight: 800, color: '#1e1b4b', margin: '0 0 12px' },
  successSub:   { color: '#6b7280', fontSize: '1rem', lineHeight: 1.6, margin: '0 0 32px' },
  successBtns:  { display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' },
  btnPrimary: {
    background: 'linear-gradient(135deg,#7c3aed,#9333ea)',
    color: '#fff',
    padding: '12px 28px',
    borderRadius: '999px',
    textDecoration: 'none',
    fontWeight: 700,
    fontSize: '0.95rem',
    boxShadow: '0 4px 14px rgba(124,58,237,0.3)',
  },
  btnOutline: {
    border: '2px solid #7c3aed',
    color: '#7c3aed',
    padding: '12px 28px',
    borderRadius: '999px',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '0.95rem',
    background: 'transparent',
  },

  /* Layout */
  container: {
    display: 'flex',
    maxWidth: '1000px',
    width: '100%',
    boxShadow: '0 24px 80px rgba(124,58,237,0.13)',
    borderRadius: '24px',
    overflow: 'hidden',
    animation: 'fadeUp 0.4s ease',
  },

  /* Left panel */
  leftPanel: {
    background: 'linear-gradient(160deg,#4c1d95 0%,#7c3aed 60%,#a855f7 100%)',
    padding: '48px 40px',
    flex: '0 0 360px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  leftContent: { color: '#fff' },
  leftLogo:    { fontSize: '3rem', marginBottom: '20px' },
  leftTitle:   { fontSize: '1.6rem', fontWeight: 800, margin: '0 0 12px', lineHeight: 1.2 },
  leftSub:     { fontSize: '0.9rem', opacity: 0.82, margin: '0 0 28px', lineHeight: 1.6 },
  featureList: { listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: '12px' },
  featureItem: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', opacity: 0.92 },
  featureIcon: { fontSize: '1.1rem', width: '24px', textAlign: 'center', flexShrink: 0 },
  leftLogin:   { fontSize: '0.85rem', opacity: 0.78 },
  leftLoginLink: { color: '#e9d5ff', fontWeight: 600, textDecoration: 'none' },

  /* Right panel */
  rightPanel: {
    background: '#fff',
    flex: 1,
    padding: '48px 40px',
    overflowY: 'auto',
  },
  formCard: { maxWidth: '440px', margin: '0 auto' },
  formHeader: { marginBottom: '28px' },
  formTitle:  { fontSize: '1.6rem', fontWeight: 800, color: '#1e1b4b', margin: '0 0 6px' },
  formSub:    { color: '#6b7280', fontSize: '0.875rem', margin: 0 },

  errorBanner: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    padding: '12px 16px',
    borderRadius: '10px',
    fontSize: '0.875rem',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  form:       { display: 'flex', flexDirection: 'column', gap: '18px' },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label:      { fontSize: '0.83rem', fontWeight: 600, color: '#374151' },
  req:        { color: '#ef4444' },
  optional:   { color: '#9ca3af', fontWeight: 400 },

  inputWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    fontSize: '1rem',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '11px 12px 11px 40px',
    border: '1.5px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '0.9rem',
    color: '#111827',
    background: '#fafafa',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    outline: 'none',
    boxSizing: 'border-box',
  },
  eyeBtn: {
    position: 'absolute',
    right: '10px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    padding: '4px',
    lineHeight: 1,
    minHeight: 'unset',
  },
  matchTick: { position: 'absolute', right: '36px', fontSize: '0.9rem' },

  strengthWrap:  { display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' },
  strengthTrack: { display: 'flex', gap: '4px', flex: 1 },
  strengthSeg:   { height: '4px', flex: 1, borderRadius: '99px', transition: 'background 0.3s' },
  strengthLabel: { fontSize: '0.75rem', fontWeight: 600, minWidth: '70px', textAlign: 'right' },

  submitBtn: {
    background: 'linear-gradient(135deg,#7c3aed,#9333ea)',
    color: '#fff',
    padding: '14px',
    borderRadius: '12px',
    border: 'none',
    fontWeight: 700,
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.22s',
    boxShadow: '0 4px 14px rgba(124,58,237,0.3)',
    marginTop: '4px',
  },
  spinnerWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' },
  spinner: {
    display: 'inline-block',
    width: '16px',
    height: '16px',
    border: '2.5px solid rgba(255,255,255,0.4)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },

  terms:     { textAlign: 'center', fontSize: '0.78rem', color: '#9ca3af', margin: '4px 0 0' },
  termsLink: { color: '#7c3aed', textDecoration: 'none', fontWeight: 500 },

  loginPrompt: {
    textAlign: 'center',
    marginTop: '24px',
    fontSize: '0.875rem',
    color: '#6b7280',
    borderTop: '1px solid #f3f4f6',
    paddingTop: '20px',
  },
  loginLink: { color: '#7c3aed', fontWeight: 700, textDecoration: 'none' },
};

export default StudentRegister;
