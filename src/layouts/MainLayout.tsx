import { Outlet } from 'react-router-dom';
import Header from '../components/shared/Header/Header';
import Footer from '../components/shared/Footer/Footer';

const MainLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
