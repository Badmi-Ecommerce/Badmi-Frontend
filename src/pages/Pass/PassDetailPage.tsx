import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  BadgeCheck,
  ChevronRight,
  Clock,
  ExternalLink,
  Handshake,
  MapPin,
  MessageCircle,
  Phone,
  Recycle,
  ShieldCheck,
  ShoppingCart,
  Store as StoreIcon,
  Tag,
  User2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ROUTES } from '../../constants/routes';
import { DA_NANG_CITY } from '../../constants/danang';
import { useProductBySlug, useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { useShops } from '../../hooks/useShops';
import { useAddToCart } from '../../hooks/useCart';
import { useAuth } from '../../store/AuthContext';
import { calcDiscount, formatCurrency } from '../../utils';
import type { Product, Shop } from '../../types';

const PASS_IMAGE_FALLBACK =
  'https://placehold.co/800x600/FFF3E8/FF6600?text=H%C3%A0ng+pass+Badmishop';

const conditionLabel = (percent?: number) => {
  if (!percent) return 'Đã qua sử dụng';
  if (percent >= 95) return 'Như mới';
  if (percent >= 90) return 'Rất tốt';
  if (percent >= 80) return 'Tốt';
  return 'Dùng ổn';
};

const initials = (name?: string) => {
  if (!name) return 'BM';
  const parts = name.trim().split(/\s+/);
  return `${parts[0][0]}${parts.length > 1 ? parts[parts.length - 1][0] : ''}`.toUpperCase();
};

const digits = (phone: string) => phone.replace(/\D/g, '');

const SellerPanel = ({ shop }: { shop?: Shop }) => {
  if (!shop) {
    return (
      <aside className="pass-seller-panel">
        <p className="pass-seller-title">Người pass</p>
        <p className="pass-seller-empty">
          Người bán chưa điền hồ sơ liên hệ. Bạn có thể đặt hàng qua giỏ hàng như bình thường.
        </p>
      </aside>
    );
  }

  const address = [shop.addressLine, shop.district && `Q. ${shop.district}`, shop.city]
    .filter(Boolean)
    .join(', ');

  return (
    <aside className="pass-seller-panel">
      <p className="pass-seller-title">Thông tin người pass</p>

      <div className="pass-seller-head">
        <span className="pass-seller-avatar">
          {shop.avatarUrl ? (
            <img src={shop.avatarUrl} alt={shop.shopName} loading="lazy" />
          ) : (
            initials(shop.shopName)
          )}
        </span>
        <div>
          <p className="pass-seller-name">
            {shop.shopName}
            {shop.shopType === 'SHOP' && <BadgeCheck size={15} />}
          </p>
          <p className="pass-seller-type">
            {shop.shopType === 'SHOP' ? <StoreIcon size={12} /> : <User2 size={12} />}
            {shop.shopType === 'SHOP' ? 'Cửa hàng đã đăng ký' : 'Cá nhân pass đồ'}
          </p>
        </div>
      </div>

      <ul className="pass-seller-meta">
        {shop.ownerName && (
          <li>
            <User2 size={15} /> {shop.ownerName}
          </li>
        )}
        {shop.phone && (
          <li>
            <Phone size={15} /> {shop.phone}
          </li>
        )}
        {shop.zaloPhone && (
          <li>
            <MessageCircle size={15} /> Zalo: {shop.zaloPhone}
          </li>
        )}
        {address && (
          <li>
            <MapPin size={15} /> {address}
          </li>
        )}
        {shop.openHours && (
          <li>
            <Clock size={15} /> {shop.openHours}
          </li>
        )}
      </ul>

      <div className="pass-seller-actions">
        {shop.phone && (
          <a href={`tel:${digits(shop.phone)}`} className="btn btn-primary btn-sm">
            <Phone size={14} /> Gọi ngay
          </a>
        )}
        {shop.zaloPhone && (
          <a
            href={`https://zalo.me/${digits(shop.zaloPhone)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm"
          >
            <MessageCircle size={14} /> Chat Zalo
          </a>
        )}
        {shop.facebookUrl && (
          <a
            href={shop.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm"
          >
            <ExternalLink size={14} /> Facebook
          </a>
        )}
      </div>

      <Link to={`${ROUTES.PASS}?shop=${shop.userId}`} className="store-action-link">
        Xem tin pass khác của người này <ChevronRight size={14} />
      </Link>
    </aside>
  );
};

const PassDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const addToCart = useAddToCart();

  const { data: product, isLoading, isError } = useProductBySlug(slug || '');
  const { data: categories = [] } = useCategories();
  const { data: shops = [] } = useShops({ city: DA_NANG_CITY });
  const { data: passPage } = useProducts({ page: 0, size: 48, listingType: 'PASS' });

  const [activeImg, setActiveImg] = useState(0);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="not-found-page">
        <div>
          <div className="not-found-code">404</div>
          <h2 className="not-found-title">Tin pass không tồn tại</h2>
          <p className="not-found-text">Tin này đã bị ẩn hoặc người bán đã pass xong.</p>
          <Link to={ROUTES.PASS} className="btn btn-primary">
            Xem tất cả tin pass
          </Link>
        </div>
      </div>
    );
  }

  const shop = shops.find((s) => s.userId === product.ownerId);
  const category = categories.find((c) => c.id === product.categoryId);
  const variant = product.variants?.[0];
  const originalPrice = product.originalPrice ?? 0;
  const discount = calcDiscount(product.price, originalPrice);
  const images = [product.image, ...(product.images ?? [])].filter(Boolean) as string[];
  const otherListings = (passPage?.content ?? [])
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để đặt hàng pass.');
      navigate(ROUTES.LOGIN);
      return;
    }
    if (!variant) {
      toast.error('Tin pass này chưa có biến thể để đặt.');
      return;
    }
    addToCart.mutate({ variantId: variant.id, quantity: 1 });
  };

  return (
    <div className="pass-detail-page">
      <div className="container">
        <nav className="product-detail-breadcrumb">
          <Link to={ROUTES.HOME}>Trang chủ</Link>
          <ChevronRight size={14} className="breadcrumb-sep" />
          <Link to={ROUTES.PASS}>Hàng pass</Link>
          {category && (
            <>
              <ChevronRight size={14} className="breadcrumb-sep" />
              <Link to={`${ROUTES.PASS}?category=${category.id}`}>{category.name}</Link>
            </>
          )}
          <ChevronRight size={14} className="breadcrumb-sep" />
          <span style={{ color: 'var(--color-text-primary)' }}>{product.name}</span>
        </nav>

        <div className="pass-detail-layout">
          <div>
            <div className="product-gallery-main">
              <img src={images[activeImg] || PASS_IMAGE_FALLBACK} alt={product.name} />
              {product.conditionPercent && (
                <span className="pass-detail-condition">
                  {product.conditionPercent}% · {conditionLabel(product.conditionPercent)}
                </span>
              )}
            </div>
            {images.length > 1 && (
              <div className="product-gallery-thumbs">
                {images.map((img, i) => (
                  <div
                    key={i}
                    className={`product-thumb${activeImg === i ? ' active' : ''}`}
                    onClick={() => setActiveImg(i)}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <span className="pass-detail-tag">
              <Recycle size={13} /> Tin pass · hàng đã qua sử dụng
            </span>
            <h1 className="product-detail-title">{product.name}</h1>

            <div className="product-detail-price">
              <span className="product-price">{formatCurrency(Number(product.price))}</span>
              {discount > 0 && (
                <>
                  <span className="product-original-price">{formatCurrency(originalPrice)}</span>
                  <span className="badge badge-sale">-{discount}%</span>
                </>
              )}
              {product.isNegotiable && (
                <span className="pass-card-negotiable">
                  <Handshake size={12} /> Thương lượng được
                </span>
              )}
            </div>

            <dl className="pass-detail-specs">
              <div>
                <dt>Tình trạng</dt>
                <dd>
                  {product.conditionPercent
                    ? `${product.conditionPercent}% - ${conditionLabel(product.conditionPercent)}`
                    : 'Đã qua sử dụng'}
                </dd>
              </div>
              {product.usageDuration && (
                <div>
                  <dt>Thời gian đã dùng</dt>
                  <dd>{product.usageDuration}</dd>
                </div>
              )}
              {product.passReason && (
                <div>
                  <dt>Lý do pass</dt>
                  <dd>{product.passReason}</dd>
                </div>
              )}
              {variant?.variantName && (
                <div>
                  <dt>Quy cách</dt>
                  <dd>{variant.variantName}</dd>
                </div>
              )}
              <div>
                <dt>Số lượng còn</dt>
                <dd>{product.stock} sản phẩm</dd>
              </div>
            </dl>

            <p className="pass-detail-desc">
              {product.description || 'Người bán chưa mô tả thêm về tình trạng hàng.'}
            </p>

            <div className="pass-detail-cta">
              <button className="btn btn-primary" type="button" onClick={handleAddToCart}>
                <ShoppingCart size={16} /> Đặt mua qua Badmishop
              </button>
              {shop?.phone && (
                <a href={`tel:${digits(shop.phone)}`} className="btn btn-outline">
                  <Phone size={16} /> Liên hệ người pass
                </a>
              )}
            </div>

            <p className="pass-detail-safety">
              <ShieldCheck size={15} /> Nên hẹn xem hàng trực tiếp và kiểm tra khung vợt, đế giày
              trước khi chuyển tiền.
            </p>

            <div className="pass-detail-seller-mobile">
              <SellerPanel shop={shop} />
            </div>
          </div>

          <div className="pass-detail-seller-side">
            <SellerPanel shop={shop} />
          </div>
        </div>

        {otherListings.length > 0 && (
          <section style={{ marginTop: 48 }}>
            <h2 style={{ marginBottom: 16 }}>Tin pass khác</h2>
            <div className="pass-grid">
              {otherListings.map((item: Product) => {
                const itemShop = shops.find((s) => s.userId === item.ownerId);
                return (
                  <Link
                    key={item.id}
                    to={`${ROUTES.PASS}/${item.slug}`}
                    className="pass-mini-card"
                  >
                    <img
                      src={item.image || item.images?.[0] || PASS_IMAGE_FALLBACK}
                      alt={item.name}
                      loading="lazy"
                    />
                    <div>
                      <p className="pass-mini-name">{item.name}</p>
                      <p className="pass-mini-price">{formatCurrency(Number(item.price))}</p>
                      <p className="pass-mini-meta">
                        <Tag size={12} /> {item.conditionPercent}% ·{' '}
                        {itemShop?.district ? `Q. ${itemShop.district}` : DA_NANG_CITY}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default PassDetailPage;
