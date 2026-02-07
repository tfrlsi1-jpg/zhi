import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

export const PostCard = ({ post, onUpdate, onDelete }) => {
  const { user } = useAuth();
  const [isLiking, setIsLiking] = useState(false);
  const [isRetweeting, setIsRetweeting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const dateStr = new Date(post.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const handleLike = async () => {
    if (!user) return;
    setIsLiking(true);
    try {
      if (post.liked) {
        await axios.delete(`/api/likes/${post.id}`, { withCredentials: true });
        onUpdate(post.id, {
          liked: false,
          like_count: (post.like_count || 0) - 1,
        });
      } else {
        await axios.post(`/api/likes/${post.id}`, {}, { withCredentials: true });
        onUpdate(post.id, {
          liked: true,
          like_count: (post.like_count || 0) + 1,
        });
      }
    } catch (err) {
      console.error('Like error:', err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleRetweet = async () => {
    if (!user) return;
    setIsRetweeting(true);
    try {
      if (post.retweeted) {
        await axios.delete(`/api/retweets/${post.id}`, { withCredentials: true });
        onUpdate(post.id, {
          retweeted: false,
          retweet_count: (post.retweet_count || 0) - 1,
        });
      } else {
        await axios.post(`/api/retweets/${post.id}`, {}, { withCredentials: true });
        onUpdate(post.id, {
          retweeted: true,
          retweet_count: (post.retweet_count || 0) + 1,
        });
      }
    } catch (err) {
      console.error('Retweet error:', err);
    } finally {
      setIsRetweeting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/posts/${post.id}`, { withCredentials: true });
      onDelete(post.id);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="post-card">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-3 flex-1">
          <div className="avatar w-12 h-12">
            {post.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-zhi-text">{post.username}</p>
            <p className="stat">@{post.username?.slice(0, 4)}</p>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="btn-ghost text-xl"
          >
            ⋯
          </button>
          {showMenu && user?.id === post.user_id && (
            <div className="absolute right-0 top-10 bg-zhi-dark border border-zhi-border rounded-lg z-10">
              <button
                onClick={handleDelete}
                className="block w-full text-left px-4 py-2 text-red-500 hover:bg-zhi-hover text-sm"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <p className="text-zhi-text mb-3 leading-normal">{post.content}</p>

      {/* Image */}
      {post.image && (
        <div className="mb-3 rounded-2xl overflow-hidden">
          <img src={post.image} alt="" className="w-full max-h-500 object-cover" />
        </div>
      )}

      {/* Stats */}
      <p className="stat text-xs mb-3">{dateStr}</p>

      {/* Actions */}
      <div className="flex justify-between pt-3 border-t border-zhi-border text-zhi-secondary">
        <button className="btn-ghost flex items-center space-x-2 group">
          <span className="group-hover:bg-blue-500/20 rounded-full p-2">💬</span>
          <span className="stat group-hover:text-blue-500">Reply</span>
        </button>

        <button
          onClick={handleRetweet}
          disabled={isRetweeting}
          className={`btn-ghost flex items-center space-x-2 group ${
            post.retweeted ? 'text-green-500' : ''
          }`}
        >
          <span className={`group-hover:bg-green-500/20 rounded-full p-2 ${
            post.retweeted ? 'animate-heart' : ''
          }`}>
            🔄
          </span>
          <span className={`stat ${post.retweeted ? 'text-green-500' : 'group-hover:text-green-500'}`}>
            {post.retweet_count || 0}
          </span>
        </button>

        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`btn-ghost flex items-center space-x-2 group ${
            post.liked ? 'text-red-500' : ''
          }`}
        >
          <span className={`group-hover:bg-red-500/20 rounded-full p-2 ${
            post.liked ? 'animate-heart' : ''
          }`}>
            {post.liked ? '❤️' : '🤍'}
          </span>
          <span className={`stat ${post.liked ? 'text-red-500' : 'group-hover:text-red-500'}`}>
            {post.like_count || 0}
          </span>
        </button>

        <button className="btn-ghost flex items-center space-x-2 group">
          <span className="group-hover:bg-blue-500/20 rounded-full p-2">📤</span>
        </button>
      </div>
    </div>
  );
};
