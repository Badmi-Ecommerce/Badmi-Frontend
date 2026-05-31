import { useState } from 'react';
import { mockBrands } from '../../../mocks/data';
import type { Brand } from '../../../types';

const AdminBrands = () => {
  const [brands, setBrands] = useState<Brand[]>(mockBrands);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this brand?')) {
      setBrands(brands.filter(b => b.id !== id));
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Brands Management</h1>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          + Add Brand
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.map(brand => (
                <tr key={brand.id}>
                  <td>{brand.id}</td>
                  <td style={{ fontWeight: 600 }}>{brand.name}</td>
                  <td style={{ color: 'var(--color-text-muted)', maxWidth: '400px' }}>
                    {brand.description || 'No description'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-outline btn-sm">Edit</button>
                      <button className="btn btn-sm" style={{ background: 'var(--color-danger)', color: '#fff' }} onClick={() => handleDelete(brand.id)}>Delete</button>
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
          <div className="admin-card" style={{ width: '100%', maxWidth: '500px' }}>
            <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 800 }}>Add New Brand</h2>
            <form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div className="input-wrap">
                  <label className="input-label">Brand Name</label>
                  <input type="text" className="input-field" placeholder="Enter brand name" required />
                </div>
                <div className="input-wrap">
                  <label className="input-label">Description</label>
                  <textarea className="input-field" placeholder="Enter details..." rows={3}></textarea>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Brand</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBrands;
