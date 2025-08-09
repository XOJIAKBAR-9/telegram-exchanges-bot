import { NextRequest, NextResponse } from 'next/server';
import { trackServerEvent } from '@/lib/analytics';

export async function GET() {
  return NextResponse.json({
    message: 'Hello from your API!',
    timestamp: new Date().toISOString(),
    platform: 'web',
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Determine source from request headers
    const userAgent = request.headers.get('user-agent') || '';
    const isTelegramMiniApp =
      userAgent.includes('TelegramWebApp') || userAgent.includes('Telegram');
    const source = isTelegramMiniApp ? 'mini_app' : 'web';

    // Track API usage
    await trackServerEvent('api_hello_world_used', {
      source: source,
      message: body.message || 'no message',
    });

    console.log('Hello World API called from:', source, 'with data:', body);

    return NextResponse.json({
      message: 'Hello from your API!',
      echo: body,
      source: source,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error('Error in hello world API:', error);

    let errorMessage = 'API error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details:
          process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
