import React from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function FilterPanel({
  isOpen,
  onClose,
  categories,
  restaurants,
  selectedCategory,
  selectedRestaurant,
  onCategoryChange,
  onRestaurantChange,
  minPrice,
  maxPrice,
  onPriceChange,
  sortBy,
  sortOrder,
  onSortChange,
  onApplyFilters,
  onClearFilters
}) {
  const { t } = useLanguage();

  const handlePriceChange = (type, value) => {
    const numValue = value === '' ? 0 : Number(value);
    if (type === 'min') {
      onPriceChange(numValue, maxPrice);
    } else {
      onPriceChange(minPrice, numValue);
    }
  };

  const handleRestaurantChange = (restaurantId) => {
    onRestaurantChange(restaurantId);
    onCategoryChange('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
      <div className="bg-white w-full sm:max-w-md h-full overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-3 sm:p-4 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">{t('filters.title')}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">{t('filters.restaurant')}</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="restaurant"
                  value=""
                  checked={selectedRestaurant === ''}
                  onChange={(e) => handleRestaurantChange(e.target.value)}
                  className="text-blue-500 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700 text-sm sm:text-base">{t('filters.all_restaurants')}</span>
              </label>
              {restaurants.map((restaurant) => (
                <label key={restaurant.id} className="flex items-center">
                  <input
                    type="radio"
                    name="restaurant"
                    value={restaurant.id}
                    checked={selectedRestaurant === restaurant.id}
                    onChange={(e) => handleRestaurantChange(e.target.value)}
                    className="text-blue-500 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700 text-sm sm:text-base capitalize-names">{restaurant.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">{t('filters.category')}</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value=""
                  checked={selectedCategory === ''}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  className="text-blue-500 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700 text-sm sm:text-base">{t('filters.all_categories')}</span>
              </label>
              {categories.map((category) => (
                <label key={category.id} className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value={category.id}
                    checked={selectedCategory === category.id}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="text-blue-500 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700 text-sm sm:text-base category-name">{category.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">{t('filters.price_range')}</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('filters.min_price')}
                </label>
                <input
                  type="number"
                  value={minPrice === 0 ? '' : minPrice}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  placeholder="0"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('filters.max_price')}
                </label>
                <input
                  type="number"
                  value={maxPrice === 1000 ? '' : maxPrice}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  placeholder="1000"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">{t('filters.sort_by')}</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="sort"
                  checked={sortBy === 'price' && sortOrder === 'asc'}
                  onChange={() => onSortChange('price', 'asc')}
                  className="text-blue-500 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700 text-sm sm:text-base">{t('filters.price_low_high')}</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="sort"
                  checked={sortBy === 'price' && sortOrder === 'desc'}
                  onChange={() => onSortChange('price', 'desc')}
                  className="text-blue-500 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700 text-sm sm:text-base">{t('filters.price_high_low')}</span>
              </label>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t p-4 space-y-3">
          <button
            onClick={onApplyFilters}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base"
          >
            {t('filters.apply')}
          </button>
          <button
            onClick={onClearFilters}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base"
          >
            {t('filters.clear')}
          </button>
        </div>
      </div>
    </div>
  );
}