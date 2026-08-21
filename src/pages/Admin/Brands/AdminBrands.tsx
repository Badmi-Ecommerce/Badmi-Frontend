import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import adminApi from '../../../api/adminApi';
import { QUERY_KEYS } from '../../../constants';
import type { Brand } from '../../../types';
import toast from 'react-hot-toast';

const AdminBrands = () => {
  const queryClient = useQueryClient();
  const { data: brands = [], isLoading } = useQuery({
    queryKey: ['admin-brands'],
    queryFn: () => adminApi.listBrands(),
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-brands'] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BRANDS] });
  };

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        name: name.trim(),
        description: description || undefined,
        website: website || undefined,
      };
      if (editing) return adminApi.updateBrand(editing.id, payload);
      return adminApi.createBrand(payload);
    },
    onSuccess: () => {
      toast.success(editing ? 'Đã cập nhật thương hiệu' : 'Đã thêm thương hiệu');
      setIsModalOpen(false);
      setEditing(null);
      setName('');
      setDescription('');
      setWebsite('');
      invalidate();
    },
  });

  const remove = useMutation({
    mutationFn: (id: number) => adminApi.deleteBrand(id),
    onSuccess: () => {
      toast.success('Đã ẩn thương hiệu');
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
        <h1 className="admin-page-title">Brands Management</h1>
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => {
            setEditing(null);
            setName('');
            setDescription('');
            setWebsite('');
            setIsModalOpen(true);
          }}
        >
          + Add Brand
        </button>
      </div>

      <div className="admin-card">
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
            {brands.map((brand) => (
              <tr key={brand.id}>
                <td>{brand.id}</td>
                <td style={{ fontWeight: 600 }}>{brand.name}</td>
                <td style={{ color: 'var(--color-text-muted)', maxWidth: 400 }}>
                  {brand.description || 'No description'}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      className="btn btn-outline btn-sm"
                      type="button"
                      onClick={() => {
                        setEditing(brand);
                        setName(brand.name);
                        setDescription(brand.description || '');
                        setWebsite(brand.website || '');
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
                        if (confirm('Ẩn thương hiệu này?')) remove.mutate(brand.id);
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
          <div className="admin-card" style={{ width: '100%', maxWidth: 500 }}>
            <h2 style={{ marginBottom: 20, fontSize: 20, fontWeight: 800 }}>
              {editing ? 'Edit Brand' : 'Add Brand'}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                save.mutate();
              }}
            >
              <div style={{ display: 'grid', gap: 16 }}>
                <div className="input-wrap">
                  <label className="input-label">Brand Name</label>
                  <input className="input-field" required value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="input-wrap">
                  <label className="input-label">Website</label>
                  <input className="input-field" value={website} onChange={(e) => setWebsite(e.target.value)} />
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

export default AdminBrands;
