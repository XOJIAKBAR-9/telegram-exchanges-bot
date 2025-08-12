import { NextRequest, NextResponse } from 'next/server';
import TelegramBot from 'node-telegram-bot-api';
import { trackServerEvent } from '@/lib/analytics';
import {
  fetchAllRates,
  formatRatesTable,
  getBestRates,
} from '@/lib/ratesService';

// Initialize Telegram bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, {
  polling: false,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Handle different types of updates
    if (body.message) {
      await handleMessage(body.message);
    } else if (body.edited_message) {
      await handleMessage(body.edited_message);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}

async function handleMessage(message: any) {
  const chatId = message.chat.id;
  const text = message.text;
  const firstName = message.from?.first_name || 'User';

  try {
    // Handle text messages
    if (text) {
      if (text === '/start') {
        // Track bot start command
        await trackServerEvent('user_engagement', {
          source: 'bot',
          action: 'start_command',
          user_id: chatId,
        });

        await bot.sendMessage(
          chatId,
          `👋 Hello ${firstName}! Welcome to Exchange Rates Bot!\n\n` +
            'Get live exchange rates from multiple banks in Uzbekistan.\n\n' +
            'Available commands:\n' +
            '/start - Start the bot\n' +
            '/help - Show help message\n' +
            '/hello - Get a greeting\n' +
            '/info - Get bot information\n' +
            '/rates - Get exchange rates from all banks'
        );
      } else if (text === '/help') {
        // Track help command
        await trackServerEvent('user_engagement', {
          source: 'bot',
          action: 'help_command',
          user_id: chatId,
        });

        await bot.sendMessage(
          chatId,
          '📖 Help:\n\n' +
            'Exchange Rates Bot:\n' +
            '• Get live exchange rates from multiple banks\n' +
            '• View USD, EUR, and RUB rates\n' +
            '• Compare rates between Hamkorbank and Universal Bank\n\n' +
            'Commands:\n' +
            '/start - Start the bot\n' +
            '/help - Show this help message\n' +
            '/hello - Get a greeting\n' +
            '/info - Get bot information\n' +
            '/rates - Get exchange rates from all banks\n' +
            '/best - Get best rates summary'
        );
      } else if (text === '/hello') {
        // Track hello command
        await trackServerEvent('user_engagement', {
          source: 'bot',
          action: 'hello_command',
          user_id: chatId,
        });

        await bot.sendMessage(
          chatId,
          `🎉 Hello ${firstName}! Nice to meet you!\n\n` +
            'This is your customizable bot template. You can modify this message and add your own functionality.'
        );
      } else if (text === '/info') {
        // Track info command
        await trackServerEvent('user_engagement', {
          source: 'bot',
          action: 'info_command',
          user_id: chatId,
        });

        await bot.sendMessage(
          chatId,
          '🤖 Bot Information:\n\n' +
            '• Name: Exchange Rates Bot\n' +
            '• Version: 1.0.0\n' +
            '• Platform: Telegram\n' +
            '• Features: Web App + Mini App + Bot\n' +
            '• Exchange Rates: Live rates from multiple banks\n\n' +
            '🏦 Get the latest USD, EUR, and RUB rates!'
        );
      } else if (text === '/rates') {
        // Track rates command
        await trackServerEvent('user_engagement', {
          source: 'bot',
          action: 'rates_command',
          user_id: chatId,
        });

        // Send loading message
        const loadingMsg = await bot.sendMessage(
          chatId,
          '🔄 Fetching exchange rates from all banks...'
        );

        try {
          // Fetch all rates
          const rates = await fetchAllRates();

          // Format the response
          const ratesTable = formatRatesTable(rates);

          // Update the message with results
          await bot.editMessageText(ratesTable, {
            chat_id: chatId,
            message_id: loadingMsg.message_id,
            parse_mode: 'Markdown',
          });
        } catch (error) {
          console.error('Error fetching rates:', error);
          await bot.editMessageText(
            "❌ Sorry, I couldn't fetch the exchange rates at the moment. Please try again later.",
            {
              chat_id: chatId,
              message_id: loadingMsg.message_id,
            }
          );
        }
      } else if (text === '/best') {
        // Track best rates command
        await trackServerEvent('user_engagement', {
          source: 'bot',
          action: 'best_rates_command',
          user_id: chatId,
        });

        // Send loading message
        const loadingMsg = await bot.sendMessage(
          chatId,
          '🏆 Finding the best exchange rates...'
        );

        try {
          // Fetch all rates
          const rates = await fetchAllRates();

          // Get best rates summary
          const bestRates = getBestRates(rates);

          // Update the message with results
          await bot.editMessageText(bestRates, {
            chat_id: chatId,
            message_id: loadingMsg.message_id,
            parse_mode: 'Markdown',
          });
        } catch (error) {
          console.error('Error fetching best rates:', error);
          await bot.editMessageText(
            "❌ Sorry, I couldn't fetch the best rates at the moment. Please try again later.",
            {
              chat_id: chatId,
              message_id: loadingMsg.message_id,
            }
          );
        }
      } else {
        // Track text message (not a command)
        await trackServerEvent('user_engagement', {
          source: 'bot',
          action: 'text_message',
          user_id: chatId,
        });

        await bot.sendMessage(
          chatId,
          `Hi ${firstName}! You said: "${text}"\n\n` +
            'This is a template response. You can customize how the bot responds to messages.\n\n' +
            'Try using one of these commands:\n' +
            '/help - Get help\n' +
            '/hello - Get a greeting\n' +
            '/info - Get bot info'
        );
      }
      return;
    }

    // Handle any other content (photos, documents, etc.)
    await trackServerEvent('user_engagement', {
      source: 'bot',
      action: 'unsupported_content',
      user_id: chatId,
    });

    await bot.sendMessage(
      chatId,
      `Thanks for sharing, ${firstName}! 📎\n\n` +
        'This template bot currently only responds to text messages. You can add handlers for photos, documents, and other content types in the code.\n\n' +
        'Try sending a text message or use /help to see available commands.'
    );
  } catch (error) {
    console.error('Error handling message:', error);
    await bot.sendMessage(
      chatId,
      '❌ Sorry, something went wrong. Please try again.'
    );
  }
}
