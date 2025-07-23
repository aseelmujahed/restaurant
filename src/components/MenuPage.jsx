import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { MenuGrid } from './MenuGrid';
import { aiDietaryAnalyzer } from '../services/aiDietaryAnalyzer';

export function MenuPage({ category, onBack, onItemClick, aiDietaryPreferences }) {
  const { t } = useLanguage();
  
  const getFilteredItems = (items) => {
    if (!aiDietaryPreferences || !items) return items;
    return aiDietaryAnalyzer.filterItems(items, aiDietaryPreferences);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center mb-3 sm:mb-4">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mr-2 sm:mr-4"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span className="text-sm sm:text-base">{t('nav.back_to_categories')}</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-3 sm:space-x-4">
            <img
              src={category.image}
              alt={category.name}
              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0"
            />
            <div className="min-w-0">
              <h1 className="text-xl sm:text-3xl font-bold text-gray-900">{category.name}</h1>
              <p className="text-gray-600 text-sm sm:text-base">
                {category.items_count} {category.items_count === 1 ? t('categories.item') : t('categories.items')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-8 sm:py-12">
        <MenuGrid
          items={getFilteredItems(category.items)}
          onItemClick={onItemClick}
          showDietaryTags={!!aiDietaryPreferences}
        />
      </div>
    </div>
  );
}