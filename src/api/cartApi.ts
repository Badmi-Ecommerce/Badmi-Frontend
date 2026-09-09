import axiosClient from './axiosClient';
import { unwrap } from './unwrap';
import { API_ENDPOINTS } from '../constants';
import type { CartItem } from '../types';

const cartApi = {
  async getCart() {
    return unwrap(await axiosClient.get(API_ENDPOINTS.CART)) as CartItem[];
  },

  async addItem(variantId: number, quantity: number) {
    return unwrap(
      await axiosClient.post(API_ENDPOINTS.CART, { variantId, quantity })
    ) as CartItem;
  },

  async updateItem(cartItemId: number, quantity: number) {
    return unwrap(
      await axiosClient.put(API_ENDPOINTS.CART_UPDATE(cartItemId), { quantity })
    ) as CartItem;
  },

  async removeItem(cartItemId: number) {
    return unwrap(await axiosClient.delete(API_ENDPOINTS.CART_REMOVE(cartItemId)));
  },

  async clearCart() {
    return unwrap(await axiosClient.delete(API_ENDPOINTS.CART_CLEAR));
  },
};

export default cartApi;
