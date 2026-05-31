import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

const WishlistPage = () => {
  // In a real app, this would use useWishlist() hook from React Query
  const wishlistItems: any[] = [];

  return (
    <div className="wishlist-page">
      <div className="container">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 8 }}>❤️ Sản phẩm yêu thích</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: 24 }}>
          {wishlistItems.length} sản phẩm
        </p>

        {wishlistItems.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Heart size={60} color="var(--color-primary)" strokeWidth={1.5} /></div>
            <h3 className="empty-state-title">Chưa có sản phẩm yêu thích</h3>
            <p className="empty-state-text">Hãy thêm sản phẩm yêu thích để theo dõi sau này!</p>
            <Link to={ROUTES.PRODUCTS} className="btn btn-primary">Khám phá sản phẩm</Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {/* ProductCard items will render here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
