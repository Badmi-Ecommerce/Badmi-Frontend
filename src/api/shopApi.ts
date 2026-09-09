import axiosClient from './axiosClient';
import { unwrap } from './unwrap';
import { API_ENDPOINTS } from '../constants';
import type { Shop, ShopType } from '../types';

export type ShopPayload = {
  shopName: string;
  shopType: ShopType;
  description?: string;
  avatarUrl?: string;
  coverUrl?: string;
  phone?: string;
  facebookUrl?: string;
  zaloPhone?: string;
  addressLine?: string;
  district?: string;
  city?: string;
  openHours?: string;
  services?: string;
};

const shopApi = {
  async getAll(params?: { city?: string; shopType?: ShopType }) {
    return unwrap(await axiosClient.get(API_ENDPOINTS.SHOPS, { params })) as Shop[];
  },

  async getBySlug(slug: string) {
    return unwrap(await axiosClient.get(API_ENDPOINTS.SHOP_DETAIL(slug))) as Shop;
  },

  async getMyShop() {
    return unwrap(await axiosClient.get(API_ENDPOINTS.OWNER_SHOP)) as Shop;
  },

  async saveMyShop(payload: ShopPayload) {
    return unwrap(await axiosClient.put(API_ENDPOINTS.OWNER_SHOP, payload)) as Shop;
  },
};

export default shopApi;
