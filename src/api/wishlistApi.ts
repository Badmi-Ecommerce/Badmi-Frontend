import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';
import type { WishlistItem } from '../types';

const wishlistApi = {
  getWishlist() {
    return axiosClient.get<WishlistItem[]>(API_ENDPOINTS.WISHLIST);
  },

  addItem(productId: number) {
    return axiosClient.post(API_ENDPOINTS.WISHLIST_ADD, { product_id: productId });
  },

  removeItem(wishlistItemId: number) {
    return axiosClient.delete(API_ENDPOINTS.WISHLIST_REMOVE(wishlistItemId));
  },
};

export default wishlistApi;
