import { Telegraf, Scenes, session } from "telegraf";
import dotenv from "dotenv";
import mongoose from "mongoose";
import addProductScene from "./scenes/addProduct.scene.js";
import deleteProductScene from "./scenes/deleteProduct.scene.js";
import isAdmin from "./middlewares/isAdminBot.js";
import Product from "../models/Product.model.js";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// MongoDB ulanish
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// Scene'larni ro'yxatdan o'tkazish
const stage = new Scenes.Stage([addProductScene, deleteProductScene]);

bot.use(session());
bot.use(stage.middleware());

// /start komandasi
bot.start(async (ctx) => {
  const telegramId = ctx.from?.id?.toString();
  if (!telegramId) return ctx.reply("⚠️ Telegram ID topilmadi");

  const allowed = await isAdmin(telegramId);
  if (!allowed) return ctx.reply("❌ Siz admin emassiz!");

  ctx.reply(
    "✅ Salom, mahsulot qo‘shish uchun /addproduct buyrug‘ini yuboring."
  );
  ctx.reply(
    "📜 Mahsulotlar ro‘yxatini ko‘rish uchun /listproducts buyrug‘ini yuboring."
  );
  ctx.reply("🗑 Mahsulot o‘chirish uchun /deleteproduct buyrug‘ini yuboring.");
  
});

// Mahsulot qo‘shish
bot.command("addproduct", async (ctx) => {
  const telegramId = ctx.from?.id?.toString();
  const allowed = await isAdmin(telegramId);
  if (!allowed) return ctx.reply("❌ Sizga ruxsat yo‘q!");

  await ctx.scene.enter("addProductScene");
});

// Mahsulotlar ro‘yxatini ko‘rish
bot.command("listproducts", async (ctx) => {
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

// Mahsulot o‘chirish sahnasiga kirish
bot.command("deleteproduct", async (ctx) => {
  const telegramId = ctx.from?.id?.toString();
  const allowed = await isAdmin(telegramId);
  if (!allowed) return ctx.reply("❌ Sizga ruxsat yo‘q!");

  await ctx.scene.enter("deleteProductScene");
});

// Cancel komandasi
bot.command("cancel", async (ctx) => {
  ctx.reply("❌ Amaliyot bekor qilindi.");
  ctx.scene.leave();
});

bot.launch();
console.log("🤖 Bot ishga tushdi");
