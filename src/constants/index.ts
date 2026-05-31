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

  // Cart
  CART: '/api/cart',
  CART_ADD: '/api/cart/add',
  CART_UPDATE: (id: number | string) => `/api/cart/${id}`,
  CART_REMOVE: (id: number | string) => `/api/cart/${id}`,
  CART_CLEAR: '/api/cart/clear',

  // Wishlist
  WISHLIST: '/api/wishlist',
  WISHLIST_ADD: '/api/wishlist/add',
  WISHLIST_REMOVE: (id: number | string) => `/api/wishlist/${id}`,

  // Orders
  ORDERS: '/api/orders',
  ORDER_DETAIL: (id: number | string) => `/api/orders/${id}`,
  ORDER_PLACE: '/api/orders/place',
} as const;

export const STORAGE_KEYS = {
  TOKEN: 'badmishop_token',
  USER: 'badmishop_user',
} as const;

export const QUERY_KEYS = {
  PRODUCTS: 'products',
  PRODUCT: 'product',
  CATEGORIES: 'categories',
  BRANDS: 'brands',
  CART: 'cart',
  WISHLIST: 'wishlist',
  ORDERS: 'orders',
  ME: 'me',
} as const;
