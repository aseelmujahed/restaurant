const BASE_URL = 'https://kaman.rest';

class ApiService {
  async fetchApi(endpoint) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        data: {},
        message: error instanceof Error ? error.message : 'An error occurred'
      };
    }
  }

  async getAllCompanies() {
    return this.fetchApi('/api/companies');
  }

  async getCompanyInfo(companyId) {
    return this.fetchApi(`/api/company-info?company_id=${companyId}`);
  }

  async getAllCategories(lang = 'en') {
    return this.fetchApi(`/api/categories?lang=${lang}`);
  }

  async getCategoriesWithItems(companyId, lang = 'en') {
    return this.fetchApi(`/api/categories-with-items?company_id=${companyId}&lang=${lang}`);
  }

  async getAllItems(lang = 'en') {
    return this.fetchApi(`/api/all-items?lang=${lang}`);
  }

  async getItemsWithIngredients(companyId, lang = 'en') {
    return this.fetchApi(`/api/items-with-ingredients?company_id=${companyId}&lang=${lang}`);
  }

  async searchItems(params) {
    if (params.categoryIds && Array.isArray(params.categoryIds) && params.categoryIds.length > 1) {
      const promises = params.categoryIds.map(categoryId => {
        const searchParams = new URLSearchParams();
        
        if (params.search) searchParams.append('search', params.search);
        if (params.companyId && params.companyId !== '') {
          searchParams.append('company_id', params.companyId);
        }
        searchParams.append('category_id', categoryId);
        if (params.minPrice !== undefined) searchParams.append('min_price', params.minPrice.toString());
        if (params.maxPrice !== undefined) searchParams.append('max_price', params.maxPrice.toString());
        if (params.sortBy) searchParams.append('sort_by', params.sortBy);
        if (params.sortOrder) searchParams.append('sort_order', params.sortOrder);
        if (params.lang) searchParams.append('lang', params.lang);

        const url = `/api/items?${searchParams.toString()}`;
        
        return this.fetchApi(url);
      });

      try {
        const responses = await Promise.all(promises);
        
        const allItems = [];
        responses.forEach((response, index) => {
          if (response.success) {
            const items = response.data.items || response.data || [];
            allItems.push(...items);
          }
        });
        
        const uniqueItems = allItems.filter((item, index, self) => 
          index === self.findIndex(i => i.id === item.id)
        );
        
        if (params.sortBy === 'price') {
          uniqueItems.sort((a, b) => {
            return params.sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
          });
        } else if (params.sortBy === 'name') {
          uniqueItems.sort((a, b) => {
            return params.sortOrder === 'asc' 
              ? a.name.localeCompare(b.name)
              : b.name.localeCompare(a.name);
          });
        }
        
        return {
          success: true,
          data: uniqueItems,
          message: 'Combined results from multiple categories'
        };
      } catch (error) {
        console.error('Error in multiple API calls:', error);
        return {
          success: false,
          data: [],
          message: error.message
        };
      }
    } else {
      const searchParams = new URLSearchParams();
      
      if (params.search) searchParams.append('search', params.search);
      if (params.companyId && params.companyId !== '') {
        searchParams.append('company_id', params.companyId);
      }
      
      if (params.categoryIds && Array.isArray(params.categoryIds) && params.categoryIds.length === 1) {
        searchParams.append('category_id', params.categoryIds[0]);
      } else if (params.categoryId) {
        searchParams.append('category_id', params.categoryId);
      }
      
      if (params.minPrice !== undefined) searchParams.append('min_price', params.minPrice.toString());
      if (params.maxPrice !== undefined) searchParams.append('max_price', params.maxPrice.toString());
      if (params.sortBy) searchParams.append('sort_by', params.sortBy);
      if (params.sortOrder) searchParams.append('sort_order', params.sortOrder);
      if (params.lang) searchParams.append('lang', params.lang);

      const url = `/api/items?${searchParams.toString()}`;
      
      return this.fetchApi(url);
    }
  }

  async filterItems(companyId, categoryId) {
    const params = new URLSearchParams({ company_id: companyId });
    if (categoryId) params.append('category_id', categoryId);
    
    return this.fetchApi(`/api/filter-items?${params.toString()}`);
  }

  async getSliders(companyId, lang = 'en') {
    return this.fetchApi(`/api/sliders?company_id=${companyId}&lang=${lang}`);
  }

  async getPopularItems(companyId, limit = 10, lang = 'en') {
    return this.fetchApi(`/api/popular-items?company_id=${companyId}&limit=${limit}&lang=${lang}`);
  }

  async getNewItems(companyId, limit = 10, lang = 'en') {
    return this.fetchApi(`/api/new-items?company_id=${companyId}&limit=${limit}&lang=${lang}`);
  }
}

export const apiService = new ApiService();