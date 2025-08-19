 import Admin from '../models/Admin.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';  

const generateToken = (adminId) => {
  return jwt.sign({ id: adminId, role: 'admin' }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

// === ADMIN SIGNUP ===
export const signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Bu username allaqachon mavjud.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await Admin.create({
      username,
      password: hashedPassword,
    });

    const token = generateToken(newAdmin._id);

    res.status(201).json({
      message: 'Admin ro‘yxatdan o‘tdi!',
      token,
      admin: {
        id: newAdmin._id,
        username: newAdmin.username,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Serverda xatolik', error: err.message });
  }
};

// === ADMIN LOGIN ===
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(404).json({ message: 'Admin topilmadi' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Parol noto‘g‘ri' });
    }

    const token = generateToken(admin._id);

    res.status(200).json({
      message: 'Tizimga muvaffaqiyatli kirildi',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Serverda xatolik', error: err.message });
  }
};

// Eski qo‘shilgan adminlar ro‘yxati bilan ishlash uchun qo‘shilgan funksiya:

// Admin qo‘shish (faqat siz qo‘shasiz, masalan Postman orqali)
export const addAdmin = async (req, res) => {
  const { telegramId } = req.body;

  if (!telegramId) {
    return res.status(400).json({ message: 'telegramId kerak' });
  }

  try {
    const exists = await Admin.findOne({ telegramId });
    if (exists) {
      return res.status(400).json({ message: 'Bu telegramId allaqachon mavjud' });
    }

    const newAdmin = new Admin({ telegramId });
    await newAdmin.save();

    res.status(201).json({ message: 'Admin qo‘shildi', admin: newAdmin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server xatosi' });
  }
};

// Barcha adminlarni ko‘rish
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-__v');
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: 'Server xatosi' });
  }
};

// Admin o‘chirish
export const deleteAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Admin.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Admin topilmadi' });
    }

    res.json({ message: 'Admin o‘chirildi' });
  } catch (err) {
    res.status(500).json({ message: 'Server xatosi' });
  }
};
