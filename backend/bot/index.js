import { Telegraf, Scenes, session, Markup } from "telegraf";
import dotenv from "dotenv";
import mongoose from "mongoose";
import addProductScene from "./scenes/addProduct.scene.js";
import deleteProductScene from "./scenes/deleteProduct.scene.js";
import isAdmin from "./middlewares/isAdminBot.js";
import Product from "../models/Product.model.js";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

const stage = new Scenes.Stage([addProductScene, deleteProductScene]);

bot.use(session());
bot.use(stage.middleware());

/**
 * START komandasi
 */
bot.start(async (ctx) => {
  const telegramId = ctx.from?.id?.toString();
  if (!telegramId) return ctx.reply("⚠️ Telegram ID topilmadi");

  const allowed = await isAdmin(telegramId);
  if (!allowed) return ctx.reply("❌ Siz admin emassiz!");

  await ctx.reply(
    "✅ Salom, bu yerda siz mahsulotlarni boshqarishingiz mumkin.",
    Markup.keyboard([
      ["➕ Mahsulot qo‘shish"],
      ["📜 Mahsulotlar ro‘yxati"],
      ["🗑 Mahsulot o‘chirish"],
      [ "👨‍💻 Dasturchi"],
    ])
      .resize()
      .oneTime()
  );
});

/**
 * Dasturchi haqida
 */
bot.hears("👨‍💻 Dasturchi", async (ctx) => {
  await ctx.reply("@uzb_bekzod — dasturchi", Markup.removeKeyboard());
});

/**
 * Mahsulot qo‘shish
 */
bot.hears("➕ Mahsulot qo‘shish", async (ctx) => {
  const telegramId = ctx.from?.id?.toString();
  const allowed = await isAdmin(telegramId);
  if (!allowed) return ctx.reply("❌ Sizga ruxsat yo‘q!");

  await ctx.scene.enter("addProductScene");
});

/**
 * Mahsulotlar ro‘yxati
 */
bot.hears("📜 Mahsulotlar ro‘yxati", async (ctx) => {
  const telegramId = ctx.from?.id?.toString();
  const allowed = await isAdmin(telegramId);
  if (!allowed) return ctx.reply("❌ Sizga ruxsat yo‘q!");

  const products = await Product.find().sort({ createdAt: -1 });
  if (!products.length) return ctx.reply("🛒 Mahsulotlar topilmadi.");

  let msg = "📦 Mahsulotlar ro‘yxati:\n\n";
  for (const p of products) {
    msg += `🆔 <code>${p._id}</code>\n📌 ${p.name}\n\n`;
  }

  ctx.reply(msg, { parse_mode: "HTML" });
});

/**
 * Mahsulot o‘chirish
 */
bot.hears("🗑 Mahsulot o‘chirish", async (ctx) => {
  const telegramId = ctx.from?.id?.toString();
  const allowed = await isAdmin(telegramId);
  if (!allowed) return ctx.reply("❌ Sizga ruxsat yo‘q!");

  await ctx.scene.enter("deleteProductScene");
});

/**
 * Bekor qilish
 */
bot.hears("🚫 Bekor qilish", async (ctx) => {
  await ctx.reply("❌ Amaliyot bekor qilindi.", Markup.removeKeyboard());
  ctx.scene.leave();
});

bot.launch();
console.log("🤖 Bot ishga tushdi");
