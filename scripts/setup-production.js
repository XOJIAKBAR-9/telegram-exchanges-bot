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

async function setupProduction() {
  console.log('🚀 Setting up Textract Bot for Production\n');

  console.log('📋 Production Setup Options:\n');
  console.log('1. Create a NEW production bot (Recommended)');
  console.log('2. Convert existing test bot to production');
  console.log('3. Exit\n');

  const choice = await question('Choose an option (1-3): ');

  if (choice === '3') {
    console.log('Setup cancelled.');
    rl.close();
    return;
  }

  if (choice === '1') {
    await setupNewProductionBot();
  } else if (choice === '2') {
    await convertTestBotToProduction();
  } else {
    console.log('Invalid choice. Please run the script again.');
    rl.close();
    return;
  }
}

async function setupNewProductionBot() {
  console.log('\n🆕 Creating New Production Bot\n');

  console.log('📝 Steps to create a new production bot:\n');
  console.log('1. Open Telegram and message @BotFather');
  console.log('2. Send /newbot');
  console.log(
    '3. Choose a name for your bot (e.g., "Textract Bot Production")'
  );
  console.log(
    '4. Choose a username ending with "bot" (e.g., "textract_prod_bot")'
  );
  console.log('5. Save the bot token provided\n');

  const botToken = await question('Enter your NEW production bot token: ');
  const botUsername = await question(
    'Enter your NEW bot username (without @): '
  );
  const appUrl = await question(
    'Enter your production app URL (e.g., https://your-app.vercel.app): '
  );

  console.log('\n🔧 Production Bot Configuration:\n');

  console.log('1. Open Telegram and message @BotFather');
  console.log('2. Send /mybots');
  console.log(`3. Select your NEW bot: @${botUsername}`);
  console.log('4. Go to "Bot Settings"');
  console.log('5. Select "Configure Mini App"');
  console.log('6. Choose "Enable Mini App"');
  console.log(`7. Enter the Mini App URL: ${appUrl}`);
  console.log(
    '8. Set description: "Extract text from images and PDFs - Production"'
  );
  console.log('9. Upload a professional icon for your Mini App');

  console.log('\n🌐 Environment Configuration:\n');
  console.log('Update your production environment variables:');
  console.log(`TELEGRAM_BOT_TOKEN=${botToken}`);
  console.log(`NEXT_PUBLIC_APP_URL=${appUrl}`);

  console.log('\n📱 Production Mini App Features:\n');
  console.log('✅ Professional branding');
  console.log('✅ Production-ready error handling');
  console.log('✅ Analytics and monitoring');
  console.log('✅ User support integration');
  console.log('✅ Rate limiting and security');

  console.log('\n🔗 Production Launch Methods:\n');
  console.log(`1. Direct link: https://t.me/${botUsername}?startapp`);
  console.log(`2. Menu button: Add a menu button that opens ${appUrl}`);
  console.log('3. Inline queries: Users can search for your bot');
  console.log('4. Share links: Users can share your Mini App');

  console.log('\n⚠️  Production Checklist:\n');
  console.log('□ App deployed to HTTPS domain');
  console.log('□ Environment variables configured');
  console.log('□ Bot token updated in production');
  console.log('□ Mini App configured with BotFather');
  console.log('□ Error monitoring set up');
  console.log('□ Analytics configured');
  console.log('□ Rate limiting implemented');
  console.log('□ Security measures in place');
  console.log('□ Backup and recovery procedures');

  console.log('\n✅ Production setup complete!');
  console.log('Your production Textract Bot is ready to serve users!');

  rl.close();
}

async function convertTestBotToProduction() {
  console.log('\n🔄 Converting Test Bot to Production\n');

  console.log('⚠️  WARNING: This will convert your test bot to production.');
  console.log('Make sure you have a backup of your test bot configuration.\n');

  const confirm = await question(
    'Are you sure you want to continue? (yes/no): '
  );

  if (confirm.toLowerCase() !== 'yes') {
    console.log('Conversion cancelled.');
    rl.close();
    return;
  }

  const botToken = await question('Enter your bot token: ');
  const botUsername = await question('Enter your bot username (without @): ');
  const appUrl = await question('Enter your production app URL: ');

  console.log('\n🔄 Conversion Steps:\n');

  console.log('1. Open Telegram and message @BotFather');
  console.log('2. Send /mybots');
  console.log(`3. Select your bot: @${botUsername}`);
  console.log('4. Go to "Bot Settings"');
  console.log('5. Update bot name to remove "Test" or "Dev"');
  console.log('6. Select "Configure Mini App"');
  console.log('7. Update Mini App URL to production:');
  console.log(`   ${appUrl}`);
  console.log('8. Update description for production');
  console.log('9. Upload a professional icon');

  console.log('\n🌐 Environment Updates:\n');
  console.log('Update your production environment variables:');
  console.log(`TELEGRAM_BOT_TOKEN=${botToken}`);
  console.log(`NEXT_PUBLIC_APP_URL=${appUrl}`);

  console.log('\n📱 Production Features to Enable:\n');
  console.log('□ Professional branding');
  console.log('□ Production error handling');
  console.log('□ User analytics');
  console.log('□ Support integration');
  console.log('□ Rate limiting');
  console.log('□ Security hardening');

  console.log('\n⚠️  Important Notes:\n');
  console.log('- Your test bot will now serve production users');
  console.log('- Consider creating a new test bot for development');
  console.log('- Update all documentation and links');
  console.log('- Monitor performance and errors closely');

  console.log('\n✅ Conversion complete!');
  console.log('Your bot is now ready for production use.');

  rl.close();
}

setupProduction().catch(console.error);
