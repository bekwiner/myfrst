// index.js
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import productRoutes from './routes/product.routes.js';
import adminRoutes from './routes/admin.routes.js';
import clientRoutes from './routes/clientRequest.routes.js';
import cors from "cors"; // 🆕 shu joyda qo‘shing

import imageRoutes from "./routes/image.routes.js";


dotenv.config();

const app = express();
app.use(express.json());

// Static uploads
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use(cors()); // 🆕 CORS qo‘shish

app.use("/images", imageRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/clients', clientRoutes);


app.get('/', (req, res) => {
  res.send('API is running...');
});



const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
