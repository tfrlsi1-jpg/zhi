import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export const RegisterForm = ({ onSuccess }) => {
  const { register, isLoading, error: authError } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!username.trim() || !email.trim() || !password.trim()) {
      setLocalError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    const result = await register(username, email, password, confirmPassword);
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
          placeholder="Choose a username"
          className="input-field"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-zhi-text mb-2">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
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
          placeholder="Enter password (min 6 chars)"
          className="input-field"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-zhi-text mb-2">
          Confirm Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm password"
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
        {isLoading ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  );
};
