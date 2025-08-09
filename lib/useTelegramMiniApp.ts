import { useEffect, useState } from 'react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

// Using the existing global Window.Telegram.WebApp type

// Using existing global declaration from app/page.tsx

export function useTelegramMiniApp() {
  const [isTelegramMiniApp, setIsTelegramMiniApp] = useState(false);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [webApp, setWebApp] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;

      // Check if we're actually in Telegram Mini App
      if (tg.initDataUnsafe?.user) {
        setIsTelegramMiniApp(true);
        setUser(tg.initDataUnsafe.user);
        setWebApp(tg);

        // Initialize the Mini App
        tg.ready();
        tg.expand();
        setIsReady(true);

        console.log('Telegram Mini App initialized:', {
          user: tg.initDataUnsafe.user,
        });
      }
    }
  }, []);

  return {
    isTelegramMiniApp,
    user,
    webApp,
    isReady,
  };
}
