import { useState } from 'react';
import { mockProducts } from '../../../mocks/data';
import type { Product } from '../../../types';

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Products Management</h1>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
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
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>
                    <img src={product.image} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                  </td>
                  <td style={{ maxWidth: '300px' }}>
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {product.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>SKU: {product.sku}</div>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                    ₫{product.price.toLocaleString()}
                  </td>
                  <td>{product.stock}</td>
                  <td>
                    {product.is_active ? 
                      <span className="badge badge-new" style={{ background: 'var(--color-success)' }}>Active</span> : 
                      <span className="badge" style={{ background: 'var(--color-text-muted)', color: '#fff' }}>Inactive</span>
                    }
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-outline btn-sm">Edit</button>
                      <button className="btn btn-sm" style={{ background: 'var(--color-danger)', color: '#fff' }} onClick={() => handleDelete(product.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="admin-card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
            <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 800 }}>Add New Product</h2>
            <form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div className="input-wrap">
                  <label className="input-label">Product Name</label>
                  <input type="text" className="input-field" placeholder="Enter product name" required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="input-wrap">
                    <label className="input-label">Price (₫)</label>
                    <input type="number" className="input-field" placeholder="0" required />
                  </div>
                  <div className="input-wrap">
                    <label className="input-label">Stock</label>
                    <input type="number" className="input-field" placeholder="0" required />
                  </div>
                </div>
                <div className="input-wrap">
                  <label className="input-label">SKU</label>
                  <input type="text" className="input-field" placeholder="SKU code" required />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Product</button>
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
