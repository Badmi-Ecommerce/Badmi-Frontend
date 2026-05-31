import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Play, ChevronRight } from 'lucide-react';
import ProductCard from '../../components/shared/ProductCard/ProductCard';
import { mockCategories, mockProducts } from '../../mocks/data';
import { useAddToCart } from '../../hooks/useCart';
import { useAuth } from '../../store/AuthContext';
import { ROUTES } from '../../constants/routes';
import { HOTLINE, WEBSITE } from '../../constants';
import type { Product } from '../../types';
import toast from 'react-hot-toast';

// ─── Mock store images ──────────────────────────────────
const STORES = [
  { id: 1, tag: 'CS10', name: 'Badmishop Thạc Ngọc Hiếu', img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80' },
  { id: 2, tag: 'CS11', name: 'Badmishop Nguyễn Trãi', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80' },
  { id: 3, tag: 'CS1',  name: 'Badmishop Trường Chinh', img: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400&q=80' },
  { id: 4, tag: 'CS2',  name: 'Badmishop Tôn Phú',    img: 'https://images.unsplash.com/photo-1586880244406-556ebe35f282?w=400&q=80' },
  { id: 5, tag: 'CS3',  name: 'Badmishop Long Biên',  img: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&q=80' },
];

const CATEGORY_PASTEL = ['#FFE8E8', '#E8F0FF', '#E8FFF3', '#FFFBE8', '#F3E8FF', '#FFF3E8', '#FFE8F5', '#E8FFFA'];

// ─── Sub-sections ───────────────────────────────────────
const rackets = mockProducts.filter(p => p.category_id === 1);
const bags    = mockProducts.filter(p => p.category_id === 3);

interface ProductSectionProps {
  title: string;
  products: Product[];
  bannerLabel: string;
  bannerSub: string;
  imgUrl: string;
  onAddToCart: (p: Product) => void;
}

const ProductSection = ({ title, products, bannerLabel, bannerSub, imgUrl, onAddToCart }: ProductSectionProps) => {
  const navigate = useNavigate();
  return (
    <section className="products-section">
      <div className="container">
        <div className="product-section-header">
          <h2 className="product-section-title">{title}</h2>
          <Link to={ROUTES.PRODUCTS} className="view-all-btn">
            Xem tất cả <ChevronRight size={16} />
          </Link>
        </div>

        <div className="product-section-body">
          {/* Featured banner */}
          <div
            className="featured-banner"
            onClick={() => navigate(ROUTES.PRODUCTS)}
          >
            <span className="featured-banner-badge">⊕ FBSHOP</span>
            <img
              src={imgUrl}
              alt={bannerLabel}
              className="featured-banner-img"
            />
            <div className="featured-banner-category">{bannerLabel}</div>
            <div className="featured-banner-sub">{bannerSub}</div>
            <span className="featured-banner-cta">
              Xem ngay <ArrowRight size={14} />
            </span>
          </div>

          {/* Products grid */}
          <div className="products-grid">
            {products.slice(0, 6).map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Main HomePage ──────────────────────────────────────
const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const addToCart = useAddToCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [activeDot, setActiveDot] = useState(0);

  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng.');
      navigate(ROUTES.LOGIN);
      return;
    }
    addToCart.mutate({ productId: product.id, quantity: 1 });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`${ROUTES.PRODUCTS}?search=${encodeURIComponent(searchQuery)}&category=${selectedCategory}`);
  };

  return (
    <div>
      {/* ── Hero Banner ── */}
      <section className="hero-banner">
        <div className="hero-placeholder">
          <div className="hero-stripes" />
          <div className="hero-stripes-right" />
          <div className="hero-content">
            <p className="hero-subtitle">Siêu phẩm 🏸</p>
            <h1 className="hero-title">Yonex Power<br />Cushion 65Z VA</h1>
            <p className="hero-hotline">HOTLINE: {HOTLINE} &nbsp;|&nbsp; WEBSITE: {WEBSITE}</p>
            <Link to={ROUTES.PRODUCTS} className="hero-cta">
              <span className="hero-play-icon"><Play size={12} fill="white" /></span>
              Mua ngay
            </Link>
          </div>
          {/* Decorative shuttlecock */}
          <div style={{ position:'absolute', right:'5%', top:'50%', transform:'translateY(-50%)', fontSize:'8rem', opacity:0.08, fontWeight:900, letterSpacing:-4, userSelect:'none' }}>
            BADMINTON
          </div>
        </div>
        <div className="hero-dots">
          {[0,1,2].map(i => (
            <div key={i} className={`hero-dot${activeDot===i?' active':''}`} onClick={() => setActiveDot(i)} />
          ))}
        </div>
      </section>

      {/* ── Search Section ── */}
      <section className="search-section">
        <div className="container">
          <div className="search-section-inner">
            <span className="search-label">Bạn đang tìm gì?</span>
            <form className="search-bar-combo" onSubmit={handleSearch} style={{ flex: 1 }}>
              <select
                className="search-category-select"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
              >
                <option value="">Tất cả danh mục</option>
                {mockCategories.map(c => (
                  <option key={c.id} value={String(c.id)}>{c.name}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Nhập từ khoá..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-submit">
                <Search size={16} /> Tìm kiếm
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── Category Grid ── */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2>Danh mục sản phẩm</h2>
          </div>
          <div className="categories-grid">
            {mockCategories.map((cat, idx) => (
              <Link key={cat.id} to={`${ROUTES.PRODUCTS}?category=${cat.id}`} className="category-card">
                <div className="category-card-img" style={{ background: CATEGORY_PASTEL[idx % CATEGORY_PASTEL.length] }}>
                  <img
                    src={cat.image || `https://placehold.co/200x150/f5f5f5/999?text=${encodeURIComponent(cat.name)}`}
                    alt={cat.name}
                    loading="lazy"
                  />
                </div>
                <div className="category-card-name">{cat.name}</div>
              </Link>
            ))}
          </div>
          <div className="category-dots">
            {[0,1].map(i => (
              <div key={i} className={`category-dot${i===0?' active':''}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ── About Section ── */}
      <section className="about-section">
        <div className="container">
          <div className="about-inner">
            <div>
              <h2 className="about-heading">Đam mê cầu lông<br />cùng Badmishop</h2>
              <p className="about-text">
                Với xuất phát từ những người chơi cầu lông và đam mê cầu lông,
                Badmishop hiểu được sự cần thiết của các dụng cụ cầu lông chính hãng phụ vụ
                cho người chơi để mang lại những cảm giác thích thú nhất cho những người đam mê bộ môn này.
              </p>
              <p className="about-text">
                Với hệ thống Cửa hàng cầu lông trên toàn quốc số lượng khách hàng sẽ được thoải mái
                lựa chọn cho mình những dụng cụ phù hợp với trình độ và sở thích.
              </p>
              <p className="about-text"><strong>Badmishop Đồng Hành Cùng Đam Mê!</strong></p>
              <div className="about-btn">
                <Link to={ROUTES.STORES} className="btn btn-primary">
                  Về chúng tôi <ArrowRight size={16} />
                </Link>
              </div>
            </div>
            <div className="about-media">
              <img
                src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80"
                alt="Badmishop store"
              />
              <div className="about-play-overlay">
                <div className="play-btn-circle">▶</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Vợt Product Section ── */}
      <ProductSection
        title="Vợt cầu lông"
        products={rackets}
        bannerLabel="VỢT CẦU LÔNG"
        bannerSub="Badminton rackets"
        imgUrl="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80"
        onAddToCart={handleAddToCart}
      />

      {/* ── Balo Product Section ── */}
      <ProductSection
        title="Balo cầu lông"
        products={bags}
        bannerLabel="BALO CẦU LÔNG"
        bannerSub="Badminton backpack"
        imgUrl="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80"
        onAddToCart={handleAddToCart}
      />

      {/* ── Customer Reviews ── */}
      <section className="reviews-section">
        <div className="container">
          <div className="reviews-inner">
            <div>
              <h2 className="reviews-heading">Đánh giá từ khách hàng<br />của Badmishop</h2>
              <p className="reviews-sub">
                Badmishop đã phục vụ hơn 50.000 khách hàng trên toàn quốc,
                hầu hết đều cùng xem những đánh giá về sản phẩm tốt nhất.
              </p>
              <div className="reviews-stats">
                <div className="reviews-avatars">
                  {['N','T','L','M','K','P'].map((letter, i) => (
                    <div key={i} className="avatar"
                      style={{ background: ['#FF6600','#3b82f6','#22c55e','#f59e0b','#8b5cf6','#ec4899'][i] }}>
                      {letter}
                    </div>
                  ))}
                </div>
                <div className="reviews-count"><span>20,000+</span> Khách hàng trên toàn quốc</div>
              </div>

              <div className="review-card">
                <div className="review-quote">"</div>
                <p className="review-text">
                  Sản phẩm rất chất lượng, giao hàng nhanh và đúng hẹn. Nhân viên tư vấn nhiệt tình,
                  hiểu biết về sản phẩm. Tôi đã mua được chiếc vợt Yonex ưng ý nhất. Sẽ tiếp tục ủng hộ Badmishop!
                </p>
                <div className="stars">★★★★★</div>
                <div className="review-author" style={{ marginTop: 12 }}>
                  <div className="review-author-avatar">N</div>
                  <div>
                    <div className="review-author-name">Nguyễn Văn An</div>
                    <div className="review-author-role">Người chơi cầu lông</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="reviews-media">
              <img
                src="https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&q=80"
                alt="Badmishop store interior"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Store System ── */}
      <section className="stores-section">
        <div className="container">
          <div className="stores-header-row">
            <div>
              <h2 className="section-title" style={{ marginBottom: 8 }}>Hệ thống cửa hàng</h2>
              <p className="stores-description">
                Badmishop tự hào là hệ thống cửa hàng lớn nhất Hà Nội giúp bạn Khách hàng thuận tiện
                mua sắm và đặt hàng sản phẩm thể thao.
              </p>
            </div>
            <Link to={ROUTES.STORES} className="view-all-btn">
              Xem tất cả <ChevronRight size={16} />
            </Link>
          </div>
          <div className="stores-scroll">
            {STORES.map(store => (
              <div key={store.id} className="store-card">
                <div className="store-card-img">
                  <img src={store.img} alt={store.name} loading="lazy" />
                </div>
                <div className="store-card-info">
                  <div className="store-card-tag">{store.tag}: {store.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom Orange Banner ── */}
      <div style={{ background: 'var(--color-primary)', height: 8 }} />
    </div>
  );
};

export default HomePage;
