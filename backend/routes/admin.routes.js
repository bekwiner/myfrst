import express from 'express';
import {
  signup,
  login,
  addAdmin,
  getAllAdmins,
  deleteAdmin
} from '../controllers/admin.controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

// Faqat backend orqali admin qo‘shish
router.post('/add', addAdmin);

// Barcha adminlar ro‘yxati
router.get('/', getAllAdmins);

// Adminni o‘chirish
router.delete('/:id', deleteAdmin);

export default router;
