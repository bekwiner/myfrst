import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String },
    model: { type: String },
    category: { type: String },
    price: { type: Number },
    inStock: { type: Boolean, default: true },
    telegramImageId: { type: String }, // Telegramdan kelgan rasm file_id
  },
  { timestamps: true }
);

// Default eksport — muhim!
const Product = mongoose.model('Product', productSchema);
export default Product;
