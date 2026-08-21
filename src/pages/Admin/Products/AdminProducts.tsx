import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import adminApi from '../../../api/adminApi';
import { useCategories } from '../../../hooks/useCategories';
import { QUERY_KEYS } from '../../../constants';
import type { Product } from '../../../types';
import toast from 'react-hot-toast';

const emptyForm = {
  name: '',
  sku: '',
  price: '',
  originalPrice: '',
  stock: '0',
  categoryId: '',
  brandId: '',
  description: '',
  image: '',
};

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const { data: page, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => adminApi.listProducts(0, 100),
  });
  const { data: categories = [] } = useCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
  };

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name.trim(),
        sku: form.sku.trim(),
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        stock: Number(form.stock),
        categoryId: Number(form.categoryId),
        brandId: form.brandId ? Number(form.brandId) : undefined,
        description: form.description || undefined,
        images: form.image ? [form.image] : [],
        isActive: true,
      };
      if (editing) return adminApi.updateProduct(editing.id, payload);
      return adminApi.createProduct(payload);
    },
    onSuccess: () => {
      toast.success(editing ? 'Đã cập nhật sản phẩm' : 'Đã thêm sản phẩm');
      setIsModalOpen(false);
      setEditing(null);
      setForm(emptyForm);
      invalidate();
    },
  });

  const remove = useMutation({
    mutationFn: (id: number) => adminApi.deleteProduct(id),
    onSuccess: () => {
      toast.success('Đã ẩn sản phẩm');
      invalidate();
    },
  });

  const openCreate = () => {
    setEditing(null);
    setForm({
      ...emptyForm,
      categoryId: categories[0] ? String(categories[0].id) : '',
    });
    setIsModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setForm({
      name: product.name,
      sku: product.sku,
      price: String(product.price),
      originalPrice: product.originalPrice ? String(product.originalPrice) : '',
      stock: String(product.stock),
      categoryId: String(product.categoryId),
      brandId: product.brandId ? String(product.brandId) : '',
      description: product.description || '',
      image: product.image || product.images?.[0] || '',
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
        <h1 className="admin-page-title">Products Management</h1>
        <button className="btn btn-primary" type="button" onClick={openCreate}>
          + Add Product
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>
                    <img
                      src={product.image || 'https://placehold.co/50x50'}
                      alt={product.name}
                      style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                    />
                  </td>
                  <td style={{ maxWidth: 300 }}>
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {product.name}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>SKU: {product.sku}</div>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                    ₫{Number(product.price).toLocaleString()}
                  </td>
                  <td>{product.stock}</td>
                  <td>
                    {product.isActive ? (
                      <span className="badge badge-new" style={{ background: 'var(--color-success)' }}>
                        Active
                      </span>
                    ) : (
                      <span className="badge" style={{ background: 'var(--color-text-muted)', color: '#fff' }}>
                        Inactive
                      </span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-outline btn-sm" type="button" onClick={() => openEdit(product)}>
                        Edit
                      </button>
                      <button
                        className="btn btn-sm"
                        style={{ background: 'var(--color-danger)', color: '#fff' }}
                        type="button"
                        onClick={() => {
                          if (confirm('Ẩn sản phẩm này?')) remove.mutate(product.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div className="admin-card" style={{ width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: 20, fontSize: 20, fontWeight: 800 }}>
              {editing ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                save.mutate();
              }}
            >
              <div style={{ display: 'grid', gap: 16 }}>
                <div className="input-wrap">
                  <label className="input-label">Name</label>
                  <input
                    className="input-field"
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div className="input-wrap">
                  <label className="input-label">SKU</label>
                  <input
                    className="input-field"
                    required
                    value={form.sku}
                    onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="input-wrap">
                    <label className="input-label">Price</label>
                    <input
                      className="input-field"
                      type="number"
                      required
                      value={form.price}
                      onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    />
                  </div>
                  <div className="input-wrap">
                    <label className="input-label">Original price</label>
                    <input
                      className="input-field"
                      type="number"
                      value={form.originalPrice}
                      onChange={(e) => setForm((f) => ({ ...f, originalPrice: e.target.value }))}
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="input-wrap">
                    <label className="input-label">Stock</label>
                    <input
                      className="input-field"
                      type="number"
                      required
                      value={form.stock}
                      onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                    />
                  </div>
                  <div className="input-wrap">
                    <label className="input-label">Category</label>
                    <select
                      className="input-field"
                      required
                      value={form.categoryId}
                      onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                    >
                      <option value="">Select</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="input-wrap">
                  <label className="input-label">Image URL</label>
                  <input
                    className="input-field"
                    value={form.image}
                    onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                  />
                </div>
                <div className="input-wrap">
                  <label className="input-label">Description</label>
                  <textarea
                    className="input-field"
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={save.isPending}>
                    {save.isPending ? 'Saving...' : 'Save'}
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

export default AdminProducts;
