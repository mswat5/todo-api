import express from 'express';
import dotenv from 'dotenv';
import { securityMiddleware } from './middleware/security';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Apply security middleware
app.use(securityMiddleware);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Basic API info endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Todo API Server',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        logout: 'POST /api/auth/logout'
      },
      todos: {
        list: 'GET /api/todos',
        create: 'POST /api/todos',
        get: 'GET /api/todos/:id',
        update: 'PUT /api/todos/:id',
        delete: 'DELETE /api/todos/:id'
      },
      users: {
        profile: 'GET /api/users/profile',
        updateProfile: 'PUT /api/users/profile'
      }
    }
  });
});

// Placeholder routes (would be replaced with actual routes when Prisma is working)
app.use('/api/auth', (req, res) => {
  res.status(503).json({
    success: false,
    message: 'Authentication service temporarily unavailable - Prisma client not initialized'
  });
});

app.use('/api/todos', (req, res) => {
  res.status(503).json({
    success: false,
    message: 'Todo service temporarily unavailable - Prisma client not initialized'
  });
});

app.use('/api/users', (req, res) => {
  res.status(503).json({
    success: false,
    message: 'User service temporarily unavailable - Prisma client not initialized'
  });
});

// Handle 404 routes
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⚡ Health check: http://localhost:${PORT}/health`);
  console.log(`📖 API info: http://localhost:${PORT}/api`);
});

export default app;