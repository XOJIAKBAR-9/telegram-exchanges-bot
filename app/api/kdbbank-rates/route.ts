import { NextResponse } from 'next/server';

export interface KdbBankRate {
  bank: string;
  currency: string;
  buy: number;
  sell: number;
  date: string;
}

export async function GET() {
  try {
    const response = await fetch(
      'https://kdb.uz/en/interactive-services/exchange-rates',
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`KDB Bank website error: ${response.status}`);
    }

    const html = await response.text();
    console.log('KDB Bank HTML fetched successfully');

    const rates: KdbBankRate[] = [];

    // Extract rates from the "Exchange Office" tab (first tab)
    // Looking for patterns like: <td> 12520 / 12640 </td> for USD, EUR, RUB

    // More specific pattern to find the exchange office rates
    const exchangeOfficeSection = html.match(
      /<div class="tab-pane fade show active" id="kdb"[^>]*>([\s\S]*?)<\/div>/
    );

    if (exchangeOfficeSection) {
      const sectionHtml = exchangeOfficeSection[1];

      // Find all rate pairs in the exchange office section
      const ratePattern = /<td>\s*([^<]+)\s*<\/td>/g;
      const rateMatches = sectionHtml.match(ratePattern);

      console.log(
        `KDB Bank regex matches found: ${rateMatches ? rateMatches.length : 0}`
      );

      if (rateMatches && rateMatches.length >= 3) {
        // Extract USD rates (first match)
        const usdMatch = rateMatches[0].match(
          /(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/
        );
        if (usdMatch) {
          const buyRate = parseFloat(usdMatch[1]) * 100; // Convert to per 100 currency
          const sellRate = parseFloat(usdMatch[2]) * 100;

          rates.push({
            bank: 'KDB Bank',
            currency: 'USD',
            buy: buyRate,
            sell: sellRate,
            date: new Date().toISOString().split('T')[0],
          });

          console.log(`KDB Bank USD: Buy ${buyRate}, Sell ${sellRate}`);
        }

        // Extract EUR rates (second match)
        const eurMatch = rateMatches[1].match(
          /(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/
        );
        if (eurMatch) {
          const buyRate = parseFloat(eurMatch[1]) * 100; // Convert to per 100 currency
          const sellRate = parseFloat(eurMatch[2]) * 100;

          rates.push({
            bank: 'KDB Bank',
            currency: 'EUR',
            buy: buyRate,
            sell: sellRate,
            date: new Date().toISOString().split('T')[0],
          });

          console.log(`KDB Bank EUR: Buy ${buyRate}, Sell ${sellRate}`);
        }

        // Extract RUB rates (third match) - check if it's not "n/a"
        const rubMatch = rateMatches[2].match(
          /(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/
        );
        if (rubMatch) {
          const buyRate = parseFloat(rubMatch[1]) * 100; // Convert to per 100 currency
          const sellRate = parseFloat(rubMatch[2]) * 100;

          rates.push({
            bank: 'KDB Bank',
            currency: 'RUB',
            buy: buyRate,
            sell: sellRate,
            date: new Date().toISOString().split('T')[0],
          });

          console.log(`KDB Bank RUB: Buy ${buyRate}, Sell ${sellRate}`);
        } else {
          // RUB shows "n/a / n/a" so we don't add it to rates
          console.log('KDB Bank RUB: n/a (not available)');
        }
      }
    }

    console.log(`KDB Bank rates fetched: ${rates.length}`);
    return NextResponse.json({ success: true, rates });
  } catch (error) {
    console.error('Error fetching KDB Bank rates:', error);

    // Return empty array if scraping fails (will show '-' in UI)
    return NextResponse.json({
      success: false,
      rates: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
