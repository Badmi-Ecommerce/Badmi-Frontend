import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ownerApi from '../../../api/ownerApi';
import { ROUTES } from '../../../constants/routes';
import { formatCurrency } from '../../../utils';

const OwnerDashboard = () => {
  const { data } = useQuery({
    queryKey: ['owner-dashboard'],
    queryFn: () => ownerApi.dashboard(),
  });
  const { data: products } = useQuery({
    queryKey: ['owner-products', 0],
    queryFn: () => ownerApi.listProducts(0, 5),
  });

  const recent = products?.content ?? [];

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Tổng quan kênh bán</h1>
        <Link to={ROUTES.OWNER_PRODUCTS} className="btn btn-primary">
          + Đăng sản phẩm
        </Link>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 28,
        }}
      >
        <div className="admin-card">
          <h3 style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginBottom: 8 }}>Tổng mặt hàng</h3>
          <p style={{ fontSize: 28, fontWeight: 800 }}>{data?.productCount ?? 0}</p>
        </div>
        <div className="admin-card">
          <h3 style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginBottom: 8 }}>Đang bán</h3>
          <p style={{ fontSize: 28, fontWeight: 800 }}>{data?.activeCount ?? 0}</p>
        </div>
        <div className="admin-card">
          <h3 style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginBottom: 8 }}>Đã ẩn</h3>
          <p style={{ fontSize: 28, fontWeight: 800 }}>{data?.hiddenCount ?? 0}</p>
        </div>
        <div className="admin-card">
          <h3 style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginBottom: 8 }}>Tổng tồn kho</h3>
          <p style={{ fontSize: 28, fontWeight: 800 }}>{data?.totalStock ?? 0}</p>
        </div>
      </div>

      <div className="admin-card">
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Sản phẩm mới đăng</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{formatCurrency(Number(product.price))}</td>
                <td>{product.stock}</td>
                <td>{product.isActive ? 'Đang bán' : 'Đã ẩn'}</td>
              </tr>
            ))}
            {recent.length === 0 && (
              <tr>
                <td colSpan={4}>Chưa có sản phẩm. Hãy đăng vợt, giày hoặc phụ kiện cầu lông của bạn.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OwnerDashboard;
