// =============================================
// Mock data for development (matches DB schema)
// =============================================
import type { Category, Brand, Product } from '../types';

export const mockCategories: Category[] = [
  { id: 1, name: 'Vợt cầu lông', slug: 'vot-cau-long', image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=300&q=80', created_at: '', updated_at: '' },
  { id: 2, name: 'Giày cầu lông', slug: 'giay-cau-long', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80', created_at: '', updated_at: '' },
  { id: 3, name: 'Bao vợt cầu lông', slug: 'bao-vot-cau-long', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&q=80', created_at: '', updated_at: '' },
  { id: 4, name: 'Vợt cầu lông Yonex', slug: 'vot-cau-long-yonex', image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=300&q=80', created_at: '', updated_at: '' },
  { id: 5, name: 'Vợt cầu lông Lining', slug: 'vot-cau-long-lining', image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=300&q=80', created_at: '', updated_at: '' },
  { id: 6, name: 'Vợt cầu lông Victor', slug: 'vot-cau-long-victor', image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=300&q=80', created_at: '', updated_at: '' },
  { id: 7, name: 'Giày cầu lông Yonex', slug: 'giay-cau-long-yonex', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80', created_at: '', updated_at: '' },
  { id: 8, name: 'Vợt cầu lông Mizuno', slug: 'vot-cau-long-mizuno', image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=300&q=80', created_at: '', updated_at: '' },
];

export const mockBrands: Brand[] = [
  { id: 1, name: 'Yonex', logo: '', description: 'Thương hiệu cầu lông số 1 thế giới', created_at: '', updated_at: '' },
  { id: 2, name: 'Victor', logo: '', description: 'Thương hiệu cầu lông Đài Loan', created_at: '', updated_at: '' },
  { id: 3, name: 'Li-Ning', logo: '', description: 'Thương hiệu cầu lông Trung Quốc', created_at: '', updated_at: '' },
  { id: 4, name: 'Mizuno', logo: '', description: 'Thương hiệu thể thao Nhật Bản', created_at: '', updated_at: '' },
  { id: 5, name: 'Kamito', logo: '', description: 'Thương hiệu Việt Nam', created_at: '', updated_at: '' },
];

export const mockProducts: Product[] = [
  {
    id: 1, name: 'Set Vợt Cầu Lông Victor Auraspeed H5 Plus CNY 2026 | M...', slug: 'set-vot-victor-auraspeed-h5-plus-cny-2026',
    price: 3299000, original_price: 4250000, stock: 10, sku: 'VIC-H5-CNY26',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80',
    category_id: 1, brand_id: 2, is_active: true, created_at: '', updated_at: '',
  },
  {
    id: 2, name: 'Vợt Cầu Lông Lining Aforce 100 Gen 2 | Sức Mạnh Cực Kỳ Lớn', slug: 'vot-lining-aforce-100-gen2',
    price: 5900000, original_price: 7000000, stock: 5, sku: 'LIN-AF100-G2',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80',
    category_id: 1, brand_id: 3, is_active: true, created_at: '', updated_at: '',
  },
  {
    id: 3, name: 'Vợt Cầu Lông Victor DriveX 12 25W | Dòng Ẩn Huyền Thoại', slug: 'vot-victor-drivex-12-25w',
    price: 4300000, original_price: 4300000, stock: 8, sku: 'VIC-DX12-25W',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80',
    category_id: 1, brand_id: 2, is_active: true, created_at: '', updated_at: '',
  },
  {
    id: 4, name: 'Vợt Cầu Lông Yonex Astrox 100 Tour VA | Kiệt Tác Tấn Công', slug: 'vot-yonex-astrox-100-tour-va',
    price: 3580000, original_price: 4469000, stock: 12, sku: 'YON-AX100-TVA',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80',
    category_id: 1, brand_id: 1, is_active: true, created_at: '', updated_at: '',
  },
  {
    id: 5, name: 'Vợt Cầu Lông Yonex Astrox 100ZZ', slug: 'vot-yonex-astrox-100zz',
    price: 5599000, original_price: 7190000, stock: 6, sku: 'YON-AX100ZZ',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80',
    category_id: 1, brand_id: 1, is_active: true, created_at: '', updated_at: '',
  },
  {
    id: 6, name: 'Vợt Cầu Lông Lining Aforce 90 New | Loh Kean Yew 2025', slug: 'vot-lining-aforce-90-new',
    price: 4420000, original_price: 6120000, stock: 4, sku: 'LIN-AF90-25',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80',
    category_id: 1, brand_id: 3, is_active: true, created_at: '', updated_at: '',
  },
  // Balo category (id: 9)
  {
    id: 7, name: 'Balo Cầu Lông Yonex All Day 0412 | Đa Năng Tiện Lợi', slug: 'balo-yonex-all-day-0412',
    price: 739000, original_price: 850000, stock: 20, sku: 'YON-BL-0412',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80',
    category_id: 3, brand_id: 1, is_active: true, created_at: '', updated_at: '',
  },
  {
    id: 8, name: 'Balo Cầu Lông Yonex All Day 0812 | Phong Cách Tối Giản', slug: 'balo-yonex-all-day-0812',
    price: 709000, original_price: 850000, stock: 15, sku: 'YON-BL-0812',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80',
    category_id: 3, brand_id: 1, is_active: true, created_at: '', updated_at: '',
  },
  {
    id: 9, name: 'Balo Cầu Lông Yonex All Day 0612 | Ba Dòng Công Dụng', slug: 'balo-yonex-all-day-0612',
    price: 709000, original_price: 850000, stock: 18, sku: 'YON-BL-0612',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80',
    category_id: 3, brand_id: 1, is_active: true, created_at: '', updated_at: '',
  },
  {
    id: 10, name: 'Balo Cầu Lông Lining P-ABSV.51 | Thiết Kế Thời Thượng', slug: 'balo-lining-p-absv51',
    price: 1070000, original_price: 1220000, stock: 9, sku: 'LIN-BL-ABSV51',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80',
    category_id: 3, brand_id: 3, is_active: true, created_at: '', updated_at: '',
  },
  {
    id: 11, name: 'Balo Cầu Lông Victor Dragon Ball Z BR5030BZ | Ra Sân Cùng Goku', slug: 'balo-victor-dragon-ball-z',
    price: 1180000, original_price: 1180000, stock: 3, sku: 'VIC-BL-BR5030BZ',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80',
    category_id: 3, brand_id: 2, is_active: true, created_at: '', updated_at: '',
  },
  {
    id: 12, name: 'Túi cầu lông 3 ngăn Kamito KMBALD200151 | Bảo Vệ Vợt Tối...', slug: 'tui-kamito-kmbald200151',
    price: 0, original_price: 0, stock: 7, sku: 'KAM-TUI-200151',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80',
    category_id: 3, brand_id: 5, is_active: true, created_at: '', updated_at: '',
  },
  // Shoes
  {
    id: 13, name: 'Giày Cầu Lông Yonex Power Cushion 65Z VA', slug: 'giay-yonex-power-cushion-65z-va',
    price: 2890000, original_price: 3500000, stock: 14, sku: 'YON-SH-65ZVA',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
    category_id: 2, brand_id: 1, is_active: true, created_at: '', updated_at: '',
  },
];
