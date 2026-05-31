import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';
import type { Category, Subcategory } from '../types';

const categoryApi = {
  getAll() {
    return axiosClient.get<Category[]>(API_ENDPOINTS.CATEGORIES);
  },

  getById(id: number) {
    return axiosClient.get<Category>(API_ENDPOINTS.CATEGORY_DETAIL(id));
  },

  getSubcategories(categoryId?: number) {
    return axiosClient.get<Subcategory[]>(API_ENDPOINTS.SUBCATEGORIES, {
      params: categoryId ? { category_id: categoryId } : undefined,
    });
  },
};

export default categoryApi;
