import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { ROUTES } from '../../constants/routes';
import GoogleSignInButton from '../../components/auth/GoogleSignInButton';
import PasswordField from '../../components/auth/PasswordField';
import {
  normalizeEmail,
  normalizePhone,
  PASSWORD_HINT,
  validateConfirmPassword,
  validateEmail,
  validatePassword,
  validatePhone,
} from '../../utils/authValidation';

interface FieldProps {
  id: string;
  label: string;
  field: 'name' | 'email' | 'phone';
  type?: string;
  placeholder: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Field = ({ id, label, field, type = 'text', placeholder, value, error, onChange }: FieldProps) => (
  <div className={`input-wrap${error ? ' input-error' : ''}`}>
    <label className="input-label" htmlFor={id}>{label}</label>
    <input
      id={id}
      type={type}
      className="input-field"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      inputMode={field === 'phone' ? 'tel' : undefined}
      autoComplete={field === 'email' ? 'email' : field === 'name' ? 'name' : field === 'phone' ? 'tel' : 'off'}
    />
    {error && <span className="input-message">{error}</span>}
  </div>
);

type ApiErrorBody = { message?: string; errors?: Record<string, string> };

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setField = (field: string, value: string) => {
    setForm((f) => {
      const next = { ...f, [field]: value };
      if (field === 'phone') {
        setErrors((prev) => {
          const nextErrs = { ...prev };
          const phoneErr = validatePhone(value);
          if (phoneErr) nextErrs.phone = phoneErr;
          else delete nextErrs.phone;
          return nextErrs;
        });
      }
      if (field === 'password' || field === 'confirmPassword') {
        setErrors((prev) => {
          const nextErrs = { ...prev };
          if (field === 'password') {
            const pwErr = validatePassword(value, { email: next.email, name: next.name });
            if (pwErr) nextErrs.password = pwErr;
            else delete nextErrs.password;
          }
          if (next.confirmPassword) {
            const confirmErr = validateConfirmPassword(next.password, next.confirmPassword);
            if (confirmErr) nextErrs.confirmPassword = confirmErr;
            else delete nextErrs.confirmPassword;
          }
          return nextErrs;
        });
      }
      return next;
    });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Vui lòng nhập họ tên';
    const emailErr = validateEmail(form.email);
    if (emailErr) errs.email = emailErr;
    const phoneErr = validatePhone(form.phone);
    if (phoneErr) errs.phone = phoneErr;
    const pwErr = validatePassword(form.password, { email: form.email, name: form.name });
    if (pwErr) errs.password = pwErr;
    const confirmErr = validateConfirmPassword(form.password, form.confirmPassword);
    if (confirmErr) errs.confirmPassword = confirmErr;
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
    setLoading(true);
    try {
      const result = await register({
        name: form.name.trim(),
        email: normalizeEmail(form.email),
        password: form.password,
        confirmPassword: form.confirmPassword,
        phone: normalizePhone(form.phone),
      });
      navigate(ROUTES.LOGIN, {
        state: {
          registeredEmail: normalizeEmail(form.email),
          verifyUrl: result.verifyUrl ?? undefined,
        },
      });
    } catch (err: unknown) {
      const data = (err as { response?: { data?: ApiErrorBody } })?.response?.data;
      if (data?.errors) {
        setErrors(data.errors);
      } else if (data?.message) {
        setErrors({ email: data.message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="auth-title">Đăng ký tài khoản</h2>
      <p className="auth-subtitle">Tham gia Badmishop — xác thực email để kích hoạt tài khoản.</p>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <Field id="reg-name" label="Họ và tên" field="name" placeholder="Nguyễn Văn An" value={form.name} error={errors.name} onChange={(e) => setField('name', e.target.value)} />
        <Field id="reg-email" label="Email" field="email" type="email" placeholder="email@example.com" value={form.email} error={errors.email} onChange={(e) => setField('email', e.target.value)} />
        <Field id="reg-phone" label="Số điện thoại" field="phone" type="tel" placeholder="0847123456" value={form.phone} error={errors.phone} onChange={(e) => setField('phone', e.target.value)} />

        <PasswordField
          id="reg-password"
          label="Mật khẩu"
          value={form.password}
          error={errors.password}
          placeholder="Ví dụ: Badminton@2026"
          hint={PASSWORD_HINT}
          showStrength
          onChange={(value) => setField('password', value)}
        />

        <PasswordField
          id="reg-confirm-password"
          label="Xác nhận mật khẩu"
          value={form.confirmPassword}
          error={errors.confirmPassword}
          placeholder="Nhập lại mật khẩu"
          onChange={(value) => setField('confirmPassword', value)}
        />

        <button id="reg-submit" type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Đang tạo...' : (
            <>
              <UserPlus size={18} /> Tạo tài khoản
            </>
          )}
        </button>
      </form>

      <div className="auth-divider"><span>hoặc</span></div>
      <GoogleSignInButton />

      <p className="auth-footer-text">
        Đã có tài khoản? <Link to={ROUTES.LOGIN}>Đăng nhập</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
