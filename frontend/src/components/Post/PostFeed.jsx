import { PostCard } from './PostCard';

export const PostFeed = ({ posts, isLoading, error, onPostUpdate, onPostDelete, onPostAdd }) => {
  if (error) {
    return (
      <div className="card p-6 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (isLoading && posts.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card p-4 animate-pulse">
            <div className="h-20 bg-zhi-border rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="card p-12 text-center">
        <p className="text-4xl mb-4">📝</p>
        <p className="text-zhi-text text-lg font-bold">No posts yet</p>
        <p className="text-zhi-secondary">Be the first to post!</p>
      </div>
    );
  }

  return (
    <div className="space-y-1 divide-y divide-zhi-border">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onUpdate={onPostUpdate}
          onDelete={onPostDelete}
          onPostAdd={onPostAdd}
        />
      ))}
    </div>
  );
};
