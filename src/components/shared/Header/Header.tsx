import { NavLink, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, Search, ChevronDown, Store } from 'lucide-react';
import { useState } from 'react';
import { ROUTES } from '../../../constants/routes';
import { useAuth } from '../../../store/AuthContext';
import { useCart } from '../../../hooks/useCart';
import ProductMegaMenu from './ProductMegaMenu';
import toast from 'react-hot-toast';

const Header = () => {
  const { isAuthenticated, user, becomeOwner } = useAuth();
  const { data: cartItems } = useCart();
  const cartCount = cartItems?.length ?? 0;
  const [searchQuery, setSearchQuery] = useState('');
  const [megaOpen, setMegaOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`${ROUTES.PRODUCTS}?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const navItems: { label: string; to?: string; comingSoon?: boolean; mega?: boolean }[] = [
    { label: 'Trang chủ', to: ROUTES.HOME },
    { label: 'Sản phẩm', to: ROUTES.PRODUCTS, mega: true },
    { label: 'Hàng pass', to: ROUTES.PASS },
    { label: 'Giảm giá', to: ROUTES.DEALS },
    { label: 'Cửa hàng', to: ROUTES.STORES },
    { label: 'Đào tạo', comingSoon: true },
    { label: 'Tin tức', comingSoon: true },
    { label: 'Tuyển dụng', comingSoon: true },
    { label: 'Liên hệ', comingSoon: true },
  ];

  return (
    <header className="header">
      <div className="container">
        <div className="header-top">
          <Link to={ROUTES.HOME} className="header-logo">
            <div className="logo-circle">BM</div>
          </Link>

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

            {isAuthenticated && user?.role !== 'admin' && (
              <button
                className="header-action-btn"
                title={user?.role === 'owner' ? 'Kênh người bán' : 'Become Owner'}
                onClick={() => {
                  if (user?.role === 'owner') {
                    navigate(ROUTES.OWNER_DASHBOARD);
                    return;
                  }
                  if (!user?.emailVerified) {
                    toast.error('Xác thực email trước khi mở kênh bán.');
                    return;
                  }
                  if (confirm('Mở kênh bán hàng để đăng vợt, giày, quần áo và phụ kiện cầu lông của bạn?')) {
                    void becomeOwner()
                      .then(() => navigate(ROUTES.OWNER_DASHBOARD))
                      .catch(() => undefined);
                  }
                }}
              >
                <Store size={22} />
                <span>{user?.role === 'owner' ? 'Kênh bán' : 'Become Owner'}</span>
              </button>
            )}

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

        <nav>
          <div
            className="header-nav"
            onMouseLeave={() => setMegaOpen(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setMegaOpen(false);
            }}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setMegaOpen(false);
            }}
          >
            {navItems.map((item) => {
              if (item.comingSoon) {
                return (
                  <span key={item.label} className="nav-link nav-link-soon" title="Sắp ra mắt">
                    {item.label}
                  </span>
                );
              }
              if (item.mega) {
                return (
                  <NavLink
                    key={item.to}
                    to={item.to!}
                    className={({ isActive }) =>
                      `nav-link${isActive ? ' active' : ''}${megaOpen ? ' is-open' : ''}`
                    }
                    aria-expanded={megaOpen}
                    onMouseEnter={() => setMegaOpen(true)}
                    onFocus={() => setMegaOpen(true)}
                    onClick={() => setMegaOpen(false)}
                  >
                    {item.label}
                    <ChevronDown size={14} className="nav-caret" />
                  </NavLink>
                );
              }
              return (
                <NavLink
                  key={item.to}
                  to={item.to!}
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                >
                  {item.label}
                </NavLink>
              );
            })}

            {megaOpen && <ProductMegaMenu onNavigate={() => setMegaOpen(false)} />}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
