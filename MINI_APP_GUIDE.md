# Telegram Mini App Guide

This guide explains how to set up and use the Telegram Mini App functionality for your Bot Template.

## What is a Telegram Mini App?

A Telegram Mini App is a web application that runs inside Telegram, providing a native-like experience for users. Unlike traditional bots that work through chat messages, Mini Apps offer rich interfaces with buttons, forms, and interactive elements.

## Key Features of Our Template

### 🎯 **Native Integration**

- Seamlessly integrated into Telegram
- Uses Telegram's native UI components
- Supports Telegram's theme and colors

### 📱 **Mobile Optimized**

- Touch-friendly interface
- Responsive design for all screen sizes
- Template ready for your custom features

### 🔔 **Haptic Feedback**

- Success notifications for API calls
- Error feedback for failed operations
- Light impact feedback for button presses

### 💾 **Template Features**

- Demo API integration
- Main Button controls
- User information display
- Ready for customization

### 🎨 **Theme Support**

- Automatically adapts to Telegram's theme
- Supports light and dark modes
- Uses Telegram's color palette

## Setup Instructions

### 1. Prerequisites

- Your app must be deployed to a HTTPS domain
- You need a Telegram bot already created
- The domain must be accessible from mobile devices

### 2. Configure with BotFather

1. Open Telegram and message [@BotFather](https://t.me/botfather)
2. Send `/mybots`
3. Select your bot
4. Go to "Bot Settings"
5. Select "Configure Mini App"
6. Choose "Enable Mini App"
7. Enter your app URL (e.g., `https://your-app.vercel.app`)
8. Set a description (e.g., "Extract text from images and PDFs")
9. Upload an icon (optional but recommended)

### 3. Customize Mini App Settings

You can customize various aspects of your Mini App:

#### Header Color

- Set a custom header color that matches your brand
- Use hex color codes (e.g., `#0088CC`)

#### Theme Parameters

- Configure colors for different UI elements
- Support both light and dark themes

#### Menu Button

- Add a menu button that opens your Mini App
- Configure button text and behavior

## Usage Guide

### For Users

1. **Launch the Mini App**
   - Go to your bot in Telegram
   - Tap the "Start" button or menu button
   - The Mini App will open within Telegram

2. **Upload Files**
   - Tap the "Choose File" button
   - Select an image or PDF from your device
   - The file will be automatically processed

3. **Get Results**
   - Wait for text extraction to complete
   - Copy the extracted text
   - Use haptic feedback for confirmation

### For Developers

#### Mini App Detection

The app automatically detects when it's running in Telegram:

```typescript
const { isTelegramMiniApp, user, webApp, isReady } = useTelegramMiniApp();
```

#### User Information

Access user data when available:

```typescript
if (user) {
  console.log(`Welcome, ${user.first_name}!`);
  console.log(`User ID: ${user.id}`);
  console.log(`Username: ${user.username}`);
}
```

#### Haptic Feedback

Provide native feedback to users:

```typescript
// Success feedback
webApp.HapticFeedback?.notificationOccurred?.('success');

// Error feedback
webApp.HapticFeedback?.notificationOccurred?.('error');

// Light impact for button presses
webApp.HapticFeedback?.impactOccurred?.('light');
```

#### Cloud Storage

Store user data persistently:

```typescript
// Save data
await webApp.CloudStorage.setItem('preferences', JSON.stringify(userPrefs));

// Retrieve data
const prefs = await webApp.CloudStorage.getItem('preferences');
```

## Technical Implementation

### File Structure

```
├── lib/
│   └── useTelegramMiniApp.ts          # Mini App hook
├── components/
│   ├── FileUpload.tsx                 # Web version
│   └── MiniAppFileUpload.tsx          # Mini App version
├── app/
│   └── page.tsx                       # Main page with Mini App detection
└── scripts/
    ├── setup-telegram-mini-app.js     # Setup script
    └── test-mini-app.js               # Test script
```

### Key Components

#### useTelegramMiniApp Hook

This hook handles:

- Mini App detection
- User data extraction
- WebApp initialization
- Theme adaptation

#### MiniAppFileUpload Component

Specialized component for Mini App that:

- Uses mobile-optimized UI
- Provides haptic feedback
- Shows native alerts
- Handles file validation

### Environment Variables

No additional environment variables are needed for Mini App functionality. The existing bot token is used for user authentication.

## Testing

### Development Testing

1. Run the test script:

   ```bash
   npm run test:mini-app
   ```

2. Test locally:

   ```bash
   npm run dev
   ```

3. Use Telegram's test environment for development

### Production Testing

1. Deploy to HTTPS domain
2. Configure with BotFather
3. Test on both iOS and Android
4. Verify all features work correctly

## Troubleshooting

### Common Issues

#### Mini App Not Opening

- Check that your domain is HTTPS
- Verify the URL is correctly configured in BotFather
- Ensure the domain is accessible from mobile devices

#### File Upload Not Working

- Check file size limits (10MB max)
- Verify supported file types
- Test with different file formats

#### Haptic Feedback Not Working

- Only works on physical devices
- Requires Telegram app (not web version)
- Check device vibration settings

### Debug Mode

Enable debug mode for development:

1. **iOS**: Tap Settings icon 10 times → Enable Web View Inspection
2. **Android**: Enable USB debugging → Enable WebView Debug in Telegram
3. **Desktop**: Use Telegram Desktop beta with webview inspection

## Best Practices

### Performance

- Optimize images and assets
- Minimize bundle size
- Use lazy loading where appropriate

### User Experience

- Provide clear feedback for all actions
- Use haptic feedback sparingly
- Ensure fast loading times

### Security

- Validate all user inputs
- Sanitize file uploads
- Use HTTPS for all communications

## Future Enhancements

### Planned Features

- [ ] Extraction history storage
- [ ] Batch file processing
- [ ] OCR language selection
- [ ] Export to different formats
- [ ] Share extracted text directly to chats

### Advanced Features

- [ ] Full-screen mode support
- [ ] Custom themes
- [ ] Offline processing
- [ ] Advanced file editing

## Support

For issues related to Mini App functionality:

1. Check the troubleshooting section above
2. Review Telegram's [Mini App documentation](https://core.telegram.org/bots/webapps)
3. Test in Telegram's test environment
4. Open an issue on GitHub with detailed information

## Resources

- [Telegram Mini App Documentation](https://core.telegram.org/bots/webapps)
- [Bot API Documentation](https://core.telegram.org/bots/api)
- [Telegram Mini App Examples](https://github.com/TelegramMessenger/WebApp)
- [Telegram Bot API](https://core.telegram.org/bots)
