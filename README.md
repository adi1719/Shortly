# Shortly - URL Shortener

A modern, efficient URL shortener built with Node.js, Express, MongoDB, and Redis. This application provides fast URL shortening with caching capabilities and analytics tracking.

## Features

- 🔗 URL shortening with custom short IDs
- 📊 Analytics tracking for each shortened URL
- ⚡ Redis caching for improved performance
- 🔒 Secure URL handling
- 📱 Responsive frontend design
- 🚀 Easy deployment with Render

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB (with Mongoose)
- Redis (for caching)
- nanoid (for generating unique IDs)

### Frontend

- HTML5
- CSS3
- JavaScript (ES6+)
- Material Icons

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Redis (local or cloud service like Upstash)
- npm or yarn

## Project Structure

```
Shortly/
├── BackendApplication/
│   ├── config/
│   │   └── redis.js
│   ├── Controller/
│   │   └── UrlController.js
│   ├── Models/
│   │   └── UrlModel.js
│   ├── Routes/
│   │   └── UrlRoute.js
│   ├── services/
│   │   ├── redisService.js
│   │   └── urlService.js
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── UrlApplicationServer.js
└── FrontendApplication/
    ├── index.html
    ├── styles.css
    ├── script.js
    └── config.js
```

## Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/shortly.git
   cd shortly
   ```

2. **Backend Setup**

   ```bash
   cd BackendApplication
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the BackendApplication directory:

   ```env
   PORT=8080
   MONGODB_URI=your_mongodb_connection_string
   NODE_ENV=development
   REDIS_URL=your_redis_url
   ```

4. **Frontend Setup**

   ```bash
   cd ../FrontendApplication
   # No installation needed for frontend
   ```

5. **Start the Application**

   ```bash
   # Start backend (from BackendApplication directory)
   npm start

   # Frontend can be served using any static file server
   # For example, using Python's built-in server:
   python -m http.server 3000
   ```

## API Endpoints

### URL Shortening

- **POST** `/api/url`
  - Request body: `{ "url": "https://example.com" }`
  - Response: `{ "shortId": "abc123", "originalUrl": "https://example.com", "shortUrl": "http://localhost:8080/abc123" }`

### Analytics

- **GET** `/api/url/analytics/:shortId`
  - Response: `{ "shortId": "abc123", "originalUrl": "https://example.com", "totalClicks": 5, "analytics": [...] }`

### URL Redirection

- **GET** `/:shortId`
  - Redirects to the original URL

## Caching Strategy

The application uses Redis for caching with the following strategy:

- URL shortening results are cached for 24 hours
- Analytics data is cached for 24 hours
- Redirect URLs are cached for 24 hours
- Cache invalidation on URL updates

## Deployment

### Backend Deployment (Render)

1. Push your code to GitHub
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Set environment variables in Render dashboard
5. Deploy!

### Frontend Deployment

1. Update the `config.js` with your production API URL
2. Deploy to any static hosting service (Netlify, Vercel, etc.)

## Environment Variables

### Backend

- `PORT`: Server port (default: 8080)
- `MONGODB_URI`: MongoDB connection string
- `NODE_ENV`: Environment (development/production)
- `REDIS_URL`: Redis connection URL

### Frontend

- `API_URL`: Backend API URL

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [nanoid](https://github.com/ai/nanoid) for generating unique IDs
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for database hosting
- [Upstash](https://upstash.com/) for Redis hosting
- [Render](https://render.com/) for deployment
