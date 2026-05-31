import { mockProducts } from '../../../mocks/data';

const AdminDashboard = () => {
  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="admin-card">
          <h3 style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginBottom: '8px' }}>Total Income</h3>
          <p style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-text-primary)' }}>₫125,000,000</p>
        </div>
        <div className="admin-card">
          <h3 style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginBottom: '8px' }}>Total Orders</h3>
          <p style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-text-primary)' }}>342</p>
        </div>
        <div className="admin-card">
          <h3 style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginBottom: '8px' }}>Active Products</h3>
          <p style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-text-primary)' }}>{mockProducts.length}</p>
        </div>
        <div className="admin-card">
          <h3 style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginBottom: '8px' }}>Active Users</h3>
          <p style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-text-primary)' }}>1,204</p>
        </div>
      </div>

      <div className="admin-card">
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Recent Orders</h2>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#ORD-001</td>
                <td>Nguyen Van A</td>
                <td>2023-10-15</td>
                <td>₫3,250,000</td>
                <td><span className="badge badge-hot">Processing</span></td>
              </tr>
              <tr>
                <td>#ORD-002</td>
                <td>Tran Thi B</td>
                <td>2023-10-14</td>
                <td>₫1,500,000</td>
                <td><span className="badge badge-new">Completed</span></td>
              </tr>
              <tr>
                <td>#ORD-003</td>
                <td>Le Van C</td>
                <td>2023-10-12</td>
                <td>₫5,400,000</td>
                <td><span className="badge badge-new">Completed</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
