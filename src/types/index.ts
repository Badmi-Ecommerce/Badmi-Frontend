// =============================================
// TypeScript interfaces matching DB schema
// =============================================

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  created_at: string;
  updated_at: string;
}

export interface Subcategory {
  id: number;
  name: string;
  category_id: number;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: number;
  name: string;
  logo?: string;
  description?: string;
  website?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  original_price?: number;
  stock: number;
  sku: string;
  image?: string;
  images?: string[];
  category_id: number;
  subcategory_id?: number;
  brand_id?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Joined relations (optional, from API response)
  category?: Category;
  subcategory?: Subcategory;
  brand?: Brand;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'customer' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Order {
  id: number;
  user_id: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  added_at: string;
  product?: Product;
}

export interface WishlistItem {
  id: number;
  user_id: number;
  product_id: number;
  added_at: string;
  product?: Product;
}

// =============================================
// API Request / Response types
// =============================================

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ProductFilters {
  category_id?: number;
  subcategory_id?: number;
  brand_id?: number;
  min_price?: number;
  max_price?: number;
  search?: string;
  page?: number;
  limit?: number;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
}
