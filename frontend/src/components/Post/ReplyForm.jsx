import { useState } from 'react';
import { api } from '../../lib/api';

export const ReplyForm = ({ postId, onReplySuccess }) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!content.trim()) {
      setError('Reply cannot be empty');
      return;
    }

    if (content.length > 280) {
      setError('Reply cannot exceed 280 characters');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post(`/api/posts/${postId}/reply`, {
        content: content.trim(),
      });

      if (response.data.success) {
        setContent('');
        onReplySuccess?.(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to post reply');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-zhi-darker p-4 border border-zhi-border rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a reply..."
          className="input-field min-h-20 resize-none"
          disabled={isLoading}
          maxLength={280}
        />

        <div className="flex justify-between items-center">
          <span className="text-xs text-zhi-secondary">
            {content.length}/280
          </span>
          {error && (
            <span className="text-xs text-red-400">{error}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !content.trim()}
          className="btn-primary w-full"
        >
          {isLoading ? 'Replying...' : 'Reply'}
        </button>
      </form>
    </div>
  );
};
