import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();

const url = process.argv[2];
const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  console.error('❌ TELEGRAM_BOT_TOKEN environment variable is required');
  process.exit(1);
}

console.log('🔄 Setting up Telegram webhook...');

const bot = new TelegramBot(token, { webHook: true });

try {
  const res = await bot.setWebHook(url);
  console.log('✅ Webhook set:', res);
} catch (err) {
  console.error('❌ Error setting up webhook:', err.message);
}
