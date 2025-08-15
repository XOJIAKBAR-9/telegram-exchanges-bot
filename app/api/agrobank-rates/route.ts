import { NextResponse } from 'next/server';

export interface AgroBankRate {
  bank: string;
  currency: string;
  buy: number;
  sell: number;
  date: string;
}

export async function GET() {
  try {
    // AgroBank website is a React application that loads data dynamically
    // For now, we'll return empty rates (showing '-' in UI)
    // TODO: Implement headless browser scraping or find API endpoints
    console.log(
      'AgroBank: React application detected, returning empty rates for now'
    );

    const rates: AgroBankRate[] = [];

    console.log(
      'AgroBank rates fetched: 0 (React app - needs headless browser)'
    );
    return NextResponse.json({ success: true, rates });
  } catch (error) {
    console.error('Error fetching AgroBank rates:', error);

    // Return empty array if scraping fails (will show '-' in UI)
    return NextResponse.json({
      success: false,
      rates: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
