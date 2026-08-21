import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, CircleAlert, Loader2, LogIn } from 'lucide-react';
import authApi from '../../api/authApi';
import { ROUTES } from '../../constants/routes';

const VerifyEmailPage = () => {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>(token ? 'loading' : 'error');
  const [message, setMessage] = useState(
    token ? 'Đang xác thực email...' : 'Thiếu token xác thực. Vui lòng mở đúng liên kết trong email.'
  );

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await authApi.verifyEmail(token);
        if (!cancelled) {
          setStatus('ok');
          setMessage(res.message || 'Email đã được xác thực thành công.');
        }
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Xác thực thất bại.';
        if (!cancelled) {
          setStatus('error');
          setMessage(msg);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="auth-result">
      {status === 'loading' && (
        <>
          <div className="auth-result-icon auth-result-icon--loading">
            <Loader2 size={40} className="auth-spin" />
          </div>
          <h2 className="auth-title">Đang xác thực</h2>
          <p className="auth-subtitle">Vui lòng đợi trong giây lát...</p>
        </>
      )}

      {status === 'ok' && (
        <>
          <div className="auth-result-icon auth-result-icon--ok">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="auth-title">Email đã xác thực</h2>
          <p className="auth-subtitle">{message}</p>
          <p className="auth-result-hint">Tài khoản của bạn đã sẵn sàng. Đăng nhập để tiếp tục mua sắm.</p>
          <Link to={ROUTES.LOGIN} className="btn btn-primary auth-result-cta">
            <LogIn size={18} /> Đăng nhập
          </Link>
        </>
      )}

      {status === 'error' && (
        <>
          <div className="auth-result-icon auth-result-icon--error">
            <CircleAlert size={48} />
          </div>
          <h2 className="auth-title">Xác thực không thành công</h2>
          <p className="auth-subtitle">{message}</p>
          <Link to={ROUTES.LOGIN} className="btn btn-primary auth-result-cta">
            <LogIn size={18} /> Đăng nhập
          </Link>
          <p className="auth-footer-text">
            Cần gửi lại email? <Link to={ROUTES.LOGIN}>Đăng nhập</Link> và chọn gửi lại xác thực.
          </p>
        </>
      )}
    </div>
  );
};

export default VerifyEmailPage;
