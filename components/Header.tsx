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
      <h1 className="text-3xl font-bold text-gray-800 mb-2">🤖 Bot Template</h1>
      <p className="text-gray-600">
        {isTelegramWebApp
          ? 'Your Telegram Mini App & Bot Template'
          : 'Full-stack template for Telegram bots with web interface'}
      </p>
      {isTelegramWebApp && (
        <div className="mt-2 text-sm text-telegram-blue">
          Powered by Telegram Mini App
          {user && (
            <div className="mt-1 text-xs text-gray-500">
              Hi, {user.first_name}!
            </div>
          )}
        </div>
      )}
    </header>
  );
}
