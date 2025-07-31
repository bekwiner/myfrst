import { Scenes } from "telegraf";
import axios from "axios";
import Admin from "../../models/Admin.model.js";

const deleteProductScene = new Scenes.WizardScene(
  "deleteProductScene",

  // 1. Adminni tekshirish
  async (ctx) => {
    const telegramId = ctx.from?.id?.toString();
    if (!telegramId) {
      await ctx.reply("❗ Telegram ID aniqlanmadi.");
      return ctx.scene.leave();
    }

    const admin = await Admin.findOne({ telegramId });
    if (!admin) {
      await ctx.reply("❌ Siz admin emassiz.");
      return ctx.scene.leave();
    }

    await ctx.reply("🗑 O‘chirmoqchi bo‘lgan mahsulotning ID sini yuboring:");
    return ctx.wizard.next();
  },

  // 2. ID asosida mahsulotni o‘chirish
  async (ctx) => {
    const productId = ctx.message?.text?.trim();

    if (!productId || productId.length < 10) {
      await ctx.reply(
        "❌ ID noto‘g‘ri. Iltimos, to‘g‘ri mahsulot ID yuboring."
      );
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:3000/api/products/${productId}`,
        {
          headers: {
            telegramid: ctx.from.id,
          },
        }
      );

      if (response.data?.name) {
        await ctx.reply(`✅ Mahsulot o‘chirildi:\n📌 ${response.data.name}`);
      } else {
        await ctx.reply("✅ Mahsulot o‘chirildi.");
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      await ctx.reply(
        "❌ Mahsulot topilmadi yoki o‘chirishda xatolik yuz berdi."
      );
    }

    return ctx.scene.leave();
  }
);

export default deleteProductScene;
