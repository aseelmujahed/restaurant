import React, { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function LanguageSelector({ onLanguageChange }) {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
    { code: 'he', name: 'Hebrew', nativeName: 'עברית' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  const handleLanguageSelect = (langCode) => {
    setLanguage(langCode);
    setIsOpen(false);
    if (onLanguageChange) {
      onLanguageChange();
    }
  };
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
      >
        <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
        <span>{currentLanguage?.nativeName}</span>
        <ChevronDown className="w-2 h-2 sm:w-3 sm:h-3" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 sm:mt-2 bg-white border rounded-lg shadow-lg z-50 min-w-[100px] sm:min-w-[120px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className={`w-full text-left px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg text-xs sm:text-sm ${
                language === lang.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
            >
              {lang.nativeName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}