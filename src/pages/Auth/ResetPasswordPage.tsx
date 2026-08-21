import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import authApi from '../../api/authApi';
import { ROUTES } from '../../constants/routes';
import toast from 'react-hot-toast';
import PasswordField from '../../components/auth/PasswordField';
import { PASSWORD_HINT, validateConfirmPassword, validatePassword } from '../../utils/authValidation';

const ResetPasswordPage = () => {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const applyPassword = (value: string) => {
    setPassword(value);
    setErrors((prev) => {
      const next = { ...prev };
      const pwErr = validatePassword(value);
      if (pwErr) next.password = pwErr;
      else delete next.password;
      if (confirm) {
        const confirmErr = validateConfirmPassword(value, confirm);
        if (confirmErr) next.confirm = confirmErr;
        else delete next.confirm;
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!token) errs.token = 'Thiếu token đặt lại mật khẩu.';
    const pwErr = validatePassword(password);
    if (pwErr) errs.password = pwErr;
    const confirmErr = validateConfirmPassword(password, confirm);
    if (confirmErr) errs.confirm = confirmErr;
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await authApi.resetPassword(token, password, confirm);
      toast.success(res.message);
      navigate(ROUTES.LOGIN);
    } catch {
      // interceptor
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div>
        <h2 className="auth-title">Liên kết không hợp lệ</h2>
        <p className="auth-subtitle">Token đặt lại mật khẩu bị thiếu. Yêu cầu lại từ trang quên mật khẩu.</p>
        <Link to={ROUTES.FORGOT_PASSWORD}>Quên mật khẩu</Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="auth-title">Đặt lại mật khẩu</h2>
      <p className="auth-subtitle">Nhập mật khẩu mới cho tài khoản của bạn.</p>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <PasswordField
          id="reset-password"
          label="Mật khẩu mới"
          value={password}
          error={errors.password}
          hint={PASSWORD_HINT}
          showStrength
          onChange={applyPassword}
        />
        <PasswordField
          id="reset-confirm"
          label="Xác nhận mật khẩu"
          value={confirm}
          error={errors.confirm}
          onChange={(value) => {
            setConfirm(value);
            const confirmErr = validateConfirmPassword(password, value);
            setErrors((prev) => {
              const next = { ...prev };
              if (confirmErr) next.confirm = confirmErr;
              else delete next.confirm;
              return next;
            });
          }}
        />
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
          <KeyRound size={16} /> {loading ? 'Đang lưu...' : 'Đặt lại mật khẩu'}
        </button>
      </form>

      <p className="auth-footer-text">
        <Link to={ROUTES.LOGIN}>Về đăng nhập</Link>
      </p>
    </div>
  );
};

export default ResetPasswordPage;
