import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { MenuGrid } from './MenuGrid';
import { SearchBar } from './SearchBar';
import { FilterPanel } from './FilterPanel';
import { apiService } from '../services/api';

export function SearchResultsPage({
  onBack,
  onItemClick,
  selectedCompany,
  initialQuery = '',
}) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState('price');
  const [sortOrder, setSortOrder] = useState('asc');
  const { t, language } = useLanguage();

  useEffect(() => {
    fetchCategories();
    fetchRestaurants();
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery, language]);

  useEffect(() => {
    if (selectedRestaurant === '') {
      setCategories(allCategories);
    } else {
      fetchCategoriesForRestaurant(selectedRestaurant);
    }
  }, [selectedRestaurant, allCategories, language]);

  useEffect(() => {
    if (selectedCompany && initialQuery) {
      if (initialQuery) {
        performSearch(initialQuery);
      }
    }
  }, [selectedCompany, language]);

  const fetchCategories = async () => {
    try {
      const response = await apiService.getAllCategories(language);
      if (response.success) {
        const deduplicatedCategories = deduplicateCategories(response.data.categories);
        setAllCategories(deduplicatedCategories);
        setCategories(deduplicatedCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchCategoriesForRestaurant = async (restaurantId) => {
    try {
      const response = await apiService.getCategoriesWithItems(restaurantId, language);
      if (response.success) {
        const deduplicatedCategories = deduplicateCategories(response.data.categories);
        setCategories(deduplicatedCategories);
      }
    } catch (error) {
      console.error('Error fetching restaurant categories:', error);
    }
  };

  const deduplicateCategories = (categories) => {
    const categoryMap = new Map();

    categories.forEach(category => {
      const normalizedName = category.name.toLowerCase().trim();

      if (categoryMap.has(normalizedName)) {
        const existing = categoryMap.get(normalizedName);

        if (!existing.combinedIds) {
          existing.combinedIds = [existing.id];
        }
        existing.combinedIds.push(category.id);

        if (category.items && existing.items) {
          existing.items = [...existing.items, ...category.items];
          existing.items_count = existing.items.length;
        } else if (category.items && !existing.items) {
          existing.items = category.items;
          existing.items_count = category.items.length;
        }

        if (category.items_count) {
          existing.items_count = (existing.items_count || 0) + category.items_count;
        }
      } else {
        const newCategory = { ...category };
        newCategory.combinedIds = [category.id];
        categoryMap.set(normalizedName, newCategory);
      }
    });

    return Array.from(categoryMap.values());
  };

  const fetchRestaurants = async () => {
    try {
      const response = await apiService.getAllCompanies();
      if (response.success) {
        setRestaurants(response.data.companies);
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  const performSearch = async (query) => {
    setIsLoading(true);
    try {
      let categoryIds = undefined;
      if (selectedCategory) {
        const selectedCategoryObj = categories.find(cat => cat.id === selectedCategory);
        if (selectedCategoryObj && selectedCategoryObj.combinedIds) {
          categoryIds = selectedCategoryObj.combinedIds;
        } else {
          categoryIds = [selectedCategory];
        }
      }

      const searchParams = {
        search: query,
        companyId: selectedRestaurant && selectedRestaurant !== '' ? selectedRestaurant : undefined,
        categoryIds: categoryIds,
        minPrice: minPrice > 0 ? minPrice : undefined,
        maxPrice: maxPrice < 1000 ? maxPrice : undefined,
        sortBy,
        sortOrder,
        lang: language
      };

      const response = await apiService.searchItems({
        search: query,
        companyId: selectedRestaurant && selectedRestaurant !== '' ? selectedRestaurant : undefined,
        categoryIds: categoryIds,
        minPrice: minPrice > 0 ? minPrice : undefined,
        maxPrice: maxPrice < 1000 ? maxPrice : undefined,
        sortBy,
        sortOrder,
        lang: language
      });

      if (response.success) {
        const itemsData = Array.isArray(response.data) ? response.data : (response.data.items || response.data.all_items || []);
        setItems(Array.isArray(itemsData) ? itemsData : []);
      }
    } catch (error) {
      console.error('Error searching items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    performSearch(query);
  };

  const handleApplyFilters = () => {
    performSearch(searchQuery);
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    setSelectedCategory('');
    setSelectedRestaurant('');
    setMinPrice(0);
    setMaxPrice(1000);
    setSortBy('price');
    setSortOrder('asc');
    performSearch(searchQuery);
    setIsFilterOpen(false);
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
              <span className="text-sm sm:text-base">{t('nav.back_to_menu')}</span>
            </button>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <Search className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0" />
            <div className="min-w-0">
              <h1 className="text-xl sm:text-3xl font-bold text-gray-900">{t('search.title')}</h1>
              <p className="text-gray-600 text-sm sm:text-base">
                {searchQuery ? `${t('search.results_for')} "${searchQuery}"` : t('search.browse_all')}
                {items.length > 0 && ` (${items.length} ${t('search.items_found')})`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <SearchBar
        onSearch={handleSearch}
        onFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
        searchQuery={searchQuery}
        isFilterOpen={isFilterOpen}
      />

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-8 sm:py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-40 sm:h-48 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-8 sm:py-12 px-4">
            <Search className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-300 mb-4" />
            <div className="text-gray-500 text-base sm:text-lg">
              {searchQuery ? t('search.no_items') : t('search.start_searching')}
            </div>
            <p className="text-gray-400 mt-2 text-sm sm:text-base">
              {searchQuery ? t('search.try_adjusting') : t('search.enter_search')}
            </p>
          </div>
        ) : (
          <MenuGrid
            items={items}
            onItemClick={onItemClick}
            showTags={true}
          />
        )}
      </div>

      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        categories={categories}
        restaurants={restaurants}
        selectedCategory={selectedCategory}
        selectedRestaurant={selectedRestaurant}
        onCategoryChange={setSelectedCategory}
        onRestaurantChange={setSelectedRestaurant}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onPriceChange={(min, max) => {
          setMinPrice(min);
          setMaxPrice(max);
        }}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={(sort, order) => {
          setSortBy(sort);
          setSortOrder(order);
        }}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />
    </div>
  );
}