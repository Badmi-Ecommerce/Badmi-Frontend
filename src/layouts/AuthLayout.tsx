import { Outlet, Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      {/* Left decorative side */}
      <div className="auth-left">
        <Link to={ROUTES.HOME} style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div className="logo-circle" style={{ width: 80, height: 80, fontSize: 30 }}>BM</div>
            <div className="auth-left-logo">Badmishop</div>
          </div>
        </Link>
        <p className="auth-left-tagline">Đam mê cầu lông cùng Badmishop</p>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', marginTop: 12, textAlign: 'center', maxWidth: 300 }}>
          Hệ thống cửa hàng cầu lông chính hãng hàng đầu Việt Nam với hơn 20.000 khách hàng tin tưởng.
        </p>
      </div>

      {/* Right form side */}
      <div className="auth-right">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
