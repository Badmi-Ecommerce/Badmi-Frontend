import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';
import type {
  Product,
  PaginatedResponse,
  ProductFilters,
} from '../types';

const productApi = {
  getAll(filters?: ProductFilters) {
    return axiosClient.get<PaginatedResponse<Product>>(API_ENDPOINTS.PRODUCTS, {
      params: filters,
    });
  },

  getById(id: number) {
    return axiosClient.get<Product>(API_ENDPOINTS.PRODUCT_DETAIL(id));
  },

  getBySlug(slug: string) {
    return axiosClient.get<Product>(API_ENDPOINTS.PRODUCT_BY_SLUG(slug));
  },

  getByCategory(categoryId: number, filters?: Omit<ProductFilters, 'category_id'>) {
    return axiosClient.get<PaginatedResponse<Product>>(API_ENDPOINTS.PRODUCTS, {
      params: { category_id: categoryId, ...filters },
    });
  },

  create(data: Partial<Product>) {
    return axiosClient.post<Product>(API_ENDPOINTS.PRODUCTS, data);
  },

  update(id: number, data: Partial<Product>) {
    return axiosClient.put<Product>(API_ENDPOINTS.PRODUCT_DETAIL(id), data);
  },

  delete(id: number) {
    return axiosClient.delete(API_ENDPOINTS.PRODUCT_DETAIL(id));
  },
};

export default productApi;
