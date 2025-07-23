import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock, Star, ArrowLeft, Building2, ChevronRight, Grid3X3, Phone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { apiService } from '../services/api';

export function RestaurantSelectionPage({ onRestaurantSelect, selectedCompany, onCategorySelect }) {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [restaurantCategories, setRestaurantCategories] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { t, language } = useLanguage();

  useEffect(() => {
    fetchRestaurants();
  }, [language]);

  useEffect(() => {
    filterRestaurants();
  }, [searchQuery, restaurants]);

  const fetchRestaurants = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getAllCompanies();
      if (response.success) {
        setRestaurants(response.data.companies);
        setFilteredRestaurants(response.data.companies);
        await fetchCategoriesForRestaurants(response.data.companies);
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategoriesForRestaurants = async (restaurants) => {
    const categoriesData = {};
    for (const restaurant of restaurants) {
      try {
        const response = await apiService.getCategoriesWithItems(restaurant.id, language);
        if (response.success && response.data.categories) {
          const categories = response.data.categories;
          const shuffled = [...categories].sort(() => 0.5 - Math.random());
          categoriesData[restaurant.id] = {
            preview: shuffled.slice(0, 3),
            all: categories,
            total: categories.length
          };
        }
      } catch (error) {
      }
    }
    setRestaurantCategories(categoriesData);
  };

  const filterRestaurants = () => {
    if (!searchQuery.trim()) {
      setFilteredRestaurants(restaurants);
      return;
    }

    const filtered = restaurants.filter(restaurant =>
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.subdomain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (restaurant.settings?.address && restaurant.settings.address.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredRestaurants(filtered);
  };

  const handleRestaurantSelect = (restaurant) => {
    onRestaurantSelect(restaurant);
  };

  const handleCategoryClick = (restaurant, category, e) => {
    e.stopPropagation();
    onRestaurantSelect(restaurant);
    if (onCategorySelect) {
      onCategorySelect(category);
    }
  };

  const toggleCategoryExpansion = (restaurantId, e) => {
    e.stopPropagation();
    setExpandedCategories(prev => ({
      ...prev,
      [restaurantId]: !prev[restaurantId]
    }));
  };
  const getCurrentDayStatus = (restaurant) => {
    if (!restaurant.settings?.working_hours) return null;

    try {
      const workingHours = JSON.parse(restaurant.settings.working_hours);
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      const todayHours = workingHours[today];

      if (!todayHours || !todayHours.from || !todayHours.to) {
        return { isOpen: false, status: t('company.closed_today') };
      }

      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      const [fromHour, fromMin] = todayHours.from.split(':').map(Number);
      const [toHour, toMin] = todayHours.to.split(':').map(Number);

      const openTime = fromHour * 60 + fromMin;
      const closeTime = toHour * 60 + toMin;

      const isOpen = currentTime >= openTime && currentTime <= closeTime;

      return {
        isOpen,
        status: isOpen ? t('company.open_now') : t('company.closed_now'),
        hours: `${todayHours.from} - ${todayHours.to}`
      };
    } catch (error) {
      return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6">
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-lg p-6">
                <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 shadow-xl">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-full">
                <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-white flex-shrink-0" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-3xl font-bold text-white drop-shadow-lg">{t('restaurants.title')}</h1>
                <p className="text-white/90 text-sm sm:text-base drop-shadow">
                  {t('restaurants.subtitle')} ({filteredRestaurants.length} {t('restaurants.found')})
                </p>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-1">
              <LanguageSelector />
            </div>
          </div>

          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('restaurants.search_placeholder')}
              className="block w-full pl-8 sm:pl-10 pr-3 py-3 sm:py-4 border-0 rounded-xl leading-5 bg-white/95 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-4 focus:ring-white/50 focus:bg-white text-sm sm:text-base shadow-lg transition-all duration-300"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
        
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-8">
        {filteredRestaurants.length === 0 ? (
          <div className="text-center py-12 sm:py-16 px-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
              <Building2 className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500" />
            </div>
            <div className="text-gray-600 text-lg sm:text-xl font-semibold mb-2">
              {searchQuery ? t('restaurants.no_results') : t('restaurants.no_restaurants')}
            </div>
            <p className="text-gray-500 text-sm sm:text-base">
              {searchQuery ? t('restaurants.try_different_search') : t('restaurants.check_back_later')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredRestaurants.map((restaurant) => {
              const dayStatus = getCurrentDayStatus(restaurant);
              const isSelected = selectedCompany?.id === restaurant.id;

              return (
                <div
                  key={restaurant.id}
                  onClick={() => handleRestaurantSelect(restaurant)}
                  className={`group cursor-pointer bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:rotate-1 ${isSelected ? 'ring-4 ring-blue-400 bg-gradient-to-br from-blue-50 to-purple-50 shadow-blue-200/50' : 'hover:bg-white'}`}
                  style={{
                    animationDelay: `${filteredRestaurants.indexOf(restaurant) * 100}ms`,
                  }}
                >
                  <div className="h-2 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400"></div>
                  
                  <div className="p-5 sm:p-7">
                    <div className="flex items-start space-x-3 sm:space-x-4 mb-4">
                      {restaurant.settings?.logo ? (
                        <img
                          src={restaurant.settings.logo}
                          alt={restaurant.name}
                          className="w-14 h-14 sm:w-18 sm:h-18 rounded-full object-cover flex-shrink-0 ring-4 ring-white shadow-lg group-hover:ring-blue-200 transition-all duration-300"
                        />
                      ) : (
                        <div className="w-14 h-14 sm:w-18 sm:h-18 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 ring-4 ring-white shadow-lg group-hover:ring-blue-200 transition-all duration-300">
                          <Building2 className="w-7 h-7 sm:w-9 sm:h-9 text-white" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300 truncate capitalize-names">
                          {restaurant.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-blue-600 font-medium truncate">@{restaurant.subdomain}</p>

                        {dayStatus && (
                          <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold mt-2 shadow-sm ${dayStatus.isOpen
                              ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200'
                              : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200'
                            }`}>
                            <div className={`w-2 h-2 rounded-full mr-2 animate-pulse ${dayStatus.isOpen ? 'bg-green-500' : 'bg-red-500'
                              }`}></div>
                            {dayStatus.status}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {restaurant.settings?.address && (
                        <div className="flex items-center text-xs sm:text-sm text-gray-600">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0 text-blue-500" />
                          <span className="truncate">{restaurant.settings.address}</span>
                        </div>
                      )}

                      {dayStatus?.hours && (
                        <div className="flex items-center text-xs sm:text-sm text-gray-600">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0 text-blue-500" />
                          <span>{dayStatus.hours}</span>
                        </div>
                      )}

                      {restaurant.settings?.phone_number && (
                        <div className="flex items-center text-xs sm:text-sm text-gray-600">
                          <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0 text-green-500" />
                          <span>{restaurant.settings.phone_number}</span>
                        </div>
                      )}
                    </div>

                    {restaurant.settings?.slogan && (
                      <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-gradient-to-r from-blue-100 to-purple-100">
                        <p className="text-xs sm:text-sm text-gray-600 italic line-clamp-2 bg-gradient-to-r from-gray-600 to-gray-500 bg-clip-text text-transparent">
                          "{restaurant.settings.slogan}"
                        </p>
                      </div>
                    )}

                    {restaurantCategories[restaurant.id] && (
                      <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-blue-100">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xs sm:text-sm font-semibold text-gray-800 flex items-center">
                            <Grid3X3 className="w-3 h-3 mr-1 text-blue-500" />
                            {t('categories.categories')} ({restaurantCategories[restaurant.id].total})
                          </h4>
                          {restaurantCategories[restaurant.id].total > 3 && (
                            <button
                              onClick={(e) => toggleCategoryExpansion(restaurant.id, e)}
                              className="flex items-center text-xs text-blue-600 hover:text-blue-700 transition-colors font-medium hover:bg-blue-50 px-2 py-1 rounded-full"
                            >
                              {expandedCategories[restaurant.id] ? (
                                <>
                                  {t('categories.show_less')}
                                  <ChevronRight className="w-3 h-3 ml-1 transform rotate-90 transition-transform" />
                                </>
                              ) : (
                                <>
                                  {t('categories.show_all')}
                                  <ChevronRight className="w-3 h-3 ml-1 transition-transform" />
                                </>
                              )}
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {(expandedCategories[restaurant.id]
                            ? restaurantCategories[restaurant.id].all
                            : restaurantCategories[restaurant.id].preview
                          ).map((category) => (
                            <div
                              key={category.id}
                              onClick={(e) => handleCategoryClick(restaurant, category, e)}
                              className="flex items-center space-x-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl hover:from-blue-100 hover:to-purple-100 transition-all duration-300 cursor-pointer transform hover:scale-105 border border-blue-100 hover:border-blue-200 shadow-sm hover:shadow-md"
                            >
                              <img
                                src={category.image}
                                alt={category.name}
                                className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-2 ring-white shadow-sm"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-gray-900 truncate category-name">
                                  {category.name}
                                </p>
                                <p className="text-xs text-blue-600 font-medium">
                                  {category.items_count || category.items?.length || 0} {t('categories.items')}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {!expandedCategories[restaurant.id] && restaurantCategories[restaurant.id].total > 3 && (
                          <div className="mt-2 text-center">
                            <button
                              onClick={(e) => toggleCategoryExpansion(restaurant.id, e)}
                              className="text-xs text-gray-500 hover:text-blue-600 transition-colors font-medium hover:bg-blue-50 px-3 py-1 rounded-full"
                            >
                              +{restaurantCategories[restaurant.id].total - 3} {t('categories.more_categories')}
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {isSelected && (
                      <div className="mt-4 sm:mt-5 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs sm:text-sm font-bold py-2 px-4 rounded-full shadow-lg">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-2 fill-current" />
                        <span className="uppercase tracking-wide">{t('restaurants.currently_selected')}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}