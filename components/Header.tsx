import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Language, t } from '@/lib/translations';

interface HeaderProps {
  isTelegramWebApp: boolean;
  language: Language;
  onLanguageChange: (lang: Language) => void;
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

export default function Header({
  isTelegramWebApp,
  language,
  onLanguageChange,
  user,
}: HeaderProps) {
  return (
    <header className="text-center mb-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1"></div>
            <LanguageSelector onLanguageChange={onLanguageChange} />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {t(language, 'header.title')}
          </h1>
          <p className="text-muted-foreground">
            {isTelegramWebApp
              ? t(language, 'header.subtitle')
              : t(language, 'header.subtitle')}
          </p>
          {isTelegramWebApp && (
            <div className="mt-4 flex justify-center gap-2">
              <Badge variant="outline">
                {t(language, 'header.telegramMiniApp')}
              </Badge>
              {user && (
                <Badge variant="secondary">
                  {t(language, 'header.greeting', { name: user.first_name })}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </header>
  );
}
