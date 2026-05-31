import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

const AdminSidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: ROUTES.ADMIN_DASHBOARD, icon: '📊' },
    { name: 'Products', path: ROUTES.ADMIN_PRODUCTS, icon: '🏸' },
    { name: 'Categories', path: ROUTES.ADMIN_CATEGORIES, icon: '🏷️' },
    { name: 'Brands', path: ROUTES.ADMIN_BRANDS, icon: '🏢' },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <Link to={ROUTES.HOME} className="logo-circle" style={{ textDecoration: 'none' }}>B</Link>
        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)' }}>Admin</span>
      </div>
      <nav className="admin-sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`admin-nav-item ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
          >
            <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
