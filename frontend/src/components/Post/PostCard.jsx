import { useState } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';

export const PostCard = ({ post, onUpdate, onDelete, onPostAdd, isReply = false }) => {
  const { user } = useAuth();
  const [isLiking, setIsLiking] = useState(false);
  const [isRetweeting, setIsRetweeting] = useState(false);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [quoteContent, setQuoteContent] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isPostingReply, setIsPostingReply] = useState(false);
  const [replies, setReplies] = useState([]);
  const [replyCount, setReplyCount] = useState(post.reply_count || 0);
  const [repliesLoading, setRepliesLoading] = useState(false);
  const [replyError, setReplyError] = useState(null);
  const [showShareBox, setShowShareBox] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  const dateStr = new Date(post.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const handleLike = async () => {
    if (!user) return;
    setIsLiking(true);
    try {
      if (post.liked) {
        await api.delete(`/api/likes/${post.id}`);
        onUpdate(post.id, {
          liked: false,
          like_count: (post.like_count || 0) - 1,
        });
      } else {
        await api.post(`/api/likes/${post.id}`);
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
        await api.delete(`/api/retweets/${post.id}`);
        if (onUpdate) {
          onUpdate(post.id, {
            retweeted: false,
            retweet_count: (post.retweet_count || 0) - 1,
          });
        }
      } else {
        // If quote form is not visible, open it for optional quote text
        if (!showQuoteForm) {
          setShowQuoteForm(true);
          setIsRetweeting(false);
          return;
        }

        const response = await api.post(`/api/retweets/${post.id}`, { content: quoteContent.trim() || null });

        if (response.data.success) {
          if (onUpdate) {
            onUpdate(post.id, {
              retweeted: true,
              retweet_count: (post.retweet_count || 0) + 1,
            });
          }
          // Add the newly created retweet post to the feed (appears on top)
          if (onPostAdd && response.data.data) {
            onPostAdd(response.data.data);
          }
          setShowQuoteForm(false);
          setQuoteContent('');
        }
      }
    } catch (err) {
      console.error('Retweet error:', err);
    } finally {
      setIsRetweeting(false);
    }
  };

  const submitQuoteRetweet = async (e) => {
    e.preventDefault();
    if (!user) return;
    setIsRetweeting(true);
    try {
      const response = await api.post(`/api/retweets/${post.id}`, { content: quoteContent.trim() || null });
      if (response.data.success) {
        if (onUpdate) {
          onUpdate(post.id, {
            retweeted: true,
            retweet_count: (post.retweet_count || 0) + 1,
          });
        }
        // Add the newly created retweet post to the feed (appears on top)
        if (onPostAdd && response.data.data) {
          onPostAdd(response.data.data);
        }
        setShowQuoteForm(false);
        setQuoteContent('');
      }
    } catch (err) {
      console.error('Quote retweet error:', err);
    } finally {
      setIsRetweeting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/posts/${post.id}`);
      onDelete(post.id);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const fetchReplies = async () => {
    setRepliesLoading(true);
    setReplyError(null);
    try {
      const response = await api.get(`/api/posts/${post.id}/replies`);
      if (response.data.success) {
        setReplies(response.data.data);
      }
    } catch (err) {
      setReplyError(err.response?.data?.error || 'Failed to load replies');
    } finally {
      setRepliesLoading(false);
    }
  };

  const handlePostReply = async (e) => {
    e.preventDefault();
    setReplyError(null);

    if (!replyContent.trim()) {
      setReplyError('Reply cannot be empty');
      return;
    }

    if (replyContent.length > 280) {
      setReplyError('Reply cannot exceed 280 characters');
      return;
    }

    setIsPostingReply(true);
    try {
      const response = await api.post(`/api/posts/${post.id}/reply`, {
        content: replyContent.trim(),
      });

      if (response.data.success) {
        setReplyContent('');
        setReplyCount(replyCount + 1);
        if (showReplies) {
          fetchReplies();
        }
      }
    } catch (err) {
      setReplyError(err.response?.data?.error || 'Failed to post reply');
    } finally {
      setIsPostingReply(false);
    }
  };

  const handleShare = () => {
    setShowShareBox((prev) => !prev);
    setHasCopied(false);
  };

  const handleCopyLink = async () => {
    try {
      const base =
        (typeof window !== 'undefined' && window.location?.origin) ||
        (import.meta && import.meta.env && import.meta.env.VITE_APP_URL) ||
        '';
      const url = `${base}/posts/${post.id}`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        setHasCopied(true);
        // Briefly show "Copied" then hide the share box
        setTimeout(() => {
          setHasCopied(false);
          setShowShareBox(false);
        }, 800);
      }
    } catch (err) {
      console.error('Copy link error:', err);
    }
  };

  return (
    <div className="post-card">
      {/* Retweet Indicator */}
      {post.retweet_of && (
        <div className="flex items-center space-x-2 mb-3 px-4 text-sm text-zhi-secondary">
          <span>🔄</span>
          <span>{post.username} retweeted</span>
        </div>
      )}

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
      {post.content && (
        <p className="text-zhi-text mb-3 leading-normal">{post.content}</p>
      )}

      {/* Embedded original post for retweets */}
      {post.retweet_of_post && (
        <div className="mb-3 rounded-lg overflow-hidden border border-zhi-border bg-zhi-darker p-3">
          <div className="flex items-center space-x-3 mb-2">
            <div className="avatar w-8 h-8">
              {post.retweet_of_post.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-zhi-text text-sm">{post.retweet_of_post.username}</p>
              <p className="stat text-xs">@{post.retweet_of_post.username?.slice(0,4)}</p>
            </div>
          </div>
          <p className="text-zhi-text mb-2 text-sm">{post.retweet_of_post.content}</p>
          {post.retweet_of_post.image && (
            <div className="mb-2 rounded-md overflow-hidden">
              <img src={post.retweet_of_post.image} alt="" className="w-full object-cover" />
            </div>
          )}
          <div className="flex items-center justify-between text-xs text-zhi-secondary">
            <span>{post.retweet_of_post.like_count || 0} ❤️</span>
            <span>{post.retweet_of_post.retweet_count || 0} 🔄</span>
            <span>{post.retweet_of_post.reply_count || 0} 💬</span>
          </div>
        </div>
      )}

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
        <button
          onClick={() => {
            setShowReplyForm(!showReplyForm);
            if (!showReplies && replyCount > 0) {
              setShowReplies(true);
              fetchReplies();
            }
          }}
          title="Reply"
          className="btn-ghost flex items-center space-x-2 group"
        >
          <span className="group-hover:bg-blue-500/20 rounded-full p-2">💬</span>
          <span className="stat group-hover:text-blue-500">{replyCount || 0}</span>
        </button>

        <button
          onClick={handleRetweet}
          disabled={isRetweeting}
          title={post.retweeted ? 'Undo retweet' : 'Retweet'}
          className={`btn-ghost flex items-center space-x-2 group ${
            post.retweeted ? 'text-green-500' : ''
          }`}
        >
          <span
            className={`group-hover:bg-green-500/20 rounded-full p-2 ${
              post.retweeted ? 'animate-heart' : ''
            }`}
          >
            🔄
          </span>
          <span
            className={`stat ${post.retweeted ? 'text-green-500' : 'group-hover:text-green-500'}`}
          >
            {post.retweet_count || 0}
          </span>
        </button>

        <button
          onClick={handleLike}
          disabled={isLiking}
          title={post.liked ? 'Unlike' : 'Like'}
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

        <div className="relative">
          <button
            onClick={handleShare}
            type="button"
            title="Share"
            className="btn-ghost flex items-center space-x-2 group"
          >
            <span className="group-hover:bg-blue-500/20 rounded-full p-2">📤</span>
          </button>

          {showShareBox && (
            <div className="absolute right-0 bottom-full mb-2 w-64 bg-zhi-dark border border-zhi-border rounded-lg shadow-lg p-3 z-50">
              <p className="text-xs text-zhi-secondary mb-2">Copy link to this post</p>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={
                    ((typeof window !== 'undefined' && window.location?.origin) ||
                      (import.meta && import.meta.env && import.meta.env.VITE_APP_URL) ||
                      '') + `/posts/${post.id}`
                  }
                  className="flex-1 bg-zhi-darker text-xs text-zhi-text px-2 py-1 rounded border border-zhi-border overflow-hidden text-ellipsis"
                  onFocus={(e) => e.target.select()}
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="btn-primary text-xs px-2 py-1 whitespace-nowrap"
                >
                  {hasCopied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reply Form */}
      {showReplyForm && user && (
        <div className="mt-4 pt-4 border-t border-zhi-border">
          <form onSubmit={handlePostReply} className="space-y-3">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              className="input-field min-h-20 resize-none"
              disabled={isPostingReply}
              maxLength={280}
            />

            <div className="flex justify-between items-center">
              <span className="text-xs text-zhi-secondary">
                {replyContent.length}/280
              </span>
              {replyError && (
                <span className="text-xs text-red-400">{replyError}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={isPostingReply || !replyContent.trim()}
              className="btn-primary w-full"
            >
              {isPostingReply ? 'Replying...' : 'Reply'}
            </button>
          </form>
        </div>
      )}

      {/* Quote-retweet Form */}
      {showQuoteForm && user && (
        <div className="mt-4 pt-4 border-t border-zhi-border">
          <form onSubmit={submitQuoteRetweet} className="space-y-3">
            <textarea
              value={quoteContent}
              onChange={(e) => setQuoteContent(e.target.value)}
              placeholder="Add a comment (optional)"
              className="input-field min-h-20 resize-none"
              disabled={isRetweeting}
              maxLength={280}
            />

            <div className="flex justify-between items-center">
              <span className="text-xs text-zhi-secondary">
                {quoteContent.length}/280
              </span>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => { setShowQuoteForm(false); setQuoteContent(''); }}
                  className="btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRetweeting}
                  className="btn-primary"
                >
                  {isRetweeting ? 'Retweeting...' : 'Retweet'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Replies List */}
      {showReplies && (
        <div className="mt-4 pt-4 border-t border-zhi-border">
          <button
            onClick={() => setShowReplies(false)}
            className="text-sm text-zhi-secondary hover:text-zhi-text mb-3"
          >
            Hide replies
          </button>

          {repliesLoading ? (
            <div className="flex justify-center py-4">
              <p className="text-zhi-secondary">Loading replies...</p>
            </div>
          ) : replyError ? (
            <div className="text-center py-4">
              <p className="text-red-400 text-sm">{replyError}</p>
            </div>
          ) : replies.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-zhi-secondary text-sm">No replies yet</p>
            </div>
          ) : (
            <div className="space-y-3 border-l-2 border-zhi-border ml-4 pl-4">
              {replies.map((reply) => (
                <div key={reply.id} className="bg-zhi-darker/50 rounded-lg p-3">
                  <PostCard
                    post={reply}
                    isReply={true}
                    onUpdate={(id, patch) => {
                      setReplies((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
                    }}
                    onDelete={(id) => {
                      setReplies((prev) => prev.filter((r) => r.id !== id));
                      setReplyCount((c) => Math.max(0, c - 1));
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Show replies button */}
      {!showReplies && replyCount > 0 && (
        <div className="mt-3">
          <button
            onClick={() => {
              setShowReplies(true);
              if (replies.length === 0) {
                fetchReplies();
              }
            }}
            className="text-sm text-blue-500 hover:text-blue-400"
          >
            Show {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
          </button>
        </div>
      )}
    </div>
  );
};
