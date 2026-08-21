import type { Category, Brand, Product } from '../types';

export const mockCategories: Category[] = [
  { id: 1, name: 'Vợt cầu lông', slug: 'vot-cau-long', image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=300&q=80', createdAt: '', updatedAt: '' },
  { id: 2, name: 'Giày cầu lông', slug: 'giay-cau-long', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80', createdAt: '', updatedAt: '' },
  { id: 3, name: 'Bao vợt cầu lông', slug: 'bao-vot-cau-long', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&q=80', createdAt: '', updatedAt: '' },
];

export const mockBrands: Brand[] = [
  { id: 1, name: 'Yonex', logo: '', description: 'Thương hiệu cầu lông số 1 thế giới', createdAt: '', updatedAt: '' },
  { id: 2, name: 'Victor', logo: '', description: 'Thương hiệu cầu lông Đài Loan', createdAt: '', updatedAt: '' },
  { id: 3, name: 'Li-Ning', logo: '', description: 'Thương hiệu cầu lông Trung Quốc', createdAt: '', updatedAt: '' },
  { id: 4, name: 'Mizuno', logo: '', description: 'Thương hiệu thể thao Nhật Bản', createdAt: '', updatedAt: '' },
  { id: 5, name: 'Kamito', logo: '', description: 'Thương hiệu Việt Nam', createdAt: '', updatedAt: '' },
];

export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Set Vợt Victor Auraspeed H5 Plus',
    slug: 'set-vot-victor-auraspeed-h5-plus-cny-2026',
    price: 3299000,
    originalPrice: 4250000,
    stock: 10,
    sku: 'VIC-H5-CNY26',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80',
    categoryId: 1,
    brandId: 2,
    isActive: true,
    createdAt: '',
    updatedAt: '',
    variants: [{ id: 101, sku: 'VIC-H5-CNY26-DEFAULT', variantName: 'Default', price: 3299000, originalPrice: 4250000, stockQuantity: 10, reservedQuantity: 0, isActive: true }],
  },
  {
    id: 2,
    name: 'Vợt Lining Aforce 100 Gen 2',
    slug: 'vot-lining-aforce-100-gen2',
    price: 5900000,
    originalPrice: 7000000,
    stock: 5,
    sku: 'LIN-AF100-G2',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80',
    categoryId: 1,
    brandId: 3,
    isActive: true,
    createdAt: '',
    updatedAt: '',
    variants: [{ id: 102, sku: 'LIN-AF100-G2-DEFAULT', variantName: 'Default', price: 5900000, originalPrice: 7000000, stockQuantity: 5, reservedQuantity: 0, isActive: true }],
  },
];
