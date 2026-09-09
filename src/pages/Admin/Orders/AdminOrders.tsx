import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import orderApi from '../../../api/orderApi';
import { QUERY_KEYS } from '../../../constants';
import { formatCurrency } from '../../../utils';
import type { Order, PagedResponse } from '../../../types';

const STATUSES = ['PENDING', 'CONFIRMED', 'PACKING', 'SHIPPING', 'DELIVERED', 'CANCELLED'];
const PAGE_SIZE = 20;

const AdminOrders = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const { data } = useQuery({
    queryKey: ['admin-orders', page, PAGE_SIZE],
    queryFn: () => orderApi.adminList(page, PAGE_SIZE) as Promise<PagedResponse<Order>>,
  });

  const status = useMutation({
    mutationFn: ({ id, value }: { id: number; value: string }) => orderApi.updateStatus(id, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
    },
  });

  const orders = data?.content ?? [];
  const totalPages = Math.max(data?.totalPages ?? 1, 1);

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Orders Management</h1>
      </div>
      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Items</th>
              <th>Total</th>
              <th>Address</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.orderCode}</td>
                <td>
                  {order.recipientName}
                  <br />
                  {order.recipientPhone}
                </td>
                <td>{order.status}</td>
                <td>{order.paymentStatus}</td>
                <td>{order.items.length}</td>
                <td>{formatCurrency(Number(order.grandTotal))}</td>
                <td>
                  {order.shippingAddress}, {order.shippingProvince}
                </td>
                <td>
                  <select
                    value={order.status}
                    disabled={
                      status.isPending || order.status === 'DELIVERED' || order.status === 'CANCELLED'
                    }
                    onChange={(event) => status.mutate({ id: order.id, value: event.target.value })}
                  >
                    {STATUSES.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={8}>Chưa có đơn hàng</td>
              </tr>
            )}
          </tbody>
        </table>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 16, alignItems: 'center' }}>
          <span style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>
            Trang {page + 1}/{totalPages} · {data?.totalElements ?? 0} đơn
          </span>
          <button
            className="btn"
            type="button"
            disabled={page <= 0}
            onClick={() => setPage((current) => Math.max(current - 1, 0))}
          >
            Trước
          </button>
          <button
            className="btn btn-primary"
            type="button"
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((current) => current + 1)}
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
