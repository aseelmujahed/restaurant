import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { aiDietaryAnalyzer } from '../services/aiDietaryAnalyzer';

export function DietaryTags({ foodName, description, className = "", showTags = false }) {
  const { t } = useLanguage();
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchTags() {
      if (!showTags) {
        setTags([]);
        return;
      }

      const item = { name: foodName, description };

      let analysis = aiDietaryAnalyzer.getItemAnalysis(item);

      if (!analysis) {
        setIsLoading(true);
        await aiDietaryAnalyzer.analyzeItems([item]);
        analysis = aiDietaryAnalyzer.getItemAnalysis(item);
      }

      if (!analysis) {
        analysis = aiDietaryAnalyzer.getFallbackAnalysis(item);
      }

      const tagList = generateTagsFromAnalysis(analysis);
      setTags(tagList);
      setIsLoading(false);
    }

    fetchTags();
  }, [foodName, description, showTags]);


  const generateTagsFromAnalysis = (analysis) => {
    const tagList = [];
    if (analysis.isVegan) tagList.push({ label: 'Vegan', color: 'green', icon: '🌱' });
    else if (analysis.isVegetarian) tagList.push({ label: 'Vegetarian', color: 'emerald', icon: '🥬' });
    if (analysis.containsMeat) tagList.push({ label: 'Meat', color: 'red', icon: '🥩' });
    if (analysis.containsChicken) tagList.push({ label: 'Chicken', color: 'orange', icon: '🍗' });
    if (analysis.containsFishSeafood) tagList.push({ label: 'Seafood', color: 'blue', icon: '🐟' });
    if (analysis.notcontainsGluten) tagList.push({ label: 'Gluten Free', color: 'amber' });

    return tagList;
  };

  if (!showTags) {
    return null;
  }

  const getTagStyles = (color) => {
    const styles = {
      green: 'bg-green-100 text-green-800 border-green-200',
      emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      red: 'bg-red-100 text-red-800 border-red-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      amber: 'bg-amber-100 text-amber-800 border-amber-200',
    };
    return styles[color] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getLocalizedLabel = (label) => {
    const labelMap = {
      'Vegan': t('dietary.vegan'),
      'Vegetarian': t('dietary.vegetarian'),
      'Meat': t('dietary.meat'),
      'Chicken': t('dietary.chicken'),
      'Seafood': t('dietary.seafood'),
      'Gluten Free': t('dietary.glutenFree')
    };
    return labelMap[label] || label;
  };

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {tags.map((tag, index) => (
        <span
          key={index}
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTagStyles(tag.color)}`}
        >
          <span className="mr-1">{tag.icon}</span>
          {getLocalizedLabel(tag.label)}
        </span>
      ))}
    </div>
  );
}