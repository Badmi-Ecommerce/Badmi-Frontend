import axiosClient from './axiosClient';
import { unwrap } from './unwrap';
import { API_ENDPOINTS } from '../constants';
import type { PagedResponse, Product, ProductFilters } from '../types';
import { withProductImage } from '../types';

const productApi = {
  async getAll(filters?: ProductFilters) {
    const page = filters?.page ?? 0;
    const limit = filters?.limit ?? 12;
    const data = unwrap(
      await axiosClient.get(API_ENDPOINTS.PRODUCTS, { params: { page, limit } })
    ) as PagedResponse<Product>;
    return {
      ...data,
      content: data.content.map(withProductImage),
    };
  },

  async getById(id: number | string) {
    return withProductImage(unwrap(await axiosClient.get(API_ENDPOINTS.PRODUCT_DETAIL(id))) as Product);
  },

  async getBySlug(slug: string) {
    return withProductImage(unwrap(await axiosClient.get(API_ENDPOINTS.PRODUCT_BY_SLUG(slug))) as Product);
  },

  async getByCategory(categoryId: number, opts?: { limit?: number }) {
    const data = await productApi.getAll({ page: 0, limit: opts?.limit ?? 24 });
    return {
      ...data,
      content: data.content.filter((p) => p.categoryId === categoryId),
    };
  },
};

export default productApi;
