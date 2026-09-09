import { useState } from 'react';
import toast from 'react-hot-toast';
import mediaApi from '../../api/mediaApi';

type ImageUploadFieldProps = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
};

const ImageUploadField = ({ value, onChange, label = 'Ảnh sản phẩm' }: ImageUploadFieldProps) => {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const result = await mediaApi.uploadImage(file);
      onChange(result.url);
      toast.success('Đã tải ảnh lên Cloudinary');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="input-wrap">
      <label className="input-label">{label}</label>
      <input
        className="input-field"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        disabled={uploading}
        onChange={(event) => {
          const file = event.target.files?.[0];
          void handleFile(file);
          event.target.value = '';
        }}
      />
      <input
        className="input-field"
        style={{ marginTop: 8 }}
        placeholder="Hoặc dán URL ảnh"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {uploading && <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Đang tải ảnh...</span>}
      {value && (
        <img
          src={value}
          alt="Xem trước"
          style={{ marginTop: 10, width: 96, height: 96, objectFit: 'cover', borderRadius: 8 }}
        />
      )}
    </div>
  );
};

export default ImageUploadField;
