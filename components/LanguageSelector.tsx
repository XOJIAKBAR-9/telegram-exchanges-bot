'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Language,
  languages,
  languageNames,
  detectLanguage,
  setLanguage,
} from '@/lib/translations';

interface LanguageSelectorProps {
  onLanguageChange?: (lang: Language) => void;
  className?: string;
}

export function LanguageSelector({
  onLanguageChange,
  className,
}: LanguageSelectorProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('uz');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const detectedLang = detectLanguage();
    setCurrentLanguage(detectedLang);
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setCurrentLanguage(lang);
    setLanguage(lang);
    setIsOpen(false);
    onLanguageChange?.(lang);
  };

  const getLanguageFlag = (lang: Language) => {
    switch (lang) {
      case 'uz':
        return '🇺🇿';
      case 'ru':
        return '🇷🇺';
      case 'en':
        return '🇺🇸';
      default:
        return '🌐';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <span>{getLanguageFlag(currentLanguage)}</span>
        <span>{languageNames[currentLanguage]}</span>
        <span className="text-xs">▼</span>
      </Button>

      {isOpen && (
        <Card className="absolute top-full left-0 mt-1 z-50 min-w-[150px]">
          <CardContent className="p-2">
            {languages.map((lang) => (
              <Button
                key={lang}
                variant={currentLanguage === lang ? 'default' : 'ghost'}
                size="sm"
                className="w-full justify-start mb-1"
                onClick={() => handleLanguageChange(lang)}
              >
                <span className="mr-2">{getLanguageFlag(lang)}</span>
                <span>{languageNames[lang]}</span>
                {currentLanguage === lang && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    ✓
                  </Badge>
                )}
              </Button>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
