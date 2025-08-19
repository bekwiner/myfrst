// index.js
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import productRoutes from './routes/product.routes.js';
import adminRoutes from './routes/admin.routes.js';
import clientRoutes from './routes/clientRequest.routes.js';
import imageRoutes from './routes/image.routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// JSON parsing
app.use(express.json());

// 🆕 CORS (frontend bilan bog‘lanish uchun)
app.use(cors());

// 🆕 uploads papkasini static qilish (rasmlarni ko‘rsatish)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ROUTES
app.use('/api/products', productRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/clients', clientRoutes);
app.use('/images', imageRoutes);

// Home route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// MongoDB ulanishi
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Port va serverni ishga tushirish
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
