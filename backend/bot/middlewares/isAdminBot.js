import Admin from '../../models/Admin.model.js';

const isAdmin = async (telegramId) => {
  if (!telegramId) {
    console.warn("⚠️ Telegram ID topilmadi");
    return false;
  }

  try {
    const admin = await Admin.findOne({ telegramId: telegramId.toString() });
    return !!admin;
  } catch (error) {
    console.error("❌ Admin tekshirishda xatolik:", error);
    return false;
  }
};

export default isAdmin; t
