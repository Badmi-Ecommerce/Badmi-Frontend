import { useMemo, useState } from 'react';
import { useParams, Link, useNavigate, Navigate } from 'react-router-dom';
import { ShoppingCart, Heart, ChevronRight, Minus, Plus } from 'lucide-react';
import { formatCurrency, calcDiscount } from '../../utils';
import { useProductBySlug, useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { useAddToCart } from '../../hooks/useCart';
import { useAddToWishlist } from '../../hooks/useWishlist';
import { useAuth } from '../../store/AuthContext';
import { ROUTES } from '../../constants/routes';
import ProductCard from '../../components/shared/ProductCard/ProductCard';
import type { Product } from '../../types';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const addToCart = useAddToCart();
  const addWishlist = useAddToWishlist();

  const { data: product, isLoading, isError } = useProductBySlug(slug || '');
  const { data: categories = [] } = useCategories();
  const { data: relatedPage } = useProducts({ page: 0, size: 24 });

  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [variantId, setVariantId] = useState<number | null>(null);

  const selectedVariant = useMemo(() => {
    if (!product?.variants?.length) return null;
    const id = variantId ?? product.variants[0].id;
    return product.variants.find((v) => v.id === id) ?? product.variants[0];
  }, [product, variantId]);

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
          <h2 className="not-found-title">Sản phẩm không tồn tại</h2>
          <p className="not-found-text">Sản phẩm bạn tìm không còn hoặc đã bị xoá.</p>
          <Link to={ROUTES.PRODUCTS} className="btn btn-primary">
            Xem tất cả sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  // Tin pass có trang riêng kèm thông tin liên hệ người bán.
  if (product.listingType === 'PASS') {
    return <Navigate to={`${ROUTES.PASS}/${product.slug}`} replace />;
  }

  const category = categories.find((c) => c.id === product.categoryId);
  const price = selectedVariant?.price ?? product.price;
  const originalPrice = selectedVariant?.originalPrice ?? product.originalPrice ?? 0;
  const discount = calcDiscount(price, originalPrice);
  const allImages = [product.image, ...(product.images ?? [])].filter(Boolean) as string[];
  const related = (relatedPage?.content ?? [])
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  const requireAuth = () => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để tiếp tục.');
      navigate(ROUTES.LOGIN);
      return false;
    }
    return true;
  };

  const handleAddToCart = () => {
    if (!requireAuth()) return;
    if (!selectedVariant) {
      toast.error('Sản phẩm chưa có biến thể.');
      return;
    }
    addToCart.mutate({ variantId: selectedVariant.id, quantity: qty });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate(ROUTES.CART);
  };

  const handleAddRelated = (p: Product) => {
    if (!requireAuth()) return;
    const id = p.variants?.[0]?.id;
    if (!id) {
      toast.error('Sản phẩm chưa có biến thể.');
      return;
    }
    addToCart.mutate({ variantId: id, quantity: 1 });
  };

  return (
    <div className="product-detail-page">
      <div className="container">
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

        <div className="product-detail-layout">
          <div>
            <div className="product-gallery-main">
              <img
                src={
                  allImages[activeImg] ||
                  `https://placehold.co/500x500/f9f9f9/999?text=${encodeURIComponent(product.name.slice(0, 10))}`
                }
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

          <div>
            <h1 className="product-detail-title">{product.name}</h1>
            <p className="product-detail-sku">SKU: {selectedVariant?.sku ?? product.sku}</p>

            {product.variants && product.variants.length > 1 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Biến thể</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      className={`btn ${selectedVariant?.id === v.id ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setVariantId(v.id)}
                    >
                      {v.variantName}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="product-detail-price">
              <span className="product-price">{formatCurrency(price)}</span>
              {discount > 0 && (
                <>
                  <span className="product-original-price">{formatCurrency(originalPrice)}</span>
                  <span className="badge badge-sale">-{discount}%</span>
                </>
              )}
            </div>

            <p style={{ margin: '16px 0', color: 'var(--color-text-secondary)' }}>
              {product.description || 'Sản phẩm chính hãng Badmishop.'}
            </p>

            <div className="qty-control" style={{ marginBottom: 16 }}>
              <button className="qty-btn" type="button" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                <Minus size={14} />
              </button>
              <span className="qty-value">{qty}</span>
              <button className="qty-btn" type="button" onClick={() => setQty((q) => q + 1)}>
                <Plus size={14} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button className="btn btn-primary" type="button" onClick={handleAddToCart}>
                <ShoppingCart size={16} /> Thêm vào giỏ
              </button>
              <button className="btn btn-secondary" type="button" onClick={handleBuyNow}>
                Mua ngay
              </button>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => {
                  if (!requireAuth()) return;
                  addWishlist.mutate(product.id);
                }}
              >
                <Heart size={16} /> Yêu thích
              </button>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section style={{ marginTop: 48 }}>
            <h2 style={{ marginBottom: 16 }}>Sản phẩm liên quan</h2>
            <div className="products-grid">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} onAddToCart={handleAddRelated} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
