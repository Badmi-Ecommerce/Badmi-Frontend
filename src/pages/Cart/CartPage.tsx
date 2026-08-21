import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useCart, useRemoveFromCart, useUpdateCartItem } from '../../hooks/useCart';
import { formatCurrency } from '../../utils';
import { ROUTES } from '../../constants/routes';
import orderApi from '../../api/orderApi';
import toast from 'react-hot-toast';
import { useState } from 'react';

const CartPage = () => {
  const navigate = useNavigate();
  const { data: cartItems = [], isLoading } = useCart();
  const removeItem = useRemoveFromCart();
  const updateItem = useUpdateCartItem();
  const [checkingOut, setCheckingOut] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const shipping = subtotal > 500000 ? 0 : 30000;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      await orderApi.checkout({ paymentMethod: 'COD' });
      toast.success('Đặt hàng thành công!');
      navigate(ROUTES.ORDERS);
    } catch {
      // toast via interceptor / BE message
    } finally {
      setCheckingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 24 }}>Giỏ hàng</h1>

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
            <div className="cart-items">
              <div className="cart-header">
                <span>Sản phẩm</span>
                <span style={{ textAlign: 'center' }}>Đơn giá</span>
                <span style={{ textAlign: 'center' }}>Số lượng</span>
                <span style={{ textAlign: 'center' }}>Thành tiền</span>
                <span />
              </div>

              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-product">
                    <div className="cart-item-img">
                      <img
                        src={item.imageUrl || 'https://placehold.co/72x72/f9f9f9/999?text=SP'}
                        alt={item.productName}
                      />
                    </div>
                    <div>
                      <div className="cart-item-name">{item.productName}</div>
                      <div className="cart-item-sku">
                        {item.variantName} · SKU: {item.sku}
                      </div>
                    </div>
                  </div>

                  <div className="cart-item-price" style={{ textAlign: 'center' }}>
                    {formatCurrency(item.unitPrice)}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="qty-control">
                      <button
                        className="qty-btn"
                        style={{ width: 30, height: 30 }}
                        onClick={() =>
                          updateItem.mutate({
                            cartItemId: item.id,
                            quantity: Math.max(1, item.quantity - 1),
                          })
                        }
                      >
                        −
                      </button>
                      <span className="qty-value" style={{ width: 36, fontSize: '0.875rem' }}>
                        {item.quantity}
                      </span>
                      <button
                        className="qty-btn"
                        style={{ width: 30, height: 30 }}
                        onClick={() =>
                          updateItem.mutate({ cartItemId: item.id, quantity: item.quantity + 1 })
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', fontWeight: 700 }}>
                    {formatCurrency(item.lineTotal)}
                  </div>

                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={() => removeItem.mutate(item.id)}
                    aria-label="Xoá"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <aside className="cart-summary">
              <h3>Tóm tắt</h3>
              <div className="cart-summary-row">
                <span>Tạm tính</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="cart-summary-row">
                <span>Phí ship</span>
                <span>{shipping === 0 ? 'Miễn phí' : formatCurrency(shipping)}</span>
              </div>
              <div className="cart-summary-row total">
                <span>Tổng</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                type="button"
                disabled={checkingOut}
                onClick={handleCheckout}
              >
                {checkingOut ? 'Đang đặt hàng...' : 'Thanh toán COD'}
              </button>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 8 }}>
                Cần địa chỉ mặc định trên tài khoản để checkout.
              </p>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
