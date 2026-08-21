import axiosClient from './axiosClient';
import { unwrap } from './unwrap';
import { API_ENDPOINTS } from '../constants';
import type { WishlistItem } from '../types';

const wishlistApi = {
  async getAll() {
    return unwrap(await axiosClient.get(API_ENDPOINTS.WISHLIST)) as WishlistItem[];
  },

  async add(productId: number) {
    return unwrap(
      await axiosClient.post(API_ENDPOINTS.WISHLIST_ADD, { productId })
    ) as WishlistItem;
  },

  async remove(wishlistItemId: number) {
    return unwrap(await axiosClient.delete(API_ENDPOINTS.WISHLIST_REMOVE(wishlistItemId)));
  },
};

export default wishlistApi;
