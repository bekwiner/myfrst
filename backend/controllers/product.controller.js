import Product from "../models/Product.model.js";

// CREATE – Mahsulot qo‘shish
export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// READ ALL – Barcha mahsulotlar
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Mahsulotlarni olishda xatolik", error: err.message });
  }
};

// READ ONE – ID bo‘yicha mahsulot
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Mahsulot topilmadi" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE – Mahsulotni yangilash
export const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Mahsulot topilmadi" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE – Mahsulotni o‘chirish
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Mahsulot topilmadi" });
    res.json({ message: "Mahsulot o‘chirildi" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🆕 PROXY – Telegram rasmni backend orqali olish
export const getTelegramImage = async (req, res) => {
  const fileId = req.params.fileId;

  try {
    const TELEGRAM_TOKEN = process.env.BOT_TOKEN;

    // 1. Telegramdan file_path ni olish
    const fileRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/getFile?file_id=${fileId}`);
    const fileData = await fileRes.json();

    if (!fileData.ok) {
      return res.status(400).json({ message: "Rasm topilmadi" });
    }

    const filePath = fileData.result.file_path;

    // 2. File'ni Telegram serveridan olish
    const imageUrl = `https://api.telegram.org/file/bot${TELEGRAM_TOKEN}/${filePath}`;
    const imageRes = await fetch(imageUrl);
    const buffer = await imageRes.arrayBuffer();

    // 3. Rasmni clientga yuborish
    res.set("Content-Type", "image/jpeg");
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error("Telegramdan rasm olishda xatolik:", err.message);
    res.status(500).json({ message: "Telegram rasm olishda xatolik" });
  }
};
