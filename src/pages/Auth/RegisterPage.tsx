import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { ROUTES } from '../../constants/routes';

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
    <label className="input-label">{label}</label>
    <input
      id={id}
      type={type}
      className="input-field"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      autoComplete={field === 'email' ? 'email' : field === 'name' ? 'name' : 'off'}
    />
    {error && <span className="input-message">{error}</span>}
  </div>
);

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate      = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState<Record<string, string>>({});

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim())   errs.name = 'Họ tên không được để trống.';
    if (!form.email)         errs.email = 'Email không được để trống.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Email không hợp lệ.';
    if (!form.password)      errs.password = 'Mật khẩu không được để trống.';
    else if (form.password.length < 6) errs.password = 'Mật khẩu ít nhất 6 ký tự.';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Mật khẩu xác nhận không khớp.';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password, phone: form.phone });
      navigate(ROUTES.HOME);
    } catch {
      // Error handled globally
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="auth-title">Đăng ký tài khoản</h2>
      <p className="auth-subtitle">Tham gia Badmishop để nhận ưu đãi độc quyền!</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <Field id="reg-name"  label="Họ và tên"      field="name"  placeholder="Nguyễn Văn An" value={form.name} error={errors.name} onChange={update('name')} />
        <Field id="reg-email" label="Email"           field="email" type="email" placeholder="email@example.com" value={form.email} error={errors.email} onChange={update('email')} />
        <Field id="reg-phone" label="Số điện thoại"  field="phone" type="tel"   placeholder="0847xxxxxx" value={form.phone} error={errors.phone} onChange={update('phone')} />

        {/* Password */}
        <div className={`input-wrap${errors.password ? ' input-error' : ''}`}>
          <label className="input-label">Mật khẩu</label>
          <div style={{ position: 'relative' }}>
            <input
              id="reg-password"
              type={showPw ? 'text' : 'password'}
              className="input-field"
              placeholder="Ít nhất 6 ký tự"
              value={form.password}
              onChange={update('password')}
              style={{ paddingRight: 44 }}
            />
            <button type="button" onClick={() => setShowPw(s => !s)}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <span className="input-message">{errors.password}</span>}
        </div>

        {/* Confirm Password */}
        <div className={`input-wrap${errors.confirmPassword ? ' input-error' : ''}`}>
          <label className="input-label">Xác nhận mật khẩu</label>
          <input
            id="reg-confirm-password"
            type="password"
            className="input-field"
            placeholder="Nhập lại mật khẩu"
            value={form.confirmPassword}
            onChange={update('confirmPassword')}
          />
          {errors.confirmPassword && <span className="input-message">{errors.confirmPassword}</span>}
        </div>

        <button id="reg-submit" type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
          {loading
            ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 3 }} />
            : <><UserPlus size={18} /> Tạo tài khoản</>
          }
        </button>
      </form>

      <p className="auth-footer-text">
        Đã có tài khoản? <Link to={ROUTES.LOGIN}>Đăng nhập</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
