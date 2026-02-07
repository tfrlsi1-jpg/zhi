import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/Auth/LoginForm';
import { RegisterForm } from '../components/Auth/RegisterForm';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-zhi-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-2">🟠</div>
          <h1 className="text-4xl font-bold text-orange-600 mb-2">Zhi</h1>
          <p className="text-zhi-secondary">Share your moments with the world</p>
        </div>

        {/* Form Card */}
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-zhi-text mb-6 text-center">
            {isLogin ? 'Welcome Back' : 'Join Zhi'}
          </h2>

          {isLogin ? (
            <LoginForm onSuccess={handleAuthSuccess} />
          ) : (
            <RegisterForm onSuccess={handleAuthSuccess} />
          )}

          {/* Toggle Form */}
          <div className="mt-6 text-center">
            <p className="text-zhi-secondary">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-orange-600 hover:text-orange-500 font-semibold"
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-zhi-secondary text-xs mt-8">
          By using Zhi, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};
