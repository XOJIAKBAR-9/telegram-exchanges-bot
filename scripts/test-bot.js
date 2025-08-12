// Test script to verify bot token
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const botToken = process.env.TELEGRAM_BOT_TOKEN;

if (!botToken) {
  console.log('❌ No bot token found in .env.local');
  console.log('Please add: TELEGRAM_BOT_TOKEN=your_token_here');
  process.exit(1);
}

console.log('🔍 Testing bot token...');
console.log(
  `Token: ${botToken.substring(0, 10)}...${botToken.substring(botToken.length - 10)}`
);

// Test bot API
async function testBot() {
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/getMe`
    );
    const data = await response.json();

    if (data.ok) {
      console.log('✅ Bot token is valid!');
      console.log(`Bot name: ${data.result.first_name}`);
      console.log(`Bot username: @${data.result.username}`);
      console.log(`Bot ID: ${data.result.id}`);
    } else {
      console.log('❌ Bot token is invalid');
      console.log('Error:', data.description);
    }
  } catch (error) {
    console.log('❌ Error testing bot:', error.message);
  }
}

testBot();
