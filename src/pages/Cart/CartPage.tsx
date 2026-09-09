import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useCart, useRemoveFromCart, useUpdateCartItem } from '../../hooks/useCart';
import { formatCurrency } from '../../utils';
import { ROUTES } from '../../constants/routes';
import { QUERY_KEYS } from '../../constants';
import orderApi from '../../api/orderApi';
import addressApi from '../../api/addressApi';
import toast from 'react-hot-toast';
import { useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const PAYMENT_OPTIONS = [
  { value: 'COD', label: 'COD — thanh toán khi nhận hàng' },
  { value: 'BANK_TRANSFER', label: 'Chuyển khoản ngân hàng' },
  { value: 'VNPAY', label: 'VNPay (mock)' },
  { value: 'MOMO', label: 'MoMo (mock)' },
];

const CartPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: cartItems = [], isLoading } = useCart();
  const removeItem = useRemoveFromCart();
  const updateItem = useUpdateCartItem();
  const idempotencyKey = useRef(
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `chk-${Date.now()}-${Math.random().toString(16).slice(2)}`
  );
  const [checkingOut, setCheckingOut] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [voucherInput, setVoucherInput] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [addressId, setAddressId] = useState<number | ''>('');
  const [newAddress, setNewAddress] = useState({
    recipientName: '',
    recipientPhone: '',
    addressLine: '',
    ward: '',
    district: '',
    province: '',
  });

  const { data: addresses = [] } = useQuery({
    queryKey: [QUERY_KEYS.ADDRESSES],
    queryFn: () => addressApi.list(),
  });

  const selectedAddressId = addressId || addresses.find((a) => a.isDefault)?.id || addresses[0]?.id;

  const { data: quote } = useQuery({
    queryKey: [QUERY_KEYS.ORDERS, 'quote', voucherCode, cartItems.length],
    queryFn: () => orderApi.quote({ voucherCode: voucherCode || undefined }),
    enabled: cartItems.length > 0,
    retry: false,
  });

  const createAddress = useMutation({
    mutationFn: () =>
      addressApi.create({
        ...newAddress,
        isDefault: addresses.length === 0,
      }),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADDRESSES] });
      setAddressId(created.id);
      toast.success('Đã lưu địa chỉ');
    },
  });

  const fallbackSubtotal = cartItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const subtotal = Number(quote?.subtotal ?? fallbackSubtotal);
  const discount = Number(quote?.discountAmount ?? 0);
  const shipping = Number(quote?.shippingFee ?? (subtotal > 500000 ? 0 : 30000));
  const tax = Number(quote?.taxAmount ?? 0);
  const total = Number(quote?.grandTotal ?? subtotal + shipping);

  const canCheckout = useMemo(
    () => cartItems.length > 0 && Boolean(selectedAddressId) && !checkingOut,
    [cartItems.length, selectedAddressId, checkingOut]
  );

  const handleCheckout = async () => {
    if (!selectedAddressId || checkingOut) return;
    setCheckingOut(true);
    try {
      const order = await orderApi.checkout({
        addressId: selectedAddressId,
        paymentMethod,
        idempotencyKey: idempotencyKey.current,
        voucherCode: voucherCode || undefined,
      });
      toast.success('Đặt hàng thành công!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CART] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
      navigate(`/don-hang/${order.id}`);
    } catch {
      // interceptor shows BE message
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

                  <div className="cart-item-price">{formatCurrency(item.unitPrice)}</div>

                  <div className="cart-item-qty">
                    <div className="qty-control">
                      <button
                        className="qty-btn"
                        type="button"
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
                        type="button"
                        style={{ width: 30, height: 30 }}
                        onClick={() =>
                          updateItem.mutate({
                            cartItemId: item.id,
                            quantity: item.quantity + 1,
                          })
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-total">{formatCurrency(item.lineTotal)}</div>

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
              <h3>Thanh toán</h3>

              <label className="checkout-label">Địa chỉ giao hàng</label>
              {addresses.length > 0 ? (
                <select
                  className="input-field"
                  value={selectedAddressId ?? ''}
                  onChange={(e) => setAddressId(Number(e.target.value))}
                >
                  {addresses.map((address) => (
                    <option key={address.id} value={address.id}>
                      {address.recipientName} — {address.addressLine}, {address.province}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="checkout-address-form">
                  <input
                    className="input-field"
                    placeholder="Họ tên người nhận"
                    value={newAddress.recipientName}
                    onChange={(e) => setNewAddress((s) => ({ ...s, recipientName: e.target.value }))}
                  />
                  <input
                    className="input-field"
                    placeholder="Số điện thoại"
                    value={newAddress.recipientPhone}
                    onChange={(e) => setNewAddress((s) => ({ ...s, recipientPhone: e.target.value }))}
                  />
                  <input
                    className="input-field"
                    placeholder="Địa chỉ"
                    value={newAddress.addressLine}
                    onChange={(e) => setNewAddress((s) => ({ ...s, addressLine: e.target.value }))}
                  />
                  <input
                    className="input-field"
                    placeholder="Tỉnh / thành"
                    value={newAddress.province}
                    onChange={(e) => setNewAddress((s) => ({ ...s, province: e.target.value }))}
                  />
                  <button
                    className="btn btn-secondary"
                    type="button"
                    disabled={createAddress.isPending}
                    onClick={() => createAddress.mutate()}
                  >
                    Lưu địa chỉ
                  </button>
                </div>
              )}

              <label className="checkout-label">Phương thức thanh toán</label>
              <div className="checkout-radios">
                {PAYMENT_OPTIONS.map((option) => (
                  <label key={option.value} className="checkout-radio">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={option.value}
                      checked={paymentMethod === option.value}
                      onChange={() => setPaymentMethod(option.value)}
                    />
                    {option.label}
                  </label>
                ))}
              </div>

              <label className="checkout-label">Voucher</label>
              <div className="checkout-voucher">
                <input
                  className="input-field"
                  placeholder="BADMI10 / FREESHIP / BADMI50K"
                  value={voucherInput}
                  onChange={(e) => setVoucherInput(e.target.value)}
                />
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => setVoucherCode(voucherInput.trim().toUpperCase())}
                >
                  Áp dụng
                </button>
              </div>

              <div className="cart-summary-row">
                <span>Tạm tính</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="cart-summary-row">
                <span>Giảm giá</span>
                <span>{discount > 0 ? `- ${formatCurrency(discount)}` : '0 ₫'}</span>
              </div>
              <div className="cart-summary-row">
                <span>Phí ship</span>
                <span>{shipping === 0 ? 'Miễn phí' : formatCurrency(shipping)}</span>
              </div>
              {tax > 0 && (
                <div className="cart-summary-row">
                  <span>Thuế</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
              )}
              <div className="cart-summary-row total">
                <span>Tổng</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                type="button"
                disabled={!canCheckout}
                onClick={handleCheckout}
              >
                {checkingOut ? 'Đang đặt hàng...' : 'Đặt hàng'}
              </button>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 8 }}>
                Bấm 2 lần vẫn chỉ tạo 1 đơn (idempotency). Online: vào chi tiết đơn để thanh toán mock.
              </p>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
