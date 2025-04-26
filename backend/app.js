import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import projectRoutes from './routes/projects.js'
// Import your routes
import loginRoutes from './routes/login.js';
import registerRoutes from './routes/register.js';
import taskRoutes from './routes/tasks.js';
import messageRoutes from './routes/message.js'
// Import DB connection
import connectDB from './config/db.js';

// Load environment variables
dotenv.config();

// __dirname workaround for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Connect to MongoDB
connectDB();

// CORS configuration for localhost:3000
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static route for uploaded resumes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/auth', loginRoutes);     // Handles /api/auth/login
app.use('/api/auth', registerRoutes);  // Handles /api/auth/register/*
app.use('/projects',projectRoutes);
app.use('/tasks',taskRoutes);
app.use('/messages',messageRoutes);
// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running!' });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
