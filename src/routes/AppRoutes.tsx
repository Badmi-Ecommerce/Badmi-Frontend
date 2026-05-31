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
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import NotFoundPage from '../pages/NotFound/NotFoundPage';

// Admin imports
import AdminLayout from '../layouts/AdminLayout';
import AdminRoute from './AdminRoute';
import AdminDashboard from '../pages/Admin/Dashboard/AdminDashboard';
import AdminProducts from '../pages/Admin/Products/AdminProducts';
import AdminCategories from '../pages/Admin/Categories/AdminCategories';
import AdminBrands from '../pages/Admin/Brands/AdminBrands';

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
        </Route>
      </Route>

      {/* ─── Auth Routes (no header/footer) ─── */}
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      </Route>

      {/* ─── Admin Routes ─── */}
      <Route element={<AdminLayout />}>
        <Route element={<AdminRoute />}>
          <Route path={ROUTES.ADMIN} element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />} />
          <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
          <Route path={ROUTES.ADMIN_PRODUCTS} element={<AdminProducts />} />
          <Route path={ROUTES.ADMIN_CATEGORIES} element={<AdminCategories />} />
          <Route path={ROUTES.ADMIN_BRANDS} element={<AdminBrands />} />
        </Route>
      </Route>

      {/* ─── 404 ─── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
