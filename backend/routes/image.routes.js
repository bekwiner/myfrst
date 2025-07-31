// routes/image.routes.js
import express from "express";
import axios from "axios";

const router = express.Router();
const BOT_TOKEN = process.env.BOT_TOKEN;

router.get("/:fileId", async (req, res) => {
  const fileId = req.params.fileId;

  try {
    // 1. file_path ni olish
    const fileInfo = await axios.get(
      `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`
    );

    const filePath = fileInfo.data.result.file_path;

    // 2. Telegramdan rasmni olish
    const fileStream = await axios({
      url: `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`,
      method: "GET",
      responseType: "stream",
    });

    res.setHeader("Content-Type", "image/jpeg"); // yoki image/png
    fileStream.data.pipe(res);
  } catch (err) {
    console.error("❌ Telegram rasm olishda xatolik:", err.message);
    res.status(500).json({ message: "Rasmni olishda xatolik yuz berdi" });
  }
});

export default router;
