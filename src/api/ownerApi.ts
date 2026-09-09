import axiosClient from './axiosClient';
import { unwrap } from './unwrap';
import { API_ENDPOINTS } from '../constants';
import type { ListingType, OwnerDashboard, PagedResponse, Product } from '../types';
import { withProductImage } from '../types';

export type OwnerProductPayload = {
  name: string;
  description?: string;
  categoryId: number;
  subcategoryId?: number;
  brandId?: number;
  price: number;
  originalPrice?: number;
  stock: number;
  imageUrl?: string;
  size?: string;
  weight?: string;
  grip?: string;
  color?: string;
  listingType?: ListingType;
  conditionPercent?: number;
  usageDuration?: string;
  passReason?: string;
  isNegotiable?: boolean;
};

const ownerApi = {
  async dashboard() {
    return unwrap(await axiosClient.get(API_ENDPOINTS.OWNER_DASHBOARD)) as OwnerDashboard;
  },

  async listProducts(page = 0, size = 20) {
    const data = unwrap(
      await axiosClient.get(API_ENDPOINTS.OWNER_PRODUCTS, { params: { page, size } })
    ) as PagedResponse<Product>;
    return { ...data, content: data.content.map(withProductImage) };
  },

  async createProduct(payload: OwnerProductPayload) {
    return withProductImage(unwrap(await axiosClient.post(API_ENDPOINTS.OWNER_PRODUCTS, payload)) as Product);
  },

  async updateProduct(id: number, payload: OwnerProductPayload) {
    return withProductImage(
      unwrap(await axiosClient.put(API_ENDPOINTS.OWNER_PRODUCT(id), payload)) as Product
    );
  },

  async hideProduct(id: number) {
    return unwrap(await axiosClient.delete(API_ENDPOINTS.OWNER_PRODUCT(id)));
  },
};

export default ownerApi;
