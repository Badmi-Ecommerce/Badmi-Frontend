import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';
import type { Brand } from '../types';

const brandApi = {
  getAll() {
    return axiosClient.get<Brand[]>(API_ENDPOINTS.BRANDS);
  },

  getById(id: number) {
    return axiosClient.get<Brand>(API_ENDPOINTS.BRAND_DETAIL(id));
  },
};

export default brandApi;
