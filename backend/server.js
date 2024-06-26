import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error('Error: MONGO_URI is not defined');
  process.exit(1);
}

connectDB(); // Connect to MongoDB

const app = express();

// Body parser middleware
app.use(express.json()); // Add middleware to parse JSON
app.use(express.urlencoded({ extended: true }));

// Cookie Parser
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

// Add the notFound middleware
app.use(notFound);

// Add the errorHandler middleware
app.use(errorHandler);

// Unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1); // Mandatory (as per the Node.js docs)
});

app.listen(port, () => console.log(`Server running on port ${port}`));
