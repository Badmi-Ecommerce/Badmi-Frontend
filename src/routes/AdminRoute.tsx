import { Outlet } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

const AdminRoute = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  // Check if logged in and role is admin
  // TẠM THỜI COMMENT LẠI ĐỂ DEV CÓ THỂ VÀO TEST TRỰC TIẾP
  // if (isAuthenticated && user?.role === 'admin') {
  //   return <Outlet />;
  // }

  // Otherwise, redirect to login or home (let's use home or forbidden, usually redirect logged in users to home, logged out to login)
  // return <Navigate to={isAuthenticated ? ROUTES.HOME : ROUTES.LOGIN} replace />;

  // Luôn luôn cho phép vào trang admin để test
  return <Outlet />;
};

export default AdminRoute;
