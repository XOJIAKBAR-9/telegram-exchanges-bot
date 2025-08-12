// Test script for exchange rates service
// This is a simple test to verify all three banks' APIs work

async function testRatesService() {
  console.log('🧪 Testing Exchange Rates Service...\n');

  try {
    // Test Hamkorbank
    console.log('📡 Testing Hamkorbank API...');
    const hamkorbankResponse = await fetch(
      'https://api-dbo.hamkorbank.uz/webflow/v1/exchanges'
    );
    console.log(`Hamkorbank API status: ${hamkorbankResponse.status}`);

    if (hamkorbankResponse.ok) {
      const data = await hamkorbankResponse.json();
      console.log(`Hamkorbank Response status: ${data.status}`);
      console.log(`Data items: ${data.data ? data.data.length : 0}`);
    }

    // Test Universal Bank
    console.log('\n📡 Testing Universal Bank API...');
    const currencies = ['usd', 'eur', 'rub'];
    for (const currency of currencies) {
      try {
        const universalResponse = await fetch(
          `https://onmap.uz/api/chart?code=${currency}&count=31&bank=25`
        );
        console.log(
          `Universal Bank ${currency.toUpperCase()} status: ${universalResponse.status}`
        );

        if (universalResponse.ok) {
          const data = await universalResponse.json();
          if (data && data.length > 0) {
            const latestRate = data[data.length - 1];
            console.log(
              `  Latest ${currency.toUpperCase()}: Buy ${latestRate.buying}, Sell ${latestRate.selling}`
            );
          }
        }
      } catch (error) {
        console.log(
          `  Error testing ${currency.toUpperCase()}: ${error.message}`
        );
      }
    }

    // Test Tenge Bank
    console.log('\n📡 Testing Tenge Bank API...');
    const tengeResponse = await fetch(
      'https://tengebank.uz/api/exchangerates/tables'
    );
    console.log(`Tenge Bank API status: ${tengeResponse.status}`);

    if (tengeResponse.ok) {
      const data = await tengeResponse.json();
      if (data.personal && data.personal.length > 0) {
        const latestRates = data.personal[0];
        console.log('  Latest rates from personal section:');
        if (latestRates.currency.USD) {
          console.log(
            `  USD: Buy ${latestRates.currency.USD.buy}, Sell ${latestRates.currency.USD.sell}`
          );
        }
        if (latestRates.currency.EUR) {
          console.log(
            `  EUR: Buy ${latestRates.currency.EUR.buy}, Sell ${latestRates.currency.EUR.sell}`
          );
        }
        if (latestRates.currency.RUB) {
          console.log(
            `  RUB: Buy ${latestRates.currency.RUB.buy}, Sell ${latestRates.currency.RUB.sell}`
          );
        }
      }
    }

    console.log('\n✅ Exchange rates API test completed');
  } catch (error) {
    console.error('❌ Error testing APIs:', error);
  }
}

// Run the test
testRatesService();
