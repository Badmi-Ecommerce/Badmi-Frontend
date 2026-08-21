import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { ROUTES } from '../../constants/routes';
import GoogleSignInButton from '../../components/auth/GoogleSignInButton';
import PasswordField from '../../components/auth/PasswordField';
import authApi from '../../api/authApi';
import toast from 'react-hot-toast';
import { normalizeEmail, validateEmail } from '../../utils/authValidation';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const loginState = (location.state as { registeredEmail?: string; verifyUrl?: string } | null) ?? {};
  const registeredEmail = loginState.registeredEmail;

  const [email, setEmail] = useState(registeredEmail ?? '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [needsVerify, setNeedsVerify] = useState(Boolean(registeredEmail));
  const [verifyUrl, setVerifyUrl] = useState(loginState.verifyUrl ?? '');

  const validate = () => {
    const errs: Record<string, string> = {};
    const emailErr = validateEmail(email);
    if (emailErr) errs.email = emailErr;
    if (!password) errs.password = 'Vui lòng nhập mật khẩu';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setNeedsVerify(false);
    setLoading(true);
    try {
      await login({ email: normalizeEmail(email), password });
      navigate(ROUTES.HOME);
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number; data?: { message?: string } } })?.response?.status;
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? '';
      if (status === 403 || /xác thực/i.test(msg)) {
        setNeedsVerify(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    const emailErr = validateEmail(email);
    if (emailErr) {
      toast.error(emailErr);
      return;
    }
    try {
      const res = await authApi.resendVerification(normalizeEmail(email));
      if (res.verifyUrl) setVerifyUrl(res.verifyUrl);
      toast.success(res.message);
    } catch {
      // interceptor
    }
  };

  return (
    <div>
      <h2 className="auth-title">Đăng nhập</h2>
      <p className="auth-subtitle">Chào mừng trở lại! Đăng nhập để tiếp tục.</p>

      {registeredEmail && (
        <div className="auth-banner-success">
          Đã tạo tài khoản cho <strong>{registeredEmail}</strong>. Kiểm tra hộp thư (và Spam) rồi nhấn
          <strong> Xác thực email</strong>. Sau khi thành công, quay lại đây để đăng nhập.
          {verifyUrl && (
            <div style={{ marginTop: 12 }}>
              <a href={verifyUrl} className="btn btn-primary" style={{ display: 'inline-flex' }}>
                Mở trang xác thực
              </a>
              <p style={{ margin: '8px 0 0', fontSize: '0.8rem' }}>
                Nếu Gmail chưa tới, dùng nút trên (SMTP chưa cấu hình trên máy local).
              </p>
            </div>
          )}
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className={`input-wrap${errors.email ? ' input-error' : ''}`}>
          <label className="input-label" htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            className="input-field"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          {errors.email && <span className="input-message">{errors.email}</span>}
        </div>

        <PasswordField
          id="login-password"
          label="Mật khẩu"
          value={password}
          error={errors.password}
          autoComplete="current-password"
          onChange={setPassword}
        />

        <div style={{ textAlign: 'right', marginTop: -8 }}>
          <Link to={ROUTES.FORGOT_PASSWORD} style={{ fontSize: '0.875rem', fontWeight: 600 }}>
            Quên mật khẩu?
          </Link>
        </div>

        {needsVerify && (
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            Email chưa xác thực.{' '}
            <button type="button" onClick={() => void handleResend()} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer', padding: 0 }}>
              Gửi lại email xác thực
            </button>
            {verifyUrl && (
              <>
                {' · '}
                <a href={verifyUrl} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                  Mở trang xác thực
                </a>
              </>
            )}
          </p>
        )}

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
          <LogIn size={16} /> {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>

      <div className="auth-divider"><span>hoặc</span></div>
      <GoogleSignInButton />

      <p className="auth-footer-text">
        Chưa có tài khoản? <Link to={ROUTES.REGISTER}>Đăng ký ngay</Link>
      </p>
    </div>
  );
};

export default LoginPage;
