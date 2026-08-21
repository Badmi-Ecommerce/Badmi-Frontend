import axiosClient from './axiosClient';
import { unwrap } from './unwrap';
import { API_ENDPOINTS } from '../constants';
import type { Order, PagedResponse } from '../types';

const orderApi = {
  async mine() {
    return unwrap(await axiosClient.get(API_ENDPOINTS.ORDERS)) as Order[];
  },

  async detail(id: number | string) {
    return unwrap(await axiosClient.get(API_ENDPOINTS.ORDER_DETAIL(id))) as Order;
  },

  async checkout(payload: { addressId?: number; paymentMethod?: string; customerNote?: string }) {
    return unwrap(await axiosClient.post(API_ENDPOINTS.ORDER_CHECKOUT, payload)) as Order;
  },

  async adminList() {
    return unwrap(await axiosClient.get(API_ENDPOINTS.ADMIN_ORDERS)) as PagedResponse<Order>;
  },

  async updateStatus(id: number | string, status: string, note?: string) {
    return unwrap(
      await axiosClient.patch(API_ENDPOINTS.ADMIN_ORDER_STATUS(id), { status, note })
    ) as Order;
  },
};

export default orderApi;
