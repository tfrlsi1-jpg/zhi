import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';

export const useFeed = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(null);

  const fetchFeed = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/posts/feed', {
        params: {
          limit: 20,
          offset: 0,
        },
      });

      if (response.data.success) {
        setPosts(response.data.data);
        setLastFetchTime(Date.now());
        setError(null);
      }
    } catch (err) {
      console.error('Fetch feed error:', err);
      setError(err.response?.data?.error || 'Failed to fetch feed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  // Polling effect
  useEffect(() => {
    const interval = setInterval(() => {
      fetchFeed();
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [fetchFeed]);

  const addPost = (newPost) => {
    // Use functional update to avoid stale closures
    setPosts((prev) => [newPost, ...prev]);
  };

  const updatePost = (postId, updates) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, ...updates } : post
      )
    );
  };

  const deletePost = (postId) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  return {
    posts,
    isLoading,
    error,
    fetchFeed,
    addPost,
    updatePost,
    deletePost,
  };
};
