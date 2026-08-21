import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Package, Heart, ShoppingCart, Shield } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { ROUTES } from '../../constants/routes';
import type { CSSProperties } from 'react';
import PasswordField from '../../components/auth/PasswordField';
import authApi from '../../api/authApi';
import toast from 'react-hot-toast';
import { PASSWORD_HINT, validateConfirmPassword, validatePassword } from '../../utils/authValidation';

const rowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '140px 1fr',
  gap: 12,
  padding: '12px 0',
  borderBottom: '1px solid var(--color-border-light)',
  fontSize: '0.95rem',
};

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME);
  };

  const applyNewPassword = (value: string) => {
    setNewPassword(value);
    setErrors((prev) => {
      const next = { ...prev };
      const pwErr = validatePassword(value, { email: user?.email, name: user?.name });
      if (pwErr) next.newPassword = pwErr;
      else delete next.newPassword;
      if (confirmPassword) {
        const confirmErr = validateConfirmPassword(value, confirmPassword);
        if (confirmErr) next.confirmPassword = confirmErr;
        else delete next.confirmPassword;
      }
      return next;
    });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!currentPassword) errs.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
    const pwErr = validatePassword(newPassword, { email: user?.email, name: user?.name });
    if (pwErr) errs.newPassword = pwErr;
    const confirmErr = validateConfirmPassword(newPassword, confirmPassword);
    if (confirmErr) errs.confirmPassword = confirmErr;
    if (currentPassword && newPassword && currentPassword === newPassword) {
      errs.newPassword = 'Mật khẩu mới phải khác mật khẩu hiện tại';
    }
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      const res = await authApi.changePassword(currentPassword, newPassword, confirmPassword);
      toast.success(res.message);
      await logout();
      navigate(ROUTES.LOGIN);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      if (message) setErrors({ currentPassword: message });
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  const isAdmin = user.role === 'admin';

  return (
    <div className="container" style={{ padding: '32px 0', maxWidth: 720 }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 24 }}>Tài khoản</h1>

      <div className="admin-card" style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>Thông tin cá nhân</h2>
        <div style={rowStyle}>
          <span style={{ color: 'var(--color-text-muted)' }}>Họ tên</span>
          <strong>{user.name}</strong>
        </div>
        <div style={rowStyle}>
          <span style={{ color: 'var(--color-text-muted)' }}>Email</span>
          <span>{user.email}</span>
        </div>
        <div style={rowStyle}>
          <span style={{ color: 'var(--color-text-muted)' }}>Số điện thoại</span>
          <span>{user.phone || '—'}</span>
        </div>
        <div style={rowStyle}>
          <span style={{ color: 'var(--color-text-muted)' }}>Địa chỉ</span>
          <span>{user.address || '—'}</span>
        </div>
        <div style={{ ...rowStyle, borderBottom: 'none' }}>
          <span style={{ color: 'var(--color-text-muted)' }}>Xác thực email</span>
          <span>{user.emailVerified ? 'Đã xác thực' : 'Chưa xác thực'}</span>
        </div>
      </div>

      <div className="admin-card" style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>Đổi mật khẩu</h2>
        <form className="auth-form" onSubmit={handleChangePassword} noValidate>
          <PasswordField
            id="current-password"
            label="Mật khẩu hiện tại"
            value={currentPassword}
            error={errors.currentPassword}
            autoComplete="current-password"
            onChange={setCurrentPassword}
          />
          <PasswordField
            id="new-password"
            label="Mật khẩu mới"
            value={newPassword}
            error={errors.newPassword}
            hint={PASSWORD_HINT}
            showStrength
            onChange={applyNewPassword}
          />
          <PasswordField
            id="confirm-new-password"
            label="Xác nhận mật khẩu mới"
            value={confirmPassword}
            error={errors.confirmPassword}
            onChange={(value) => {
              setConfirmPassword(value);
              const confirmErr = validateConfirmPassword(newPassword, value);
              setErrors((prev) => {
                const next = { ...prev };
                if (confirmErr) next.confirmPassword = confirmErr;
                else delete next.confirmPassword;
                return next;
              });
            }}
          />
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Đang lưu...' : 'Cập nhật mật khẩu'}
          </button>
        </form>
      </div>

      <div className="admin-card" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
        <Link to={ROUTES.ORDERS} className="btn btn-secondary">
          <Package size={16} /> Đơn hàng
        </Link>
        <Link to={ROUTES.WISHLIST} className="btn btn-secondary">
          <Heart size={16} /> Yêu thích
        </Link>
        <Link to={ROUTES.CART} className="btn btn-secondary">
          <ShoppingCart size={16} /> Giỏ hàng
        </Link>
        {isAdmin && (
          <Link to={ROUTES.ADMIN_DASHBOARD} className="btn btn-secondary">
            <Shield size={16} /> Quản trị
          </Link>
        )}
      </div>

      <button type="button" className="btn btn-primary" onClick={() => void handleLogout()}>
        <LogOut size={16} /> Đăng xuất
      </button>
    </div>
  );
};

export default ProfilePage;
