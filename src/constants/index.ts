// =============================================
// Application-wide Constants
// =============================================

export const APP_NAME = 'Badmishop';
export const HOTLINE = '0847.143.888';
export const WEBSITE = 'FBSHOP.VN';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  GOOGLE: '/api/auth/google',
  VERIFY_EMAIL: '/api/auth/verify-email',
  RESEND_VERIFICATION: '/api/auth/resend-verification',
  FORGOT_PASSWORD: '/api/auth/forgot-password',
  RESET_PASSWORD: '/api/auth/reset-password',
  CHANGE_PASSWORD: '/api/auth/change-password',
  BECOME_OWNER: '/api/auth/become-owner',
  LOGOUT: '/api/auth/logout',
  ME: '/api/auth/me',

  // Products
  PRODUCTS: '/api/products',
  PRODUCT_DETAIL: (id: number | string) => `/api/products/${id}`,
  PRODUCT_BY_SLUG: (slug: string) => `/api/products/slug/${slug}`,

  // Categories
  CATEGORIES: '/api/categories',
  CATEGORY_DETAIL: (id: number | string) => `/api/categories/${id}`,
  SUBCATEGORIES: '/api/subcategories',

  // Brands
  BRANDS: '/api/brands',
  BRAND_DETAIL: (id: number | string) => `/api/brands/${id}`,

  // Shops (người bán: cửa hàng + cá nhân pass hàng)
  SHOPS: '/api/shops',
  SHOP_DETAIL: (slug: string) => `/api/shops/${slug}`,
  OWNER_SHOP: '/api/owner/shop',

  // Cart
  CART: '/api/cart',
  CART_UPDATE: (id: number | string) => `/api/cart/${id}`,
  CART_REMOVE: (id: number | string) => `/api/cart/${id}`,
  CART_CLEAR: '/api/cart/clear',

  // Wishlist
  WISHLIST: '/api/wishlist',
  WISHLIST_REMOVE: (id: number | string) => `/api/wishlist/${id}`,

  // Orders
  ORDERS: '/api/orders',
  ORDER_DETAIL: (id: number | string) => `/api/orders/${id}`,
  ORDER_CHECKOUT: '/api/orders/checkout',
  ORDER_QUOTE: '/api/orders/quote',
  ORDER_PAY: (id: number | string) => `/api/orders/${id}/pay`,
  ADDRESSES: '/api/addresses',
  ADMIN_ORDERS: '/api/admin/orders',
  ADMIN_ORDER_STATUS: (id: number | string) => `/api/admin/orders/${id}/status`,
  ADMIN_PRODUCTS: '/api/admin/products',
  ADMIN_PRODUCT: (id: number | string) => `/api/admin/products/${id}`,
  ADMIN_CATEGORIES: '/api/admin/categories',
  ADMIN_CATEGORY: (id: number | string) => `/api/admin/categories/${id}`,
  ADMIN_BRANDS: '/api/admin/brands',
  ADMIN_BRAND: (id: number | string) => `/api/admin/brands/${id}`,
  OWNER_DASHBOARD: '/api/owner/dashboard',
  OWNER_PRODUCTS: '/api/owner/products',
  OWNER_PRODUCT: (id: number | string) => `/api/owner/products/${id}`,
  MEDIA_UPLOAD: '/api/media/upload',
} as const;

export const STORAGE_KEYS = {
  TOKEN: 'badmishop_token',
  USER: 'badmishop_user',
} as const;

export const QUERY_KEYS = {
  PRODUCTS: 'products',
  PRODUCT: 'product',
  CATEGORIES: 'categories',
  SUBCATEGORIES: 'subcategories',
  BRANDS: 'brands',
  SHOPS: 'shops',
  OWNER_SHOP: 'owner-shop',
  CART: 'cart',
  WISHLIST: 'wishlist',
  ORDERS: 'orders',
  ORDER: 'order',
  ADDRESSES: 'addresses',
  ME: 'me',
} as const;
