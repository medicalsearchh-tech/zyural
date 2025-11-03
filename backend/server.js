const express = require('express');
const passport = require('passport');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const loadEnvironmentConfig = () => {
  // Check if we're in production (Render sets NODE_ENV automatically)
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Determine which env file to load
  const envFile = isProduction ? '.env.production' : '.env.local';
  
  try {
    require('dotenv').config({ path: path.resolve(process.cwd(), envFile) });
    console.log(`* Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`* Loaded config from: ${envFile}`);
  } catch (error) {
    console.warn(`###  Could not load ${envFile}, falling back to default .env`);
    require('dotenv').config();
  }
};
loadEnvironmentConfig();

const db = require('./models');

const app = express();
app.use(passport.initialize());
const PORT = process.env.PORT || 5000;

// Log startup information
console.log(`* Starting server in ${process.env.NODE_ENV || 'development'} mode`);
console.log(`* Frontend URL: ${process.env.FRONTEND_URL}`);
console.log(`* Database Host: ${process.env.DB_HOST}`);

// Security middleware
app.use(helmet({
  // Allow cross-origin requests for development
  crossOriginResourcePolicy: process.env.NODE_ENV === 'development' ? { policy: "cross-origin" } : { policy: "same-origin" }
}));

app.set('trust proxy', true);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 500 : 400, // More requests in development
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL?.replace(/\/$/, ''),
  ...(process.env.NODE_ENV === 'development' ? [
    'http://localhost:3300',
    'http://127.0.0.1:3300'
  ] : [])
].filter(Boolean); 

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      console.warn(`### CORS blocked request from: ${origin}`);
      return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
    }
  },
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Log all requests in development
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Routes
app.use('/api/admin', require('./routes/admin'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/sections', require('./routes/sections'));
app.use('/api/lessons', require('./routes/lessons'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/detail-instructors', require('./routes/detail-instructor'));
app.use('/api/specialties', require('./routes/specialties'));
app.use('/api/enrollments', require('./routes/enrollments'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/quiz', require('./routes/quizzes'));
app.use('/api/certificates', require('./routes/certificate'));
app.use('/api/admin/certificate-templates', require('./routes/certificate-template'));
app.use('/api/student-certificates', require('./routes/student-certificate'));
app.use('/api/student', require('./routes/student-dashboard'));
app.use('/api/instructor', require('./routes/instructor'));
app.use('/api/instructors', require('./routes/instructor-quiz'));
app.use('/api/instructor/quiz', require('./routes/instructor-question'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/contact', require('./routes/contact'));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await db.sequelize.authenticate();
    res.json({ 
      status: 'OK', 
      db: 'Connected', 
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0'
    });
  } catch (err) {
    console.error('### Database health check failed:', err);
    res.status(500).json({ 
      status: 'ERROR', 
      db: 'Disconnected', 
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      error: process.env.NODE_ENV === 'development' ? err.message : 'Database connection failed'
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'E-Learning Platform API',
    status: 'Running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      users: '/api/users',
      courses: '/api/courses',
      categories: '/api/categories',
      enrollments: '/api/enrollments',
      payments: '/api/payments',
      progress: '/api/progress'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.warn(`### 404: Route not found - ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    success: false, 
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('### Global Error Handler:', {
    message: error.message,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
  
  const statusCode = error.statusCode || 500;
  const message = error.message || '### Internal server error';
  
  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === 'development' ? message : 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});
// Database connection and server start
// Database connection and server start
const startServer = async () => {
  try {
    console.log('Testing database connection...');
    
    // Test database connection
    await db.sequelize.authenticate();
    console.log('Database connection established successfully');
    
    // Sync database (create tables)
    const syncOptions = {
      alter: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development' ? console.log : false
    };
    
    console.log('🔄 Synchronizing database...');
    await db.sequelize.sync(syncOptions);
    console.log('✅ Database synchronized');
    
    // Start server
    const server = app.listen(PORT, () => {
      console.log('===================================');
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`API URL: ${process.env.NODE_ENV === 'production' ? `http://localhost:${PORT}` : `http://localhost:${PORT}`}/api`);
      console.log(`Frontend: ${process.env.FRONTEND_URL}`);
      console.log(`Health check: ${process.env.NODE_ENV === 'production' ? `http://localhost:${PORT}` : `http://localhost:${PORT}`}/api/health`);
      console.log('===================================');
    });

    // Handle server errors
    server.on('error', (err) => {
      console.error('### Server error:', err);
      process.exit(1);
    });
    
  } catch (error) {
    console.error('### Unable to start server:', error);
    console.error('### Check your database connection and environment variables');
    process.exit(1);
  }
};

// Graceful shutdown
const shutdown = async (signal) => {
  console.log(`Received ${signal}, shutting down server gracefully...`);
  try {
    await db.sequelize.close();
    console.log('Database connection closed');
    console.log('Server shutdown complete');
    process.exit(0);
  } catch (err) {
    console.error('### Error during shutdown:', err);
    process.exit(1);
  }
};

// Listen for shutdown signals
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Call the function to start server
startServer();