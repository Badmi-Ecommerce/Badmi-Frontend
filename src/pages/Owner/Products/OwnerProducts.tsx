import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import categoryApi from '../../../api/categoryApi';
import ownerApi from '../../../api/ownerApi';
import {
  APPAREL_SIZES,
  BAG_SIZES,
  RACKET_GRIPS,
  RACKET_WEIGHTS,
  SHOE_SIZES,
  SHUTTLE_SPEEDS,
  parseVariantSpecs,
  specKindFromSlug,
} from '../../../constants/badmintonSpecs';
import { QUERY_KEYS } from '../../../constants';
import { useBrands, useCategories } from '../../../hooks/useCategories';
import { formatCurrency } from '../../../utils';
import type { ListingType, Product } from '../../../types';
import ImageUploadField from '../../../components/shared/ImageUploadField';

const emptyForm = {
  name: '',
  description: '',
  categoryId: '',
  subcategoryId: '',
  brandId: '',
  price: '',
  originalPrice: '',
  stock: '1',
  imageUrl: '',
  size: '',
  weight: '',
  grip: '',
  color: '',
  listingType: 'NEW' as ListingType,
  conditionPercent: '95',
  usageDuration: '',
  passReason: '',
  isNegotiable: false,
};

const OwnerProducts = () => {
  const queryClient = useQueryClient();
  const { data: page, isLoading } = useQuery({
    queryKey: ['owner-products'],
    queryFn: () => ownerApi.listProducts(0, 50),
  });
  const { data: categories = [] } = useCategories();
  const { data: brands = [] } = useBrands();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: subcategories = [] } = useQuery({
    queryKey: ['owner-subcategories', form.categoryId],
    queryFn: () => categoryApi.getSubcategories(Number(form.categoryId)),
    enabled: Boolean(form.categoryId),
  });

  const selectedCategory = categories.find((item) => String(item.id) === form.categoryId);
  const specKind = specKindFromSlug(selectedCategory?.slug);
  const isPass = form.listingType === 'PASS';

  const specHint = useMemo(() => {
    if (specKind === 'racket') return 'Vợt: chọn trọng lượng (U) và cán (G) theo thông số nhà sản xuất.';
    if (specKind === 'shoes') return 'Giày cầu lông: chọn size EU.';
    if (specKind === 'apparel') return 'Áo / quần / tất: chọn size quần áo.';
    if (specKind === 'shuttle') return 'Ống cầu: chọn tốc độ (76 nội địa, 77 phổ biến).';
    if (specKind === 'bag') return 'Bao vợt / balo: chọn sức chứa.';
    return 'Nhập size hoặc quy cách nếu có (ví dụ quấn cán, dây, khăn).';
  }, [specKind]);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['owner-products'] });
    queryClient.invalidateQueries({ queryKey: ['owner-dashboard'] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
  };

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        categoryId: Number(form.categoryId),
        subcategoryId: form.subcategoryId ? Number(form.subcategoryId) : undefined,
        brandId: form.brandId ? Number(form.brandId) : undefined,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        stock: Number(form.stock),
        imageUrl: form.imageUrl.trim() || undefined,
        size: form.size.trim() || undefined,
        weight: form.weight.trim() || undefined,
        grip: form.grip.trim() || undefined,
        color: form.color.trim() || undefined,
        listingType: form.listingType,
        conditionPercent: isPass ? Number(form.conditionPercent) : undefined,
        usageDuration: isPass ? form.usageDuration.trim() || undefined : undefined,
        passReason: isPass ? form.passReason.trim() || undefined : undefined,
        isNegotiable: isPass ? form.isNegotiable : undefined,
      };
      if (editing) return ownerApi.updateProduct(editing.id, payload);
      return ownerApi.createProduct(payload);
    },
    onSuccess: () => {
      toast.success(editing ? 'Đã cập nhật mặt hàng' : 'Đã đăng sản phẩm');
      setIsModalOpen(false);
      setEditing(null);
      setForm(emptyForm);
      invalidate();
    },
  });

  const hide = useMutation({
    mutationFn: (id: number) => ownerApi.hideProduct(id),
    onSuccess: () => {
      toast.success('Đã ẩn sản phẩm khỏi cửa hàng');
      invalidate();
    },
  });

  const openCreate = (listingType: ListingType = 'NEW') => {
    setEditing(null);
    setForm({
      ...emptyForm,
      listingType,
      categoryId: categories[0] ? String(categories[0].id) : '',
    });
    setIsModalOpen(true);
  };

  const openEdit = (product: Product) => {
    const specs = parseVariantSpecs(product.variants?.[0]?.attributes);
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description || '',
      categoryId: String(product.categoryId),
      subcategoryId: product.subcategoryId ? String(product.subcategoryId) : '',
      brandId: product.brandId ? String(product.brandId) : '',
      price: String(product.price),
      originalPrice: product.originalPrice ? String(product.originalPrice) : '',
      stock: String(product.stock),
      imageUrl: product.image || product.images?.[0] || '',
      size: specs.size,
      weight: specs.weight,
      grip: specs.grip,
      color: specs.color,
      listingType: product.listingType ?? 'NEW',
      conditionPercent: product.conditionPercent ? String(product.conditionPercent) : '95',
      usageDuration: product.usageDuration ?? '',
      passReason: product.passReason ?? '',
      isNegotiable: Boolean(product.isNegotiable),
    });
    setIsModalOpen(true);
  };

  const products = page?.content ?? [];

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Sản phẩm của tôi</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline" type="button" onClick={() => openCreate('PASS')}>
            + Đăng tin pass
          </button>
          <button className="btn btn-primary" type="button" onClick={() => openCreate('NEW')}>
            + Đăng hàng mới
          </button>
        </div>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Loại tin</th>
              <th>Loại</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Quy cách</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const categoryName = categories.find((item) => item.id === product.categoryId)?.name ?? '—';
              return (
                <tr key={product.id}>
                  <td>
                    <strong>{product.name}</strong>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{product.sku}</div>
                  </td>
                  <td>
                    {product.listingType === 'PASS' ? (
                      <span className="badge badge-sale">Pass {product.conditionPercent}%</span>
                    ) : (
                      <span className="badge badge-new">Hàng mới</span>
                    )}
                  </td>
                  <td>{categoryName}</td>
                  <td>{formatCurrency(Number(product.price))}</td>
                  <td>{product.stock}</td>
                  <td>{product.variants?.[0]?.variantName ?? '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-outline btn-sm" type="button" onClick={() => openEdit(product)}>
                        Sửa
                      </button>
                      {product.isActive && (
                        <button
                          className="btn btn-sm"
                          style={{ background: 'var(--color-danger)', color: '#fff' }}
                          type="button"
                          onClick={() => {
                            if (confirm('Ẩn sản phẩm này khỏi cửa hàng?')) hide.mutate(product.id);
                          }}
                        >
                          Ẩn
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={7}>
                  Chưa có mặt hàng. Đăng hàng mới của shop, hoặc đăng tin pass vợt, giày, balo bạn
                  không còn dùng.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">

          <div className="admin-card" style={{ width: '100%', maxWidth: 680, maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: 8, fontSize: 20, fontWeight: 800 }}>
              {editing
                ? 'Cập nhật mặt hàng'
                : isPass
                  ? 'Đăng tin pass dụng cụ'
                  : 'Đăng sản phẩm cầu lông'}
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 16, fontSize: 14 }}>{specHint}</p>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                save.mutate();
              }}
            >
              <div style={{ display: 'grid', gap: 14 }}>
                <div className="listing-type-switch">
                  {(
                    [
                      { value: 'NEW', label: 'Hàng mới', hint: 'Hàng nguyên seal của shop' },
                      { value: 'PASS', label: 'Hàng pass', hint: 'Dụng cụ đã qua sử dụng' },
                    ] as { value: ListingType; label: string; hint: string }[]
                  ).map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`listing-type-option${form.listingType === option.value ? ' is-active' : ''}`}
                      onClick={() => setForm((current) => ({ ...current, listingType: option.value }))}
                    >
                      <strong>{option.label}</strong>
                      <span>{option.hint}</span>
                    </button>
                  ))}
                </div>

                <div className="input-wrap">
                  <label className="input-label">Tên sản phẩm</label>
                  <input
                    className="input-field"
                    required
                    placeholder="Ví dụ: Yonex Astrox 100ZZ, Victor A970..."
                    value={form.name}
                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  />
                </div>

                <div className="form-grid-2">
                  <div className="input-wrap">
                    <label className="input-label">Loại hàng</label>
                    <select
                      className="input-field"
                      required
                      value={form.categoryId}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          categoryId: event.target.value,
                          subcategoryId: '',
                          size: '',
                          weight: '',
                          grip: '',
                        }))
                      }
                    >
                      <option value="">Chọn loại</option>
                      {categories.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="input-wrap">
                    <label className="input-label">Nhóm hàng</label>
                    <select
                      className="input-field"
                      value={form.subcategoryId}
                      onChange={(event) => setForm((current) => ({ ...current, subcategoryId: event.target.value }))}
                    >
                      <option value="">Không bắt buộc</option>
                      {subcategories.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="input-wrap">
                  <label className="input-label">Thương hiệu</label>
                  <select
                    className="input-field"
                    value={form.brandId}
                    onChange={(event) => setForm((current) => ({ ...current, brandId: event.target.value }))}
                  >
                    <option value="">Không bắt buộc</option>
                    {brands.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-wrap">
                  <label className="input-label">Mô tả</label>
                  <textarea
                    className="input-field"
                    rows={3}
                    placeholder="Độ cứng thân, điểm cân bằng, phù hợp trình độ..."
                    value={form.description}
                    onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  />
                </div>

                <div className="form-grid-3">
                  <div className="input-wrap">
                    <label className="input-label">Giá bán (₫)</label>
                    <input
                      className="input-field"
                      type="number"
                      min={0}
                      required
                      value={form.price}
                      onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
                    />
                  </div>
                  <div className="input-wrap">
                    <label className="input-label">Giá niêm yết</label>
                    <input
                      className="input-field"
                      type="number"
                      min={0}
                      value={form.originalPrice}
                      onChange={(event) => setForm((current) => ({ ...current, originalPrice: event.target.value }))}
                    />
                  </div>
                  <div className="input-wrap">
                    <label className="input-label">Số lượng</label>
                    <input
                      className="input-field"
                      type="number"
                      min={0}
                      required
                      value={form.stock}
                      onChange={(event) => setForm((current) => ({ ...current, stock: event.target.value }))}
                    />
                  </div>
                </div>

                {isPass && (
                  <div className="pass-form-block">
                    <p className="pass-form-title">Thông tin hàng pass</p>
                    <div className="form-grid-2">
                      <div className="input-wrap">
                        <label className="input-label">Tình trạng (%)</label>
                        <input
                          className="input-field"
                          type="number"
                          min={1}
                          max={100}
                          required
                          value={form.conditionPercent}
                          onChange={(event) =>
                            setForm((current) => ({ ...current, conditionPercent: event.target.value }))
                          }
                        />
                        <span className="input-hint">Ví dụ 95 = như mới, 85 = còn tốt.</span>
                      </div>
                      <div className="input-wrap">
                        <label className="input-label">Đã dùng bao lâu</label>
                        <input
                          className="input-field"
                          placeholder="Đã dùng 3 tháng / Hàng trưng bày"
                          value={form.usageDuration}
                          onChange={(event) =>
                            setForm((current) => ({ ...current, usageDuration: event.target.value }))
                          }
                        />
                      </div>
                    </div>
                    <div className="input-wrap">
                      <label className="input-label">Lý do pass</label>
                      <input
                        className="input-field"
                        placeholder="Đổi sang vợt nhẹ đầu hơn, dư vợt..."
                        value={form.passReason}
                        onChange={(event) =>
                          setForm((current) => ({ ...current, passReason: event.target.value }))
                        }
                      />
                    </div>
                    <label className="pass-form-check">
                      <input
                        type="checkbox"
                        checked={form.isNegotiable}
                        onChange={(event) =>
                          setForm((current) => ({ ...current, isNegotiable: event.target.checked }))
                        }
                      />
                      Chấp nhận thương lượng giá
                    </label>
                  </div>
                )}

                {specKind === 'racket' && (
                  <div className="form-grid-3">
                    <div className="input-wrap">
                      <label className="input-label">Trọng lượng</label>
                      <select
                        className="input-field"
                        value={form.weight}
                        onChange={(event) => setForm((current) => ({ ...current, weight: event.target.value }))}
                      >
                        <option value="">Chọn U</option>
                        {RACKET_WEIGHTS.map((item) => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    </div>
                    <div className="input-wrap">
                      <label className="input-label">Cán vợt (grip)</label>
                      <select
                        className="input-field"
                        value={form.grip}
                        onChange={(event) => setForm((current) => ({ ...current, grip: event.target.value }))}
                      >
                        <option value="">Chọn G</option>
                        {RACKET_GRIPS.map((item) => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    </div>
                    <div className="input-wrap">
                      <label className="input-label">Màu</label>
                      <input
                        className="input-field"
                        placeholder="Đỏ / Đen..."
                        value={form.color}
                        onChange={(event) => setForm((current) => ({ ...current, color: event.target.value }))}
                      />
                    </div>
                  </div>
                )}

                {specKind === 'shoes' && (
                  <div className="form-grid-2">
                    <div className="input-wrap">
                      <label className="input-label">Size giày (EU)</label>
                      <select
                        className="input-field"
                        value={form.size}
                        onChange={(event) => setForm((current) => ({ ...current, size: event.target.value }))}
                      >
                        <option value="">Chọn size</option>
                        {SHOE_SIZES.map((item) => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    </div>
                    <div className="input-wrap">
                      <label className="input-label">Màu</label>
                      <input
                        className="input-field"
                        value={form.color}
                        onChange={(event) => setForm((current) => ({ ...current, color: event.target.value }))}
                      />
                    </div>
                  </div>
                )}

                {specKind === 'apparel' && (
                  <div className="form-grid-2">
                    <div className="input-wrap">
                      <label className="input-label">Size</label>
                      <select
                        className="input-field"
                        value={form.size}
                        onChange={(event) => setForm((current) => ({ ...current, size: event.target.value }))}
                      >
                        <option value="">Chọn size</option>
                        {APPAREL_SIZES.map((item) => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    </div>
                    <div className="input-wrap">
                      <label className="input-label">Màu</label>
                      <input
                        className="input-field"
                        value={form.color}
                        onChange={(event) => setForm((current) => ({ ...current, color: event.target.value }))}
                      />
                    </div>
                  </div>
                )}

                {specKind === 'shuttle' && (
                  <div className="input-wrap">
                    <label className="input-label">Tốc độ cầu</label>
                    <select
                      className="input-field"
                      value={form.size}
                      onChange={(event) => setForm((current) => ({ ...current, size: event.target.value }))}
                    >
                      <option value="">Chọn tốc độ</option>
                      {SHUTTLE_SPEEDS.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </div>
                )}

                {specKind === 'bag' && (
                  <div className="input-wrap">
                    <label className="input-label">Sức chứa</label>
                    <select
                      className="input-field"
                      value={form.size}
                      onChange={(event) => setForm((current) => ({ ...current, size: event.target.value }))}
                    >
                      <option value="">Chọn</option>
                      {BAG_SIZES.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </div>
                )}

                {specKind === 'generic' && (
                  <div className="form-grid-2">
                    <div className="input-wrap">
                      <label className="input-label">Size / quy cách</label>
                      <input
                        className="input-field"
                        placeholder="Ví dụ: 10m, 3 pack..."
                        value={form.size}
                        onChange={(event) => setForm((current) => ({ ...current, size: event.target.value }))}
                      />
                    </div>
                    <div className="input-wrap">
                      <label className="input-label">Màu</label>
                      <input
                        className="input-field"
                        value={form.color}
                        onChange={(event) => setForm((current) => ({ ...current, color: event.target.value }))}
                      />
                    </div>
                  </div>
                )}

                <ImageUploadField
                  value={form.imageUrl}
                  onChange={(imageUrl) => setForm((current) => ({ ...current, imageUrl }))}
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>
                    Hủy
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={save.isPending}>
                    {save.isPending ? 'Đang lưu...' : 'Lưu sản phẩm'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerProducts;
