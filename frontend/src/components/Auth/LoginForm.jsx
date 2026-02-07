import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export const LoginForm = ({ onSuccess }) => {
  const { login, isLoading, error: authError } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!username.trim() || !password.trim()) {
      setLocalError('Username and password are required');
      return;
    }

    const result = await login(username, password);
    if (result.success) {
      onSuccess?.();
    } else {
      setLocalError(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-zhi-text mb-2">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          className="input-field"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-zhi-text mb-2">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          className="input-field"
          disabled={isLoading}
        />
      </div>

      {(authError || localError) && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 text-red-400 text-sm">
          {authError || localError}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full"
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};
