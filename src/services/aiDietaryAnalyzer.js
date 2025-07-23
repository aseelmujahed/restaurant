class AIDietaryAnalyzer {
  constructor() {
    this.cache = new Map();
  }

  filterItems(items, preferences) {
    if (!preferences || !items) return items;

    return items.filter(item => {
      const analysis = this.getItemAnalysis(item) || this.getFallbackAnalysis(item);
      if (!analysis) return true; 

      if (preferences.excludeMeat && analysis.containsMeat) return false;
      if (preferences.excludeChicken && analysis.containsChicken) return false;
      if (preferences.excludeFishSeafood && analysis.containsFishSeafood) return false;
      if (preferences.excludeGluten && !analysis.notcontainsGluten) return false;

      const inclusionFilters = [];
      if (preferences.onlyVegetarian) inclusionFilters.push(analysis.isVegetarian);
      if (preferences.onlyVegan) inclusionFilters.push(analysis.isVegan);
      if (preferences.onlyMeat) inclusionFilters.push(analysis.containsMeat);
      if (preferences.onlyChicken) inclusionFilters.push(analysis.containsChicken);
      if (preferences.onlyFishSeafood) inclusionFilters.push(analysis.containsFishSeafood);

      if (inclusionFilters.length > 0) {
        return inclusionFilters.some(filter => filter === true);
      }

      return true;
    });
  }
  getFallbackAnalysis(item) {
    const name = item.name.toLowerCase();
    const description = (item.description || '').toLowerCase();
    const text = `${name} ${description}`;

    const analysis = {
      containsMeat: false,
      containsChicken: false,
      containsFishSeafood: false,
      notcontainsGluten: false,
      isVegetarian: false,
      isVegan: false
    };

    const meatKeywords = [
      'beef', 'lamb', 'pork', 'meat', 'steak', 'kebab', 'shawarma',
      'لحم', 'بقر', 'خروف', 'كفتة', 'كباب', 'كفته', 'بوفتيك', 'ريش', 'مفروم',
      'בשר', 'בקר', 'טומהוק', 'لحمه', 'لحمة'
    ];

    analysis.containsMeat = meatKeywords.some(keyword => text.includes(keyword));

    const chickenKeywords = ['chicken', 'دجاج', 'עוף', 'poultry', 'Schnitzel'];
    analysis.containsChicken = chickenKeywords.some(keyword => text.includes(keyword));

    const seafoodKeywords = ['fish', 'salmon', 'tuna', 'shrimp', 'seafood', 'سمك', 'جمبري', 'דג', 'סלמון'];
    analysis.containsFishSeafood = seafoodKeywords.some(keyword => text.includes(keyword));

    const glutenKeywords = ['bread', 'pasta', 'wheat', 'flour', 'خبز', 'معكرونة', 'לחם', 'פסטה'];
    const glutenFound = glutenKeywords.some(keyword => text.includes(keyword));

    const vegKeywords = ['vegetarian', 'vegan', 'vegetables', 'نباتي', 'צמחוני', 'טבעוני'];
    const hasAnimalProducts = analysis.containsMeat || analysis.containsChicken || analysis.containsFishSeafood;

    if (!hasAnimalProducts) {
      const looksVeg = vegKeywords.some(keyword => text.includes(keyword));
      if (looksVeg) {
        analysis.isVegetarian = true;
        const dairyKeywords = ['cheese', 'milk', 'cream', 'butter', 'جبن', 'حليب', 'גבינה', 'חלב'];
        const hasDairy = dairyKeywords.some(keyword => text.includes(keyword));
        analysis.isVegan = !hasDairy;
      }
    }
    return analysis;
  }

  getItemAnalysis(item) {
    const key = item.name.toLowerCase().trim();

    return this.cache.get(key);
  }

  cacheItemAnalysis(item, analysis) {
const key = item.name.toLowerCase().trim();
    this.cache.set(key, analysis);
  }

  async analyzeItems(items) {
    const uncachedItems = items.filter(item => !this.getItemAnalysis(item));

    if (uncachedItems.length === 0) return;

    try {
      const API_BASE_URL = '';

      const response = await fetch(`${API_BASE_URL}/api/ai-analyze-meals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meals: uncachedItems.map(item => ({
            name: item.name,
            description: item.description || ''
          }))
        })
      });

      if (!response.ok) {
        console.error('AI API Error:', response.status, response.statusText);
        return;
      }

      const data = await response.json();

      if (Array.isArray(data.analysis)) {
        data.analysis.forEach((analysis, index) => {
          if (uncachedItems[index]) {
            this.cacheItemAnalysis(uncachedItems[index], analysis);
          }
        });
      } else {
        console.error('Invalid AI response format:', data);
      }
    } catch (error) {
      console.error('Error analyzing items with AI:', error);
    }
  }

  async loadCacheFromJson() {
    try {
      const response = await fetch('/restaurant/meal_analysis_cache.json');
      if (!response.ok) {
        console.error('Failed to load cache JSON:', response.status);
        return;
      }

      const data = await response.json();

      if (Array.isArray(data.meals)) {
        data.meals.forEach(entry => {
          const key = entry.name.toLowerCase().trim();
          this.cache.set(key, entry.analysis);
        });
        console.log('Loaded cache from static JSON file');
      } else {
        console.error('Invalid cache JSON structure:', data);
      }
    } catch (error) {
      console.error('Error reading static cache JSON:', error);
    }
  }

}

export const aiDietaryAnalyzer = new AIDietaryAnalyzer();