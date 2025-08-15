import { ExchangeRate } from '@/lib/ratesService';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Language, t } from '@/lib/translations';

interface ExchangeRatesTableProps {
  rates: ExchangeRate[];
  currency?: string;
  language: Language;
}

export function ExchangeRatesTable({
  rates,
  currency,
  language,
}: ExchangeRatesTableProps) {
  if (!rates || rates.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            {t(language, 'table.noRatesAvailable')}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group rates by currency if no specific currency is selected
  const ratesByCurrency: { [key: string]: ExchangeRate[] } = {};

  if (currency) {
    ratesByCurrency[currency] = rates.filter(
      (rate) => rate.currency === currency
    );
  } else {
    const currencies = ['USD', 'EUR', 'RUB'];
    currencies.forEach((curr) => {
      ratesByCurrency[curr] = rates.filter((rate) => rate.currency === curr);
    });
  }

  // Define all banks that should always be shown
  const allBanks = [
    'Hamkorbank',
    'Universal Bank',
    'Tenge Bank',
    'Anorbank',
    'NBU',
    'Davr Bank',
    'InfinBank',
    'AgroBank',
  ];

  const formatRate = (rate: number) => {
    return rate.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getBankIcon = (bankName: string) => {
    switch (bankName) {
      case 'Hamkorbank':
        return '🏦';
      case 'Universal Bank':
        return '🏛️';
      case 'Tenge Bank':
        return '🏪';
      case 'Anorbank':
        return '🏢';
      case 'NBU':
        return '🏛️';
      case 'Davr Bank':
        return '🏦';
      case 'InfinBank':
        return '🏛️';
      case 'AgroBank':
        return '🌾';
      default:
        return '🏦';
    }
  };

  const getCurrencyIcon = (curr: string) => {
    switch (curr) {
      case 'USD':
        return '💵';
      case 'EUR':
        return '💶';
      case 'RUB':
        return '💷';
      default:
        return '💰';
    }
  };

  return (
    <div className="space-y-6">
      {Object.entries(ratesByCurrency).map(([curr, currencyRates]) => (
        <Card key={curr}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getCurrencyIcon(curr)} {curr} Exchange Rates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t(language, 'table.bank')}</TableHead>
                  <TableHead className="text-right">
                    {t(language, 'table.buyRate')}
                  </TableHead>
                  <TableHead className="text-right">
                    {t(language, 'table.sellRate')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allBanks.map((bankName) => {
                  const bankRate = currencyRates.find(
                    (rate) => rate.bank === bankName
                  );

                  return (
                    <TableRow key={`${bankName}-${curr}`}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <span>{getBankIcon(bankName)}</span>
                          <span>{bankName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {bankRate ? (
                          <Badge variant="secondary" className="font-mono">
                            {formatRate(bankRate.buy)} UZS
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="font-mono">
                            -
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {bankRate ? (
                          <Badge variant="secondary" className="font-mono">
                            {formatRate(bankRate.sell)} UZS
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="font-mono">
                            -
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
