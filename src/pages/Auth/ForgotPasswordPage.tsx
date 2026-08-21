import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import authApi from '../../api/authApi';
import { ROUTES } from '../../constants/routes';
import toast from 'react-hot-toast';
import { normalizeEmail, validateEmail } from '../../utils/authValidation';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailErr = validateEmail(email);
    if (emailErr) {
      setError(emailErr);
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await authApi.forgotPassword(normalizeEmail(email));
      setSent(true);
      toast.success(res.message);
    } catch {
      // interceptor — still show generic success UX if needed
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="auth-title">Quên mật khẩu</h2>
      <p className="auth-subtitle">Nhập email đã đăng ký — chúng tôi sẽ gửi liên kết đặt lại mật khẩu.</p>

      {sent ? (
        <div>
          <p style={{ marginBottom: 16 }}>
            Nếu email đã được đăng ký, chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu. Kiểm tra hộp thư (và spam).
          </p>
          <Link to={ROUTES.LOGIN} className="btn btn-primary" style={{ display: 'inline-flex' }}>
            Về đăng nhập
          </Link>
        </div>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className={`input-wrap${error ? ' input-error' : ''}`}>
            <label className="input-label" htmlFor="forgot-email">Email</label>
            <input
              id="forgot-email"
              type="email"
              className="input-field"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            {error && <span className="input-message">{error}</span>}
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            <Mail size={16} /> {loading ? 'Đang gửi...' : 'Gửi liên kết'}
          </button>
        </form>
      )}

      <p className="auth-footer-text">
        <Link to={ROUTES.LOGIN}>Quay lại đăng nhập</Link>
      </p>
    </div>
  );
};

export default ForgotPasswordPage;
