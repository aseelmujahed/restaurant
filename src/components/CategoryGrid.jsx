import React, { useState, useEffect } from 'react';
import { Utensils, ArrowRight, Search, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { MenuGrid } from './MenuGrid';
import { apiService } from '../services/api';
import { aiDietaryAnalyzer } from '../services/aiDietaryAnalyzer';

export function CategoryGrid({ onCategoryClick, selectedCompany, onItemClick, onAddToCart, highlightedCategory, onCategorySelect, aiDietaryPreferences }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t, language } = useLanguage();

  useEffect(() => {
    if (selectedCompany) {
      const fetchCategories = async () => {
        setIsLoading(true);
        try {
          const response = await apiService.getCategoriesWithItems(
            selectedCompany.id,
            language
          );
          if (response.success) {
            setCategories(response.data.categories);

            if (response.data.categories.length > 0) {
              let categoryToSelect;

              if (highlightedCategory) {
                categoryToSelect = response.data.categories.find(cat =>
                  cat.name.toLowerCase() === highlightedCategory.name.toLowerCase()
                ) || response.data.categories[0];
              } else if (!selectedCategory) {
                categoryToSelect = response.data.categories[0];
              }

              if (categoryToSelect) {
                setSelectedCategory(categoryToSelect);
                setFilteredItems(categoryToSelect.items || []);
              }
            }
          }
        } catch (error) {
          console.error('Error fetching categories:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchCategories();
    }
  }, [selectedCompany, language, highlightedCategory]);

  useEffect(() => {
    if (highlightedCategory && categories.length > 0) {
      const categoryToSelect = categories.find(cat =>
        cat.name.toLowerCase() === highlightedCategory.name.toLowerCase()
      );

      if (categoryToSelect) {
        setSelectedCategory(categoryToSelect);
        setFilteredItems(categoryToSelect.items || []);
        setCategorySearchQuery('');

        setTimeout(() => {
          const categoryElement = document.getElementById('category-section');
          if (categoryElement) {
            categoryElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
              inline: 'nearest'
            });
          }
        }, 100);
      }
    }
  }, [highlightedCategory, categories]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCategorySearchQuery('');
    setFilteredItems(category.items || []);
  };

  const handleCategorySearch = (query) => {
    setCategorySearchQuery(query);

    if (!selectedCategory || !selectedCategory.items) {
      setFilteredItems([]);
      return;
    }

    if (!query.trim()) {
      setFilteredItems(selectedCategory.items);
      return;
    }

    const filtered = selectedCategory.items.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredItems(filtered);
  };

  const clearCategorySearch = () => {
    setCategorySearchQuery('');
    setFilteredItems(selectedCategory?.items || []);
  };
  const getFilteredItems = (items) => {
    if (!aiDietaryPreferences || !items) return items;
    return aiDietaryAnalyzer.filterItems(items, aiDietaryPreferences);
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-10 w-24 rounded-full flex-shrink-0"></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-40 sm:h-48 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16 px-4">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Utensils className="w-10 h-10 sm:w-12 sm:h-12 text-blue-700" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{t('categories.no_categories')}</h3>
          <p className="text-gray-500 text-sm sm:text-base">{t('categories.check_back')}</p>
        </div>
      </div>
    );
  }

  return (
    <div id="category-section" className="space-y-8">
      <div className="relative">
        <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
          {categories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className={`group relative flex items-center space-x-3 px-4 sm:px-6 py-3 sm:py-4 rounded-full transition-all duration-300 flex-shrink-0 ${selectedCategory?.id === category.id
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 shadow-md hover:shadow-lg'
                }`}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
              />
              <div className="text-left">
                <div className="font-semibold text-sm sm:text-base whitespace-nowrap category-name">
                  {category.name}
                </div>
                <div className={`text-xs ${selectedCategory?.id === category.id ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                  {category.items_count || category.items?.length || 0} {t('categories.items')}
                </div>
              </div>
              {selectedCategory?.id === category.id && (
                <ArrowRight className="w-4 h-4 ml-2 animate-pulse" />
              )}
            </button>
          ))}
        </div>
      </div>

      {selectedCategory && (
        <div id="category-items" className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={categorySearchQuery}
                onChange={(e) => handleCategorySearch(e.target.value)}
                placeholder={`${t('search.placeholder')} ${selectedCategory.name}...`}
                className="block w-full pl-8 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              />
              {categorySearchQuery && (
                <button
                  onClick={clearCategorySearch}
                  className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            {categorySearchQuery && (
              <p className="mt-2 text-sm text-gray-600">
                {filteredItems.length} {filteredItems.length === 1 ? t('categories.item') : t('categories.items')} {t('search.items_found')}
              </p>
            )}
          </div>

          {filteredItems && filteredItems.length > 0 ? (
            <MenuGrid
              items={getFilteredItems(filteredItems)}
              onItemClick={onItemClick}
              onAddToCart={onAddToCart}
              showTags={true}
            />

          ) : (
            <div className="text-center py-8 px-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">
                {categorySearchQuery
                  ? t('search.no_items')
                  : t('categories.no_items_in_category')
                }
              </p>
              {categorySearchQuery && (
                <p className="text-gray-400 mt-2 text-sm">
                  {t('search.try_adjusting')}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}