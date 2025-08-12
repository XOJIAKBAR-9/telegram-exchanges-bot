import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface HeaderProps {
  isTelegramWebApp: boolean;
  user?: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    is_premium?: boolean;
    photo_url?: string;
  } | null;
}

export default function Header({ isTelegramWebApp, user }: HeaderProps) {
  return (
    <header className="text-center mb-8">
      <Card>
        <CardContent className="pt-6">
          <h1 className="text-3xl font-bold mb-2">🏦 Exchange Rates</h1>
          <p className="text-muted-foreground">
            {isTelegramWebApp
              ? 'Live exchange rates from Hamkorbank, Universal Bank & Tenge Bank'
              : 'Get live exchange rates from Hamkorbank, Universal Bank & Tenge Bank in Uzbekistan'}
          </p>
          {isTelegramWebApp && (
            <div className="mt-4 flex justify-center gap-2">
              <Badge variant="outline">Telegram Mini App</Badge>
              {user && (
                <Badge variant="secondary">Hi, {user.first_name}!</Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </header>
  );
}
