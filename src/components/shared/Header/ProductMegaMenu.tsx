import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';
import { useBrands, useCategories, useSubcategories } from '../../../hooks/useCategories';

const productsLink = (params: Record<string, number>) => {
  const query = new URLSearchParams(
    Object.entries(params).map(([key, value]) => [key, String(value)])
  );
  return `${ROUTES.PRODUCTS}?${query.toString()}`;
};

const ProductMegaMenu = ({ onNavigate }: { onNavigate: () => void }) => {
  const { data: categories = [] } = useCategories();
  const { data: brands = [] } = useBrands();
  const { data: subcategories = [] } = useSubcategories();
  const [hoveredCategoryId, setHoveredCategoryId] = useState<number | null>(null);

  if (categories.length === 0) return null;

  const activeCategory = categories.find((c) => c.id === hoveredCategoryId) ?? categories[0];
  const activeLines = subcategories.filter((s) => s.categoryId === activeCategory.id);

  return (
    <div className="mega-menu">
      <div className="mega-menu-cats">
        <p className="mega-menu-cats-title">Danh mục sản phẩm</p>
        <ul>
          {categories.map((c) => (
            <li key={c.id}>
              <Link
                to={productsLink({ category: c.id })}
                className={`mega-cat${c.id === activeCategory.id ? ' is-active' : ''}`}
                onMouseEnter={() => setHoveredCategoryId(c.id)}
                onFocus={() => setHoveredCategoryId(c.id)}
                onClick={onNavigate}
              >
                <span>{c.name}</span>
                <ChevronRight size={16} />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mega-menu-brands">
        {brands.map((b) => (
          <div key={b.id} className="mega-brand">
            <Link
              to={productsLink({ category: activeCategory.id, brand: b.id })}
              className="mega-brand-title"
              onClick={onNavigate}
            >
              {activeCategory.name} {b.name}
            </Link>
            {activeLines.length > 0 && (
              <ul className="mega-brand-lines">
                {activeLines.map((s) => (
                  <li key={s.id}>
                    <Link
                      to={productsLink({
                        category: activeCategory.id,
                        brand: b.id,
                        subcategory: s.id,
                      })}
                      onClick={onNavigate}
                    >
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductMegaMenu;
