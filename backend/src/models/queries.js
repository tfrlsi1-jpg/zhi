import { query } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

// ===== USERS =====
export const createUser = async (username, email, password) => {
  const id = uuidv4();
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await query(
    'INSERT INTO users (id, username, email, password) VALUES ($1, $2, $3, $4) RETURNING id, username, email',
    [id, username, email, hashedPassword]
  );
  return result.rows[0];
};

export const getUserByUsername = async (username) => {
  const result = await query('SELECT * FROM users WHERE username = $1', [username]);
  return result.rows[0];
};

export const getUserById = async (id) => {
  const result = await query('SELECT id, username, email, bio, avatar, created_at FROM users WHERE id = $1', [id]);
  return result.rows[0];
};

export const updateUser = async (userId, updates) => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  for (const [key, value] of Object.entries(updates)) {
    if (['bio', 'avatar'].includes(key)) {
      fields.push(`${key} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }
  }

  if (fields.length === 0) return null;

  values.push(userId);
  const result = await query(
    `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${paramCount} RETURNING id, username, email, bio, avatar`,
    values
  );
  return result.rows[0];
};

// ===== POSTS =====
export const createPost = async (userId, content, image = null) => {
  const id = uuidv4();
  const result = await query(
    'INSERT INTO posts (id, user_id, content, image) VALUES ($1, $2, $3, $4) RETURNING *',
    [id, userId, content, image]
  );
  return result.rows[0];
};

export const getPostById = async (id) => {
  const result = await query(
    `SELECT p.*, u.username, u.avatar,
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count,
      (SELECT COUNT(*) FROM retweets WHERE post_id = p.id) as retweet_count
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.id = $1`,
    [id]
  );
  return result.rows[0];
};

export const getFeed = async (limit = 20, offset = 0, userId = null) => {
  const result = await query(
    `SELECT p.*, u.id as author_id, u.username, u.avatar,
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count,
      (SELECT COUNT(*) FROM retweets where post_id = p.id) as retweet_count,
      CASE WHEN $3::text IS NOT NULL THEN EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = $3::uuid) ELSE false END as liked,
      CASE WHEN $3::text IS NOT NULL THEN EXISTS(SELECT 1 FROM retweets WHERE post_id = p.id AND user_id = $3::uuid) ELSE false END as retweeted
     FROM posts p
     JOIN users u ON p.user_id = u.id
     ORDER BY p.created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset, userId]
  );
  return result.rows;
};

export const getUserPosts = async (userId, limit = 20, offset = 0, currentUserId = null) => {
  const result = await query(
    `SELECT p.*, u.id as author_id, u.username, u.avatar,
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count,
      (SELECT COUNT(*) FROM retweets WHERE post_id = p.id) as retweet_count,
      CASE WHEN $4::text IS NOT NULL THEN EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = $4::uuid) ELSE false END as liked,
      CASE WHEN $4::text IS NOT NULL THEN EXISTS(SELECT 1 FROM retweets WHERE post_id = p.id AND user_id = $4::uuid) ELSE false END as retweeted
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.user_id = $1::uuid
     ORDER BY p.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset, currentUserId]
  );
  return result.rows;
};

export const deletePost = async (postId, userId) => {
  const result = await query(
    'DELETE FROM posts WHERE id = $1 AND user_id = $2 RETURNING id',
    [postId, userId]
  );
  return result.rows[0];
};

// ===== LIKES =====
export const likePost = async (userId, postId) => {
  const id = uuidv4();
  try {
    await query(
      'INSERT INTO likes (id, user_id, post_id) VALUES ($1, $2, $3)',
      [id, userId, postId]
    );
    return true;
  } catch (err) {
    if (err.code === '23505') return false; // Unique constraint
    throw err;
  }
};

export const unlikePost = async (userId, postId) => {
  const result = await query(
    'DELETE FROM likes WHERE user_id = $1 AND post_id = $2 RETURNING id',
    [userId, postId]
  );
  return result.rowCount > 0;
};

// ===== RETWEETS =====
export const retweetPost = async (userId, postId) => {
  const id = uuidv4();
  try {
    await query(
      'INSERT INTO retweets (id, user_id, post_id) VALUES ($1, $2, $3)',
      [id, userId, postId]
    );
    return true;
  } catch (err) {
    if (err.code === '23505') return false; // Unique constraint
    throw err;
  }
};

export const unretweetPost = async (userId, postId) => {
  const result = await query(
    'DELETE FROM retweets WHERE user_id = $1 AND post_id = $2 RETURNING id',
    [userId, postId]
  );
  return result.rowCount > 0;
};

// ===== FOLLOWS =====
export const followUser = async (followerId, followingId) => {
  const id = uuidv4();
  try {
    await query(
      'INSERT INTO follows (id, follower_id, following_id) VALUES ($1, $2, $3)',
      [id, followerId, followingId]
    );
    return true;
  } catch (err) {
    if (err.code === '23505') return false; // Unique constraint
    throw err;
  }
};

export const unfollowUser = async (followerId, followingId) => {
  const result = await query(
    'DELETE FROM follows WHERE follower_id = $1 AND following_id = $2 RETURNING id',
    [followerId, followingId]
  );
  return result.rowCount > 0;
};

export const getFollowers = async (userId) => {
  const result = await query(
    `SELECT u.id, u.username, u.email, u.avatar
     FROM users u
     INNER JOIN follows f ON u.id = f.follower_id
     WHERE f.following_id = $1
     ORDER BY f.created_at DESC`,
    [userId]
  );
  return result.rows;
};

export const getFollowing = async (userId) => {
  const result = await query(
    `SELECT u.id, u.username, u.email, u.avatar
     FROM users u
     INNER JOIN follows f ON u.id = f.following_id
     WHERE f.follower_id = $1
     ORDER BY f.created_at DESC`,
    [userId]
  );
  return result.rows;
};

export const isFollowing = async (followerId, followingId) => {
  const result = await query(
    'SELECT 1 FROM follows WHERE follower_id = $1 AND following_id = $2',
    [followerId, followingId]
  );
  return result.rows.length > 0;
};
