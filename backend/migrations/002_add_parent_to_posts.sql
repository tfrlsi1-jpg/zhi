-- Add parent_id to posts to support replies/comments
ALTER TABLE posts ADD COLUMN parent_id UUID REFERENCES posts(id) ON DELETE CASCADE;

-- Create index on parent_id for performance
CREATE INDEX IF NOT EXISTS idx_posts_parent_id ON posts(parent_id);
