import React, { useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { DietaryTags } from './DietaryTags';
import { aiDietaryAnalyzer } from '../services/aiDietaryAnalyzer';

export function MenuGrid({ items, onItemClick, onAddToCart, showTags = false }) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform "
        >
          <div className="relative h-40 sm:h-48 overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(item);
              }}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-blue-700 hover:bg-blue-600 text-white p-1.5 sm:p-2 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
          <div
            className="p-4 sm:p-6 cursor-pointer"
            onClick={() => onItemClick(item)}
          >
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 hover:text-blue-800 transition-colors item-name">
              {item.name}
            </h3>

            {showTags && (
              <DietaryTags
                foodName={item.name}
                description={item.description}
                showTags={true}
                className="mt-1"
              />
            )}
            {item.company && (
              <div className="flex items-center mb-2">
                <span className="text-xs sm:text-sm text-blue-800 bg-blue-50 px-2 py-1 rounded-full capitalize-names mt-2">
                  {item.company.name}
                </span>
              </div>
            )}
            {/* {item.description && (
              <p className="text-gray-600 mb-3 sm:mb-4 line-clamp-2 text-sm sm:text-base">
                {item.description}
              </p>
            )} */}

            <div className="flex flex-col items-start mt-3">
              <span className="text-xl sm:text-2xl font-bold text-blue-800 self-end">
                ₪{item.price}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onItemClick(item);
                }}
                className="text-blue-800 hover:text-blue-700 text-xs sm:text-sm font-medium mt-1"
              >
                {t('item.view_details')}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}