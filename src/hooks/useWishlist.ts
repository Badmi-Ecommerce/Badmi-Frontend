import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import wishlistApi from '../api/wishlistApi';
import { QUERY_KEYS } from '../constants';
import { useAuth } from '../store/AuthContext';
import toast from 'react-hot-toast';

export const useWishlist = () => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: [QUERY_KEYS.WISHLIST],
    queryFn: () => wishlistApi.getAll(),
    enabled: isAuthenticated,
  });
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: number) => wishlistApi.add(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WISHLIST] });
      toast.success('Đã thêm vào yêu thích');
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => wishlistApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WISHLIST] });
      toast.success('Đã xoá khỏi yêu thích');
    },
  });
};
