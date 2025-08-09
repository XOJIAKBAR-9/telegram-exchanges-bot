# Telegram Bot Template Setup Guide

This guide will help you set up the Telegram Bot Template project step by step.

## Prerequisites

- Node.js 18+ installed
- Telegram Bot Token (get from @BotFather)

## Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cp env.example .env.local
```

Edit `.env.local` with your actual values:

```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here

# Next.js Configuration (Optional)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# Google Analytics 4 Configuration (Optional)
NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your template in action!

## Telegram Bot Setup

### 1. Create Bot

1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Send `/newbot`
3. Follow the instructions to create your bot
4. Save the bot token and add it to your `.env.local`

### 2. Deploy and Set Webhook (for production)

1. Deploy your application to a hosting service (Vercel, Railway, etc.)
2. Set up the webhook:

```bash
npm run setup:telegram https://your-domain.com/api/telegram-webhook
```

### 3. Setup Mini App

```bash
npm run setup:mini-app
```

Or manually with @BotFather:
1. Send `/mybots` to @BotFather
2. Select your bot → "Bot Settings" → "Configure Mini App"
3. Set URL to your deployed domain

## Template Features

### Web Application

- Hello World template page
- Demo API integration
- Responsive design with Tailwind CSS
- Ready for customization

### Telegram Bot

- Template bot commands (`/start`, `/help`, `/hello`, `/info`)
- Message handling framework
- Easy to extend with your own commands

### Telegram Mini App

- Haptic feedback integration
- Main button controls
- Template API integration
- Native Telegram Mini App experience

## API Endpoints

- `GET/POST /api/extract-text` - Template API endpoint for your custom functionality
- `POST /api/telegram-webhook` - Telegram bot webhook handler

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run setup:telegram` - Setup Telegram webhook
- `npm run setup:mini-app` - Setup Telegram Mini App
- `npm run test:mini-app` - Test Mini App configuration

### Code Quality

The project uses:

- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for git hooks
- **lint-staged** for pre-commit checks

## Customization Guide

### Adding Your Own Bot Commands

Edit `app/api/telegram-webhook/route.ts`:

```typescript
// Add new command handling
if (text === '/mycustom') {
  await bot.sendMessage(chatId, 'Your custom response here!');
}
```

### Creating New API Endpoints

Create a new file in `app/api/your-endpoint/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Your API logic here
  return NextResponse.json({ message: 'Success!' });
}
```

### Customizing the Web Interface

Edit `app/page.tsx` and components in `components/` to match your needs.

## Troubleshooting

### Common Issues

1. **Telegram Bot Not Responding**:
   - Verify your bot token is correct
   - Check that the webhook URL is accessible
   - Ensure the bot has permission to send messages

2. **Mini App Not Loading**:
   - Verify the Mini App URL is correct in @BotFather
   - Check that your app is deployed and accessible
   - Ensure HTTPS is used for production

### Environment Variables

| Variable                            | Description                      | Required |
| ----------------------------------- | -------------------------------- | -------- |
| `TELEGRAM_BOT_TOKEN`                | Your Telegram bot token          | Yes      |
| `NEXTAUTH_URL`                      | Your app URL                     | No       |
| `NEXTAUTH_SECRET`                   | Secret for authentication        | No       |
| `NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID` | Google Analytics 4 Measurement ID| No       |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Run `npm run test:aws` to verify AWS setup
3. Check the browser console for errors
4. Review the application logs

For additional help, please open an issue on GitHub.
