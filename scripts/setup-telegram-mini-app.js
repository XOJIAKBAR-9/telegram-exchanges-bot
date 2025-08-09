#!/usr/bin/env node

import readline from 'readline';
import { execSync } from 'child_process';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupTelegramMiniApp() {
  console.log('🚀 Setting up Telegram Mini App for Textract Bot\n');

  console.log('📋 Prerequisites:');
  console.log(
    '1. You need to have a Telegram bot already created with @BotFather'
  );
  console.log('2. Your bot should have a webhook or polling set up');
  console.log(
    '3. Your Next.js app should be deployed and accessible via HTTPS\n'
  );

  const botToken = await question('Enter your Telegram bot token: ');
  const botUsername = await question('Enter your bot username (without @): ');
  const appUrl = await question(
    'Enter your deployed app URL (e.g., https://your-app.vercel.app): '
  );

  console.log('\n📝 Mini App Configuration Steps:\n');

  console.log('1. Open Telegram and message @BotFather');
  console.log('2. Send /mybots');
  console.log(`3. Select your bot: @${botUsername}`);
  console.log('4. Go to "Bot Settings"');
  console.log('5. Select "Configure Mini App"');
  console.log('6. Choose "Enable Mini App"');
  console.log(`7. Enter the Mini App URL: ${appUrl}`);
  console.log(
    '8. Set a short description (e.g., "Extract text from images and PDFs")'
  );
  console.log('9. Upload a photo for your Mini App icon (optional)');

  console.log('\n🎨 Optional Mini App Customization:');
  console.log(
    '- You can customize the header color, theme, and other settings'
  );
  console.log('- Set up a menu button to launch your Mini App');
  console.log('- Configure inline queries for better discoverability');

  console.log('\n🔗 Mini App Launch Methods:');
  console.log(`1. Direct link: https://t.me/${botUsername}?startapp`);
  console.log(`2. Menu button: Add a menu button that opens ${appUrl}`);
  console.log(
    '3. Inline queries: Users can search for your bot and launch the Mini App'
  );

  console.log('\n📱 Testing Your Mini App:');
  console.log('1. Open Telegram on your phone');
  console.log(`2. Go to @${botUsername}`);
  console.log('3. Tap the "Start" button or menu button');
  console.log('4. Your Mini App should open in Telegram');

  console.log('\n⚠️  Important Notes:');
  console.log('- Your app must be served over HTTPS');
  console.log("- The domain must be added to your bot's allowed domains");
  console.log('- Test thoroughly on both iOS and Android');
  console.log('- Consider adding error handling for network issues');

  console.log('\n✅ Setup Complete!');
  console.log('Your Textract Bot is now ready to work as a Telegram Mini App!');

  rl.close();
}

setupTelegramMiniApp().catch(console.error);
