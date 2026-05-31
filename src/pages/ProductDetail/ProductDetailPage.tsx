import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, ChevronRight, Minus, Plus } from 'lucide-react';
import { mockProducts, mockCategories } from '../../mocks/data';
import { formatCurrency, calcDiscount } from '../../utils';
import { useAddToCart } from '../../hooks/useCart';
import { useAuth } from '../../store/AuthContext';
import { ROUTES } from '../../constants/routes';
import ProductCard from '../../components/shared/ProductCard/ProductCard';
import type { Product } from '../../types';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate  = useNavigate();
  const { isAuthenticated } = useAuth();
  const addToCart = useAddToCart();

  const product = mockProducts.find(p => p.slug === slug);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  if (!product) {
    return (
      <div className="not-found-page">
        <div>
          <div className="not-found-code">404</div>
          <h2 className="not-found-title">Sản phẩm không tồn tại</h2>
          <p className="not-found-text">Sản phẩm bạn tìm không còn hoặc đã bị xoá.</p>
          <Link to={ROUTES.PRODUCTS} className="btn btn-primary">Xem tất cả sản phẩm</Link>
        </div>
      </div>
    );
  }

  const category  = mockCategories.find(c => c.id === product.category_id);
  const discount  = calcDiscount(product.price, product.original_price ?? 0);
  const allImages = [product.image, ...(product.images ?? [])].filter(Boolean) as string[];
  const related   = mockProducts.filter(p => p.category_id === product.category_id && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng.');
      navigate(ROUTES.LOGIN);
      return;
    }
    addToCart.mutate({ productId: product.id, quantity: qty });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate(ROUTES.CART);
  };

  const handleAddRelated = (p: Product) => {
    if (!isAuthenticated) { toast.error('Vui lòng đăng nhập.'); return; }
    addToCart.mutate({ productId: p.id, quantity: 1 });
  };

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="product-detail-breadcrumb">
          <Link to={ROUTES.HOME}>Trang chủ</Link>
          <ChevronRight size={14} className="breadcrumb-sep" />
          <Link to={ROUTES.PRODUCTS}>Sản phẩm</Link>
          {category && (
            <>
              <ChevronRight size={14} className="breadcrumb-sep" />
              <Link to={`${ROUTES.PRODUCTS}?category=${category.id}`}>{category.name}</Link>
            </>
          )}
          <ChevronRight size={14} className="breadcrumb-sep" />
          <span style={{ color: 'var(--color-text-primary)' }}>{product.name}</span>
        </nav>

        {/* Detail card */}
        <div className="product-detail-layout">
          {/* Gallery */}
          <div>
            <div className="product-gallery-main">
              <img
                src={allImages[activeImg] || `https://placehold.co/500x500/f9f9f9/999?text=${encodeURIComponent(product.name.slice(0, 10))}`}
                alt={product.name}
              />
            </div>
            {allImages.length > 1 && (
              <div className="product-gallery-thumbs">
                {allImages.map((img, i) => (
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

          {/* Info */}
          <div>
            <span className="product-detail-brand-tag">
              {['Yonex','Victor','Li-Ning','Mizuno','Kamito'][( product.brand_id ?? 1) - 1] ?? 'Badmishop'}
            </span>
            <h1 className="product-detail-name">{product.name}</h1>
            <p className="product-detail-sku">SKU: {product.sku}</p>

            {/* Stock */}
            <div className="stock-tag">
              <span className="stock-dot" />
              {product.stock > 0 ? `Còn hàng (${product.stock} sản phẩm)` : 'Hết hàng'}
            </div>

            {/* Price */}
            {product.price > 0 ? (
              <>
                <div className="product-detail-price">{formatCurrency(product.price)}</div>
                {product.original_price && product.original_price > product.price && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                    <span className="product-detail-original">{formatCurrency(product.original_price)}</span>
                    <span className="badge badge-sale">-{discount}%</span>
                  </div>
                )}
              </>
            ) : (
              <div className="product-detail-price" style={{ color: 'var(--color-text-secondary)' }}>Liên hệ</div>
            )}

            {/* Description */}
            <p className="product-detail-desc">
              {product.description || `${product.name} - Sản phẩm chính hãng từ Badmishop. Cam kết chất lượng 100%, bảo hành đầy đủ từ nhà sản xuất.`}
            </p>

            {/* Quantity */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 10, color: 'var(--color-text-secondary)' }}>Số lượng</div>
              <div className="qty-control">
                <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}><Minus size={16} /></button>
                <span className="qty-value">{qty}</span>
                <button className="qty-btn" onClick={() => setQty(q => Math.min(product.stock, q + 1))}><Plus size={16} /></button>
              </div>
            </div>

            {/* Actions */}
            <div className="product-detail-actions">
              <button
                className="btn btn-primary btn-lg"
                style={{ flex: 1 }}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart size={18} />
                Thêm vào giỏ
              </button>
              <button
                className="btn btn-outline btn-lg"
                style={{ flex: 1 }}
                onClick={handleBuyNow}
                disabled={product.stock === 0}
              >
                Mua ngay
              </button>
              <button className="btn btn-ghost btn-lg" title="Yêu thích" style={{ padding: '14px' }}>
                <Heart size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <h2 className="section-title">Sản phẩm liên quan</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {related.map(p => (
                <ProductCard key={p.id} product={p} onAddToCart={handleAddRelated} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
