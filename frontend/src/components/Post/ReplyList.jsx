import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { PostCard } from './PostCard';

export const ReplyList = ({ postId, onReplyAdded }) => {
  const [replies, setReplies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReplies();
  }, [postId, onReplyAdded]);

  const fetchReplies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/posts/${postId}/replies`);
      if (response.data.success) {
        setReplies(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load replies');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <p className="text-zhi-secondary">Loading replies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  if (replies.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-zhi-secondary text-sm">No replies yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 border-l-2 border-zhi-border ml-4 pl-4">
      {replies.map((reply) => (
        <div key={reply.id} className="bg-zhi-darker/50 rounded-lg p-3">
          <PostCard post={reply} isReply={true} />
        </div>
      ))}
    </div>
  );
};
