import { NextResponse } from 'next/server';

export interface InfinBankRate {
  bank: string;
  currency: string;
  buy: number;
  sell: number;
  date: string;
}

export async function GET() {
  try {
    const response = await fetch(
      'https://www.infinbank.com/en/private/exchange-rates/',
      {
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
      }
    );

    if (!response.ok) {
      throw new Error(`InfinBank website error: ${response.status}`);
    }

    const html = await response.text();

    const rates: InfinBankRate[] = [];
    const today = new Date().toISOString().split('T')[0];

    // Target currencies we want to extract
    const currencyMap = {
      USD: 'USD',
      EUR: 'EUR',
      RUB: 'RUB',
    };

    // Regex pattern to match InfinBank's exchange office rates
    // Looking for: Exchange office Buy/Sell rows with USD, EUR, RUB rates
    // The table structure is: USD | EUR | GBP | RUB | JPY | CHF
    // We want columns 1 (USD), 2 (EUR), 4 (RUB) - skipping GBP (3)
    const exchangeOfficeBuyRegex =
      /<td class="pr--32">Buy<\/td>[\s\S]*?<td>([^<]+)<\/td><td>([^<]+)<\/td><td>[^<]+<\/td><td>([^<]+)<\/td>/g;
    const exchangeOfficeSellRegex =
      /<td class="pt-0 pr--32">Sell<\/td>[\s\S]*?<td class="pt-0">([^<]+)<\/td><td class="pt-0">([^<]+)<\/td><td class="pt-0">[^<]+<\/td><td class="pt-0">([^<]+)<\/td>/g;

    let buyMatch = exchangeOfficeBuyRegex.exec(html);
    let sellMatch = exchangeOfficeSellRegex.exec(html);

    if (buyMatch && sellMatch) {
      // Extract rates from the matches
      const currencies = ['USD', 'EUR', 'RUB'];

      for (let i = 0; i < currencies.length; i++) {
        const currencyCode = currencies[i];
        const buyText = buyMatch[i + 1].trim();
        const sellText = sellMatch[i + 1].trim();

        console.log(
          `InfinBank raw data: ${currencyCode} - Buy: ${buyText}, Sell: ${sellText}`
        );

        // Check if this is one of our target currencies
        if (currencyMap[currencyCode as keyof typeof currencyMap]) {
          // Parse the rates (remove spaces and convert to number)
          const buyRate = parseFloat(
            buyText.replace(/\s/g, '').replace(/,/g, '')
          );
          const sellRate = parseFloat(
            sellText.replace(/\s/g, '').replace(/,/g, '')
          );

          console.log(
            `InfinBank parsed rates: ${currencyCode} - Buy: ${buyRate}, Sell: ${sellRate}`
          );

          if (!isNaN(buyRate) && !isNaN(sellRate)) {
            // Convert to "per 100 currency" format to match other banks
            rates.push({
              bank: 'InfinBank',
              currency: currencyCode,
              buy: buyRate * 100, // Convert to per 100 format
              sell: sellRate * 100, // Convert to per 100 format
              date: today,
            });

            console.log(
              `InfinBank ${currencyCode}: Buy ${buyRate * 100}, Sell ${sellRate * 100}`
            );
          }
        }
      }
    }

    console.log(
      `InfinBank regex matches found: ${buyMatch ? 1 : 0} buy, ${sellMatch ? 1 : 0} sell`
    );

    // If no rates found, return empty array (will show '-' in UI)
    if (rates.length === 0) {
      console.log('No rates found for InfinBank - returning empty array');
    }

    console.log(`InfinBank rates fetched: ${rates.length}`);
    return NextResponse.json({ success: true, rates });
  } catch (error) {
    console.error('Error fetching InfinBank rates:', error);

    // Return empty array if scraping fails (will show '-' in UI)
    return NextResponse.json({
      success: false,
      rates: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
