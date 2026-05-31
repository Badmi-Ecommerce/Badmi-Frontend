import { useState } from 'react';
import { mockCategories } from '../../../mocks/data';
import type { Category } from '../../../types';

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Categories Management</h1>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          + Add Category
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
                <th>Slug</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>
                    {category.image ? (
                      <img src={category.image} alt={category.name} style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '4px', background: '#f5f5f5' }} />
                    ) : (
                      <div style={{ width: '40px', height: '40px', background: '#eee', borderRadius: '4px' }}></div>
                    )}
                  </td>
                  <td style={{ fontWeight: 600 }}>{category.name}</td>
                  <td style={{ color: 'var(--color-text-muted)' }}>{category.slug}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-outline btn-sm">Edit</button>
                      <button className="btn btn-sm" style={{ background: 'var(--color-danger)', color: '#fff' }} onClick={() => handleDelete(category.id)}>Delete</button>
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
            <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 800 }}>Add New Category</h2>
            <form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div className="input-wrap">
                  <label className="input-label">Category Name</label>
                  <input type="text" className="input-field" placeholder="Enter category name" required />
                </div>
                <div className="input-wrap">
                  <label className="input-label">Image URL</label>
                  <input type="text" className="input-field" placeholder="https://..." />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Area</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
