import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';
import type { CartItem } from '../types';

const cartApi = {
  getCart() {
    return axiosClient.get<CartItem[]>(API_ENDPOINTS.CART);
  },

  addItem(productId: number, quantity: number) {
    return axiosClient.post(API_ENDPOINTS.CART_ADD, { product_id: productId, quantity });
  },

  updateItem(cartItemId: number, quantity: number) {
    return axiosClient.put(API_ENDPOINTS.CART_UPDATE(cartItemId), { quantity });
  },

  removeItem(cartItemId: number) {
    return axiosClient.delete(API_ENDPOINTS.CART_REMOVE(cartItemId));
  },

  clearCart() {
    return axiosClient.delete(API_ENDPOINTS.CART_CLEAR);
  },
};

export default cartApi;
