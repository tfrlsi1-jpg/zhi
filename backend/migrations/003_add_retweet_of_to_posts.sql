-- Add retweet_of column to posts to reference original post for retweets
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS retweet_of uuid NULL REFERENCES posts(id);

-- Optional index to speed up lookup when deleting retweet posts
CREATE INDEX IF NOT EXISTS idx_posts_retweet_of ON posts(retweet_of);