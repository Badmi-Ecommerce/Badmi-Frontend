import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import ProductCard from '../../components/shared/ProductCard/ProductCard';
import { useProducts } from '../../hooks/useProducts';
import { useCategories, useBrands } from '../../hooks/useCategories';
import { useAddToCart } from '../../hooks/useCart';
import { useAuth } from '../../store/AuthContext';
import { ROUTES } from '../../constants/routes';
import type { Product } from '../../types';
import toast from 'react-hot-toast';

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

  const searchQuery = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';

  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    categoryParam ? [Number(categoryParam)] : []
  );
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  const [sort, setSort] = useState('newest');

  const { data: productsPage, isLoading } = useProducts({ page: 0, limit: 48 });
  const { data: categories = [] } = useCategories();
  const { data: brands = [] } = useBrands();

  let filtered = (productsPage?.content ?? []).filter((p) => p.isActive);

  if (searchQuery) {
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }
  if (selectedCategories.length > 0) {
    filtered = filtered.filter((p) => selectedCategories.includes(p.categoryId));
  }
  if (selectedBrands.length > 0) {
    filtered = filtered.filter((p) => selectedBrands.includes(p.brandId ?? 0));
  }
  if (sort === 'price_asc') filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sort === 'price_desc') filtered = [...filtered].sort((a, b) => b.price - a.price);

  const toggleCategory = (id: number) =>
    setSelectedCategories((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  const toggleBrand = (id: number) =>
    setSelectedBrands((prev) => (prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]));

  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng.');
      navigate(ROUTES.LOGIN);
      return;
    }
    const variantId = product.variants?.[0]?.id;
    if (!variantId) {
      toast.error('Sản phẩm chưa có biến thể để mua.');
      return;
    }
    addToCart.mutate({ variantId, quantity: 1 });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSort('newest');
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="container">
        <div className="products-layout">
          <aside className="products-sidebar">
            <div className="filter-group">
              <h3>Danh mục</h3>
              {categories.map((c) => (
                <label key={c.id} className="filter-check">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(c.id)}
                    onChange={() => toggleCategory(c.id)}
                  />
                  {c.name}
                </label>
              ))}
            </div>
            <div className="filter-group">
              <h3>Thương hiệu</h3>
              {brands.map((b) => (
                <label key={b.id} className="filter-check">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(b.id)}
                    onChange={() => toggleBrand(b.id)}
                  />
                  {b.name}
                </label>
              ))}
            </div>
            <button className="btn btn-secondary" onClick={clearFilters}>
              <X size={14} /> Xoá bộ lọc
            </button>
          </aside>

          <div className="products-main">
            <div className="products-toolbar">
              <span>{filtered.length} sản phẩm</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="products-grid">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
