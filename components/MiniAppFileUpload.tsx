'use client';

import { useState, useEffect } from 'react';
import { trackUserEngagement, trackSourceIdentification } from '@/lib/analytics';

interface MiniAppDemoProps {
  webApp: any;
}

export default function MiniAppDemo({ webApp }: MiniAppDemoProps) {
  const [message, setMessage] = useState('');
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Track source identification on component mount
  useEffect(() => {
    trackSourceIdentification('mini_app');
  }, []);

  const handleApiCall = async () => {
    if (!message.trim()) {
      webApp.showAlert('Please enter a message first!');
      return;
    }

    setIsLoading(true);
    trackUserEngagement('mini_app', 'mini_app_api_call');
    webApp.HapticFeedback?.impactOccurred?.('light');

    try {
      const response = await fetch('/api/extract-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message.trim() }),
      });

      if (!response.ok) {
        throw new Error('API call failed');
      }

      const data = await response.json();
      setApiResponse(data);
      
      // Show success feedback
      webApp.HapticFeedback?.notificationOccurred?.('success');
      trackUserEngagement('mini_app', 'mini_app_api_success');
    } catch (error) {
      console.error('Error calling API:', error);
      trackUserEngagement('mini_app', 'mini_app_api_error');
      webApp.showAlert('Failed to call API. Please try again.');
      webApp.HapticFeedback?.notificationOccurred?.('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowMainButton = () => {
    webApp.MainButton.setText('Demo Main Button');
    webApp.MainButton.show();
    webApp.MainButton.onClick(() => {
      webApp.showAlert('Main button clicked!');
      webApp.HapticFeedback?.impactOccurred?.('medium');
    });
    trackUserEngagement('mini_app', 'main_button_demo');
  };

  const handleHideMainButton = () => {
    webApp.MainButton.hide();
    trackUserEngagement('mini_app', 'main_button_hide');
  };

  return (
    <div className="card">
      <div className="text-center p-8">
        <div className="space-y-6">
          <div className="text-6xl">📱</div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Mini App Demo
            </h3>
            <p className="text-gray-600 mb-4">
              Explore Telegram Mini App features with haptic feedback
            </p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter a message to send to your API..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-telegram-blue focus:border-transparent text-base"
              disabled={isLoading}
            />

            <button
              onClick={handleApiCall}
              disabled={isLoading}
              className="btn-primary w-full py-4 text-lg"
            >
              {isLoading ? '⏳ Calling API...' : '🚀 Call API'}
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleShowMainButton}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-medium text-sm"
              >
                Show Main Button
              </button>
              <button
                onClick={handleHideMainButton}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-medium text-sm"
              >
                Hide Main Button
              </button>
            </div>
          </div>

          {apiResponse && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
              <h4 className="font-semibold text-green-800 mb-2">API Response:</h4>
              <pre className="text-sm text-green-700 whitespace-pre-wrap">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </div>
          )}

          <div className="text-xs text-gray-500 space-y-1">
            <p>✨ This template includes haptic feedback</p>
            <p>🎯 Customize Mini App features for your needs!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
