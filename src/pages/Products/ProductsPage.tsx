import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { X } from 'lucide-react';
import ProductCard from '../../components/shared/ProductCard/ProductCard';
import { mockProducts, mockCategories, mockBrands } from '../../mocks/data';
import { useAddToCart } from '../../hooks/useCart';
import { useAuth } from '../../store/AuthContext';
import { ROUTES } from '../../constants/routes';
import type { Product } from '../../types';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price_asc', label: 'Giá: Thấp → Cao' },
  { value: 'price_desc', label: 'Giá: Cao → Thấp' },
  { value: 'popular', label: 'Phổ biến nhất' },
];

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const addToCart = useAddToCart();

  const searchQuery  = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';

  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    categoryParam ? [Number(categoryParam)] : []
  );
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  const [sort, setSort] = useState('newest');

  // ─── Filter logic (local mock) ───────────────────
  let filtered = mockProducts.filter(p => p.is_active);

  if (searchQuery)
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  if (selectedCategories.length > 0)
    filtered = filtered.filter(p => selectedCategories.includes(p.category_id));

  if (selectedBrands.length > 0)
    filtered = filtered.filter(p => selectedBrands.includes(p.brand_id ?? 0));

  // Sort
  if (sort === 'price_asc') filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sort === 'price_desc') filtered = [...filtered].sort((a, b) => b.price - a.price);

  const toggleCategory = (id: number) =>
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );

  const toggleBrand = (id: number) =>
    setSelectedBrands(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );

  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng.');
      navigate(ROUTES.LOGIN);
      return;
    }
    addToCart.mutate({ productId: product.id, quantity: 1 });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSort('newest');
  };

  return (
    <div className="products-page">
      <div className="container">
        {/* Page heading */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
            {searchQuery ? `Kết quả tìm kiếm: "${searchQuery}"` : 'Tất cả sản phẩm'}
          </h1>
        </div>

        <div className="products-page-layout">
          {/* ─── Filter Sidebar ─── */}
          <aside className="filter-sidebar">
            <h3 className="filter-sidebar-title">🔍 Bộ lọc</h3>

            {/* Category filter */}
            <div className="filter-group">
              <div className="filter-group-title">Danh mục</div>
              {mockCategories.map(cat => (
                <label key={cat.id} className="filter-option">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.id)}
                    onChange={() => toggleCategory(cat.id)}
                  />
                  <span>{cat.name}</span>
                </label>
              ))}
            </div>

            {/* Brand filter */}
            <div className="filter-group">
              <div className="filter-group-title">Thương hiệu</div>
              {mockBrands.map(brand => (
                <label key={brand.id} className="filter-option">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand.id)}
                    onChange={() => toggleBrand(brand.id)}
                  />
                  <span>{brand.name}</span>
                </label>
              ))}
            </div>

            <button className="btn btn-outline btn-full filter-clear" onClick={clearFilters}>
              <X size={14} /> Xoá bộ lọc
            </button>
          </aside>

          {/* ─── Products Main ─── */}
          <div>
            <div className="products-main-top">
              <span className="results-count">{filtered.length} sản phẩm</span>
              <select
                className="sort-select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🏸</div>
                <h3 className="empty-state-title">Không tìm thấy sản phẩm</h3>
                <p className="empty-state-text">Hãy thử bộ lọc khác hoặc từ khoá khác.</p>
                <button className="btn btn-primary" onClick={clearFilters}>Xoá bộ lọc</button>
              </div>
            ) : (
              <div className="products-list-grid">
                {filtered.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
