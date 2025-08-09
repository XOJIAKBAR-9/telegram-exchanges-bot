# Google Analytics 4 Setup Guide

This guide will help you set up Google Analytics 4 (GA4) for your Textract Bot to track user interactions and extraction success rates.

## Step 1: Create Google Analytics 4 Property

1. Go to [analytics.google.com](https://analytics.google.com)
2. Sign in with your Google account
3. Click "Start measuring"
4. Follow the setup wizard:
   - **Account name**: `Textract Bot Analytics`
   - **Property name**: `Textract Bot`
   - **Reporting time zone**: Choose your timezone
   - **Currency**: Choose your currency
5. Click "Next" and complete the business information
6. Click "Create"

## Step 2: Get Your Measurement ID

1. In your GA4 property, go to **Admin** (gear icon)
2. Under **Property**, click **Data Streams**
3. Click **Web** to add a web stream
4. Enter your website URL (e.g., `https://your-domain.com`)
5. Give it a name like "Textract Bot Web App"
6. Click **Create stream**
7. Copy the **Measurement ID** (format: `G-XXXXXXXXXX`)

## Step 3: Set Up Environment Variables

### Required (Client-Side Tracking):

Add this to your `.env.local` file:

```bash
# Google Analytics 4 Configuration (REQUIRED)
NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID=G-XXXXXXXXXX
```

Replace `G-XXXXXXXXXX` with your actual Measurement ID.

### Optional (Server-Side Tracking):

For enhanced server-side tracking (bot events), you can also add:

```bash
# Google Analytics 4 Configuration (OPTIONAL)
GOOGLE_MEASUREMENT_ID=G-XXXXXXXXXX
GOOGLE_ANALYTICS_API_SECRET=your_ga4_api_secret_here
```

**Note**: Server-side tracking is completely optional. If you don't set these, you'll still get full client-side tracking for web app usage.

## Step 4: Get API Secret (Optional - for Server-Side Tracking)

For enhanced server-side tracking:

1. In GA4, go to **Admin** → **Property** → **Data Streams**
2. Click on your web stream
3. Scroll down to **Measurement Protocol API secrets**
4. Click **Create**
5. Copy the secret and add it to `GOOGLE_ANALYTICS_API_SECRET`

## Step 5: Test the Integration

1. Start your development server: `npm run dev`
2. Visit your app and perform some actions:
   - Upload a file
   - Extract text
   - Use the bot (if API secret is configured)
3. Check GA4 **Real-time reports** to see events coming in

## Step 6: View Analytics Dashboard

1. Visit your GA4 dashboard
2. Go to **Reports** → **Engagement** → **Events**
3. You'll see all your custom events with source tracking

## Events Being Tracked

### Source Identification:

- `source_identification` - Identifies user source (web, mini_app, bot)

### Web App Events (Always Tracked):

- `text_extraction_started` - When user uploads a file
- `text_extraction_success` - When text extraction succeeds
- `text_extraction_failed` - When text extraction fails
- `file_upload` - File upload details
- `user_engagement` - User interactions

### Mini App Events (Always Tracked):

- `text_extraction_started` - When mini-app user uploads a file
- `text_extraction_success` - When mini-app extraction succeeds
- `text_extraction_failed` - When mini-app extraction fails
- `file_upload` - Mini-app file upload details
- `user_engagement` - Mini-app user interactions

### Bot Events (Only if API secret configured):

- `text_extraction_started` - When bot receives a file
- `text_extraction_success` - When bot extraction succeeds
- `text_extraction_failed` - When bot extraction fails
- `user_engagement` - Bot commands and interactions

## Custom Parameters

Each event includes useful parameters:

- `source`: 'web', 'mini_app', or 'bot'
- `file_type`: Type of file processed
- `file_size`: Size of uploaded file
- `text_length`: Length of extracted text
- `error_type`: Type of error (if failed)
- `user_id`: Telegram user ID (for bot events)
- `action`: Specific user action (for engagement events)

## Source Tracking

The analytics now tracks three distinct sources:

### 1. **Web App** (`source: 'web'`)

- Users accessing your app via web browser
- Direct website visits
- Standard web interactions

### 2. **Telegram Mini App** (`source: 'mini_app'`)

- Users accessing via Telegram Mini App
- In-app Telegram experience
- Mobile-optimized interactions

### 3. **Telegram Bot** (`source: 'bot'`)

- Users sending files directly to bot
- Bot command interactions
- Server-side processing

## What You Get Without API Secret

Even without the API secret, you'll get comprehensive analytics:

- ✅ All web app user interactions
- ✅ All mini-app user interactions
- ✅ File uploads and extractions
- ✅ Success/failure rates for web and mini-app usage
- ✅ User engagement metrics
- ✅ Geographic and device analytics
- ✅ Real-time user activity
- ✅ Source identification and comparison

## Next Steps

1. **Wait for data**: GA4 takes 24-48 hours to populate reports
2. **Set up custom reports**: Create dashboards for your specific needs
3. **Monitor success rates**: Track extraction success/failure rates by source
4. **User behavior**: Understand how users interact with each platform
5. **Performance optimization**: Identify common failure points by source

## Troubleshooting

### Events not showing up:

- Check browser console for errors
- Verify Measurement ID is correct
- Ensure environment variables are set
- Check GA4 real-time reports

### Server-side events not working:

- This is expected if you don't have the API secret
- Only web app and mini-app events will be tracked
- Bot events will be skipped gracefully

## Privacy Considerations

- GA4 respects user privacy settings
- No personally identifiable information is sent
- Users can opt out via browser settings
- Consider adding a privacy policy

## Support

If you need help with GA4 setup or have questions about the analytics implementation, refer to:

- [GA4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [GA4 Events Reference](https://developers.google.com/analytics/devguides/collection/ga4/events)
- [Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/ga4)
