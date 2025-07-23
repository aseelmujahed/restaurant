import React, { useState, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { apiService } from '../services/api';

export function ItemDetailModal({ item, isOpen, onClose, onAddToCart, selectedCompany, itemWithIngredients }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedIngredients, setSelectedIngredients] = useState({});
  const { t, language } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setSelectedIngredients({});
      
      if (itemWithIngredients?.item_ingredients) {
        const defaultIngredients = {};
        Object.entries(itemWithIngredients.item_ingredients).forEach(([groupName, ingredients]) => {
          const defaultIngredient = ingredients.find(ing => ing.default_ingredient === 1);
          if (defaultIngredient) {
            defaultIngredients[groupName] = [defaultIngredient];
          }
        });
        setSelectedIngredients(defaultIngredients);
      } else if (item.ingredients && item.ingredients.length > 0) {
        const defaultIngredients = {};
        item.ingredients.forEach(ingredient => {
          if (ingredient.default_ingredient === 1) {
            const groupName = ingredient.category_name || 'Default';
            if (!defaultIngredients[groupName]) {
              defaultIngredients[groupName] = [];
            }
            defaultIngredients[groupName].push(ingredient);
          }
        });
        setSelectedIngredients(defaultIngredients);
      }
    }
  }, [isOpen, item, itemWithIngredients]);

  const handleIngredientChange = (groupName, ingredient, isSelected) => {
    setSelectedIngredients(prev => {
      const newSelected = { ...prev };
      
      if (ingredient.category_type === 'one_option') {
        newSelected[groupName] = isSelected ? [ingredient] : [];
      } else {
        if (!newSelected[groupName]) {
          newSelected[groupName] = [];
        }
        
        if (isSelected) {
          newSelected[groupName] = [...newSelected[groupName], ingredient];
        } else {
          newSelected[groupName] = newSelected[groupName].filter(ing => ing.id !== ingredient.id);
        }
      }
      
      return newSelected;
    });
  };

  const calculateTotalPrice = () => {
    let total = item.price;
    Object.values(selectedIngredients).flat().forEach(ingredient => {
      if (ingredient.extra_fee) {
        total += ingredient.extra_fee_cost || 0;
      }
    });
    return total * quantity;
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(item, selectedIngredients);
    }
    onClose();
  };

  const ingredientGroups = itemWithIngredients?.item_ingredients || {};
  
  const fallbackGroupedIngredients = item.ingredients?.reduce((groups, ingredient) => {
    const groupName = ingredient.category_name || 'Options';
    if (!groups[groupName]) {
      groups[groupName] = [];
    }
    groups[groupName].push(ingredient);
    return groups;
  }, {}) || {};
  
  const groupedIngredients = Object.keys(ingredientGroups).length > 0 
    ? ingredientGroups 
    : fallbackGroupedIngredients;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-3 sm:p-4 flex items-center justify-between">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900 truncate pr-2 item-name">{item.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-3 sm:p-6">
          <div className="mb-4 sm:mb-6">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 sm:h-64 object-cover rounded-lg"
            />
          </div>

          {item.description && (
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">{item.description}</p>
          )}

          {Object.keys(groupedIngredients).length > 0 && (
            <div className="space-y-4 sm:space-y-6">
              {Object.entries(groupedIngredients).map(([groupName, ingredients]) => (
                <div key={groupName} className="border rounded-lg p-3 sm:p-4">
                  <h3 className="font-semibold text-base sm:text-lg mb-3 text-gray-900">
                    {groupName}
                    <span className="text-xs sm:text-sm font-normal text-gray-500 ml-2">
                      ({ingredients[0].category_type === 'one_option' ? t('item.choose_one') : t('item.choose_multiple')})
                    </span>
                  </h3>
                  <div className="space-y-2">
                    {ingredients.map((ingredient) => {
                      const isSelected = selectedIngredients[groupName]?.some(ing => ing.id === ingredient.id) || false;
                      return (
                        <label
                          key={ingredient.id}
                          className={`flex items-center p-2 sm:p-3 rounded-lg border cursor-pointer transition-colors ${
                            isSelected ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <input
                            type={ingredients[0].category_type === 'one_option' ? 'radio' : 'checkbox'}
                            name={groupName}
                            checked={isSelected}
                            onChange={(e) => handleIngredientChange(groupName, ingredient, e.target.checked)}
                            className="sr-only"
                          />
                          <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 mr-2 sm:mr-3 ${
                            isSelected ? 'bg-blue-700 border-blue-700' : 'border-gray-300'
                          }`}>
                            {isSelected && <div className="w-full h-full bg-white rounded-full scale-50"></div>}
                          </div>
                          <span className="flex-1 text-gray-900 text-sm sm:text-base">{ingredient.name}</span>
                          {ingredient.extra_fee ? (
                            <span className="text-blue-800 font-medium text-sm sm:text-base">+₪{ingredient.extra_fee_cost || 0}</span>
                          ) : (
                            <span className="text-gray-500 text-sm sm:text-base">{t('item.free')}</span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 sm:mt-8 border-t pt-4 sm:pt-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="text-base sm:text-lg font-semibold text-gray-900">{t('cart.quantity')}</span>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 sm:p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                <span className="text-lg sm:text-xl font-semibold w-8 sm:w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1.5 sm:p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <span className="text-lg sm:text-xl font-bold text-gray-900">{t('cart.total')}</span>
              <span className="text-xl sm:text-2xl font-bold text-blue-800">₪{calculateTotalPrice()}</span>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base"
            >
              {t('item.add_to_cart')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}