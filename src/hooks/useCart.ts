import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import cartApi from '../api/cartApi';
import { QUERY_KEYS } from '../constants';
import { useAuth } from '../store/AuthContext';
import toast from 'react-hot-toast';

export const useCart = () => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: [QUERY_KEYS.CART],
    queryFn: () => cartApi.getCart().then((r) => r.data),
    enabled: isAuthenticated,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
      cartApi.addItem(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CART] });
      toast.success('Đã thêm vào giỏ hàng!');
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cartItemId, quantity }: { cartItemId: number; quantity: number }) =>
      cartApi.updateItem(cartItemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CART] });
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cartItemId: number) => cartApi.removeItem(cartItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CART] });
      toast.success('Đã xoá khỏi giỏ hàng.');
    },
  });
};
