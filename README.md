# Telegram Bot Template

A complete Next.js template for building Telegram bots with integrated Mini App and web interface. Perfect for quickly starting new bot projects with modern web technologies.

## Features

- 🤖 **Telegram Bot**: Complete bot framework with command handling
- 📱 **Telegram Mini App**: Integrated Mini App with haptic feedback
- 🌐 **Web Application**: Modern web interface with responsive design
- 🎯 **Template Ready**: Hello World examples to get you started quickly
- 🎨 **Modern UI**: Beautiful interface built with Tailwind CSS
- 📱 **Responsive Design**: Works perfectly on mobile and desktop
- 🔔 **Haptic Feedback**: Native feedback in Telegram Mini App
- 📊 **Analytics Ready**: Built-in Google Analytics integration
- 🛠️ **Developer Friendly**: TypeScript, ESLint, Prettier, and Husky configured

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Telegram**: node-telegram-bot-api, Telegram Mini App SDK
- **Development**: ESLint, Prettier, Husky
- **Analytics**: Google Analytics 4 (optional)

## Prerequisites

- Node.js 18+
- Telegram Bot Token (get from @BotFather)

## Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd telegram-bot-template
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Configuration

Copy the example environment file and configure your variables:

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

### 4. Telegram Bot Setup

1. Create a bot with [@BotFather](https://t.me/botfather)
2. Get your bot token and add it to your `.env.local`

### 5. Telegram Mini App Setup

Run the setup script to configure your Mini App:

```bash
npm run setup:mini-app
```

Or manually configure with @BotFather:

1. Message @BotFather and send `/mybots`
2. Select your bot
3. Go to "Bot Settings" → "Configure Mini App"
4. Enable Mini App and set the URL to your deployed app
5. Customize the Mini App appearance and settings

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the web application.

## Usage

### Web Application

1. Open the web app in your browser
2. See the Hello World template page
3. Test the demo API functionality
4. Customize the interface for your needs

### Telegram Bot

1. Start a conversation with your bot
2. Send `/start` to get started
3. Try commands like `/help`, `/hello`, `/info`
4. Send any message to see the template response
5. Customize the bot commands in `app/api/telegram-webhook/route.ts`

### Telegram Mini App

1. Open Telegram and go to your bot
2. Tap the "Start" button or menu button
3. The Mini App will open within Telegram
4. Experience haptic feedback and Mini App features
5. Test the API integration with the demo form
6. Customize the Mini App in `components/MiniAppFileUpload.tsx`

## API Endpoints

- `GET/POST /api/extract-text` - Template API endpoint for your custom functionality
- `POST /api/telegram-webhook` - Telegram bot webhook handler

## Customization

This template provides a solid foundation that you can customize:

### Bot Commands

Edit `app/api/telegram-webhook/route.ts` to add your custom bot commands and responses.

### Web Interface

Modify `app/page.tsx` and components in `components/` to create your custom web interface.

### API Endpoints

Add new API routes in `app/api/` for your specific functionality.

### Styling

Customize the look and feel by editing `app/globals.css` and Tailwind classes.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run setup:telegram` - Setup Telegram bot webhook
- `npm run setup:mini-app` - Setup Telegram Mini App
- `npm run test:mini-app` - Test Mini App configuration
- `npm run setup:production` - Setup production environment

### Code Quality

The project uses:

- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for git hooks
- **lint-staged** for pre-commit checks

## Deployment

### Development to Production

1. **Test your Mini App**:

   ```bash
   npm run test:mini-app
   ```

2. **Setup production environment**:

   ```bash
   npm run setup:production
   ```

3. **Follow the production checklist**:
   - Review `PRODUCTION_CHECKLIST.md`
   - Complete all required steps
   - Test thoroughly before launch

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

## Environment Variables

| Variable                            | Description                             | Required |
| ----------------------------------- | --------------------------------------- | -------- |
| `TELEGRAM_BOT_TOKEN`                | Your Telegram bot token                 | Yes      |
| `NEXTAUTH_URL`                      | Your app URL (for authentication)       | No       |
| `NEXTAUTH_SECRET`                   | Secret for authentication               | No       |
| `NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID` | Google Analytics 4 Measurement ID       | No       |
| `GOOGLE_MEASUREMENT_ID`             | GA4 ID for server-side tracking         | No       |
| `GOOGLE_ANALYTICS_API_SECRET`       | GA4 API secret for server-side tracking | No       |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## Getting Started with Your Own Bot

1. **Fork this repository** to your GitHub account
2. **Clone your fork** to your local machine
3. **Follow the setup instructions** above to configure your environment
4. **Customize the template**:
   - Update bot commands in `app/api/telegram-webhook/route.ts`
   - Modify the web interface in `app/page.tsx` and components
   - Add your own API endpoints in `app/api/`
   - Style your app by editing CSS and Tailwind classes
5. **Deploy to your preferred platform** (Vercel, Netlify, etc.)
6. **Set up your Mini App** with @BotFather pointing to your deployed URL

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue on GitHub or contact the maintainers.

---

**Happy bot building! 🤖**
