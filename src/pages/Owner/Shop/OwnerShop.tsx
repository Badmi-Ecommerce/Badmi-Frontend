import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import shopApi from '../../../api/shopApi';
import ImageUploadField from '../../../components/shared/ImageUploadField';
import { QUERY_KEYS } from '../../../constants';
import { DA_NANG_CITY, DA_NANG_DISTRICTS } from '../../../constants/danang';
import { ROUTES } from '../../../constants/routes';
import type { Shop, ShopType } from '../../../types';

type ShopForm = {
  shopName: string;
  shopType: ShopType;
  description: string;
  phone: string;
  facebookUrl: string;
  zaloPhone: string;
  addressLine: string;
  district: string;
  city: string;
  openHours: string;
  services: string;
  avatarUrl: string;
  coverUrl: string;
};

const emptyForm: ShopForm = {
  shopName: '',
  shopType: 'SHOP',
  description: '',
  phone: '',
  facebookUrl: '',
  zaloPhone: '',
  addressLine: '',
  district: DA_NANG_DISTRICTS[0],
  city: DA_NANG_CITY,
  openHours: '',
  services: '',
  avatarUrl: '',
  coverUrl: '',
};

const formFromShop = (shop?: Shop): ShopForm =>
  shop
    ? {
        shopName: shop.shopName,
        shopType: shop.shopType,
        description: shop.description ?? '',
        phone: shop.phone ?? '',
        facebookUrl: shop.facebookUrl ?? '',
        zaloPhone: shop.zaloPhone ?? '',
        addressLine: shop.addressLine ?? '',
        district: shop.district ?? DA_NANG_DISTRICTS[0],
        city: shop.city || DA_NANG_CITY,
        openHours: shop.openHours ?? '',
        services: shop.services.join(', '),
        avatarUrl: shop.avatarUrl ?? '',
        coverUrl: shop.coverUrl ?? '',
      }
    : emptyForm;

const OwnerShop = () => {
  const queryClient = useQueryClient();

  const { data: shop, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.OWNER_SHOP],
    queryFn: () => shopApi.getMyShop(),
    retry: false,
  });

  // Chỉ giữ phần người bán vừa sửa; còn lại lấy từ hồ sơ đã lưu.
  const [draft, setDraft] = useState<ShopForm | null>(null);
  const form = draft ?? formFromShop(shop);
  const setForm = (patch: (current: ShopForm) => ShopForm) => setDraft(patch(form));

  const save = useMutation({
    mutationFn: () =>
      shopApi.saveMyShop({
        shopName: form.shopName.trim(),
        shopType: form.shopType,
        description: form.description.trim() || undefined,
        phone: form.phone.trim() || undefined,
        facebookUrl: form.facebookUrl.trim() || undefined,
        zaloPhone: form.zaloPhone.trim() || undefined,
        addressLine: form.addressLine.trim() || undefined,
        district: form.district || undefined,
        city: form.city.trim() || DA_NANG_CITY,
        openHours: form.openHours.trim() || undefined,
        services: form.services.trim() || undefined,
        avatarUrl: form.avatarUrl.trim() || undefined,
        coverUrl: form.coverUrl.trim() || undefined,
      }),
    onSuccess: () => {
      toast.success('Đã lưu hồ sơ cửa hàng');
      setDraft(null);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.OWNER_SHOP] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SHOPS] });
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
        <div>
          <h1 className="admin-page-title">Hồ sơ cửa hàng</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>
            Hồ sơ này hiển thị trong{' '}
            <Link to={ROUTES.STORES} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
              danh bạ người bán
            </Link>{' '}
            và kèm theo mỗi tin pass của bạn.
          </p>
        </div>
        {shop && (
          <span className="badge badge-hot">
            {shop.productCount} hàng mới · {shop.passCount} tin pass
          </span>
        )}
      </div>

      <div className="admin-card" style={{ maxWidth: 760 }}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            save.mutate();
          }}
        >
          <div style={{ display: 'grid', gap: 14 }}>
            <div className="form-grid-2">
              <div className="input-wrap">
                <label className="input-label">Tên cửa hàng / tên hiển thị</label>
                <input
                  className="input-field"
                  required
                  placeholder="Ví dụ: Huy Badminton, Tuấn Pass Vợt..."
                  value={form.shopName}
                  onChange={(e) => setForm((c) => ({ ...c, shopName: e.target.value }))}
                />
              </div>
              <div className="input-wrap">
                <label className="input-label">Bạn bán với tư cách</label>
                <select
                  className="input-field"
                  value={form.shopType}
                  onChange={(e) => setForm((c) => ({ ...c, shopType: e.target.value as ShopType }))}
                >
                  <option value="SHOP">Cửa hàng cầu lông (có đăng ký)</option>
                  <option value="PERSONAL">Cá nhân pass dụng cụ</option>
                </select>
                <span className="input-hint">
                  {form.shopType === 'SHOP'
                    ? 'Shop sẽ xuất hiện trong danh bạ cửa hàng.'
                    : 'Cá nhân không vào danh bạ cửa hàng, chỉ hiện kèm tin pass.'}
                </span>
              </div>
            </div>

            <div className="input-wrap">
              <label className="input-label">Giới thiệu</label>
              <textarea
                className="input-field"
                rows={3}
                placeholder="Bạn bán gì, có dịch vụ đan lưới không, hẹn xem hàng thế nào..."
                value={form.description}
                onChange={(e) => setForm((c) => ({ ...c, description: e.target.value }))}
              />
            </div>

            <div className="form-grid-2">
              <div className="input-wrap">
                <label className="input-label">Số điện thoại</label>
                <input
                  className="input-field"
                  placeholder="0905 118 236"
                  value={form.phone}
                  onChange={(e) => setForm((c) => ({ ...c, phone: e.target.value }))}
                />
              </div>
              <div className="input-wrap">
                <label className="input-label">Giờ mở cửa / giờ hẹn</label>
                <input
                  className="input-field"
                  placeholder="08:00 - 21:30 hoặc Hẹn trước theo giờ"
                  value={form.openHours}
                  onChange={(e) => setForm((c) => ({ ...c, openHours: e.target.value }))}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="input-wrap">
                <label className="input-label">Link Facebook</label>
                <input
                  className="input-field"
                  placeholder="https://facebook.com/tencuaban"
                  value={form.facebookUrl}
                  onChange={(e) => setForm((c) => ({ ...c, facebookUrl: e.target.value }))}
                />
                <span className="input-hint">Hiện ở mỗi tin pass để người mua nhắn tin.</span>
              </div>
              <div className="input-wrap">
                <label className="input-label">Số Zalo</label>
                <input
                  className="input-field"
                  placeholder="0905 118 236"
                  value={form.zaloPhone}
                  onChange={(e) => setForm((c) => ({ ...c, zaloPhone: e.target.value }))}
                />
              </div>
            </div>

            <div className="input-wrap">
              <label className="input-label">Địa chỉ</label>
              <input
                className="input-field"
                placeholder="215 Nguyễn Văn Linh, P. Vĩnh Trung"
                value={form.addressLine}
                onChange={(e) => setForm((c) => ({ ...c, addressLine: e.target.value }))}
              />
            </div>

            <div className="form-grid-2">
              <div className="input-wrap">
                <label className="input-label">Quận / huyện</label>
                <select
                  className="input-field"
                  value={form.district}
                  onChange={(e) => setForm((c) => ({ ...c, district: e.target.value }))}
                >
                  {DA_NANG_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-wrap">
                <label className="input-label">Tỉnh / thành</label>
                <input
                  className="input-field"
                  value={form.city}
                  onChange={(e) => setForm((c) => ({ ...c, city: e.target.value }))}
                />
              </div>
            </div>

            <div className="input-wrap">
              <label className="input-label">Dịch vụ (cách nhau bằng dấu phẩy)</label>
              <input
                className="input-field"
                placeholder="Đan lưới tại chỗ, Thử vợt miễn phí, Giao hàng 2h"
                value={form.services}
                onChange={(e) => setForm((c) => ({ ...c, services: e.target.value }))}
              />
            </div>

            <div className="form-grid-2">
              <ImageUploadField
                label="Ảnh đại diện"
                value={form.avatarUrl}
                onChange={(avatarUrl) => setForm((c) => ({ ...c, avatarUrl }))}
              />
              <ImageUploadField
                label="Ảnh bìa cửa hàng"
                value={form.coverUrl}
                onChange={(coverUrl) => setForm((c) => ({ ...c, coverUrl }))}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" disabled={save.isPending}>
                {save.isPending ? 'Đang lưu...' : 'Lưu hồ sơ'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OwnerShop;
