import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { ROUTES } from '../../constants/routes';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate   = useNavigate();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [errors,   setErrors]   = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!email)              errs.email    = 'Email không được để trống.';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Email không hợp lệ.';
    if (!password)           errs.password = 'Mật khẩu không được để trống.';
    else if (password.length < 6) errs.password = 'Mật khẩu ít nhất 6 ký tự.';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('Form submitted!');
    e.preventDefault();
    console.log('Validation starting...');
    const errs = validate();
    console.log('Validation errors:', errs);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    console.log('Starting login process...');
    try {
      console.log('Calling login...');
      await login({ email, password });
      console.log('Login completed, navigating to:', ROUTES.HOME);
      navigate(ROUTES.HOME);
    } catch (error) {
      console.error('Login failed:', error);
      // Error handled by axios interceptor + react-hot-toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="auth-title">Đăng nhập</h2>
      <p className="auth-subtitle">Chào mừng trở lại! Đăng nhập để tiếp tục.</p>

      {/* Test button */}
      <button onClick={() => console.log('Test button clicked!')} style={{ marginBottom: 10, padding: 5, background: 'red', color: 'white' }}>
        Test Console
      </button>

      <form className="auth-form" onSubmit={handleSubmit}>
        {/* Email */}
        <div className={`input-wrap${errors.email ? ' input-error' : ''}`}>
          <label className="input-label">Email</label>
          <input
            id="login-email"
            type="email"
            className="input-field"
            placeholder="email@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
          />
          {errors.email && <span className="input-message">{errors.email}</span>}
        </div>

        {/* Password */}
        <div className={`input-wrap${errors.password ? ' input-error' : ''}`}>
          <label className="input-label">Mật khẩu</label>
          <div style={{ position: 'relative' }}>
            <input
              id="login-password"
              type={showPw ? 'text' : 'password'}
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              style={{ paddingRight: 44 }}
            />
            <button
              type="button"
              onClick={() => setShowPw(s => !s)}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
            >
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <span className="input-message">{errors.password}</span>}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <a href="#" style={{ fontSize: '0.875rem', color: 'var(--color-primary)', fontWeight: 600 }}>Quên mật khẩu?</a>
        </div>

        <button
          id="login-submit"
          type="submit"
          className="btn btn-primary btn-full btn-lg"
          disabled={loading}
        >
          {loading ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 3 }} /> : <><LogIn size={18} /> Đăng nhập</>}
        </button>
      </form>

      <p className="auth-footer-text">
        Chưa có tài khoản?{' '}
        <Link to={ROUTES.REGISTER}>Đăng ký ngay</Link>
      </p>
    </div>
  );
};

export default LoginPage;
