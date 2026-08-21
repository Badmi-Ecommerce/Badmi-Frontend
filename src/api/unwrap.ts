import type { AxiosResponse } from 'axios';
import type { ApiResponse } from '../types';

export function unwrap<T>(response: AxiosResponse<ApiResponse<T>>): T {
  return response.data.data;
}
