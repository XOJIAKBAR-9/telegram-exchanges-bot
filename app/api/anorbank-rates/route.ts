import { NextResponse } from 'next/server';

export interface AnorbankRate {
  bank: string;
  currency: string;
  buy: number;
  sell: number;
  date: string;
}

export async function GET() {
  try {
    const response = await fetch(
      'https://anorbank.uz/en/about/exchange-rates/',
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
      throw new Error(`Anorbank website error: ${response.status}`);
    }

    const html = await response.text();

    const rates: AnorbankRate[] = [];
    const today = new Date().toISOString().split('T')[0];

    // Target currencies we want to extract
    const currencyMap = {
      'US Dollar, USD': 'USD',
      'EURO, EUR': 'EUR',
      'Russian Rouble, RUB': 'RUB',
    };

    // More specific regex to target the exchange rates table
    const tableRegex =
      /<tr[^>]*>\s*<td[^>]*>([^<]+)<\/td>\s*<td[^>]*>([^<]+)<\/td>\s*<td[^>]*>([^<]+)<\/td>\s*<td[^>]*>([^<]+)<\/td>/g;
    let match;

    while ((match = tableRegex.exec(html)) !== null) {
      const currencyText = match[1].trim();
      const buyText = match[2].trim();
      const sellText = match[3].trim();

      // Check if this row contains one of our target currencies
      for (const [fullName, code] of Object.entries(currencyMap)) {
        if (currencyText.includes(fullName) || currencyText.includes(code)) {
          // Parse the rates (remove spaces and convert to number)
          const buyRate = parseFloat(
            buyText.replace(/\s/g, '').replace(',', '.')
          );
          const sellRate = parseFloat(
            sellText.replace(/\s/g, '').replace(',', '.')
          );

          if (!isNaN(buyRate) && !isNaN(sellRate)) {
            // Convert to "per 100 currency" format to match other banks
            rates.push({
              bank: 'Anorbank',
              currency: code,
              buy: buyRate * 100, // Convert to per 100 format
              sell: sellRate * 100, // Convert to per 100 format
              date: today,
            });

            console.log(
              `Anorbank ${code}: Buy ${buyRate * 100}, Sell ${sellRate * 100}`
            );
            break; // Found this currency, move to next row
          }
        }
      }
    }

    // If no rates found, return empty array (will show '-' in UI)
    if (rates.length === 0) {
      console.log('No rates found for Anorbank - returning empty array');
    }

    // Remove duplicates by keeping only the first occurrence of each currency
    const uniqueRates = rates.filter(
      (rate, index, self) =>
        index === self.findIndex((r) => r.currency === rate.currency)
    );

    console.log(`Anorbank rates fetched: ${uniqueRates.length} unique rates`);
    return NextResponse.json({ success: true, rates: uniqueRates });
  } catch (error) {
    console.error('Error fetching Anorbank rates:', error);

    // Return empty array if scraping fails (will show '-' in UI)
    return NextResponse.json({
      success: false,
      rates: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
