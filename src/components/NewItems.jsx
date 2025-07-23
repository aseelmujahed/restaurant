import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Plus, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { apiService } from '../services/api';
import { DietaryTags } from './DietaryTags';
import { aiDietaryAnalyzer } from '../services/aiDietaryAnalyzer';

export function NewItems({ selectedCompany, onItemClick, onAddToCart, aiDietaryPreferences }) {
  const [newItems, setNewItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);
  const { t, language, isRTL } = useLanguage();

  const getFilteredItems = (items) => {
    if (!aiDietaryPreferences || !items) return items;
    return aiDietaryAnalyzer.filterItems(items, aiDietaryPreferences);
  };
  const filteredItems = getFilteredItems(newItems);

  useEffect(() => {
    if (selectedCompany) {
      const fetchNewItems = async () => {
        setIsLoading(true);
        try {
          const response = await apiService.getNewItems(selectedCompany.id, 10, language);
          if (response.success) {
            setNewItems(response.data.new_items);
          }
        } catch (error) {
        } finally {
          setIsLoading(false);
        }
      };

      fetchNewItems();
    }
  }, [selectedCompany, language]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.setAttribute("dir", isRTL ? "rtl" : "ltr");

      const container = scrollContainerRef.current;
      const handleScroll = () => {
        if (!container) return;

        const itemWidth = container.children[0]?.offsetWidth || 0;
        const gap = 24;
        const scrollLeft = Math.abs(container.scrollLeft);
        const itemWithGap = itemWidth + gap;

        if (itemWithGap > 0) {
          const newIndex = Math.round(scrollLeft / itemWithGap);
          setCurrentIndex(newIndex);
        }
      };

      container.addEventListener('scroll', handleScroll);

      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, [language, isRTL, filteredItems.length]);

  const scrollToIndex = (index) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const itemWidth = container.children[0]?.offsetWidth || 0;
      const gap = 24;
      const scrollTo = index * (itemWidth + gap);

      container.scrollTo({
        left: isRTL ? -scrollTo : scrollTo,
        behavior: 'smooth'
      });

      setCurrentIndex(index);
    }
  };

  const scrollAmount = () => {
    const container = scrollContainerRef.current;
    const itemWidth = container?.children[0]?.offsetWidth || 0;
    const gap = 24;
    return itemWidth + gap;
  };

  const nextSlide = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const amount = scrollAmount();

    container.scrollBy({
      left: isRTL ? -amount : amount,
      behavior: 'smooth'
    });
  };

  const prevSlide = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const amount = scrollAmount();

    container.scrollBy({
      left: isRTL ? amount : -amount,
      behavior: 'smooth'
    });
  };

  const getVisibleItems = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 640) return 2;
      return 1;
    }
    return 3;
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-8 sm:py-12">
          <div className="flex items-center mb-6 sm:mb-8">
            <div className="animate-pulse">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded mr-3"></div>
            </div>
            <div className="animate-pulse">
              <div className="w-32 sm:w-48 h-6 sm:h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="flex space-x-6 overflow-hidden">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex-shrink-0 w-80">
                <div className="bg-gray-200 h-40 sm:h-48 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (newItems.length === 0) {
    return null;
  }

  const showNavigation = newItems.length > getVisibleItems();

  if (filteredItems.length === 0 && newItems.length > 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3 sm:mr-4">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-3xl font-bold text-gray-900">{t('home.new_items')}</h2>
              <p className="text-gray-800 mt-1 text-sm sm:text-base">{t('home.new_items_subtitle')}</p>
            </div>
          </div>
          {showNavigation && (
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <button
                onClick={isRTL ? nextSlide : prevSlide}
                className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 text-gray-800 hover:text-blue-800"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={isRTL ? prevSlide : nextSlide}
                className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 text-gray-800 hover:text-blue-800"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        <div className="relative carousel-wrapper">
          <div
            ref={scrollContainerRef}
            className={`flex overflow-x-auto scrollbar-hide scroll-smooth relative ${isRTL ? 'gap-x-reverse gap-4 sm:gap-6' : 'gap-4 sm:gap-6'}`}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', overflowY: 'visible' }}
          >
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform -translate-y-2 flex-shrink-0 w-72 sm:w-80"
              >
                <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10">
                  <div className="flex items-center bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                    <Clock className="w-3 h-3 mr-1" />
                    {t('home.new')}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(item);
                  }}
                  className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 hover:text-blue-800 p-1.5 sm:p-2 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110 opacity-0 group-hover:opacity-100"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <div className="relative h-40 sm:h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <div
                  className="p-4 sm:p-6 cursor-pointer"
                  onClick={() => onItemClick(item)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 group-hover:text-blue-800 transition-colors line-clamp-1 item-name">
                      {item.name}
                    </h3>
                    <span className="text-lg sm:text-2xl font-bold text-blue-800 ml-2">
                      ₪{item.price}
                    </span>
                  </div>

                  {item.description && (
                    <p className="text-gray-800 mb-3 sm:mb-4 line-clamp-2 text-xs sm:text-sm">
                      {item.description}
                    </p>
                  )}

                  <DietaryTags
                    foodName={item.name}
                    description={item.description}
                    showTags={true}
                    className="mb-2"
                  />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded-full text-xs category-name">
                        {item.category.name}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onItemClick(item);
                      }}
                      className="text-blue-800 hover:text-blue-700 text-xs sm:text-sm font-medium transition-colors"
                    >
                      {t('item.view_details')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {showNavigation && (
            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: Math.ceil(filteredItems.length / getVisibleItems()) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${Math.floor(currentIndex / getVisibleItems()) === index
                    ? 'bg-blue-700 w-6'
                    : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}