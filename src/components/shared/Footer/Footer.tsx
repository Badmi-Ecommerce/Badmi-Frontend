import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';
import { APP_NAME, HOTLINE } from '../../../constants';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="logo-circle">BM</div>
              <span className="footer-logo-text">{APP_NAME}</span>
            </div>
            <p className="footer-desc">
              Badmishop – Hệ thống cửa hàng cầu lông chính hãng hàng đầu Việt Nam.
              Cung cấp vợt, giày, balo, quần áo cầu lông chính hãng từ các thương hiệu nổi tiếng thế giới.
            </p>
            <div className="footer-hotline">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Phone size={14} />
                Hotline: <strong>{HOTLINE}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Mail size={14} />
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>info@badmishop.vn</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <MapPin size={14} />
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Hà Nội, Việt Nam</span>
              </div>
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="footer-col-title">Sản phẩm</h4>
            <div className="footer-links">
              {['Vợt cầu lông', 'Giày cầu lông', 'Bao vợt', 'Balo cầu lông', 'Quần áo', 'Cầu lông'].map((item) => (
                <Link key={item} to={ROUTES.PRODUCTS} className="footer-link">{item}</Link>
              ))}
            </div>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="footer-col-title">Thương hiệu</h4>
            <div className="footer-links">
              {['Yonex', 'Victor', 'Li-Ning', 'Mizuno', 'Kamito', 'Apacs'].map((brand) => (
                <Link key={brand} to={ROUTES.PRODUCTS} className="footer-link">{brand}</Link>
              ))}
            </div>
          </div>

          {/* Links 3 */}
          <div>
            <h4 className="footer-col-title">Hỗ trợ</h4>
            <div className="footer-links">
              {[
                { label: 'Cửa hàng', to: ROUTES.STORES },
                { label: 'Đào tạo', to: ROUTES.TRAINING },
                { label: 'Tin tức', to: ROUTES.NEWS },
                { label: 'Tuyển dụng', to: ROUTES.CAREERS },
                { label: 'Liên hệ', to: ROUTES.CONTACT },
              ].map((item) => (
                <Link key={item.label} to={item.to} className="footer-link">{item.label}</Link>
              ))}
            </div>
            {/* Social */}
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              {[
                { href: 'https://facebook.com', label: 'Facebook', path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
                { href: 'https://youtube.com', label: 'YouTube', path: 'M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z' },
                { href: 'https://instagram.com', label: 'Instagram', path: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zm1.5-4.87h.01M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2z' },
              ].map((social) => (
                <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer"
                  style={{ color: 'rgba(255,255,255,0.5)', transition: 'color 0.2s' }}
                  title={social.label}
                  onMouseEnter={e => (e.currentTarget.style.color = '#FF6600')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                    fill={social.label === 'YouTube' ? 'currentColor' : 'none'}
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">© 2024 {APP_NAME}. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#" className="footer-bottom-link">Chính sách bảo mật</a>
            <a href="#" className="footer-bottom-link">Điều khoản sử dụng</a>
            <a href="#" className="footer-bottom-link">Chính sách đổi trả</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
