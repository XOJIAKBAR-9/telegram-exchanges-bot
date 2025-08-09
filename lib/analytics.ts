// Google Analytics 4 tracking utilities
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// Check if GA4 is loaded
const isGA4Loaded = () => {
  return (
    typeof window !== 'undefined' &&
    typeof window.gtag === 'function' &&
    process.env.NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID
  );
};

// Initialize GA4
export const initGA = () => {
  if (isGA4Loaded()) {
    window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID!, {
      page_title: 'Textract Bot',
      page_location: window.location.href,
    });
  }
};

// Track source identification
export const trackSourceIdentification = (
  source: 'web' | 'mini_app' | 'bot'
) => {
  if (isGA4Loaded()) {
    window.gtag('event', 'source_identification', {
      source: source,
      platform: source,
      user_source: source,
    });
    console.log('GA4: Tracked source_identification', { source });
  } else {
    console.log('GA4: Not loaded, skipping source_identification event');
  }
};

// Track text extraction events
export const trackTextExtractionStarted = (
  source: 'web' | 'mini_app' | 'bot',
  fileType: string
) => {
  if (isGA4Loaded()) {
    window.gtag('event', 'text_extraction_started', {
      source: source,
      file_type: fileType,
      platform: source,
    });
    console.log('GA4: Tracked text_extraction_started', { source, fileType });
  } else {
    console.log('GA4: Not loaded, skipping text_extraction_started event');
  }
};

export const trackTextExtractionSuccess = (
  source: 'web' | 'mini_app' | 'bot',
  fileType: string,
  textLength: number
) => {
  if (isGA4Loaded()) {
    window.gtag('event', 'text_extraction_success', {
      source: source,
      file_type: fileType,
      text_length: textLength,
      platform: source,
      value: textLength,
    });
    console.log('GA4: Tracked text_extraction_success', {
      source,
      fileType,
      textLength,
    });
  } else {
    console.log('GA4: Not loaded, skipping text_extraction_success event');
  }
};

export const trackTextExtractionFailed = (
  source: 'web' | 'mini_app' | 'bot',
  fileType: string,
  errorType: string
) => {
  if (isGA4Loaded()) {
    window.gtag('event', 'text_extraction_failed', {
      source: source,
      file_type: fileType,
      error_type: errorType,
      platform: source,
    });
    console.log('GA4: Tracked text_extraction_failed', {
      source,
      fileType,
      errorType,
    });
  } else {
    console.log('GA4: Not loaded, skipping text_extraction_failed event');
  }
};

// Track user engagement
export const trackUserEngagement = (
  source: 'web' | 'mini_app' | 'bot',
  action: string
) => {
  if (isGA4Loaded()) {
    window.gtag('event', 'user_engagement', {
      source: source,
      action: action,
      platform: source,
    });
    console.log('GA4: Tracked user_engagement', { source, action });
  } else {
    console.log('GA4: Not loaded, skipping user_engagement event');
  }
};

// Track file upload
export const trackFileUpload = (
  source: 'web' | 'mini_app' | 'bot',
  fileType: string,
  fileSize: number
) => {
  if (isGA4Loaded()) {
    window.gtag('event', 'file_upload', {
      source: source,
      file_type: fileType,
      file_size: fileSize,
      platform: source,
      value: fileSize,
    });
    console.log('GA4: Tracked file_upload', { source, fileType, fileSize });
  } else {
    console.log('GA4: Not loaded, skipping file_upload event');
  }
};

// Server-side tracking (OPTIONAL - only works if API secret is configured)
export const trackServerEvent = async (
  eventName: string,
  parameters: Record<string, any>
) => {
  // Skip server-side tracking if API secret is not configured
  if (
    !process.env.GOOGLE_MEASUREMENT_ID ||
    !process.env.GOOGLE_ANALYTICS_API_SECRET
  ) {
    console.log('Server-side GA4 tracking skipped - API secret not configured');
    return;
  }

  try {
    const response = await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GOOGLE_MEASUREMENT_ID}&api_secret=${process.env.GOOGLE_ANALYTICS_API_SECRET}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: 'server-side',
          events: [
            {
              name: eventName,
              params: parameters,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      console.error('Failed to send GA4 event:', response.statusText);
    } else {
      console.log('GA4: Server event sent successfully', {
        eventName,
        parameters,
      });
    }
  } catch (error) {
    console.error('Error sending GA4 event:', error);
  }
};
