import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import type { Product } from '../../../types';
import { formatCurrency, calcDiscount } from '../../../utils';
import { ROUTES } from '../../../constants/routes';

interface Props {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onWishlist?: (product: Product) => void;
}

const BRAND_NAMES: Record<number, string> = {
  1: 'Yonex', 2: 'Victor', 3: 'Li-Ning', 4: 'Mizuno', 5: 'Kamito',
};

const ProductCard = ({ product, onAddToCart, onWishlist }: Props) => {
  const navigate = useNavigate();
  const discount = calcDiscount(product.price, product.original_price ?? 0);
  const brandName = product.brand?.name ?? BRAND_NAMES[product.brand_id ?? 0] ?? '';

  const handleNavigate = () => {
    navigate(ROUTES.PRODUCT_DETAIL.replace(':slug', product.slug));
  };

  return (
    <div className="product-card" onClick={handleNavigate}>
      {/* Badges */}
      <div className="product-card-badges">
        {discount > 0 && <span className="badge badge-sale">-{discount}%</span>}
        {product.stock <= 3 && product.stock > 0 && <span className="badge badge-hot">Hot</span>}
        {product.stock === 0 && <span className="badge badge-contact">Hết hàng</span>}
      </div>

      {/* Image */}
      <div className="product-card-img-wrap">
        <img
          src={product.image || `https://placehold.co/300x300/f5f5f5/999?text=${encodeURIComponent(product.name.slice(0, 10))}`}
          alt={product.name}
          loading="lazy"
        />
        {/* Actions overlay */}
        <div className="product-card-actions" onClick={(e) => e.stopPropagation()}>
          <button
            className="product-action-btn"
            title="Yêu thích"
            onClick={() => onWishlist?.(product)}
          >
            <Heart size={15} />
          </button>
          <button
            className="product-action-btn"
            title="Xem nhanh"
            onClick={handleNavigate}
          >
            <Eye size={15} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="product-card-info">
        {brandName && <span className="product-brand-tag">{brandName}</span>}
        <h3 className="product-name" title={product.name}>{product.name}</h3>

        <div className="product-price-wrap">
          {product.price > 0 ? (
            <>
              <span className="product-price">{formatCurrency(product.price)}</span>
              {product.original_price && product.original_price > product.price && (
                <span className="product-original-price">{formatCurrency(product.original_price)}</span>
              )}
            </>
          ) : (
            <span className="product-price-contact">Liên hệ</span>
          )}
        </div>

        <button
          className="product-add-to-cart"
          onClick={(e) => { e.stopPropagation(); onAddToCart?.(product); }}
        >
          <ShoppingCart size={13} style={{ display: 'inline', marginRight: 4 }} />
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
