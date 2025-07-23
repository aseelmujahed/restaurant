import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function SearchBar({ onSearch, onFilterToggle, searchQuery, isFilterOpen }) {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const { t } = useLanguage();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(localQuery);
  };

  const handleClear = () => {
    setLocalQuery('');
    onSearch('');
  };

  return (
    <div className="bg-white shadow-sm border-b sticky top-14 sm:top-16 z-30">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-3 sm:py-4">
          <form onSubmit={handleSubmit} className="flex items-center gap-2 sm:gap-4">

          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder={t('search.placeholder')}
              className="block w-full pl-8 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-800 focus:border-blue-800 text-sm sm:text-base"
            />
            {localQuery && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-600 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base whitespace-nowrap"
          >
            {t('nav.search')}
          </button>
          
          <button
            type="button"
            onClick={onFilterToggle}
            className={`p-2 sm:p-3 rounded-lg border transition-colors ${
              isFilterOpen 
                ? 'bg-blue-50 border-blue-300 text-blue-700' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}