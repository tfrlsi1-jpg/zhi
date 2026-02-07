import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

export const PostForm = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState(null);

  const charCount = content.length;
  const isOverLimit = charCount > 280;

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || isOverLimit) return;

    setIsPosting(true);
    setError(null);

    try {
      const response = await axios.post(
        '/api/posts',
        {
          content: content.trim(),
          image: image || null,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        setContent('');
        setImage(null);
        setImagePreview(null);
        onPostCreated(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to post');
    } finally {
      setIsPosting(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="card p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Header */}
        <div className="flex items-start space-x-4">
          <div className="avatar w-12 h-12">
            {user.username?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="font-bold text-zhi-text">{user.username}</p>
            <p className="stat text-sm">@{user.username?.slice(0, 4)}</p>
          </div>
        </div>

        {/* Textarea */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening?!"
          className="input-field min-h-24 resize-none"
        />

        {/* Image Preview */}
        {imagePreview && (
          <div className="relative rounded-2xl overflow-hidden max-h-64 bg-zhi-darker">
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => {
                setImage(null);
                setImagePreview(null);
              }}
              className="absolute top-2 right-2 bg-zhi-darker/80 hover:bg-zhi-darker rounded-full p-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-zhi-border">
          <label className="cmd btn-ghost cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <span className="text-orange-600 text-lg">📷</span>
          </label>

          <div className="flex items-center space-x-3">
            <span className={`text-sm font-semibold ${
              isOverLimit ? 'text-red-500' : charCount > 250 ? 'text-orange-600' : 'text-zhi-secondary'
            }`}>
              {charCount}/280
            </span>
            <button
              type="submit"
              disabled={!content.trim() || isOverLimit || isPosting}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPosting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};
