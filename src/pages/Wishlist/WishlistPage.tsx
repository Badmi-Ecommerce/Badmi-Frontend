import { Link } from 'react-router-dom';
import { useWishlist, useRemoveFromWishlist } from '../../hooks/useWishlist';
import { formatCurrency } from '../../utils';
import { ROUTES } from '../../constants/routes';

const WishlistPage = () => {
  const { data: items = [], isLoading } = useWishlist();
  const removeItem = useRemoveFromWishlist();

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '32px 0' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 24 }}>Sản phẩm yêu thích</h1>
      {items.length === 0 ? (
        <div className="empty-state">
          <h3 className="empty-state-title">Chưa có sản phẩm yêu thích</h3>
          <Link to={ROUTES.PRODUCTS} className="btn btn-primary">
            Khám phá sản phẩm
          </Link>
        </div>
      ) : (
        <div className="products-grid">
          {items.map((item) => (
            <div key={item.id} className="product-card" style={{ cursor: 'default' }}>
              <Link to={ROUTES.PRODUCT_DETAIL.replace(':slug', item.productSlug)}>
                <div className="product-card-img-wrap">
                  <img
                    src={item.imageUrl || 'https://placehold.co/300x300/f5f5f5/999?text=SP'}
                    alt={item.productName}
                  />
                </div>
                <div className="product-card-info">
                  <h3 className="product-name">{item.productName}</h3>
                  <div className="product-price">{formatCurrency(item.price)}</div>
                </div>
              </Link>
              <button
                className="btn btn-secondary"
                style={{ margin: 12 }}
                type="button"
                onClick={() => removeItem.mutate(item.id)}
              >
                Xoá
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
