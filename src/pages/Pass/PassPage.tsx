import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Clock,
  Handshake,
  MapPin,
  Phone,
  Recycle,
  ShieldCheck,
  Store as StoreIcon,
  Tag,
  User2,
} from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { useShops } from '../../hooks/useShops';
import { useAuth } from '../../store/AuthContext';
import { formatCurrency } from '../../utils';
import type { Product, Shop } from '../../types';

const CITY = 'Đà Nẵng';
const ALL = 'Tất cả';
const PASS_IMAGE_FALLBACK =
  'https://placehold.co/800x600/FFF3E8/FF6600?text=H%C3%A0ng+pass+Badmishop';

const CONDITION_FILTERS = [
  { value: ALL, label: 'Mọi tình trạng', min: 0, max: 100 },
  { value: 'like-new', label: 'Như mới (95% +)', min: 95, max: 100 },
  { value: 'great', label: 'Rất tốt (90 - 94%)', min: 90, max: 94 },
  { value: 'good', label: 'Tốt (dưới 90%)', min: 0, max: 89 },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Mới đăng' },
  { value: 'price_asc', label: 'Giá: Thấp → Cao' },
  { value: 'price_desc', label: 'Giá: Cao → Thấp' },
  { value: 'condition', label: 'Tình trạng tốt nhất' },
];

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

const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  if (e.currentTarget.src !== PASS_IMAGE_FALLBACK) e.currentTarget.src = PASS_IMAGE_FALLBACK;
};

const PassCard = ({ product, shop }: { product: Product; shop?: Shop }) => {
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : 0;

  return (
    <article className="pass-card">
      <div className="pass-card-media">
        <img
          src={product.image || product.images?.[0] || PASS_IMAGE_FALLBACK}
          alt={product.name}
          loading="lazy"
          onError={handleImageError}
        />
        {product.conditionPercent && (
          <span className="pass-card-condition">
            {product.conditionPercent}% · {conditionLabel(product.conditionPercent)}
          </span>
        )}
        {discount > 0 && <span className="pass-card-discount">-{discount}%</span>}
      </div>

      <div className="pass-card-body">
        <Link to={`${ROUTES.PASS}/${product.slug}`} className="pass-card-name">
          {product.name}
        </Link>

        <div className="pass-card-price">
          <strong>{formatCurrency(Number(product.price))}</strong>
          {product.originalPrice && product.originalPrice > product.price && (
            <s>{formatCurrency(Number(product.originalPrice))}</s>
          )}
          {product.isNegotiable && (
            <span className="pass-card-negotiable">
              <Handshake size={12} /> Thương lượng
            </span>
          )}
        </div>

        <ul className="pass-card-meta">
          {product.usageDuration && (
            <li>
              <Clock size={14} /> {product.usageDuration}
            </li>
          )}
          {product.passReason && (
            <li>
              <Tag size={14} /> Lý do pass: {product.passReason}
            </li>
          )}
        </ul>

        <div className="pass-card-seller">
          <span className="pass-card-seller-avatar">
            {shop?.avatarUrl ? (
              <img src={shop.avatarUrl} alt={shop.shopName} loading="lazy" />
            ) : (
              initials(shop?.shopName)
            )}
          </span>
          <div>
            <p className="pass-card-seller-name">
              {shop?.shopName ?? 'Người bán Badmishop'}
              {shop?.shopType === 'SHOP' && <BadgeCheck size={13} />}
            </p>
            <p className="pass-card-seller-meta">
              {shop?.shopType === 'SHOP' ? <StoreIcon size={12} /> : <User2 size={12} />}
              {shop?.shopType === 'SHOP' ? 'Cửa hàng' : 'Cá nhân'}
              {shop?.district ? ` · Q. ${shop.district}` : ''}
            </p>
          </div>
        </div>

        <div className="pass-card-actions">
          <Link to={`${ROUTES.PASS}/${product.slug}`} className="btn btn-primary btn-sm">
            Xem chi tiết
          </Link>
          {shop?.phone && (
            <a href={`tel:${shop.phone.replace(/\s/g, '')}`} className="btn btn-outline btn-sm">
              <Phone size={14} /> Gọi người bán
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

const PassPage = () => {
  const [searchParams] = useSearchParams();
  const shopParam = searchParams.get('shop');
  const { isAuthenticated, user } = useAuth();

  const { data: passPage, isLoading } = useProducts({ page: 0, size: 48, listingType: 'PASS' });
  const { data: categories = [] } = useCategories();
  const { data: shops = [] } = useShops({ city: CITY });

  const [categoryId, setCategoryId] = useState(searchParams.get('category') ?? '');
  const [district, setDistrict] = useState(ALL);
  const [condition, setCondition] = useState(ALL);
  const [sort, setSort] = useState('newest');

  const shopByUser = useMemo(() => new Map(shops.map((s) => [s.userId, s])), [shops]);
  const districts = useMemo(
    () => [...new Set(shops.map((s) => s.district).filter((d): d is string => Boolean(d)))],
    [shops]
  );

  const listings = useMemo(() => {
    let items = (passPage?.content ?? []).filter((p) => p.isActive);

    if (shopParam) items = items.filter((p) => String(p.ownerId) === shopParam);
    if (categoryId) items = items.filter((p) => String(p.categoryId) === categoryId);
    if (district !== ALL) {
      items = items.filter((p) => shopByUser.get(p.ownerId ?? 0)?.district === district);
    }
    const range = CONDITION_FILTERS.find((c) => c.value === condition);
    if (range && condition !== ALL) {
      items = items.filter((p) => {
        const percent = p.conditionPercent ?? 0;
        return percent >= range.min && percent <= range.max;
      });
    }

    if (sort === 'price_asc') items = [...items].sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') items = [...items].sort((a, b) => b.price - a.price);
    else if (sort === 'condition') {
      items = [...items].sort((a, b) => (b.conditionPercent ?? 0) - (a.conditionPercent ?? 0));
    } else {
      items = [...items].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    return items;
  }, [passPage, shopParam, categoryId, district, condition, sort, shopByUser]);

  const activeShop = shopParam ? shopByUser.get(Number(shopParam)) : undefined;
  const postRoute = !isAuthenticated
    ? ROUTES.LOGIN
    : user?.role === 'owner'
      ? ROUTES.OWNER_PRODUCTS
      : ROUTES.PROFILE;

  return (
    <div className="pass-page">
      {/* ── Banner ── */}
      <section className="pass-hero">
        <div className="container pass-hero-inner">
          <div>
            <p className="pass-hero-kicker">
              <Recycle size={14} /> Hàng pass · {CITY}
            </p>
            <h1 className="pass-hero-title">Chợ pass dụng cụ cầu lông</h1>
            <p className="pass-hero-text">
              Nơi người chơi và chủ shop tại Đà Nẵng pass lại vợt, giày, balo còn tốt. Mỗi tin đều
              ghi rõ tình trạng phần trăm, thời gian đã dùng và lý do pass.
            </p>
            <div className="pass-hero-cta">
              <Link to={postRoute} className="btn btn-primary btn-lg">
                <Recycle size={16} /> Đăng tin pass
              </Link>
              <Link to={ROUTES.STORES} className="pass-hero-link">
                Xem người bán tại Đà Nẵng <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <ul className="pass-hero-tips">
            <li>
              <ShieldCheck size={18} /> Tình trạng hàng ghi theo % và ảnh thật của người bán.
            </li>
            <li>
              <MapPin size={18} /> Hẹn xem hàng trực tiếp trong nội thành trước khi chốt.
            </li>
            <li>
              <Handshake size={18} /> Tin có nhãn “Thương lượng” là người bán chấp nhận trả giá.
            </li>
          </ul>
        </div>
      </section>

      <section className="container pass-body">
        {activeShop && (
          <div className="pass-shop-banner">
            <span>
              Đang xem tin pass của <strong>{activeShop.shopName}</strong>
              {activeShop.district ? ` · Q. ${activeShop.district}` : ''}
            </span>
            <Link to={ROUTES.PASS} className="store-action-link">
              Xem tất cả tin pass <ArrowRight size={14} />
            </Link>
          </div>
        )}

        <div className="pass-toolbar">
          <div className="pass-filters">
            <label className="pass-field">
              <span>Loại hàng</span>
              <select
                className="sort-select"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Tất cả loại</option>
                {categories.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="pass-field">
              <span>Khu vực</span>
              <select
                className="sort-select"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              >
                {[ALL, ...districts].map((d) => (
                  <option key={d} value={d}>
                    {d === ALL ? 'Tất cả quận' : `Q. ${d}`}
                  </option>
                ))}
              </select>
            </label>

            <label className="pass-field">
              <span>Tình trạng</span>
              <select
                className="sort-select"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              >
                {CONDITION_FILTERS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="pass-field">
            <span>Sắp xếp</span>
            <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="results-count">
          <strong>{listings.length}</strong> tin pass
        </p>

        {isLoading ? (
          <div className="pass-grid">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="skeleton" style={{ height: 430 }} />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏸</div>
            <h3 className="empty-state-title">Chưa có tin pass phù hợp</h3>
            <p className="empty-state-text">
              Thử bỏ bộ lọc, hoặc đăng tin pass dụng cụ bạn không còn dùng.
            </p>
            <Link to={postRoute} className="btn btn-primary">
              Đăng tin pass
            </Link>
          </div>
        ) : (
          <div className="pass-grid">
            {listings.map((product) => (
              <PassCard
                key={product.id}
                product={product}
                shop={shopByUser.get(product.ownerId ?? 0)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default PassPage;
