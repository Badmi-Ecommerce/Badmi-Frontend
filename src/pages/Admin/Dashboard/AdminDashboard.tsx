import { useQuery } from '@tanstack/react-query';
import adminApi from '../../../api/adminApi';
import orderApi from '../../../api/orderApi';
import { formatCurrency } from '../../../utils';
import type { Order, PagedResponse } from '../../../types';

const AdminDashboard = () => {
  const { data: products } = useQuery({
    queryKey: ['admin-products-dash'],
    queryFn: () => adminApi.listProducts(0, 1),
  });
  const { data: ordersPage } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => orderApi.adminList() as Promise<PagedResponse<Order>>,
  });

  const recent = (ordersPage?.content ?? []).slice(0, 5);
  const activeProducts = products?.totalElements ?? 0;
  const totalOrders = ordersPage?.totalElements ?? 0;

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 20,
          marginBottom: 32,
        }}
      >
        <div className="admin-card">
          <h3 style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginBottom: 8 }}>Total Orders</h3>
          <p style={{ fontSize: 28, fontWeight: 800 }}>{totalOrders}</p>
        </div>
        <div className="admin-card">
          <h3 style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginBottom: 8 }}>Products</h3>
          <p style={{ fontSize: 28, fontWeight: 800 }}>{activeProducts}</p>
        </div>
      </div>

      <div className="admin-card">
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Recent Orders</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((order) => (
              <tr key={order.id}>
                <td>{order.orderCode}</td>
                <td>{order.recipientName}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>{formatCurrency(Number(order.grandTotal))}</td>
                <td>
                  <span className="badge badge-hot">{order.status}</span>
                </td>
              </tr>
            ))}
            {recent.length === 0 && (
              <tr>
                <td colSpan={5}>Chưa có đơn hàng</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
