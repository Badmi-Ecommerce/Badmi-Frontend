import { useAuth } from '../../../store/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="admin-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>
          Xin chào, <span style={{ color: 'var(--color-text-primary)' }}>{user?.name || 'Admin'}</span>
        </span>
        <button className="btn btn-outline btn-sm" onClick={handleLogout}>
          Đăng xuất
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
