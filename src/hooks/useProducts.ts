import { useQuery } from '@tanstack/react-query';
import productApi from '../api/productApi';
import { QUERY_KEYS } from '../constants';
import type { ProductFilters } from '../types';

export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, filters],
    queryFn: () => productApi.getAll(filters),
    staleTime: 1000 * 60 * 5,
  });
};

export const useProductBySlug = (slug: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCT, slug],
    queryFn: () => productApi.getBySlug(slug),
    enabled: !!slug,
  });
};

export const useProductsByCategory = (categoryId: number, limit = 6) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, 'category', categoryId],
    queryFn: () => productApi.getByCategory(categoryId, { limit }),
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 5,
  });
};
