import axiosClient from './axiosClient';
import { unwrap } from './unwrap';
import { API_ENDPOINTS } from '../constants';
import type { Order, OrderQuote, PagedResponse } from '../types';

const orderApi = {
  async mine() {
    return unwrap(await axiosClient.get(API_ENDPOINTS.ORDERS)) as Order[];
  },

  async detail(id: number | string) {
    return unwrap(await axiosClient.get(API_ENDPOINTS.ORDER_DETAIL(id))) as Order;
  },

  async quote(payload: { voucherCode?: string }) {
    return unwrap(await axiosClient.post(API_ENDPOINTS.ORDER_QUOTE, payload)) as OrderQuote;
  },

  async checkout(payload: {
    addressId?: number;
    paymentMethod?: string;
    customerNote?: string;
    idempotencyKey: string;
    voucherCode?: string;
  }) {
    return unwrap(await axiosClient.post(API_ENDPOINTS.ORDER_CHECKOUT, payload)) as Order;
  },

  async pay(id: number | string) {
    return unwrap(await axiosClient.post(API_ENDPOINTS.ORDER_PAY(id))) as Order;
  },

  async adminList(page = 0, size = 20) {
    return unwrap(
      await axiosClient.get(API_ENDPOINTS.ADMIN_ORDERS, { params: { page, size } })
    ) as PagedResponse<Order>;
  },

  async updateStatus(id: number | string, status: string, note?: string) {
    return unwrap(
      await axiosClient.patch(API_ENDPOINTS.ADMIN_ORDER_STATUS(id), { status, note })
    ) as Order;
  },
};

export default orderApi;
