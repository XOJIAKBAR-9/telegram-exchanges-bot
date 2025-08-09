'use client';

import { useState, useEffect } from 'react';
import { trackUserEngagement, trackSourceIdentification } from '@/lib/analytics';

interface WebDemoProps {
  isTelegramWebApp: boolean;
}

export default function WebDemo({ isTelegramWebApp }: WebDemoProps) {
  const [message, setMessage] = useState('');
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Track source identification on component mount
  useEffect(() => {
    trackSourceIdentification('web');
  }, []);

  const handleApiCall = async () => {
    if (!message.trim()) {
      alert('Please enter a message first!');
      return;
    }

    setIsLoading(true);
    trackUserEngagement('web', 'api_demo_call');

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
    } catch (error) {
      console.error('Error calling API:', error);
      trackUserEngagement('web', 'api_demo_error');
      alert('Failed to call API. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="p-8 text-center">
        <div className="space-y-6">
          <div className="text-6xl">🌐</div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Web Demo
            </h3>
            <p className="text-gray-600 mb-4">
              Test your API functionality from the web interface
            </p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter a message to send to your API..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-telegram-blue focus:border-transparent"
              disabled={isLoading}
            />

            <button
              onClick={handleApiCall}
              disabled={isLoading}
              className="btn-primary w-full py-3"
            >
              {isLoading ? 'Calling API...' : 'Call API'}
            </button>
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
            <p>Platform: {isTelegramWebApp ? 'Telegram Web App' : 'Web Browser'}</p>
            <p>This is a template component - customize it for your needs!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
