import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const NotFoundPage = () => (
  <div className="not-found-page">
    <div style={{ textAlign: 'center' }}>
      <div className="not-found-code">404</div>
      <h2 className="not-found-title">Trang không tồn tại</h2>
      <p className="not-found-text">Trang bạn tìm kiếm không tồn tại hoặc đã bị xoá.</p>
      <Link to={ROUTES.HOME} className="btn btn-primary btn-lg">
        🏠 Về trang chủ
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
