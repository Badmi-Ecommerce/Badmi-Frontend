import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import adminApi from '../../../api/adminApi';
import { QUERY_KEYS } from '../../../constants';
import type { Category } from '../../../types';
import toast from 'react-hot-toast';

const AdminCategories = () => {
  const queryClient = useQueryClient();
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => adminApi.listCategories(),
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] });
  };

  const save = useMutation({
    mutationFn: async () => {
      const payload = { name: name.trim(), image: image || undefined, description: description || undefined };
      if (editing) return adminApi.updateCategory(editing.id, payload);
      return adminApi.createCategory(payload);
    },
    onSuccess: () => {
      toast.success(editing ? 'Đã cập nhật danh mục' : 'Đã thêm danh mục');
      setIsModalOpen(false);
      setEditing(null);
      setName('');
      setImage('');
      setDescription('');
      invalidate();
    },
  });

  const remove = useMutation({
    mutationFn: (id: number) => adminApi.deleteCategory(id),
    onSuccess: () => {
      toast.success('Đã ẩn danh mục');
      invalidate();
    },
  });

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
        <h1 className="admin-page-title">Categories Management</h1>
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => {
            setEditing(null);
            setName('');
            setImage('');
            setDescription('');
            setIsModalOpen(true);
          }}
        >
          + Add Category
        </button>
      </div>

      <div className="admin-card">
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
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 4, background: '#f5f5f5' }}
                    />
                  ) : (
                    <div style={{ width: 40, height: 40, background: '#eee', borderRadius: 4 }} />
                  )}
                </td>
                <td style={{ fontWeight: 600 }}>{category.name}</td>
                <td style={{ color: 'var(--color-text-muted)' }}>{category.slug}</td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      className="btn btn-outline btn-sm"
                      type="button"
                      onClick={() => {
                        setEditing(category);
                        setName(category.name);
                        setImage(category.image || '');
                        setDescription(category.description || '');
                        setIsModalOpen(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm"
                      style={{ background: 'var(--color-danger)', color: '#fff' }}
                      type="button"
                      onClick={() => {
                        if (confirm('Ẩn danh mục này?')) remove.mutate(category.id);
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

      {isModalOpen && (
        <div className="modal-overlay">

          <div className="admin-card" style={{ width: '100%', maxWidth: 500 }}>
            <h2 style={{ marginBottom: 20, fontSize: 20, fontWeight: 800 }}>
              {editing ? 'Edit Category' : 'Add Category'}
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
                  <input className="input-field" required value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="input-wrap">
                  <label className="input-label">Image URL</label>
                  <input className="input-field" value={image} onChange={(e) => setImage(e.target.value)} />
                </div>
                <div className="input-wrap">
                  <label className="input-label">Description</label>
                  <textarea
                    className="input-field"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={save.isPending}>
                    Save
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

export default AdminCategories;
