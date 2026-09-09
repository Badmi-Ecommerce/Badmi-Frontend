import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Clock,
  MapPin,
  Navigation,
  Package,
  Phone,
  Recycle,
  Store as StoreIcon,
  User2,
} from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { useShops } from '../../hooks/useShops';
import type { Shop } from '../../types';

const CITY = 'Đà Nẵng';
const ALL_DISTRICTS = 'Tất cả quận';
const SHOP_COVER_FALLBACK =
  'https://placehold.co/800x450/FFF3E8/FF6600?text=Badmishop+%C4%90%C3%A0+N%E1%BA%B5ng';

const initials = (name?: string) => {
  if (!name) return 'BM';
  const parts = name.trim().split(/\s+/);
  return `${parts[0][0]}${parts.length > 1 ? parts[parts.length - 1][0] : ''}`.toUpperCase();
};

const fullAddress = (shop: Shop) =>
  [shop.addressLine, shop.district && `Q. ${shop.district}`, shop.city].filter(Boolean).join(', ');

const mapUrl = (shop: Shop) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress(shop))}`;

const handleCoverError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  if (e.currentTarget.src !== SHOP_COVER_FALLBACK) e.currentTarget.src = SHOP_COVER_FALLBACK;
};

const ShopCard = ({ shop }: { shop: Shop }) => (
  <article className="shop-card">
    <div className="shop-card-cover">
      <img
        src={shop.coverUrl || SHOP_COVER_FALLBACK}
        alt={shop.shopName}
        loading="lazy"
        onError={handleCoverError}
      />
      <span className="shop-card-type is-shop">
        <StoreIcon size={12} /> Shop đã đăng ký
      </span>
      {shop.district && (
        <span className="shop-card-district">
          <MapPin size={12} /> {shop.district}
        </span>
      )}
    </div>

    <div className="shop-card-body">
      <div className="shop-card-head">
        <span className="shop-card-avatar">
          {shop.avatarUrl ? (
            <img src={shop.avatarUrl} alt={shop.shopName} loading="lazy" />
          ) : (
            initials(shop.shopName)
          )}
        </span>
        <div>
          <h3 className="shop-card-name">{shop.shopName}</h3>
          <p className="shop-card-owner">
            <User2 size={13} /> {shop.ownerName ?? 'Người bán Badmishop'}
          </p>
        </div>
      </div>

      {shop.description && <p className="shop-card-desc">{shop.description}</p>}

      <ul className="store-meta">
        {shop.addressLine && (
          <li>
            <MapPin size={15} /> {fullAddress(shop)}
          </li>
        )}
        {shop.openHours && (
          <li>
            <Clock size={15} /> {shop.openHours}
          </li>
        )}
      </ul>

      <div className="shop-card-counts">
        <span>
          <Package size={14} /> {shop.productCount} sản phẩm đang bán
        </span>
      </div>

      {shop.services.length > 0 && (
        <div className="store-tags">
          {shop.services.map((service) => (
            <span key={service} className="store-tag">
              {service}
            </span>
          ))}
        </div>
      )}

      <div className="store-actions">
        {shop.phone && (
          <a href={`tel:${shop.phone.replace(/\s/g, '')}`} className="btn btn-primary btn-sm">
            <Phone size={14} /> {shop.phone}
          </a>
        )}
        {shop.addressLine && (
          <a
            href={mapUrl(shop)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm"
          >
            <Navigation size={14} /> Chỉ đường
          </a>
        )}
        <Link to={`${ROUTES.PRODUCTS}?shop=${shop.userId}`} className="store-action-link">
          Xem hàng của shop <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  </article>
);

const StoresPage = () => {
  // Danh bạ này chỉ gồm shop đã đăng ký; cá nhân pass đồ nằm ở trang Hàng pass.
  const { data: shops = [], isLoading } = useShops({ city: CITY, shopType: 'SHOP' });
  const [district, setDistrict] = useState(ALL_DISTRICTS);

  const districts = useMemo(
    () => [...new Set(shops.map((s) => s.district).filter((d): d is string => Boolean(d)))],
    [shops]
  );

  const filtered = shops.filter((s) => district === ALL_DISTRICTS || s.district === district);

  const totalProducts = shops.reduce((sum, s) => sum + s.productCount, 0);
  const serviceCount = new Set(shops.flatMap((s) => s.services)).size;
  const covers = shops.filter((s) => s.coverUrl).slice(0, 4);

  return (
    <div className="stores-page">
      {/* ── Banner người bán tại Đà Nẵng ── */}
      <section className="stores-hero">
        <div className="stores-hero-stripes" />
        <div className="container stores-hero-inner">
          <div className="stores-hero-content">
            <p className="stores-hero-kicker">
              <MapPin size={14} /> {CITY}
            </p>
            <h1 className="stores-hero-title">
              Cửa hàng cầu lông
              <br />
              đã đăng ký tại Đà Nẵng
            </h1>
            <p className="stores-hero-text">
              Danh bạ các shop cầu lông ở Đà Nẵng đã đăng ký bán trên Badmishop. Mỗi shop tự quản
              lý hàng của mình, có địa chỉ và số điện thoại thật để bạn ghé xem hàng hoặc đặt
              online.
            </p>
            <div className="stores-hero-cta">
              <Link to={ROUTES.PROFILE} className="btn btn-primary btn-lg">
                <StoreIcon size={16} /> Đăng ký shop của bạn
              </Link>
            </div>
          </div>

          {covers.length > 0 && (
            <div className="stores-hero-mosaic">
              {covers.map((shop) => (
                <figure key={shop.id} className="stores-hero-shot">
                  <img
                    src={shop.coverUrl}
                    alt={shop.shopName}
                    loading="lazy"
                    onError={handleCoverError}
                  />
                  <figcaption>
                    <strong>{shop.shopName}</strong> {shop.district ?? shop.city}
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Số liệu ── */}
      <section className="container">
        <div className="stores-stats">
          {[
            { icon: <StoreIcon size={20} />, value: shops.length, label: 'Shop đã đăng ký' },
            { icon: <MapPin size={20} />, value: districts.length, label: 'Quận, huyện có shop' },
            { icon: <Package size={20} />, value: totalProducts, label: 'Sản phẩm đang bán' },
            { icon: <BadgeCheck size={20} />, value: serviceCount, label: 'Dịch vụ tại cửa hàng' },
          ].map((stat) => (
            <div key={stat.label} className="stores-stat">
              <span className="stores-stat-icon">{stat.icon}</span>
              <div>
                <p className="stores-stat-value">{stat.value}</p>
                <p className="stores-stat-label">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Danh bạ người bán ── */}
      <section className="stores-list-section">
        <div className="container">
          <div className="stores-list-head">
            <div>
              <h2 className="section-title" style={{ marginBottom: 6 }}>
                Shop cầu lông tại Đà Nẵng
              </h2>
              <p className="stores-description">
                Chọn quận để tìm shop gần bạn nhất.
              </p>
            </div>
            {districts.length > 0 && (
              <div className="stores-filter">
                {[ALL_DISTRICTS, ...districts].map((d) => (
                  <button
                    key={d}
                    type="button"
                    className={`stores-filter-chip${district === d ? ' is-active' : ''}`}
                    onClick={() => setDistrict(d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="stores-grid">
              {[0, 1, 2].map((i) => (
                <div key={i} className="skeleton" style={{ height: 420 }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🏸</div>
              <h3 className="empty-state-title">Chưa có shop ở khu vực này</h3>
              <p className="empty-state-text">
                Thử chọn quận khác, hoặc đăng ký để trở thành shop đầu tiên tại đây.
              </p>
              <Link to={ROUTES.PROFILE} className="btn btn-primary">
                Đăng ký shop
              </Link>
            </div>
          ) : (
            <div className="stores-grid">
              {filtered.map((shop) => (
                <ShopCard key={shop.id} shop={shop} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Mời đăng ký shop ── */}
      <section className="stores-invite">
        <div className="container stores-invite-inner">
          <div>
            <h2>Bạn đang có shop cầu lông tại Đà Nẵng?</h2>
            <p>
              Đăng ký kênh bán và điền hồ sơ cửa hàng để shop của bạn xuất hiện trong danh bạ này,
              kèm địa chỉ, giờ mở cửa và toàn bộ hàng đang bán.
            </p>
          </div>
          <div className="stores-invite-actions">
            <Link to={ROUTES.PROFILE} className="btn btn-primary btn-lg">
              Đăng ký shop <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Tách rõ hai luồng: shop bán hàng ở trang này, pass đồ ở trang riêng. */}
      <section className="container">
        <div className="stores-pass-note">
          <Recycle size={18} />
          <p>
            Bạn không mở shop, chỉ muốn pass lại vài cây vợt hoặc đôi giày đã dùng? Đăng tin ở
            trang <Link to={ROUTES.PASS}>Hàng pass</Link> – danh bạ này chỉ dành cho shop đã đăng
            ký.
          </p>
        </div>
      </section>
    </div>
  );
};

export default StoresPage;
