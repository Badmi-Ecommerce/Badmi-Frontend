import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { ROUTES } from '../constants/routes';

const OwnerRoute = () => {
  const { isLoading, isAuthenticated, user } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (user?.role !== 'owner') {
    return <Navigate to={ROUTES.PROFILE} replace />;
  }

  return <Outlet />;
};

export default OwnerRoute;
