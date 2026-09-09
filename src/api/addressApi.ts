import axiosClient from './axiosClient';
import { unwrap } from './unwrap';
import { API_ENDPOINTS } from '../constants';
import type { Address } from '../types';

const addressApi = {
  async list() {
    return unwrap(await axiosClient.get(API_ENDPOINTS.ADDRESSES)) as Address[];
  },

  async create(payload: {
    recipientName: string;
    recipientPhone: string;
    addressLine: string;
    ward?: string;
    district?: string;
    province: string;
    isDefault?: boolean;
  }) {
    return unwrap(await axiosClient.post(API_ENDPOINTS.ADDRESSES, payload)) as Address;
  },
};

export default addressApi;
