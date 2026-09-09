import axiosClient from './axiosClient';
import { unwrap } from './unwrap';
import { API_ENDPOINTS } from '../constants';

export type UploadResult = { url: string; publicId: string };

const mediaApi = {
  async uploadImage(file: File) {
    const body = new FormData();
    body.append('file', file);
    return unwrap(
      await axiosClient.post(API_ENDPOINTS.MEDIA_UPLOAD, body, { timeout: 60000 })
    ) as UploadResult;
  },
};

export default mediaApi;
