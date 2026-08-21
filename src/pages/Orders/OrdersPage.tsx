import { useQuery } from '@tanstack/react-query';
import orderApi from '../../api/orderApi';
import { QUERY_KEYS } from '../../constants';
import { formatCurrency } from '../../utils';

const OrdersPage = () => {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: [QUERY_KEYS.ORDERS],
    queryFn: () => orderApi.mine(),
  });

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '32px 0' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 24 }}>Đơn hàng của tôi</h1>
      {orders.length === 0 ? (
        <div className="empty-state">
          <h3 className="empty-state-title">Chưa có đơn hàng</h3>
        </div>
      ) : (
        <div className="admin-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Trạng thái</th>
                <th>Thanh toán</th>
                <th>SP</th>
                <th>Tổng</th>
                <th>Giao đến</th>
                <th>Ngày</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.orderCode}</td>
                  <td>{order.status}</td>
                  <td>{order.paymentStatus}</td>
                  <td>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                  <td>{formatCurrency(Number(order.grandTotal))}</td>
                  <td>
                    {order.shippingAddress}, {order.shippingProvince}
                  </td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
