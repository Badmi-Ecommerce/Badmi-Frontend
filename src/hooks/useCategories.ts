import { useQuery } from '@tanstack/react-query';
import categoryApi from '../api/categoryApi';
import brandApi from '../api/brandApi';
import { QUERY_KEYS } from '../constants';

export const useCategories = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: () => categoryApi.getAll(),
    staleTime: 1000 * 60 * 10,
  });
};

export const useSubcategories = (categoryId?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SUBCATEGORIES, categoryId ?? 'all'],
    queryFn: () => categoryApi.getSubcategories(categoryId),
    staleTime: 1000 * 60 * 10,
  });
};

export const useBrands = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.BRANDS],
    queryFn: () => brandApi.getAll(),
    staleTime: 1000 * 60 * 10,
  });
};
