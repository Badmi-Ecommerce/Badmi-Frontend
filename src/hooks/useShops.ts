import { useQuery } from '@tanstack/react-query';
import shopApi from '../api/shopApi';
import { QUERY_KEYS } from '../constants';
import type { ShopType } from '../types';

export const useShops = (params?: { city?: string; shopType?: ShopType }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SHOPS, params?.city ?? 'all', params?.shopType ?? 'all'],
    queryFn: () => shopApi.getAll(params),
    staleTime: 1000 * 60 * 5,
  });
};

export const useShopBySlug = (slug: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SHOPS, slug],
    queryFn: () => shopApi.getBySlug(slug),
    enabled: !!slug,
  });
};
