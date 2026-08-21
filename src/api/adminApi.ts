import axiosClient from './axiosClient';
import { unwrap } from './unwrap';
import { API_ENDPOINTS } from '../constants';
import type { Brand, Category, PagedResponse, Product } from '../types';
import { withProductImage } from '../types';

export type UpsertProductPayload = {
  name: string;
  slug?: string;
  sku: string;
  description?: string;
  price: number;
  originalPrice?: number;
  stock: number;
  categoryId: number;
  subcategoryId?: number;
  brandId?: number;
  isActive?: boolean;
  status?: string;
  images?: string[];
  variantName?: string;
};

export type UpsertCategoryPayload = {
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  isActive?: boolean;
};

export type UpsertBrandPayload = {
  name: string;
  slug?: string;
  logo?: string;
  description?: string;
  website?: string;
  isActive?: boolean;
};

const adminApi = {
  async listProducts(page = 0, limit = 50) {
    const data = unwrap(
      await axiosClient.get(API_ENDPOINTS.ADMIN_PRODUCTS, { params: { page, limit } })
    ) as PagedResponse<Product>;
    return { ...data, content: data.content.map(withProductImage) };
  },

  async createProduct(payload: UpsertProductPayload) {
    return withProductImage(unwrap(await axiosClient.post(API_ENDPOINTS.ADMIN_PRODUCTS, payload)) as Product);
  },

  async updateProduct(id: number, payload: UpsertProductPayload) {
    return withProductImage(
      unwrap(await axiosClient.put(API_ENDPOINTS.ADMIN_PRODUCT(id), payload)) as Product
    );
  },

  async deleteProduct(id: number) {
    return unwrap(await axiosClient.delete(API_ENDPOINTS.ADMIN_PRODUCT(id)));
  },

  async listCategories() {
    return unwrap(await axiosClient.get(API_ENDPOINTS.ADMIN_CATEGORIES)) as Category[];
  },

  async createCategory(payload: UpsertCategoryPayload) {
    return unwrap(await axiosClient.post(API_ENDPOINTS.ADMIN_CATEGORIES, payload)) as Category;
  },

  async updateCategory(id: number, payload: UpsertCategoryPayload) {
    return unwrap(await axiosClient.put(API_ENDPOINTS.ADMIN_CATEGORY(id), payload)) as Category;
  },

  async deleteCategory(id: number) {
    return unwrap(await axiosClient.delete(API_ENDPOINTS.ADMIN_CATEGORY(id)));
  },

  async listBrands() {
    return unwrap(await axiosClient.get(API_ENDPOINTS.ADMIN_BRANDS)) as Brand[];
  },

  async createBrand(payload: UpsertBrandPayload) {
    return unwrap(await axiosClient.post(API_ENDPOINTS.ADMIN_BRANDS, payload)) as Brand;
  },

  async updateBrand(id: number, payload: UpsertBrandPayload) {
    return unwrap(await axiosClient.put(API_ENDPOINTS.ADMIN_BRAND(id), payload)) as Brand;
  },

  async deleteBrand(id: number) {
    return unwrap(await axiosClient.delete(API_ENDPOINTS.ADMIN_BRAND(id)));
  },
};

export default adminApi;
