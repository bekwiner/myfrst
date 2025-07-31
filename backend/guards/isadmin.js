  import Admin from '../models/Admin.model.js';

  const isAdmin = async (req, res, next) => {
    const telegramId = req.headers.telegramid;

    if (!telegramId) {
      return res.status(401).json({ message: "Telegram ID yuborilmagan (headers.telegramid)!" });
    }

    const admin = await Admin.findOne({ telegramId });

    if (!admin) {
      return res.status(403).json({ message: "Siz admin emassiz!" });
    }

    next();
  };

  export default isAdmin;
