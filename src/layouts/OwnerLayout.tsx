import { Outlet, useNavigate } from 'react-router-dom';
import OwnerSidebar from '../components/shared/OwnerSidebar/OwnerSidebar';
import { useAuth } from '../store/AuthContext';
import { ROUTES } from '../constants/routes';

const OwnerLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="admin-layout">
      <OwnerSidebar />
      <div className="admin-main">
        <header className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>
              Người bán: <span style={{ color: 'var(--color-text-primary)' }}>{user?.name}</span>
            </span>
            <button className="btn btn-outline btn-sm" type="button" onClick={() => navigate(ROUTES.HOME)}>
              Về cửa hàng
            </button>
            <button
              className="btn btn-outline btn-sm"
              type="button"
              onClick={() => {
                void logout();
                navigate(ROUTES.LOGIN);
              }}
            >
              Đăng xuất
            </button>
          </div>
        </header>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OwnerLayout;
