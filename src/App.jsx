import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { RestaurantSelectionPage } from './components/RestaurantSelectionPage';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { MenuPage } from './components/MenuPage';
import { SearchResultsPage } from './components/SearchResultsPage';
import { ItemDetailModal } from './components/ItemDetailModal';
import { AIDietaryFilter } from './components/AIDietaryFilter';
import { useCart } from './hooks/useCart';
import { apiService } from './services/api';
import { aiDietaryAnalyzer } from './services/aiDietaryAnalyzer';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [itemWithIngredients, setItemWithIngredients] = useState(null);
  const [isLoadingItemDetails, setIsLoadingItemDetails] = useState(false);
  const [highlightedCategory, setHighlightedCategory] = useState(null);
  const [isAIFilterOpen, setIsAIFilterOpen] = useState(false);
  const [aiDietaryPreferences, setAiDietaryPreferences] = useState(null);
  const { addToCart, toggleCart } = useCart();

  useEffect(() => {
    if (selectedCompany) {
      const fetchCompanyInfo = async () => {
        try {
          const response = await apiService.getCompanyInfo(selectedCompany.id);
          if (response.success) {
            setCompanyInfo(response.data.company);
          }
        } catch (error) {
          console.error('Error fetching company info:', error);
        }
      };
      fetchCompanyInfo();
    }
  }, [selectedCompany]);

    useEffect(() => {
    aiDietaryAnalyzer.loadCacheFromJson();
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentView('menu');
  };

  const handleCategorySelectFromRestaurant = (category) => {
    setHighlightedCategory(category);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedCategory(null);
    setHighlightedCategory(null);
  };

  const handleItemClick = (item) => {
    setIsLoadingItemDetails(true);
    fetchItemWithIngredients(item);
  };

  const fetchItemWithIngredients = async (item) => {
    if (!selectedCompany) {
      setSelectedItem(item);
      setItemWithIngredients(null);
      setIsItemModalOpen(true);
      setIsLoadingItemDetails(false);
      return;
    }
    
    try {
      const response = await apiService.getItemsWithIngredients(selectedCompany.id);
      if (response.success) {
        const foundItem = response.data.find((itemData) => itemData.item.id === item.id);
        setItemWithIngredients(foundItem || null);
      } else {
        setItemWithIngredients(null);
      }
    } catch (error) {
      setItemWithIngredients(null);
    } finally {
      setSelectedItem(item);
      setIsItemModalOpen(true);
      setIsLoadingItemDetails(false);
    }
  };

  const handleAddToCart = (item, selectedIngredients = {}) => {
    addToCart(item, selectedIngredients);
  };

  const handleMenuClick = () => {
    if (currentView === 'menu') {
      handleBackToHome();
    } else {
      setCurrentView('home');
    }
  };

  const handleSearchClick = () => {
    setCurrentView('search');
  };
  
  const handleAIFilterClick = () => {
    setIsAIFilterOpen(true);
  };
  
  const handleAIFilterChange = (preferences) => {
    setAiDietaryPreferences(preferences);
  };

  const handleRestaurantSelectionClick = () => {
    setSelectedCompany(null);
    setSelectedCategory(null);
    setHighlightedCategory(null);
    setCurrentView('home');
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gray-50">
        {!selectedCompany ? (
          <RestaurantSelectionPage
            onRestaurantSelect={setSelectedCompany}
            selectedCompany={selectedCompany}
            onCategorySelect={handleCategorySelectFromRestaurant}
          />
        ) : (
          <>
            <Header 
              onMenuClick={handleMenuClick} 
              onCartClick={toggleCart}
              onSearchClick={handleSearchClick}
              onAIFilterClick={handleAIFilterClick}
              selectedCompany={selectedCompany}
              companyInfo={companyInfo}
              onRestaurantSelectionClick={handleRestaurantSelectionClick}
              currentView={currentView}
            />
            
            {currentView === 'home' && (
              <HomePage 
                onCategoryClick={handleCategoryClick}
                selectedCompany={selectedCompany}
                companyInfo={companyInfo}
                onItemClick={handleItemClick}
                onAddToCart={handleAddToCart}
                highlightedCategory={highlightedCategory}
                onCategorySelect={handleCategorySelectFromRestaurant}
                aiDietaryPreferences={aiDietaryPreferences}
              />
            )}
            
            {currentView === 'menu' && selectedCategory && (
              <MenuPage
                category={selectedCategory}
                onBack={handleBackToHome}
                onItemClick={handleItemClick}
                onAddToCart={handleAddToCart}
                aiDietaryPreferences={aiDietaryPreferences}
              />
            )}
            
            {currentView === 'search' && (
              <SearchResultsPage
                onBack={handleBackToHome}
                onItemClick={handleItemClick}
                onAddToCart={handleAddToCart}
                selectedCompany={selectedCompany}
              />
            )}
            
            {selectedItem && (
              <ItemDetailModal
                item={selectedItem}
                itemWithIngredients={itemWithIngredients}
                isOpen={isItemModalOpen}
                onClose={() => {
                  setIsItemModalOpen(false);
                  setSelectedItem(null);
                  setItemWithIngredients(null);
                }}
                onAddToCart={handleAddToCart}
                selectedCompany={selectedCompany}
              />
            )}            
            
            <AIDietaryFilter
              isOpen={isAIFilterOpen}
              onClose={() => setIsAIFilterOpen(false)}
              onFilterChange={handleAIFilterChange}
            />
          </>
        )}
      </div>
    </LanguageProvider>
  );
}

export default App;