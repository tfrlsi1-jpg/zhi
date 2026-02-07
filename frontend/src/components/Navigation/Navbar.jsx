import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 w-full bg-zhi-dark border-b border-zhi-border backdrop-blur-sm z-50">
      <div className="max-w-full px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🟠</span>
          <span className="text-xl font-bold text-orange-600">Zhi</span>
        </div>

        {/* Center - Navigation */}
        {user && (
          <div className="hidden sm:flex space-x-8">
            <button
              onClick={() => navigate('/home')}
              className="btn-ghost flex items-center space-x-2"
            >
              <span className="text-lg">🏠</span>
              <span>Home</span>
            </button>
            <button
              onClick={() => navigate('/explore')}
              className="btn-ghost flex items-center space-x-2"
            >
              <span className="text-lg">🔍</span>
              <span>Explore</span>
            </button>
            <button
              onClick={() => navigate(`/profile/${user.id}`)}
              className="btn-ghost flex items-center space-x-2"
            >
              <span className="text-lg">👤</span>
              <span>Profile</span>
            </button>
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="hidden sm:inline text-sm text-zhi-secondary">
                {user.username}
              </span>
              <button onClick={handleLogout} className="btn-secondary py-2">
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="btn-secondary py-2"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="btn-primary py-2"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
