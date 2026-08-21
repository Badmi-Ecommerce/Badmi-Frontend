import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import PrivateRoute from './PrivateRoute';

import HomePage from '../pages/Home/HomePage';
import ProductsPage from '../pages/Products/ProductsPage';
import ProductDetailPage from '../pages/ProductDetail/ProductDetailPage';
import CartPage from '../pages/Cart/CartPage';
import WishlistPage from '../pages/Wishlist/WishlistPage';
import OrdersPage from '../pages/Orders/OrdersPage';
import ProfilePage from '../pages/Profile/ProfilePage';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import ForgotPasswordPage from '../pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/Auth/ResetPasswordPage';
import VerifyEmailPage from '../pages/Auth/VerifyEmailPage';
import NotFoundPage from '../pages/NotFound/NotFoundPage';

// Admin imports
import AdminLayout from '../layouts/AdminLayout';
import AdminRoute from './AdminRoute';
import AdminDashboard from '../pages/Admin/Dashboard/AdminDashboard';
import AdminProducts from '../pages/Admin/Products/AdminProducts';
import AdminCategories from '../pages/Admin/Categories/AdminCategories';
import AdminBrands from '../pages/Admin/Brands/AdminBrands';
import AdminOrders from '../pages/Admin/Orders/AdminOrders';

const AppRoutes = () => {
  return (
    <Routes>
      {/* ─── Public Routes (with main layout) ─── */}
      <Route element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.PRODUCTS} element={<ProductsPage />} />
        <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetailPage />} />
        <Route path={ROUTES.DEALS} element={<ProductsPage />} />
      </Route>

      {/* ─── Private Routes (require login) ─── */}
      <Route element={<MainLayout />}>
        <Route element={<PrivateRoute />}>
          <Route path={ROUTES.CART} element={<CartPage />} />
          <Route path={ROUTES.WISHLIST} element={<WishlistPage />} />
          <Route path={ROUTES.ORDERS} element={<OrdersPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        </Route>
      </Route>

      {/* ─── Auth Routes (no header/footer) ─── */}
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
        <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmailPage />} />
      </Route>

      {/* ─── Admin Routes ─── */}
      <Route element={<AdminLayout />}>
        <Route element={<AdminRoute />}>
          <Route path={ROUTES.ADMIN} element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />} />
          <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
          <Route path={ROUTES.ADMIN_PRODUCTS} element={<AdminProducts />} />
          <Route path={ROUTES.ADMIN_CATEGORIES} element={<AdminCategories />} />
          <Route path={ROUTES.ADMIN_BRANDS} element={<AdminBrands />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
        </Route>
      </Route>

      {/* ─── 404 ─── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
