import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, X, Send, Lightbulb, Filter, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function AIDietaryFilter({ onFilterChange, isOpen, onClose }) {
  const [userMessage, setUserMessage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentPreferences, setCurrentPreferences] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [quickFilters, setQuickFilters] = useState([]);
  const { t } = useLanguage();

  const API_BASE_URL = '';

  useEffect(() => {
    setQuickFilters([
      { id: 'vegetarian', label: t('ai.vegetarian_only'), message: t('ai.msg_vegetarian'), icon: '🥬' },
      { id: 'vegan', label: t('ai.vegan_only'), message: t('ai.msg_vegan'), icon: '🌱' },
      { id: 'no-meat', label: t('ai.no_meat'), message: t('ai.msg_no_meat'), icon: '🚫🥩' },
      { id: 'meat-only', label: t('ai.meat_only'), message: t('ai.msg_meat_only'), icon: '🥩' },
      { id: 'chicken-only', label: t('ai.chicken_only'), message: t('ai.msg_chicken_only'), icon: '🍗' },
      { id: 'seafood-only', label: t('ai.seafood_only'), message: t('ai.msg_seafood_only'), icon: '🐟' },
      { id: 'gluten-free', label: t('ai.gluten_free'), message: t('ai.msg_gluten_free'), icon: '🚫🌾' }
    ]);
  }, [t]);

  const handleAnalyze = async () => {
    if (!userMessage.trim()) return;

    setIsAnalyzing(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/ai-dietary-filter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage })
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`HTTP ${res.status}: ${err}`);
      }

      const data = await res.json();
      const preferences = data.preferences || {};

      setCurrentPreferences(preferences);
      setSuggestions([]); 
      onFilterChange(preferences);

    } catch (error) {
      console.error('Error analyzing dietary preferences:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleQuickFilter = (filter) => {
    const isCurrentlyActive = isFilterActive(filter.id);
    
    if (isCurrentlyActive) {
      const filterKey = getFilterKey(filter.id);
      const updatedPreferences = { ...currentPreferences };
      delete updatedPreferences[filterKey];
      
      const hasActiveFilters = Object.values(updatedPreferences).some(value => value === true);
      const finalPreferences = hasActiveFilters ? updatedPreferences : null;
      
      setCurrentPreferences(finalPreferences);
      onFilterChange(finalPreferences);
      
      if (finalPreferences) {
        const activeFilters = getActiveFilterMessages(finalPreferences);
        setUserMessage(activeFilters.join(' and '));
      } else {
        setUserMessage('');
      }
    } else {
      const quickPreferences = getQuickFilterPreferences(filter.id);
      if (quickPreferences) {
        const mergedPreferences = {
          ...currentPreferences,
          ...quickPreferences
        };
        setCurrentPreferences(mergedPreferences);
        onFilterChange(mergedPreferences);

        const activeFilters = getActiveFilterMessages(mergedPreferences);
        setUserMessage(activeFilters.join(' and '));
      }
    }
  };

  const getActiveFilterMessages = (preferences) => {
    const messages = [];
    if (preferences?.onlyVegetarian) messages.push('show me vegetarian dishes');
    if (preferences?.onlyVegan) messages.push('show me vegan dishes');
    if (preferences?.onlyMeat) messages.push('show me dishes with meat');
    if (preferences?.onlyChicken) messages.push('show me chicken dishes');
    if (preferences?.onlyFishSeafood) messages.push('show me seafood dishes');
    if (preferences?.excludeMeat) messages.push('exclude meat dishes');
    if (preferences?.excludeChicken) messages.push('exclude chicken dishes');
    if (preferences?.excludeFishSeafood) messages.push('exclude seafood dishes');
    if (preferences?.excludeGluten) messages.push('exclude gluten');
    return messages;
  };

  const getQuickFilterPreferences = (filterId) => {
    const preferencesMap = {
      'vegetarian': { onlyVegetarian: true },
      'vegan': { onlyVegan: true },
      'no-meat': { excludeMeat: true },
      'meat-only': { onlyMeat: true },
      'chicken-only': { onlyChicken: true },
      'seafood-only': { onlyFishSeafood: true },
      'gluten-free': { excludeGluten: true }
    };
    return preferencesMap[filterId] || null;
  };

  const getFilterKey = (filterId) => {
    const keyMap = {
      'vegetarian': 'onlyVegetarian',
      'vegan': 'onlyVegan',
      'no-meat': 'excludeMeat',
      'meat-only': 'onlyMeat',
      'chicken-only': 'onlyChicken',
      'seafood-only': 'onlyFishSeafood',
      'gluten-free': 'excludeGluten'
    };
    return keyMap[filterId];
  };

  const handleAnalyzeMessage = async (message) => {
    setIsAnalyzing(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/ai-dietary-filter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage: message })
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`HTTP ${res.status}: ${err}`);
      }

      const data = await res.json();
      const preferences = data.preferences || {};
      setCurrentPreferences(preferences);
      setSuggestions([]);
      onFilterChange(preferences);

    } catch (error) {
      console.error('Error analyzing dietary preferences:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClearFilter = () => {
    setUserMessage('');
    setCurrentPreferences(null);
    setSuggestions([]);
    onFilterChange(null);
  };

  const isFilterActive = (filterId) => {
    if (!currentPreferences) return false;
    
    const filterMap = {
      'vegetarian': currentPreferences.onlyVegetarian,
      'vegan': currentPreferences.onlyVegan,
      'no-meat': currentPreferences.excludeMeat,
      'meat-only': currentPreferences.onlyMeat,
      'chicken-only': currentPreferences.onlyChicken,
      'seafood-only': currentPreferences.onlyFishSeafood,
      'gluten-free': currentPreferences.excludeGluten
    };
    
    return filterMap[filterId] || false;
  };

  const getPreferencesSummary = () => {
    if (!currentPreferences) return null;
    const active = [];
    if (currentPreferences.onlyVegetarian) active.push(t('ai.vegetarian_only'));
    if (currentPreferences.onlyVegan) active.push(t('ai.vegan_only'));
    if (currentPreferences.onlyMeat) active.push(t('ai.meat_only'));
    if (currentPreferences.onlyChicken) active.push(t('ai.chicken_only'));
    if (currentPreferences.onlyFishSeafood) active.push(t('ai.seafood_only'));
    if (currentPreferences.excludeMeat) active.push(t('ai.no_meat'));
    if (currentPreferences.excludeChicken) active.push('No Chicken');
    if (currentPreferences.excludeFishSeafood) active.push('No Seafood');
    if (currentPreferences.excludeGluten) active.push(t('ai.gluten_free'));
    return active;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
      <div className="bg-white w-full sm:max-w-md h-full overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 bg-white/20 rounded-full mr-3">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">{t('ai.title')}</h2>
              <p className="text-sm opacity-90">{t('ai.subtitle')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center mb-1">
              <Sparkles className="w-5 h-5 text-purple-600 mr-2" />
              <h3 className="font-semibold text-gray-900">{t('ai.tell_preferences')}</h3>
            </div>
          </div>
          <div>
            <div className="flex items-center mb-3">
              <Filter className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-gray-900">{t('ai.quick_filters')}</h3>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {quickFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => handleQuickFilter(filter)}
                  className={`p-3 border rounded-lg transition-all duration-200 text-left ${
                    isFilterActive(filter.id)
                      ? 'bg-blue-100 border-blue-300 text-blue-800'
                      : 'bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300'
                  }`}
                >
                  <div className="text-lg mb-1">{filter.icon}</div>
                  <div className="text-sm font-medium">{filter.label}</div>
                  {isFilterActive(filter.id) && (
                    <div className="text-xs text-blue-600 mt-1">✓ Active</div>
                  )}
                </button>
              ))}
            </div>
            
            <div className="mt-3 text-center">
              <button
                onClick={handleClearFilter}
                className="text-xs text-gray-500 hover:text-red-600 transition-colors font-medium hover:bg-red-50 px-3 py-1 rounded-full"
              >
                Clear All Selections
              </button>
            </div>
          </div>

          <div className="hidden">
            <div className="flex items-center mb-3">
              <Filter className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-gray-900">{t('ai.quick_filters')}</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {quickFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => handleQuickFilter(filter)}
                  className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 text-left"
                >
                  <div className="text-lg mb-1">{filter.icon}</div>
                  <div className="text-sm font-medium text-gray-900">{filter.label}</div>
                </button>
              ))}
            </div>
          </div>

          {currentPreferences && (
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <div className="flex items-center mb-3">
                <Check className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="font-semibold text-gray-900">{t('ai.active_filters')}</h3>
              </div>
              
              <div className="space-y-2">
                {getPreferencesSummary()?.map((pref, index) => (
                  <div key={index} className="flex items-center bg-white rounded-lg px-3 py-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium text-gray-700">{pref}</span>
                  </div>
                ))}
              </div>
              
              <button
                onClick={handleClearFilter}
                className="mt-3 w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {t('ai.clear_filters')}
              </button>
            </div>
          )}

          {suggestions.length > 0 && (
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
              <div className="flex items-center mb-3">
                <Lightbulb className="w-5 h-5 text-amber-600 mr-2" />
                <h3 className="font-semibold text-gray-900">{t('ai.suggestions')}</h3>
              </div>
              
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="bg-white rounded-lg p-3">
                    <p className="text-sm text-gray-700">{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-2">{t('ai.how_it_works')}</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>{t('ai.works_1')}</p>
              <p>{t('ai.works_2')}</p>
              <p>{t('ai.works_3')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}