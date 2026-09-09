export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subcategory {
  id: number;
  name: string;
  categoryId: number;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  id: number;
  name: string;
  slug?: string;
  logo?: string;
  description?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
}

export type ShopType = 'SHOP' | 'PERSONAL';

export interface Shop {
  id: number;
  userId: number;
  shopName: string;
  slug: string;
  shopType: ShopType;
  description?: string;
  avatarUrl?: string;
  coverUrl?: string;
  phone?: string;
  facebookUrl?: string;
  zaloPhone?: string;
  addressLine?: string;
  district?: string;
  city: string;
  openHours?: string;
  services: string[];
  ownerName?: string;
  productCount: number;
  passCount: number;
  joinedAt: string;
}

export interface ProductVariant {
  id: number;
  sku: string;
  variantName: string;
  attributes?: string;
  price: number;
  originalPrice?: number;
  stockQuantity: number;
  reservedQuantity: number;
  isActive: boolean;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  originalPrice?: number;
  stock: number;
  sku: string;
  image?: string;
  images?: string[];
  categoryId: number;
  subcategoryId?: number;
  brandId?: number;
  ownerId?: number;
  isActive: boolean;
  status?: string;
  /** NEW = hàng mới bán ra, PASS = hàng đã qua sử dụng người bán pass lại. */
  listingType?: ListingType;
  conditionPercent?: number;
  usageDuration?: string;
  passReason?: string;
  isNegotiable?: boolean;
  createdAt: string;
  updatedAt: string;
  variants?: ProductVariant[];
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
  role: 'customer' | 'admin' | 'owner';
  emailVerified?: boolean;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  id: number;
  productName: string;
  variantName: string;
  sku: string;
  imageUrl?: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  id: number;
  orderCode: string;
  status: string;
  paymentStatus: string;
  paymentMethod?: string;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  shippingWard?: string;
  shippingDistrict?: string;
  shippingProvince: string;
  subtotal: number;
  discountAmount?: number;
  shippingFee: number;
  taxAmount?: number;
  grandTotal: number;
  voucherCode?: string;
  customerNote?: string;
  items: OrderItem[];
  createdAt: string;
}

export interface OrderQuote {
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  taxAmount: number;
  grandTotal: number;
  voucherCode?: string;
  freeShipping: boolean;
}

export interface Address {
  id: number;
  recipientName: string;
  recipientPhone: string;
  addressLine: string;
  ward?: string;
  district?: string;
  province: string;
  isDefault?: boolean;
  createdAt?: string;
}

export interface CartItem {
  id: number;
  variantId: number;
  productId: number;
  productName: string;
  productSlug: string;
  variantName: string;
  sku: string;
  imageUrl?: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  createdAt: string;
}

export interface WishlistItem {
  id: number;
  productId: number;
  productName: string;
  productSlug: string;
  price: number;
  imageUrl?: string;
  addedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface OwnerDashboard {
  productCount: number;
  activeCount: number;
  hiddenCount: number;
  totalStock: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export type ListingType = 'NEW' | 'PASS';

export interface ProductFilters {
  categoryId?: number;
  subcategoryId?: number;
  brandId?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  /** Không truyền = chỉ hàng mới (mặc định của API), 'ALL' = cả tin pass. */
  listingType?: ListingType | 'ALL';
  page?: number;
  size?: number;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
}

/** Normalize product for UI (primary image). */
export function withProductImage(product: Product): Product {
  return {
    ...product,
    image: product.image ?? product.images?.[0],
  };
}
