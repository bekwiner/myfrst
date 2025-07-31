import { Scenes } from "telegraf";
import axios from "axios";
import Admin from "../../models/Admin.model.js";

const addProductScene = new Scenes.WizardScene(
  "addProductScene",

  // 1. ADMINNI TEKSHIRISH
  async (ctx) => {
    const telegramId = ctx.from?.id?.toString();
    if (ctx.message?.text === "/cancel" || ctx.message?.text === "/stop") {
      await ctx.reply("❌ Amaliyot bekor qilindi.");
      return ctx.scene.leave();
    }
    if (!telegramId) {
      await ctx.reply("❗ Telegram ID aniqlanmadi.");
      return ctx.scene.leave();
    }

    const admin = await Admin.findOne({ telegramId });
    if (!admin) {
      await ctx.reply("❌ Siz admin emassiz.");
      return ctx.scene.leave();
    }

    ctx.wizard.state.product = {};
    await ctx.reply("📝 Mahsulot nomini yuboring:");
    return ctx.wizard.next();
  },

  // 2. Mahsulot nomi
  async (ctx) => {
    if (ctx.message?.text === "/cancel" || ctx.message?.text === "/stop") {
      await ctx.reply("❌ Amaliyot bekor qilindi.");
      return ctx.scene.leave();
    }
    if (!ctx.message?.text) return;
    ctx.wizard.state.product.name = ctx.message.text;
    await ctx.reply("🏷 Brend nomini yuboring:");
    return ctx.wizard.next();
  },

  // 3. Brend
  async (ctx) => {
    if (ctx.message?.text === "/cancel" || ctx.message?.text === "/stop") {
      await ctx.reply("❌ Amaliyot bekor qilindi.");
      return ctx.scene.leave();
    }
    if (!ctx.message?.text) return;
    ctx.wizard.state.product.brand = ctx.message.text;
    await ctx.reply("📄 Model nomini yuboring:");
    return ctx.wizard.next();
  },

  // 4. Model
  async (ctx) => {
    if (ctx.message?.text === "/cancel" || ctx.message?.text === "/stop") {
      await ctx.reply("❌ Amaliyot bekor qilindi.");
      return ctx.scene.leave();
    }
    if (!ctx.message?.text) return;
    ctx.wizard.state.product.model = ctx.message.text;
    await ctx.reply("🗂 Kategoriyasini yuboring:");
    return ctx.wizard.next();
  },

  // 5. Kategoriya
  async (ctx) => {
    if (ctx.message?.text === "/cancel" || ctx.message?.text === "/stop") {
      await ctx.reply("❌ Amaliyot bekor qilindi.");
      return ctx.scene.leave();
    }
    if (!ctx.message?.text) return;
    ctx.wizard.state.product.category = ctx.message.text;
    await ctx.reply("💰 Narxini yuboring (raqam):");
    return ctx.wizard.next();
  },

  // 6. Narx
  async (ctx) => {
    if (ctx.message?.text === "/cancel" || ctx.message?.text === "/stop") {
      await ctx.reply("❌ Amaliyot bekor qilindi.");
      return ctx.scene.leave();
    }
    if (!ctx.message?.text) {
      await ctx.reply("❌ Iltimos, narxni faqat raqam sifatida yuboring.");
      return;
    }
    const price = parseFloat(ctx.message.text);
    if (isNaN(price)) {
      await ctx.reply("❌ Narx noto‘g‘ri. Iltimos, faqat raqam yuboring.");
      return;
    }
    ctx.wizard.state.product.price = price;
    await ctx.reply("📦 Omborda bormi? (ha/yo‘q)");
    return ctx.wizard.next();
  },

  // 7. Ombordaligi
  async (ctx) => {
    if (ctx.message?.text === "/cancel" || ctx.message?.text === "/stop") {
      await ctx.reply("❌ Amaliyot bekor qilindi.");
      return ctx.scene.leave();
    }
    if (!ctx.message?.text) {
      await ctx.reply("❌ Iltimos, 'ha' yoki 'yo‘q' deb javob bering.");
      return;
    }
    const text = ctx.message.text.toLowerCase();
    ctx.wizard.state.product.inStock = text.includes("ha");
    await ctx.reply("🖼 Mahsulot rasmini yuboring (foto):");
    return ctx.wizard.next();
  },

  /// 8. Rasm
  async (ctx) => {
    if (!ctx.message.photo) {
      await ctx.reply("❌ Iltimos, rasm yuboring.");
      return;
    }

    const photo = ctx.message.photo.at(-1); // eng yuqori sifatli
    const fileId = photo.file_id;

    try {
      // 1. File linkni olish
      const file = await ctx.telegram.getFile(fileId);
      const fileLink = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;

      // 2. Rasmani yuklab olish uchun form-data
      const FormData = await import("form-data");
      const form = new FormData.default();
      const response = await fetch(fileLink);
      const buffer = await response.arrayBuffer();
      form.append("image", Buffer.from(buffer), { filename: "product.jpg" });

      // 3. Backendga POST qilish
      const uploadRes = await axios.post(
        "http://localhost:3000/api/products/upload",
        form,
        {
          headers: {
            ...form.getHeaders(),
          },
        }
      );

      // 4. Mahsulot malumotini birlashtirish
      const imageUrl = uploadRes.data.imageUrl;
      const productData = {
        ...ctx.wizard.state.product,
        imageUrl,
      };

      // 5. Mahsulotni saqlash
      const saved = await axios.post(
        "http://localhost:3000/api/products",
        productData,
        {
          headers: {
            telegramid: ctx.from.id,
          },
        }
      );

      await ctx.reply(`✅ Mahsulot qo‘shildi:\n📦 ${saved.data.name}`);
    } catch (err) {
      console.error("❌ Rasm yuklashda xatolik:", err.message);
      await ctx.reply("❌ Rasm yuklashda muammo yuz berdi.");
    }

    return ctx.scene.leave();
  }
);

export default addProductScene;
