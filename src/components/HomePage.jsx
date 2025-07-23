import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Slider } from './Slider';
import { PopularItems } from './PopularItems';
import { NewItems } from './NewItems';
import { CategoryGrid } from './CategoryGrid';
import { CompanyInfo } from './CompanyInfo';

export function HomePage({ onCategoryClick, selectedCompany, onItemClick, companyInfo, highlightedCategory, onCategorySelect, aiDietaryPreferences }) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      <Slider selectedCompany={selectedCompany} />
      
      <PopularItems 
        selectedCompany={selectedCompany}
        onItemClick={onItemClick}
        aiDietaryPreferences={aiDietaryPreferences}
      />
      
      <NewItems 
        selectedCompany={selectedCompany}
        onItemClick={onItemClick}
        aiDietaryPreferences={aiDietaryPreferences}
      />
      
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('home.explore_menu')}
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            {t('home.discover_dishes')}
          </p>
        </div>
        
        <CategoryGrid 
          onCategoryClick={onCategoryClick} 
          selectedCompany={selectedCompany}
          onItemClick={onItemClick}
          highlightedCategory={highlightedCategory}
          aiDietaryPreferences={aiDietaryPreferences}
        />
      </div>
      
      <CompanyInfo company={companyInfo || selectedCompany} />
    </div>
  );
}