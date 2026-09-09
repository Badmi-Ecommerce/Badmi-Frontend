import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ArrowRight, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '../../components/shared/ProductCard/ProductCard';
import { useProducts } from '../../hooks/useProducts';
import { useCategories, useBrands, useSubcategories } from '../../hooks/useCategories';
import { useShops } from '../../hooks/useShops';
import { DA_NANG_CITY } from '../../constants/danang';
import { useAddToCart } from '../../hooks/useCart';
import { useAuth } from '../../store/AuthContext';
import { ROUTES } from '../../constants/routes';
import type { Product } from '../../types';
import toast from 'react-hot-toast';

type FilterState = {
  key: string;
  categories: number[];
  brands: number[];
  subcategories: number[];
};

const filtersFromParams = (key: string): FilterState => {
  const [category, brand, subcategory] = key.split('|');
  return {
    key,
    categories: category ? [Number(category)] : [],
    brands: brand ? [Number(brand)] : [],
    subcategories: subcategory ? [Number(subcategory)] : [],
  };
};

const toggleIn = (list: number[], id: number) =>
  list.includes(id) ? list.filter((value) => value !== id) : [...list, id];

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
  const brandParam = searchParams.get('brand') || '';
  const subcategoryParam = searchParams.get('subcategory') || '';
  const shopParam = searchParams.get('shop') || '';

  const paramKey = `${categoryParam}|${brandParam}|${subcategoryParam}`;
  const [filterDraft, setFilterDraft] = useState<FilterState>(() => filtersFromParams(paramKey));
  const [sort, setSort] = useState('newest');

  // Link từ mega menu chỉ đổi query string, nên khi param đổi thì lấy lại bộ lọc từ URL.
  const filters = filterDraft.key === paramKey ? filterDraft : filtersFromParams(paramKey);
  const { categories: selectedCategories, brands: selectedBrands, subcategories: selectedSubcategories } = filters;

  const { data: productsPage, isLoading } = useProducts({ page: 0, size: 48 });
  const { data: categories = [] } = useCategories();
  const { data: brands = [] } = useBrands();
  const { data: subcategories = [] } = useSubcategories();
  const { data: shops = [] } = useShops({ city: DA_NANG_CITY });
  const activeShop = shopParam ? shops.find((s) => String(s.userId) === shopParam) : undefined;

  const visibleSubcategories =
    selectedCategories.length > 0
      ? subcategories.filter((s) => selectedCategories.includes(s.categoryId))
      : subcategories;

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
  if (selectedSubcategories.length > 0) {
    filtered = filtered.filter((p) => selectedSubcategories.includes(p.subcategoryId ?? 0));
  }
  if (shopParam) {
    filtered = filtered.filter((p) => String(p.ownerId) === shopParam);
  }
  if (sort === 'price_asc') filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sort === 'price_desc') filtered = [...filtered].sort((a, b) => b.price - a.price);

  const toggleCategory = (id: number) =>
    setFilterDraft({ ...filters, key: paramKey, categories: toggleIn(selectedCategories, id) });
  const toggleBrand = (id: number) =>
    setFilterDraft({ ...filters, key: paramKey, brands: toggleIn(selectedBrands, id) });
  const toggleSubcategory = (id: number) =>
    setFilterDraft({ ...filters, key: paramKey, subcategories: toggleIn(selectedSubcategories, id) });

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
    setFilterDraft({ key: paramKey, categories: [], brands: [], subcategories: [] });
    setSort('newest');
  };

  const activeFilterCount =
    selectedCategories.length + selectedBrands.length + selectedSubcategories.length;
  const selectedCategoryNames = categories.filter((c) => selectedCategories.includes(c.id));
  const selectedBrandNames = brands.filter((b) => selectedBrands.includes(b.id));
  const selectedSubcategoryNames = subcategories.filter((s) =>
    selectedSubcategories.includes(s.id)
  );

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
        <div className="products-page-head">
          <p className="products-kicker">Cửa hàng</p>
          <h1 className="products-title">Sản phẩm cầu lông</h1>
          {searchQuery && (
            <p className="products-search-hint">
              Kết quả cho “{searchQuery}”
            </p>
          )}
        </div>

        {activeShop && (
          <div className="pass-shop-banner">
            <span>
              Hàng mới của <strong>{activeShop.shopName}</strong>
              {activeShop.district ? ` · Q. ${activeShop.district}` : ''}
            </span>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              {activeShop.passCount > 0 && (
                <Link to={`${ROUTES.PASS}?shop=${activeShop.userId}`} className="store-action-link">
                  {activeShop.passCount} tin pass <ArrowRight size={14} />
                </Link>
              )}
              <Link to={ROUTES.PRODUCTS} className="store-action-link">
                Xem tất cả sản phẩm <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}

        <div className="products-page-layout">
          <aside className="filter-sidebar">
            <div className="filter-sidebar-head">
              <SlidersHorizontal size={18} />
              <h2 className="filter-sidebar-title">Bộ lọc</h2>
              {activeFilterCount > 0 && (
                <span className="filter-badge">{activeFilterCount}</span>
              )}
            </div>

            <div className="filter-group">
              <h3 className="filter-group-title">Danh mục</h3>
              <div className="filter-options">
                {categories.map((c) => (
                  <label
                    key={c.id}
                    className={`filter-option ${selectedCategories.includes(c.id) ? 'is-active' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(c.id)}
                      onChange={() => toggleCategory(c.id)}
                    />
                    <span>{c.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {visibleSubcategories.length > 0 && (
              <div className="filter-group">
                <h3 className="filter-group-title">Nhóm sản phẩm</h3>
                <div className="filter-options">
                  {visibleSubcategories.map((s) => (
                    <label
                      key={s.id}
                      className={`filter-option ${selectedSubcategories.includes(s.id) ? 'is-active' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSubcategories.includes(s.id)}
                        onChange={() => toggleSubcategory(s.id)}
                      />
                      <span>{s.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="filter-group">
              <h3 className="filter-group-title">Thương hiệu</h3>
              <div className="filter-options">
                {brands.map((b) => (
                  <label
                    key={b.id}
                    className={`filter-option ${selectedBrands.includes(b.id) ? 'is-active' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(b.id)}
                      onChange={() => toggleBrand(b.id)}
                    />
                    <span>{b.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {activeFilterCount > 0 && (
              <button type="button" className="filter-clear" onClick={clearFilters}>
                <X size={14} /> Xoá bộ lọc
              </button>
            )}
          </aside>

          <div className="products-main">
            <div className="products-main-top">
              <div>
                <p className="results-count">
                  <strong>{filtered.length}</strong> sản phẩm
                </p>
                {activeFilterCount > 0 && (
                  <div className="filter-chips">
                    {selectedCategoryNames.map((c) => (
                      <button
                        key={`cat-${c.id}`}
                        type="button"
                        className="filter-chip"
                        onClick={() => toggleCategory(c.id)}
                      >
                        {c.name} <X size={12} />
                      </button>
                    ))}
                    {selectedSubcategoryNames.map((s) => (
                      <button
                        key={`sub-${s.id}`}
                        type="button"
                        className="filter-chip"
                        onClick={() => toggleSubcategory(s.id)}
                      >
                        {s.name} <X size={12} />
                      </button>
                    ))}
                    {selectedBrandNames.map((b) => (
                      <button
                        key={`brand-${b.id}`}
                        type="button"
                        className="filter-chip"
                        onClick={() => toggleBrand(b.id)}
                      >
                        {b.name} <X size={12} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <label className="sort-field">
                <span>Sắp xếp</span>
                <select
                  className="sort-select"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🏸</div>
                <h3 className="empty-state-title">Không tìm thấy sản phẩm</h3>
                <p className="empty-state-text">Thử xoá bộ lọc hoặc đổi từ khoá tìm kiếm.</p>
                <button type="button" className="btn btn-secondary" onClick={clearFilters}>
                  Xoá bộ lọc
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
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
