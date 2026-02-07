# Zhi 🟠 - Social Platform

A beautiful, modern Twitter-like social platform built with React and Node.js. Share moments, connect with others, like, and retweet posts with a stunning orange-themed interface.

## Features

✨ **Core Features**
- 🔐 User authentication (register/login)
- 📝 Create posts with images (up to 280 characters like Twitter)
- ❤️ Like posts with heart animation
- 🔄 Retweet posts to share with your network
- 👥 Follow/unfollow users
- 🖼️ Image upload with base64 storage
- ⚡ Real-time feed with polling (updates every 5 seconds)
- 📱 Fully responsive design

🎨 **Design**
- Orange color scheme (#FF6B35 primary)
- Dark theme optimized for social media
- Smooth animations and transitions
- Twitter-like UI inspiration

## Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: React Context API + Hooks

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: Session-based (express-session)
- **Password Hashing**: bcryptjs
- **ORM**: Raw SQL queries

## Project Structure

```
zhi/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # PostgreSQL connection
│   │   ├── middleware/
│   │   │   └── auth.js              # Authentication middleware
│   │   ├── routes/
│   │   │   ├── auth.js              # Auth endpoints
│   │   │   ├── posts.js             # Post CRUD
│   │   │   ├── likes.js             # Like endpoints
│   │   │   ├── retweets.js          # Retweet endpoints
│   │   │   ├── follows.js           # Follow endpoints
│   │   │   └── users.js             # User endpoints
│   │   ├── models/
│   │   │   └── queries.js           # Database queries
│   │   └── server.js                # Express server
│   ├── migrations/
│   │   └── 001_create_tables.sql    # Database schema
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   └── RegisterForm.jsx
│   │   │   ├── Post/
│   │   │   │   ├── PostForm.jsx     # Create posts
│   │   │   │   ├── PostCard.jsx     # Display posts
│   │   │   │   └── PostFeed.jsx     # Feed list
│   │   │   └── Navigation/
│   │   │       └── Navbar.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js           # Auth context & hook
│   │   │   └── useFeed.js           # Feed polling
│   │   ├── pages/
│   │   │   ├── Auth.jsx
│   │   │   ├── Home.jsx
│   │   │   └── Profile.jsx (future)
│   │   ├── App.jsx                  # Main app with routing
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Global styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## Prerequisites

- **Node.js** 16+ and npm
- **PostgreSQL** 12+ installed and running

## Installation & Setup

### 1. Clone or Extract

```bash
cd zhi
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file with your PostgreSQL credentials:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/zhi
PORT=3001
NODE_ENV=development
SESSION_SECRET=your-secret-key-change-in-production
FRONTEND_URL=http://localhost:5173
```

### 3. Database Setup

Create a PostgreSQL database:

```bash
createdb zhi
```

Run migrations:

```bash
psql -U username -d zhi -f migrations/001_create_tables.sql
```

Or manually create tables (see migration file for SQL).

### 4. Start Backend

```bash
npm run dev
```

Backend runs on `http://localhost:3001`

### 5. Frontend Setup (in another terminal)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## Usage

1. **Register**: Click "Sign Up" and create an account
2. **Login**: Log in with your credentials
3. **Create Post**: Type in the text area and optionally add an image
4. **Interact**: Like (❤️), retweet (🔄), and reply to posts
5. **Follow**: Discover and follow other users (future implementation)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Posts
- `POST /api/posts` - Create post
- `GET /api/posts/feed` - Get feed (with polling)
- `GET /api/posts/user/:userId` - Get user's posts
- `GET /api/posts/:id` - Get single post
- `DELETE /api/posts/:id` - Delete post

### Interactions
- `POST /api/likes/:postId` - Like post
- `DELETE /api/likes/:postId` - Unlike post
- `POST /api/retweets/:postId` - Retweet
- `DELETE /api/retweets/:postId` - Remove retweet

### Follows
- `POST /api/follows/:userId` - Follow user
- `DELETE /api/follows/:userId` - Unfollow user
- `GET /api/follows/:userId/followers` - Get followers
- `GET /api/follows/:userId/following` - Get following

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile` - Update profile

## Features Roadmap

- [ ] User profiles with bio and avatar
- [ ] Comments/replies on posts
- [ ] Direct messaging
- [ ] Trending topics
- [ ] Search functionality
- [ ] User recommendations
- [ ] Dark/Light theme toggle
- [ ] Media gallery view
- [ ] Post threads
- [ ] Notifications

## Deployment

### Frontend (Vercel)

```bash
npm run build
```

Deploy the `dist` folder to Vercel, Netlify, or any static host.

### Backend (Heroku/Railway/Render)

1. Set environment variables in deployment platform
2. Deploy code repository
3. Platform will run `npm start`

## Color Scheme

```
Primary Orange:    #FF6B35 (Zhi main color)
Dark Orange:       #E55100 (Hover states)
Light Orange:      #FFD9B3 (Highlights)
Background:        #0F1419 (Dark theme)
Text:              #FFFFFF (Primary text)
Secondary Text:    #71767B (Dates, counts)
Border:            #2F3336 (Post borders)
Hover:             #181B20 (Hover background)
```

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env`
- Verify tables exist: `\dt` in psql

### CORS Errors
- Backend `vite.config.js` proxies `/api` to backend
- Ensure backend is running on port 3001
- Check `FRONTEND_URL` matches your frontend URL

### Images Not Saving
- Check file size (backend accepts up to 50MB)
- Images are converted to base64 - larger images = larger database
- Consider implementing image compression or cloud storage

### Feed Not Updating
- Polling checks every 5 seconds
- Ensure backend is responding to `GET /api/posts/feed`
- Check browser console for errors

## Security Notes

This is a demo application. For production:
- [ ] Use HTTPS/SSL
- [ ] Implement CSRF protection
- [ ] Add rate limiting
- [ ] Implement image upload security
- [ ] Use secure password hashing (already using bcryptjs)
- [ ] Add input validation
- [ ] Use CORS properly with specific origins
- [ ] Implement refresh tokens
- [ ] Add database backups

## Contributing

Feel free to fork and submit pull requests!

## License

MIT License

## Credits

- Inspired by Twitter
- Built with React, Node.js, Tailwind CSS
- Orange theme inspired by modern social apps

---

**Made with 🟠 and ❤️**
