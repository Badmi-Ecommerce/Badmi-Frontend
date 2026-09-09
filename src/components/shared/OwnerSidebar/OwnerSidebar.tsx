import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

const OwnerSidebar = () => {
  const location = useLocation();
  const navItems = [
    { name: 'Tổng quan', path: ROUTES.OWNER_DASHBOARD },
    { name: 'Sản phẩm của tôi', path: ROUTES.OWNER_PRODUCTS },
    { name: 'Hồ sơ cửa hàng', path: ROUTES.OWNER_SHOP },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <Link to={ROUTES.HOME} className="logo-circle" style={{ textDecoration: 'none' }}>B</Link>
        <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-primary)' }}>Kênh Owner</span>
      </div>
      <nav className="admin-sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`admin-nav-item ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default OwnerSidebar;
