
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
const adminId = process.env.ADMIN_ID || 'your_admin_id';

bot.onText(/\/links/, async (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "User, I sent all of GambaCodez social media, referral links & any available promos to your DM.");

  const { data } = await axios.get(process.env.PROMO_FEED_URL || 'https://your.fly.app/api/feed');
  const buttons = data.map(p => ([{ text: p.title, url: p.url }]));

  bot.sendMessage(msg.from.id, "🎯 Promos + Socials:", {
    reply_markup: {
      inline_keyboard: buttons
    }
  });
});

bot.onText(/\/send (.+)/s, async (msg, match) => {
  if (msg.from.username !== process.env.ADMIN_USER) return;
  const parts = match[1].split(/\n\n|\r\n\r\n/);
  const text = parts[0];
  const image = parts.find(p => p.includes("http") && (p.includes(".jpg") || p.includes(".png")));
  const buttons = parts.filter(p => p.includes(" + ")).map(p => {
    const [text, url] = p.replace("[", "").replace("]", "").split(" + ");
    return [{ text: text.trim(), url: url.trim() }];
  });

  if (image) {
    bot.sendPhoto(msg.chat.id, image.trim(), {
      caption: text,
      parse_mode: "HTML",
      reply_markup: { inline_keyboard: buttons }
    });
  } else {
    bot.sendMessage(msg.chat.id, text, {
      parse_mode: "HTML",
      reply_markup: { inline_keyboard: buttons }
    });
  }
});
