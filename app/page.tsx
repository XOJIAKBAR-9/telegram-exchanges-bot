'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import { useTelegramMiniApp } from '@/lib/useTelegramMiniApp';
import { fetchAllRates } from '@/lib/ratesService';
import { ExchangeRatesTable } from '@/components/ExchangeRatesTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Language, detectLanguage, t } from '@/lib/translations';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        initDataUnsafe?: {
          user?: any;
        };
        MainButton: {
          text: string;
          isVisible: boolean;
          show: () => void;
          hide: () => void;
          onClick: (_callback: () => void) => void; // eslint-disable-line no-unused-vars
        };
        BackButton: {
          isVisible: boolean;
          show: () => void;
          hide: () => void;
          onClick: (_callback: () => void) => void; // eslint-disable-line no-unused-vars
        };
      };
    };
  }
}

export default function Home() {
  const { isTelegramMiniApp, user, webApp } = useTelegramMiniApp();
  const [ratesData, setRatesData] = useState<any>(null);
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [language, setLanguage] = useState<Language>('uz');

  useEffect(() => {
    const detectedLang = detectLanguage();
    setLanguage(detectedLang);
  }, []);

  const handleFetchRates = useCallback(
    async (currency?: string) => {
      setIsLoadingRates(true);
      setSelectedCurrency(currency || 'ALL');

      try {
        const rates = await fetchAllRates();

        if (currency) {
          // Filter rates for specific currency from all banks
          const currencyRates = rates.filter(
            (rate) => rate.currency === currency
          );
          if (currencyRates.length > 0) {
            setRatesData({
              full: `${currency} Exchange Rates from All Banks`,
              best: `📊 ${currency} Exchange Rates from All Banks`,
              raw: currencyRates,
            });
          } else {
            setRatesData({
              full: `❌ No rates available for ${currency}`,
              best: `❌ No ${currency} rates`,
              raw: [],
            });
          }
        } else {
          // Show all rates
          setRatesData({
            full: 'All Exchange Rates',
            best: '📊 All Exchange Rates from All Banks',
            raw: rates,
          });
        }

        if (isTelegramMiniApp && webApp) {
          webApp.HapticFeedback?.notificationOccurred?.('success');
        }
      } catch (error) {
        console.error('Error fetching rates:', error);
        setRatesData({
          full: '❌ Error fetching exchange rates.',
          best: '❌ Error',
          raw: [],
        });

        if (isTelegramMiniApp && webApp) {
          webApp.showAlert('Failed to fetch exchange rates');
          webApp.HapticFeedback?.notificationOccurred?.('error');
        } else {
          alert('Failed to fetch exchange rates');
        }
      } finally {
        setIsLoadingRates(false);
      }
    },
    [isTelegramMiniApp, webApp]
  );

  // Fetch USD rates by default when component mounts
  useEffect(() => {
    handleFetchRates('USD');
  }, [handleFetchRates]);

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl min-h-screen">
      <Header
        isTelegramWebApp={isTelegramMiniApp}
        language={language}
        onLanguageChange={setLanguage}
        user={user}
      />
      <div className="space-y-6">
        {/* Exchange Rates Section */}
        <Card className="text-center">
          <CardContent className="space-y-6 p-8">
            <div className="text-6xl">💱</div>
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {t(language, 'exchangeRates.title')}
              </h2>
              <p className="text-muted-foreground mb-6">
                {t(language, 'exchangeRates.subtitle')}
              </p>
            </div>

            {/* Currency Buttons */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <Button
                onClick={() => handleFetchRates('USD')}
                disabled={isLoadingRates}
                variant="default"
                size="lg"
                className="h-12"
              >
                {t(language, 'exchangeRates.currencyButtons.usd')}
              </Button>
              <Button
                onClick={() => handleFetchRates('EUR')}
                disabled={isLoadingRates}
                variant="default"
                size="lg"
                className="h-12"
              >
                {t(language, 'exchangeRates.currencyButtons.eur')}
              </Button>
              <Button
                onClick={() => handleFetchRates('RUB')}
                disabled={isLoadingRates}
                variant="default"
                size="lg"
                className="h-12"
              >
                {t(language, 'exchangeRates.currencyButtons.rub')}
              </Button>
            </div>

            {/* All Rates Button */}
            <Button
              onClick={() => handleFetchRates()}
              disabled={isLoadingRates}
              variant="secondary"
              size="lg"
              className="w-full h-12 text-lg"
            >
              {isLoadingRates
                ? t(language, 'exchangeRates.loadingRates')
                : t(language, 'exchangeRates.allRates')}
            </Button>

            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                {t(language, 'exchangeRates.platform')}:{' '}
                {isTelegramMiniApp
                  ? t(language, 'header.telegramMiniApp')
                  : t(language, 'header.web')}
              </p>
              <p>
                {t(language, 'exchangeRates.selectedCurrency')}:{' '}
                {selectedCurrency}
              </p>
              {user && (
                <p>
                  User: {user.first_name} {user.last_name}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Exchange Rates Display */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {selectedCurrency === 'USD' ||
              selectedCurrency === 'EUR' ||
              selectedCurrency === 'RUB'
                ? `${selectedCurrency} ${t(language, 'exchangeRates.title')} from All Banks`
                : t(language, 'exchangeRates.allRates')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {ratesData ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline">
                    {ratesData.raw.length}{' '}
                    {t(language, 'exchangeRates.ratesFetched')}
                  </Badge>
                  <Badge variant="secondary">
                    {selectedCurrency === 'ALL'
                      ? t(language, 'exchangeRates.allCurrencies')
                      : selectedCurrency}
                  </Badge>
                </div>

                <ExchangeRatesTable
                  rates={ratesData.raw}
                  currency={
                    selectedCurrency === 'USD' ||
                    selectedCurrency === 'EUR' ||
                    selectedCurrency === 'RUB'
                      ? selectedCurrency
                      : undefined
                  }
                  language={language}
                />
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-muted-foreground">
                  {isLoadingRates ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span>{t(language, 'table.loadingRates')}</span>
                    </div>
                  ) : (
                    <span>{t(language, 'table.clickToLoad')}</span>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
