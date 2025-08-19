import { Scenes, Markup } from "telegraf";
import axios from "axios";
import Admin from "../../models/Admin.model.js";

const addProductScene = new Scenes.WizardScene(
  "addProductScene",

  // 1-bosqich: admin tekshirish
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

    ctx.wizard.state.product = {};
    await ctx.reply(
      "📝 Mahsulot nomini yuboring:",
      Markup.keyboard([["🚫 Bekor qilish"]]).resize()
    );
    return ctx.wizard.next();
  },

  // 2-bosqich: nom
  async (ctx) => {
    if (ctx.message?.text === "🚫 Bekor qilish") {
      await ctx.reply("❌ Amaliyot bekor qilindi.", Markup.removeKeyboard());
      return ctx.scene.leave();
    }
    if (!ctx.message?.text) return;
    ctx.wizard.state.product.name = ctx.message.text;

    await ctx.reply(
      "🏷 Brend nomini yuboring:",
      Markup.keyboard([["🚫 Bekor qilish"]]).resize()
    );
    return ctx.wizard.next();
  },

  // 3-bosqich: brand
  async (ctx) => {
    if (ctx.message?.text === "🚫 Bekor qilish") {
      await ctx.reply("❌ Amaliyot bekor qilindi.", Markup.removeKeyboard());
      return ctx.scene.leave();
    }
    if (!ctx.message?.text) return;
    ctx.wizard.state.product.brand = ctx.message.text;

    await ctx.reply(
      "📄 Model nomini yuboring:",
      Markup.keyboard([["🚫 Bekor qilish"]]).resize()
    );
    return ctx.wizard.next();
  },

  // 4-bosqich: model
  async (ctx) => {
    if (ctx.message?.text === "🚫 Bekor qilish") {
      await ctx.reply("❌ Amaliyot bekor qilindi.", Markup.removeKeyboard());
      return ctx.scene.leave();
    }
    if (!ctx.message?.text) return;
    ctx.wizard.state.product.model = ctx.message.text;

    await ctx.reply(
      "🗂 Kategoriyasini yuboring:",
      Markup.keyboard([["🚫 Bekor qilish"]]).resize()
    );
    return ctx.wizard.next();
  },

  // 5-bosqich: kategoriya
  async (ctx) => {
    if (ctx.message?.text === "🚫 Bekor qilish") {
      await ctx.reply("❌ Amaliyot bekor qilindi.", Markup.removeKeyboard());
      return ctx.scene.leave();
    }
    if (!ctx.message?.text) return;
    ctx.wizard.state.product.category = ctx.message.text;

    await ctx.reply(
      "💰 Narxini yuboring (raqam):",
      Markup.keyboard([["🚫 Bekor qilish"]]).resize()
    );
    return ctx.wizard.next();
  },

  // 6-bosqich: narx
  async (ctx) => {
    if (ctx.message?.text === "🚫 Bekor qilish") {
      await ctx.reply("❌ Amaliyot bekor qilindi.", Markup.removeKeyboard());
      return ctx.scene.leave();
    }
    if (!ctx.message?.text) return;
    const price = parseFloat(ctx.message.text);
    if (isNaN(price)) {
      await ctx.reply("❌ Narx noto‘g‘ri. Iltimos, faqat raqam yuboring.");
      return;
    }
    ctx.wizard.state.product.price = price;

    await ctx.reply(
      "📦 Omborda bormi?",
      Markup.keyboard([["✅ Ha", "❌ Yo‘q"], ["🚫 Bekor qilish"]])
        .oneTime()
        .resize()
    );
    return ctx.wizard.next();
  },

  // 7-bosqich: inStock
  async (ctx) => {
    if (ctx.message?.text === "🚫 Bekor qilish") {
      await ctx.reply("❌ Amaliyot bekor qilindi.", Markup.removeKeyboard());
      return ctx.scene.leave();
    }

    const text = ctx.message?.text;
    if (text === "✅ Ha") ctx.wizard.state.product.inStock = true;
    else if (text === "❌ Yo‘q") ctx.wizard.state.product.inStock = false;
    else {
      await ctx.reply("❌ Faqat tugmalardan foydalaning.");
      return;
    }

    await ctx.reply(
      "🖼 Mahsulot rasmini yuboring (foto):",
      Markup.keyboard([["🚫 Bekor qilish"]]).resize()
    );
    return ctx.wizard.next();
  },

  // 8-bosqich: rasm
  async (ctx) => {
    if (ctx.message?.text === "🚫 Bekor qilish") {
      await ctx.reply("❌ Amaliyot bekor qilindi.", Markup.removeKeyboard());
      return ctx.scene.leave();
    }

    if (!ctx.message?.photo) {
      await ctx.reply("❌ Iltimos, rasm yuboring.");
      return;
    }

    const photo = ctx.message.photo.at(-1);
    const fileId = photo.file_id;

    try {
      const file = await ctx.telegram.getFile(fileId);
      const fileLink = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;

      const response = await fetch(fileLink);
      const buffer = Buffer.from(await response.arrayBuffer());

      const FormData = await import("form-data");
      const form = new FormData.default();
      form.append("image", buffer, "product.jpg");

      // upload
      const uploadRes = await axios.post(
        "http://localhost:3000/api/products/upload",
        form,
        { headers: form.getHeaders() }
      );

      const imageUrl = uploadRes.data.imageUrl;

      const productData = {
        ...ctx.wizard.state.product,
        imageUrl,
      };

      const saved = await axios.post(
        "http://localhost:3000/api/products",
        productData,
        { headers: { telegramid: ctx.from.id } }
      );

      await ctx.reply(
        `✅ Mahsulot qo‘shildi:\n📦 ${saved.data.name}`,
        Markup.removeKeyboard()
      );
    } catch (err) {
      console.error("❌ Rasm yuklashda xatolik:", err.message);
      await ctx.reply("❌ Rasm yuklashda muammo yuz berdi.", Markup.removeKeyboard());
    }

    return ctx.scene.leave();
  }
);

export default addProductScene;
