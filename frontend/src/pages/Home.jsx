import { useAuth } from '../hooks/useAuth';
import { useFeed } from '../hooks/useFeed';
import { PostForm } from '../components/Post/PostForm';
import { PostFeed } from '../components/Post/PostFeed';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const HomePage = () => {
  const { user } = useAuth();
  const { posts, isLoading, error, addPost, updatePost, deletePost } = useFeed();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-zhi-dark">
      {/* Main Feed */}
      <div className="flex-1 max-w-2xl border-r border-zhi-border overflow-y-auto pt-16">
        {/* Sticky Header */}
        <div className="sticky top-16 bg-zhi-dark/95 border-b border-zhi-border backdrop-blur-sm z-40">
          <div className="px-4 py-4">
            <h2 className="text-xl font-bold text-zhi-text">Home</h2>
          </div>
        </div>

        {/* Post Form */}
        <div className="border-b border-zhi-border p-4">
          <PostForm onPostCreated={addPost} />
        </div>

        {/* Feed */}
        <div>
          <PostFeed
            posts={posts}
            isLoading={isLoading}
            error={error}
            onPostUpdate={updatePost}
            onPostDelete={deletePost}
          />
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="hidden lg:block w-80 border-l border-zhi-border p-4 pt-20 overflow-y-auto">
        {/* Search */}
        <input
          type="text"
          placeholder="Search Zhi"
          className="input-field mb-6"
        />

        {/* What's Happening */}
        <div className="card p-4 space-y-4">
          <h3 className="text-xl font-bold text-zhi-text">What's happening?!</h3>
          <div className="space-y-2">
            <div className="p-3 bg-zhi-hover rounded-xl hover:bg-zhi-border cursor-pointer transition">
              <p className="stat text-xs">Trending Worldwide</p>
              <p className="font-bold text-zhi-text">Zhi</p>
              <p className="stat text-xs">150.2K posts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
