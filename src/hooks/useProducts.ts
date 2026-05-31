import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import productApi from '../api/productApi';
import { QUERY_KEYS } from '../constants';
import type { ProductFilters, Product } from '../types';
import toast from 'react-hot-toast';

// ─── Get all products (with optional filters) ───
export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, filters],
    queryFn: () => productApi.getAll(filters).then((r) => r.data),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};

// ─── Get product by slug ────────────────────────
export const useProductBySlug = (slug: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCT, slug],
    queryFn: () => productApi.getBySlug(slug).then((r) => r.data),
    enabled: !!slug,
  });
};

// ─── Get products by category ───────────────────
export const useProductsByCategory = (categoryId: number, limit = 6) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, 'category', categoryId],
    queryFn: () =>
      productApi.getByCategory(categoryId, { limit }).then((r) => r.data),
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 5,
  });
};

// ─── Create product (Admin) ─────────────────────
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Product>) => productApi.create(data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
      toast.success('Thêm sản phẩm thành công!');
    },
  });
};

// ─── Update product (Admin) ─────────────────────
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Product> }) =>
      productApi.update(id, data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
      toast.success('Cập nhật sản phẩm thành công!');
    },
  });
};

// ─── Delete product (Admin) ─────────────────────
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => productApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
      toast.success('Đã xoá sản phẩm.');
    },
  });
};
