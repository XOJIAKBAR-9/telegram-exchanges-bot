const { fetchAllRates } = require('../lib/ratesService.ts');

async function testAnorbank() {
  console.log('Testing Anorbank scraping...');

  try {
    const rates = await fetchAllRates();

    // Filter for Anorbank rates
    const anorbankRates = rates.filter((rate) => rate.bank === 'Anorbank');

    console.log('\n=== Anorbank Rates ===');
    anorbankRates.forEach((rate) => {
      console.log(`${rate.currency}: Buy ${rate.buy}, Sell ${rate.sell}`);
    });

    console.log(`\nTotal rates fetched: ${rates.length}`);
    console.log(`Anorbank rates: ${anorbankRates.length}`);
  } catch (error) {
    console.error('Error testing Anorbank:', error);
  }
}

testAnorbank();
