import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/shared/AdminSidebar/AdminSidebar';
import AdminHeader from '../components/shared/AdminHeader/AdminHeader';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
