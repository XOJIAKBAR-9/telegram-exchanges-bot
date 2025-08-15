import { NextResponse } from 'next/server';

export interface DavrBankRate {
  bank: string;
  currency: string;
  buy: number;
  sell: number;
  date: string;
}

export async function GET() {
  try {
    const response = await fetch('https://davrbank.uz/en', {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        Connection: 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
    });

    if (!response.ok) {
      throw new Error(`Davr Bank website error: ${response.status}`);
    }

    const html = await response.text();

    const rates: DavrBankRate[] = [];
    const today = new Date().toISOString().split('T')[0];

    // Target currencies we want to extract
    const currencyMap = {
      USD: 'USD',
      EUR: 'EUR',
      RUB: 'RUB',
    };

    // More specific regex pattern to match Davr Bank's table structure
    // Looking for: USD, EUR, RUB in the HTML with specific class names
    const tableRowRegex =
      /<span class="typograhpy-headline">([A-Z]{3})<\/span>[\s\S]*?<td class="typography-headline-semibold pb-4 text-right">([^<]+)<\/td>[\s\S]*?<td class="typography-headline-semibold pb-4 text-right">([^<]+)<\/td>[\s\S]*?<td class="typography-headline-semibold pb-4 text-right">([^<]+)<\/td>/g;

    let match;
    let matchCount = 0;

    while ((match = tableRowRegex.exec(html)) !== null) {
      matchCount++;
      const currencyCode = match[1].trim();
      const cbRate = match[2].trim(); // Central Bank rate (not used)
      const sellText = match[3].trim();
      const buyText = match[4].trim();

      console.log(
        `Davr Bank raw data: ${currencyCode} - CB: ${cbRate}, Sell: ${sellText}, Buy: ${buyText}`
      );

      // Check if this is one of our target currencies
      if (currencyMap[currencyCode as keyof typeof currencyMap]) {
        // Parse the rates (remove spaces and commas, then convert to number)
        const sellRate = parseFloat(
          sellText.replace(/\s/g, '').replace(/,/g, '')
        );
        const buyRate = parseFloat(
          buyText.replace(/\s/g, '').replace(/,/g, '')
        );

        console.log(
          `Davr Bank parsed rates: ${currencyCode} - Buy: ${buyRate}, Sell: ${sellRate}`
        );

        if (!isNaN(buyRate) && !isNaN(sellRate)) {
          // Convert to "per 100 currency" format to match other banks
          rates.push({
            bank: 'Davr Bank',
            currency: currencyCode,
            buy: buyRate * 100, // Convert to per 100 format
            sell: sellRate * 100, // Convert to per 100 format
            date: today,
          });

          console.log(
            `Davr Bank ${currencyCode}: Buy ${buyRate * 100}, Sell ${sellRate * 100}`
          );
        }
      }
    }

    console.log(`Davr Bank regex matches found: ${matchCount}`);

    // If no rates found, return empty array (will show '-' in UI)
    if (rates.length === 0) {
      console.log('No rates found for Davr Bank - returning empty array');
    }

    console.log(`Davr Bank rates fetched: ${rates.length}`);
    return NextResponse.json({ success: true, rates });
  } catch (error) {
    console.error('Error fetching Davr Bank rates:', error);

    // Return empty array if scraping fails (will show '-' in UI)
    return NextResponse.json({
      success: false,
      rates: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
