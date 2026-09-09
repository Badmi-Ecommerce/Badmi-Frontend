import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import orderApi from '../../api/orderApi';
import { QUERY_KEYS } from '../../constants';
import { ROUTES } from '../../constants/routes';
import { formatCurrency } from '../../utils';
import toast from 'react-hot-toast';

const OrderDetailPage = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { data: order, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.ORDER, id],
    queryFn: () => orderApi.detail(id!),
    enabled: Boolean(id),
  });

  const pay = useMutation({
    mutationFn: () => orderApi.pay(id!),
    onSuccess: () => {
      toast.success('Thanh toán thành công (mock gateway)');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDER, id] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
    },
  });

  if (isLoading || !order) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  const onlineUnpaid =
    order.paymentMethod !== 'COD' &&
    order.paymentStatus === 'UNPAID' &&
    order.status === 'PENDING';

  return (
    <div className="container" style={{ padding: '32px 0' }}>
      <Link to={ROUTES.ORDERS} style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>
        ← Đơn hàng của tôi
      </Link>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '12px 0 8px' }}>
        {order.orderCode}
      </h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 24 }}>
        {order.status} · {order.paymentStatus}
        {order.paymentMethod ? ` · ${order.paymentMethod}` : ''}
      </p>

      <div className="admin-card" style={{ marginBottom: 16 }}>
        <h3 style={{ marginBottom: 12 }}>Sản phẩm</h3>
        {order.items.map((item) => (
          <div key={item.id} className="cart-summary-row">
            <span>
              {item.productName} × {item.quantity}
            </span>
            <span>{formatCurrency(Number(item.lineTotal))}</span>
          </div>
        ))}
        <div className="cart-summary-row">
          <span>Tạm tính</span>
          <span>{formatCurrency(Number(order.subtotal))}</span>
        </div>
        <div className="cart-summary-row">
          <span>Giảm giá {order.voucherCode ? `(${order.voucherCode})` : ''}</span>
          <span>{formatCurrency(Number(order.discountAmount ?? 0))}</span>
        </div>
        <div className="cart-summary-row">
          <span>Phí ship</span>
          <span>{formatCurrency(Number(order.shippingFee))}</span>
        </div>
        <div className="cart-summary-row">
          <span>Thuế</span>
          <span>{formatCurrency(Number(order.taxAmount ?? 0))}</span>
        </div>
        <div className="cart-summary-row total">
          <span>Tổng</span>
          <span>{formatCurrency(Number(order.grandTotal))}</span>
        </div>
      </div>

      <div className="admin-card" style={{ marginBottom: 16 }}>
        <h3 style={{ marginBottom: 8 }}>Giao đến</h3>
        <p>
          {order.recipientName} · {order.recipientPhone}
        </p>
        <p>
          {order.shippingAddress}
          {order.shippingWard ? `, ${order.shippingWard}` : ''}
          {order.shippingDistrict ? `, ${order.shippingDistrict}` : ''}
          {order.shippingProvince ? `, ${order.shippingProvince}` : ''}
        </p>
      </div>

      {order.paymentMethod === 'COD' && order.paymentStatus === 'UNPAID' && (
        <p className="checkout-hint">COD: thanh toán khi nhận hàng. Đơn này không tự huỷ vì timeout.</p>
      )}

      {onlineUnpaid && (
        <button
          className="btn btn-primary"
          type="button"
          disabled={pay.isPending}
          onClick={() => pay.mutate()}
        >
          {pay.isPending ? 'Đang thanh toán...' : 'Thanh toán ngay (mock)'}
        </button>
      )}

      {order.paymentStatus === 'PAID' && (
        <p className="checkout-hint">Đã thanh toán · đơn {order.status}</p>
      )}
      {order.status === 'CANCELLED' && (
        <p className="checkout-hint">Đơn đã huỷ, tồn kho đã hoàn.</p>
      )}
    </div>
  );
};

export default OrderDetailPage;
