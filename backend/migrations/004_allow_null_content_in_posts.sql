-- Allow posts.content to be NULL so retweet-only posts can exist
ALTER TABLE posts
ALTER COLUMN content DROP NOT NULL;