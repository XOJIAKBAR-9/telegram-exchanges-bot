'use client';

import Header from '@/components/Header';
import WebDemo from '@/components/FileUpload';
import MiniAppDemo from '@/components/MiniAppFileUpload';
import { useTelegramMiniApp } from '@/lib/useTelegramMiniApp';

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

  const handleDemoAction = () => {
    if (isTelegramMiniApp && webApp) {
      webApp.HapticFeedback?.impactOccurred?.('light');
      webApp.showAlert('Hello from your Telegram Mini App!');
    } else {
      alert('Hello from your web app!');
    }
  };

  return (
    <main
      className={`container mx-auto px-4 py-8 max-w-2xl ${isTelegramMiniApp ? 'min-h-screen' : ''}`}
    >
      <Header isTelegramWebApp={isTelegramMiniApp} user={user} />
      <div className="space-y-6">
        <div className="card text-center">
          <div className="space-y-6 p-8">
            <div className="text-6xl">👋</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Hello World!
              </h2>
              <p className="text-gray-600 mb-6">
                Welcome to your{' '}
                {isTelegramMiniApp ? 'Telegram Mini App' : 'Web App'} template!
              </p>
            </div>
            <button
              onClick={handleDemoAction}
              className="btn-primary px-6 py-3 text-lg"
            >
              Try Demo Action
            </button>
            <div className="text-sm text-gray-500 space-y-2">
              <p>
                Platform: {isTelegramMiniApp ? 'Telegram Mini App' : 'Web'}
              </p>
              {user && (
                <p>
                  User: {user.first_name} {user.last_name}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Demo Components */}
        {isTelegramMiniApp && webApp ? (
          <MiniAppDemo webApp={webApp} />
        ) : (
          <WebDemo isTelegramWebApp={isTelegramMiniApp} />
        )}
      </div>
    </main>
  );
}
