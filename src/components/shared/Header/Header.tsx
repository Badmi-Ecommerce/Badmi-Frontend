import { NavLink, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, Search, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { ROUTES } from '../../../constants/routes';
import { useAuth } from '../../../store/AuthContext';
import { useCart } from '../../../hooks/useCart';

const Header = () => {
  const { isAuthenticated, user } = useAuth();
  const { data: cartItems } = useCart();
  const cartCount = cartItems?.length ?? 0;
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`${ROUTES.PRODUCTS}?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const navItems = [
    { label: 'Trang chủ', to: ROUTES.HOME },
    { label: 'Sản phẩm', to: ROUTES.PRODUCTS, icon: <ChevronDown size={14} /> },
    { label: 'Cửa hàng', to: ROUTES.STORES },
    { label: 'Đào tạo', to: ROUTES.TRAINING },
    { label: 'Giảm giá', to: ROUTES.DEALS },
    { label: 'Tin tức', to: ROUTES.NEWS },
    { label: 'Tuyển dụng', to: ROUTES.CAREERS },
    { label: 'Liên hệ', to: ROUTES.CONTACT },
  ];

  return (
    <header className="header">
      <div className="container">
        <div className="header-top">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="header-logo">
            <div className="logo-circle">BM</div>
          </Link>

          {/* Search */}
          <form className="header-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="header-search-btn">
              <Search size={16} />
              Tìm kiếm
            </button>
          </form>

          {/* Actions */}
          <div className="header-actions">
            <button
              className="header-action-btn"
              onClick={() => navigate(ROUTES.WISHLIST)}
              title="Yêu thích"
            >
              <Heart size={22} />
              <span>Yêu thích</span>
            </button>

            <button
              className="header-action-btn"
              onClick={() => isAuthenticated ? navigate(ROUTES.PROFILE) : navigate(ROUTES.LOGIN)}
              title="Tài khoản"
            >
              <User size={22} />
              <span>{isAuthenticated ? user?.name?.split(' ').pop() : 'Đăng nhập'}</span>
            </button>

            <button
              className="header-action-btn"
              onClick={() => navigate(ROUTES.CART)}
              title="Giỏ hàng"
              style={{ position: 'relative' }}
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && <span className="action-badge">{cartCount}</span>}
              <span>Giỏ hàng</span>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav>
          <div className="header-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                {item.label}
                {item.icon}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
