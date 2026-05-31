import { useQuery } from '@tanstack/react-query';
import categoryApi from '../api/categoryApi';
import { QUERY_KEYS } from '../constants';

export const useCategories = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: () => categoryApi.getAll().then((r) => r.data),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useSubcategories = (categoryId?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES, 'sub', categoryId],
    queryFn: () => categoryApi.getSubcategories(categoryId).then((r) => r.data),
    staleTime: 1000 * 60 * 10,
  });
};
