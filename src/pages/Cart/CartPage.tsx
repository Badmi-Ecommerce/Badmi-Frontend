import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useCart, useRemoveFromCart, useUpdateCartItem } from '../../hooks/useCart';
import { formatCurrency } from '../../utils';
import { ROUTES } from '../../constants/routes';

const CartPage = () => {
  const { data: cartItems = [], isLoading } = useCart();
  const removeItem   = useRemoveFromCart();
  const updateItem   = useUpdateCartItem();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.price ?? 0) * item.quantity, 0
  );
  const shipping = subtotal > 500000 ? 0 : 30000;
  const total    = subtotal + shipping;

  if (isLoading) return (
    <div className="loading-screen"><div className="spinner" /></div>
  );

  return (
    <div className="cart-page">
      <div className="container">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 24 }}>🛒 Giỏ hàng</h1>

        {cartItems.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🛒</div>
            <h3 className="empty-state-title">Giỏ hàng trống</h3>
            <p className="empty-state-text">Hãy chọn thêm sản phẩm để vào giỏ hàng nhé!</p>
            <Link to={ROUTES.PRODUCTS} className="btn btn-primary">
              <ShoppingBag size={16} /> Mua sắm ngay
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            {/* Cart items */}
            <div className="cart-items">
              <div className="cart-header">
                <span>Sản phẩm</span>
                <span style={{ textAlign: 'center' }}>Đơn giá</span>
                <span style={{ textAlign: 'center' }}>Số lượng</span>
                <span style={{ textAlign: 'center' }}>Thành tiền</span>
                <span />
              </div>

              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-product">
                    <div className="cart-item-img">
                      <img
                        src={item.product?.image || `https://placehold.co/72x72/f9f9f9/999?text=SP`}
                        alt={item.product?.name}
                      />
                    </div>
                    <div>
                      <div className="cart-item-name">{item.product?.name}</div>
                      <div className="cart-item-sku">SKU: {item.product?.sku}</div>
                    </div>
                  </div>

                  <div className="cart-item-price" style={{ textAlign: 'center' }}>
                    {formatCurrency(item.product?.price ?? 0)}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="qty-control">
                      <button
                        className="qty-btn"
                        style={{ width: 30, height: 30 }}
                        onClick={() => updateItem.mutate({ cartItemId: item.id, quantity: Math.max(1, item.quantity - 1) })}
                      >−</button>
                      <span className="qty-value" style={{ width: 36, fontSize: '0.875rem' }}>{item.quantity}</span>
                      <button
                        className="qty-btn"
                        style={{ width: 30, height: 30 }}
                        onClick={() => updateItem.mutate({ cartItemId: item.id, quantity: item.quantity + 1 })}
                      >+</button>
                    </div>
                  </div>

                  <div className="cart-item-subtotal" style={{ textAlign: 'center' }}>
                    {formatCurrency((item.product?.price ?? 0) * item.quantity)}
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeItem.mutate(item.id)}
                    title="Xoá"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="cart-summary">
              <h3 className="cart-summary-title">Tóm tắt đơn hàng</h3>
              <div className="summary-row">
                <span>Tạm tính</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="summary-row">
                <span>Phí vận chuyển</span>
                <span style={{ color: shipping === 0 ? 'var(--color-success)' : undefined }}>
                  {shipping === 0 ? 'Miễn phí' : formatCurrency(shipping)}
                </span>
              </div>
              {subtotal > 0 && subtotal < 500000 && (
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 8 }}>
                  Mua thêm {formatCurrency(500000 - subtotal)} để được miễn phí vận chuyển
                </p>
              )}
              <div className="summary-total-row">
                <span>Tổng cộng</span>
                <span className="summary-total-amount">{formatCurrency(total)}</span>
              </div>
              <button className="btn btn-primary btn-full btn-lg" style={{ marginTop: 16 }}>
                Tiến hành thanh toán
              </button>
              <Link to={ROUTES.PRODUCTS} className="btn btn-ghost btn-full" style={{ marginTop: 10, justifyContent: 'center' }}>
                ← Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
