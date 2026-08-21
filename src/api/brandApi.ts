import axiosClient from './axiosClient';
import { unwrap } from './unwrap';
import { API_ENDPOINTS } from '../constants';
import type { Brand } from '../types';

const brandApi = {
  async getAll() {
    return unwrap(await axiosClient.get(API_ENDPOINTS.BRANDS)) as Brand[];
  },
  async getById(id: number | string) {
    return unwrap(await axiosClient.get(API_ENDPOINTS.BRAND_DETAIL(id))) as Brand;
  },
};

export default brandApi;
