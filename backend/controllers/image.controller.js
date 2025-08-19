// controllers/image.controller.js
import fetch from "node-fetch";

export const getTelegramImage = async (req, res) => {
  const fileId = req.params.fileId;

  try {
    const TELEGRAM_TOKEN = process.env.BOT_TOKEN;

    if (!TELEGRAM_TOKEN) {
      return res.status(500).json({ message: "BOT_TOKEN .env faylda topilmadi" });
    }

    // 1. Telegramdan file_path olish
    const fileRes = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/getFile?file_id=${fileId}`
    );
    const fileData = await fileRes.json();

    if (!fileData.ok) {
      return res.status(400).json({ message: "❌ Rasm topilmadi" });
    }

    const filePath = fileData.result.file_path;

    // 2. Telegram serveridan faylni olish
    const imageUrl = `https://api.telegram.org/file/bot${TELEGRAM_TOKEN}/${filePath}`;
    const imageRes = await fetch(imageUrl);

    if (!imageRes.ok) {
      return res.status(500).json({ message: "❌ Telegram serveridan rasm olinmadi" });
    }

    const buffer = await imageRes.arrayBuffer();

    // 3. Rasmni clientga yuborish
    res.set("Content-Type", "image/jpeg");
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error("❌ Telegramdan rasm olishda xatolik:", err.message);
    res.status(500).json({ message: "Telegram rasm olishda xatolik" });
  }
};
