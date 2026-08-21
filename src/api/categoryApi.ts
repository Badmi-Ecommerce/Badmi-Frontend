import axiosClient from './axiosClient';
import { unwrap } from './unwrap';
import { API_ENDPOINTS } from '../constants';
import type { Category, Subcategory } from '../types';

const categoryApi = {
  async getAll() {
    return unwrap(await axiosClient.get(API_ENDPOINTS.CATEGORIES)) as Category[];
  },
  async getById(id: number | string) {
    return unwrap(await axiosClient.get(API_ENDPOINTS.CATEGORY_DETAIL(id))) as Category;
  },
  async getSubcategories(categoryId?: number) {
    return unwrap(
      await axiosClient.get(API_ENDPOINTS.SUBCATEGORIES, {
        params: categoryId ? { categoryId } : undefined,
      })
    ) as Subcategory[];
  },
};

export default categoryApi;
