import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, MapPin, Phone, Search, Building2, Brain } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '../contexts/LanguageContext';

export function Header({ onMenuClick, onCartClick, onSearchClick, onAIFilterClick, selectedCompany, onRestaurantSelectionClick, companyInfo, currentView }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, language } = useLanguage();
  const isRTL = language === 'ar' || language === 'he';
  const displayCompany = companyInfo;

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  if (!displayCompany) {
    return (
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="animate-pulse">
              <div className="w-32 h-6 bg-gray-200 rounded"></div>
            </div>
            <div className="animate-pulse">
              <div className="w-24 h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-gradient-to-r from-white via-blue-50 to-purple-50 shadow-lg border-b border-blue-100 sticky top-0 z-40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
            {displayCompany?.settings.logo && (
              <img
                src={displayCompany.settings.logo}
                alt={displayCompany.name}
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover flex-shrink-0 ring-2 ring-blue-200 shadow-md hover:ring-blue-300 transition-all duration-200"
              />
            )}
            <div className="min-w-0 flex-1">
              <h1 className="text-sm sm:text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent truncate capitalize-names" title={displayCompany?.name}>{displayCompany?.name}</h1>
<div className={`flex flex-col sm:flex-row sm:items-center text-xs sm:text-sm text-gray-500 ${isRTL ? 'sm:space-x-reverse sm:space-x-4' : 'sm:space-x-4'}`}>
                {displayCompany?.settings.address && (
                  <div className="hidden sm:flex items-center min-w-0">
<MapPin className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                    <span className="truncate ">{displayCompany.settings.address}</span>
                  </div>
                )}
                {displayCompany?.settings.phone_number && (
                  <div className={`hidden sm:flex items-center flex-shrink-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Phone className={`w-3 h-3 sm:w-3 sm:h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                    <span>{displayCompany.settings.phone_number}</span>
                  </div>
                )}

              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-4">
            <button
              onClick={onMenuClick}
              className="hidden lg:flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              {t('nav.menu')}
            </button>

            <button
              onClick={onSearchClick}
              className="hidden lg:flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              <Search className="w-4 h-4 mr-2 text-blue-500" />
              {t('nav.search')}
            </button>

            <button
              onClick={onAIFilterClick}
              className={`items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-100 rounded-lg transition-all duration-200 transform hover:scale-105 ${(currentView === 'home' || currentView === 'menu') ? 'hidden lg:flex' : 'hidden'
                }`}
            >
              <Brain className="w-4 h-4 mr-2 text-purple-500" />
              {t('nav.ai_filter')}
            </button>

            <button
              onClick={onRestaurantSelectionClick}
              className="hidden lg:flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              <Building2 className="w-4 h-4 mr-2 text-purple-500" />
              {t('restaurants.change')}
            </button>

            <div className="hidden sm:block">
              <LanguageSelector />
            </div>

            <button
              onClick={onCartClick}
              className="relative p-1.5 sm:p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 transform hover:scale-110"
            >
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 transform hover:scale-110"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-blue-200 bg-gradient-to-b from-blue-50 to-white backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <div className="sm:hidden mb-3">
                <LanguageSelector onLanguageChange={handleMobileMenuClose} />
              </div>
              <button
                onClick={() => {
                  onMenuClick();
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-100 transition-all duration-200 rounded-lg transform hover:translate-x-1"
              >
                {t('nav.menu')}
              </button>
              <button
                onClick={() => {
                  onSearchClick();
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-100 transition-all duration-200 rounded-lg transform hover:translate-x-1"
              >
                {t('nav.search')}
              </button>
              <button
                onClick={() => {
                  onAIFilterClick();
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-3 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-100 transition-all duration-200 rounded-lg transform hover:translate-x-1 ${(currentView === 'home' || currentView === 'menu') ? 'block' : 'hidden'
                  }`}
              >
                {t('nav.ai_filter')}
              </button>
              <button
                onClick={() => {
                  onRestaurantSelectionClick();
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-100 transition-all duration-200 rounded-lg transform hover:translate-x-1"
              >
                {t('restaurants.change')}
              </button>
              {displayCompany?.settings.address && (
                <div className="sm:hidden px-3 py-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <MapPin className="w-3 h-3 mr-2 text-blue-600" />
                    <span>{displayCompany.settings.address}</span>
                  </div>
                </div>
              )}
              {displayCompany?.settings.phone_number && (
                <div className="sm:hidden px-3 py-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Phone className="w-3 h-3 mr-2 text-green-600" />
                    <span>{displayCompany.settings.phone_number}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}