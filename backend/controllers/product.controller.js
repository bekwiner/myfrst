// controllers/product.controller.js
import Product from "../models/Product.model.js";

// CREATE
// CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const { name, brand, model, category, price, inStock, imageUrl } = req.body;

    const productData = {
      name,
      brand,
      model,
      category,
      price,
      inStock,
    };

    // Agar rasm backenddan yuklangan bo‘lsa
   if (req.file) {
    productData.imageUrl = `/uploads/${req.file.filename}`;
    productData.imageName = req.file.filename;
  }

    // Agar botdan yuborilgan bo‘lsa (imageUrl kelgan bo‘lsa)
    if (imageUrl) {
      productData.imageUrl = imageUrl;
      productData.imageName = imageUrl.split("/").pop();
    }

    const product = new Product(productData);
    await product.save();

    res.status(201).json(product);
  } catch (err) {
    console.error("❌ Rasm yuklashda muammo:", err);
    res.status(400).json({ message: "❌ Rasm yuklashda muammo yuz berdi" });
  }
};

// GET ALL
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    const updatedProducts = products.map((p) => {
      const obj = p.toObject();
      if (obj.imageUrl) {
        obj.imageName = obj.imageUrl.split("/").pop();
      }
      return obj;
    });

    res.json(updatedProducts);
  } catch (err) {
    res.status(500).json({ message: "Mahsulotlarni olishda xatolik", error: err.message });
  }
};

// GET BY ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Mahsulot topilmadi" });

    const obj = product.toObject();
    if (obj.imageUrl) {
      obj.imageName = obj.imageUrl.split("/").pop();
    }

    res.json(obj);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
export const updateProduct = async (req, res) => {
  try {
    let updateData = { ...req.body };

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
      updateData.imageName = req.file.filename;
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: "Mahsulot topilmadi" });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Mahsulot topilmadi" });
    res.json({ message: "Mahsulot o‘chirildi" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
