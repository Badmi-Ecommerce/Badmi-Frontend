import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { useAuth } from '../../store/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

type Props = {
  onSuccessNavigate?: string;
};

/** Renders Google button when VITE_GOOGLE_CLIENT_ID is set. */
const GoogleSignInButton = ({ onSuccessNavigate = ROUTES.HOME }: Props) => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  if (!clientId) {
    return null;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <GoogleLogin
        onSuccess={async (res) => {
          if (!res.credential) {
            toast.error('Không nhận được Google credential.');
            return;
          }
          try {
            await loginWithGoogle(res.credential);
            navigate(onSuccessNavigate);
          } catch {
            // toast via interceptor
          }
        }}
        onError={() => toast.error('Đăng nhập Google thất bại.')}
        useOneTap={false}
        theme="outline"
        size="large"
        width="320"
        text="continue_with"
        shape="rectangular"
      />
    </div>
  );
};

export default GoogleSignInButton;
