import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    // Navigation
    'nav.menu': 'Menu',
    'nav.search': 'Search',
    'nav.ai_filter': 'AI Filter',
    'nav.cart': 'Cart',
    'nav.back_to_categories': 'Back to Categories',
    'nav.back_to_menu': 'Back to Menu',
    
    // Home page
    'home.explore_menu': 'Explore Our Menu',
    'home.discover_dishes': 'Discover our carefully crafted dishes made with the finest ingredients',
    'home.welcome': 'Welcome to',
    'home.fresh_ingredients': 'Fresh ingredients, authentic flavors',
    'home.popular_items': 'Popular Items',
    'home.popular_items_subtitle': 'Customer favorites and trending dishes',
    'home.new_items': 'New Items',
    'home.new_items_subtitle': 'Fresh additions to our menu',
    'home.new': 'NEW',
    
    // Categories
    'categories.no_categories': 'No categories available',
    'categories.check_back': 'Please check back later or contact the restaurant',
    'categories.item': 'item',
    'categories.items': 'items',
    'categories.categories': 'Categories',
    'categories.show_all': 'Show All',
    'categories.show_less': 'Show Less',
    'categories.more_categories': 'more categories',
    'categories.available': 'available',
    'categories.no_items_in_category': 'No items available in this category',
    
    // Search
    'search.title': 'Search Results',
    'search.results_for': 'Results for',
    'search.browse_all': 'Browse all items',
    'search.items_found': 'items found',
    'search.placeholder': 'Search for dishes...',
    'search.no_items': 'No items found',
    'search.start_searching': 'Start searching to find items',
    'search.try_adjusting': 'Try adjusting your search terms or filters',
    'search.enter_search': 'Enter a search term above',
    
    // Filters
    'filters.title': 'Filters',
    'filters.restaurant': 'Restaurant',
    'filters.all_restaurants': 'All Restaurants',
    'filters.category': 'Category',
    'filters.all_categories': 'All Categories',
    'filters.price_range': 'Price Range',
    'filters.min_price': 'Min Price (₪)',
    'filters.max_price': 'Max Price (₪)',
    'filters.sort_by': 'Sort By',
    'filters.price_low_high': 'Price (Low to High)',
    'filters.price_high_low': 'Price (High to Low)',
    'filters.apply': 'Apply Filters',
    'filters.clear': 'Clear All',
    
    // Cart
    'cart.title': 'Your Cart',
    'cart.empty': 'Your cart is empty',
    'cart.empty_subtitle': 'Add some delicious items to get started',
    'cart.total': 'Total:',
    'cart.checkout': 'Checkout',
    'cart.clear': 'Clear Cart',
    'cart.remove': 'Remove',
    'cart.quantity': 'Quantity:',
    
    // Item details
    'item.view_details': 'View Details',
    'item.add_to_cart': 'Add to Cart',
    'item.choose_one': 'Choose one',
    'item.choose_multiple': 'Choose multiple',
    'item.free': 'Free',
    'item.loading': 'Loading...',
    
    // Company selector
    'company.select': 'Select Restaurant',
    
    // Restaurants page
    'restaurants.title': 'Choose Restaurant',
    'restaurants.subtitle': 'Select a restaurant to explore their menu',
    'restaurants.change': 'Change Restaurant',
    'restaurants.found': 'restaurants found',
    'restaurants.search_placeholder': 'Search restaurants...',
    'restaurants.no_results': 'No restaurants found',
    'restaurants.no_restaurants': 'No restaurants available',
    'restaurants.try_different_search': 'Try a different search term',
    'restaurants.check_back_later': 'Please check back later',
    'restaurants.currently_selected': 'Currently Selected',
    
    // Company info
    'company.working_hours': 'Working Hours',
    'company.follow_us': 'Follow Us',
    'company.open_now': 'Open Now',
    'company.closed_now': 'Closed Now',
    'company.closed_today': 'Closed Today',
    'company.closed': 'Closed',
    'company.instagram': 'Instagram',
    'company.facebook': 'Facebook',
    'company.tiktok': 'TikTok',
    'company.whatsapp': 'WhatsApp',
    
    // Language selector
    'language.english': 'English',
    'language.arabic': 'العربية',
    'language.hebrew': 'עברית',
    
    // AI Dietary Filter
    'ai.title': 'AI Dietary Filter',
    'ai.subtitle': 'Smart food analysis',
    'ai.tell_preferences': 'Tell AI Your Preferences',
    'ai.placeholder': "e.g., 'I want dishes without meat' or 'Show me only vegan options' or 'I'm looking for chicken dishes'",
    'ai.analyzing': 'Analyzing...',
    'ai.analyze_preferences': 'Analyze Preferences',
    'ai.quick_filters': 'Quick Filters',
    'ai.active_filters': 'Active Filters',
    'ai.clear_filters': 'Clear All Filters',
    'ai.suggestions': 'AI Suggestions',
    'ai.how_it_works': 'How AI Analysis Works',
    'ai.works_1': '• AI analyzes food names and descriptions',
    'ai.works_2': '• Identifies ingredients like meat, chicken, etc.',
    'ai.works_3': '• Filters menu items based on your dietary needs',
    
    // Quick filter options
    'ai.vegetarian_only': 'Vegetarian ',
    'ai.vegan_only': 'Vegan ',
    'ai.no_meat': 'No Meat',
    'ai.meat_only': 'Meat ',
    'ai.chicken_only': 'Chicken ',
    'ai.seafood_only': 'Seafood ',
    'ai.gluten_free': 'Gluten Free',
    
    // Quick filter messages
    'ai.msg_vegetarian': 'Show me only vegetarian dishes',
    'ai.msg_vegan': 'Show me only vegan dishes',
    'ai.msg_no_meat': 'Exclude all meat dishes',
    'ai.msg_meat_only': 'Show me only dishes with meat',
    'ai.msg_chicken_only': 'Show me only chicken dishes',
    'ai.msg_seafood_only': 'Show me only fish and seafood dishes',
    'ai.msg_dairy_free': 'Exclude all dairy products',
    'ai.msg_gluten_free': 'Exclude all gluten-containing dishes',
    
    // Dietary tags
    'dietary.vegan': 'Vegan',
    'dietary.vegetarian': 'Vegetarian',
    'dietary.meat': 'Meat',
    'dietary.chicken': 'Chicken',
    'dietary.seafood': 'Seafood',
    'dietary.dairy': 'Dairy',
    'dietary.gluten': 'Contains Gluten',
    'dietary.glutenFree': 'Gluten Free'

  },
  ar: {
    // Navigation
    'nav.menu': 'القائمة',
    'nav.search': 'البحث',
    'nav.ai_filter': 'مرشح الذكي',
    'nav.cart': 'السلة',
    'nav.back_to_categories': 'العودة للفئات',
    'nav.back_to_menu': 'العودة للقائمة',
    
    // Home page
    'home.explore_menu': 'استكشف قائمتنا',
    'home.discover_dishes': 'اكتشف أطباقنا المحضرة بعناية من أجود المكونات',
    'home.welcome': 'مرحباً بكم في',
    'home.fresh_ingredients': 'مكونات طازجة، نكهات أصيلة',
    'home.popular_items': 'الأطباق الشائعة',
    'home.popular_items_subtitle': 'المفضلة لدى العملاء والأطباق الرائجة',
    'home.new_items': 'الأطباق الجديدة',
    'home.new_items_subtitle': 'إضافات جديدة لقائمتنا',
    'home.new': 'جديد',
    
    // Categories
    'categories.no_categories': 'لا توجد فئات متاحة',
    'categories.check_back': 'يرجى المراجعة لاحقاً أو الاتصال بالمطعم',
    'categories.item': 'عنصر',
    'categories.items': 'عناصر',
    'categories.categories': 'الفئات',
    'categories.show_all': 'عرض الكل',
    'categories.show_less': 'عرض أقل',
    'categories.more_categories': 'فئات أخرى',
    
    // Search
    'search.title': 'نتائج البحث',
    'search.results_for': 'نتائج البحث عن',
    'search.browse_all': 'تصفح جميع العناصر',
    'search.items_found': 'عنصر موجود',
    'search.placeholder': 'ابحث عن الأطباق...',
    'search.no_items': 'لم يتم العثور على عناصر',
    'search.start_searching': 'ابدأ البحث للعثور على العناصر',
    'search.try_adjusting': 'حاول تعديل مصطلحات البحث أو المرشحات',
    'search.enter_search': 'أدخل مصطلح البحث أعلاه',
    
    // Filters
    'filters.title': 'المرشحات',
    'filters.restaurant': 'المطعم',
    'filters.all_restaurants': 'جميع المطاعم',
    'filters.category': 'الفئة',
    'filters.all_categories': 'جميع الفئات',
    'filters.price_range': 'نطاق السعر',
    'filters.min_price': 'أقل سعر (₪)',
    'filters.max_price': 'أعلى سعر (₪)',
    'filters.sort_by': 'ترتيب حسب',
    'filters.price_low_high': 'السعر (من الأقل للأعلى)',
    'filters.price_high_low': 'السعر (من الأعلى للأقل)',
    'filters.apply': 'تطبيق المرشحات',
    'filters.clear': 'مسح الكل',
    
    // Cart
    'cart.title': 'سلتك',
    'cart.empty': 'سلتك فارغة',
    'cart.empty_subtitle': 'أضف بعض العناصر اللذيذة للبدء',
    'cart.total': 'المجموع:',
    'cart.checkout': 'الدفع',
    'cart.clear': 'مسح السلة',
    'cart.remove': 'إزالة',
    'cart.quantity': 'الكمية:',
    
    // Item details
    'item.view_details': 'عرض التفاصيل',
    'item.add_to_cart': 'إضافة للسلة',
    'item.choose_one': 'اختر واحد',
    'item.choose_multiple': 'اختر متعدد',
    'item.free': 'مجاني',
    'item.loading': 'جاري التحميل...',
    
    // Company selector
    'company.select': 'اختر المطعم',
    
    // Restaurants page
    'restaurants.title': 'اختر المطعم',
    'restaurants.subtitle': 'اختر مطعماً لاستكشاف قائمته',
    'restaurants.change': 'تغيير المطعم',
    'restaurants.found': 'مطعم موجود',
    'restaurants.search_placeholder': 'ابحث عن المطاعم...',
    'restaurants.no_results': 'لم يتم العثور على مطاعم',
    'restaurants.no_restaurants': 'لا توجد مطاعم متاحة',
    'restaurants.try_different_search': 'جرب مصطلح بحث مختلف',
    'restaurants.check_back_later': 'يرجى المراجعة لاحقاً',
    'restaurants.currently_selected': 'المختار حالياً',
    
    // Company info
    'company.working_hours': 'ساعات العمل',
    'company.follow_us': 'تابعنا',
    'company.open_now': 'مفتوح الآن',
    'company.closed_now': 'مغلق الآن',
    'company.closed_today': 'مغلق اليوم',
    'company.closed': 'مغلق',
    'company.instagram': 'إنستغرام',
    'company.facebook': 'فيسبوك',
    'company.tiktok': 'تيك توك',
    'company.whatsapp': 'واتساب',
    
    // Language selector
    'language.english': 'English',
    'language.arabic': 'العربية',
    'language.hebrew': 'עברית',
    
    // AI Dietary Filter
    'ai.title': 'مرشح الطعام الذكي',
    'ai.subtitle': 'تحليل ذكي للطعام',
    'ai.tell_preferences': 'أخبر الذكي الاصطناعي بتفضيلاتك',
    'ai.placeholder': 'مثال: "أريد أطباق بدون لحم" أو "أظهر لي الخيارات النباتية فقط" أو "أبحث عن أطباق الدجاج"',
    'ai.analyzing': 'جاري التحليل...',
    'ai.analyze_preferences': 'تحليل التفضيلات',
    'ai.quick_filters': 'مرشحات سريعة',
    'ai.active_filters': 'المرشحات النشطة',
    'ai.clear_filters': 'مسح جميع المرشحات',
    'ai.suggestions': 'اقتراحات الذكي الاصطناعي',
    'ai.how_it_works': 'كيف يعمل التحليل الذكي',
    'ai.works_1': '• يحلل الذكي الاصطناعي أسماء الأطعمة والأوصاف',
    'ai.works_2': '• يحدد المكونات مثل اللحم والدجاج ومنتجات الألبان وغيرها',
    'ai.works_3': '• يرشح عناصر القائمة بناءً على احتياجاتك الغذائية',
    
    // Quick filter options
    'ai.vegetarian_only': 'نباتي',
    'ai.vegan_only': 'نباتي صرف ',
    'ai.no_meat': 'بدون لحم',
    'ai.meat_only': 'لحم ',
    'ai.chicken_only': 'دجاج ',
    'ai.seafood_only': 'مأكولات بحرية ',
    'ai.gluten_free': 'خالي من الغلوتين',
    
    // Quick filter messages
    'ai.msg_vegetarian': 'أظهر لي الأطباق النباتية فقط',
    'ai.msg_vegan': 'أظهر لي الأطباق النباتية الصرفة فقط',
    'ai.msg_no_meat': 'استبعد جميع أطباق اللحوم',
    'ai.msg_meat_only': 'أظهر لي الأطباق التي تحتوي على لحم فقط',
    'ai.msg_chicken_only': 'أظهر لي أطباق الدجاج فقط',
    'ai.msg_seafood_only': 'أظهر لي أطباق السمك والمأكولات البحرية فقط',
    'ai.msg_dairy_free': 'استبعد جميع منتجات الألبان',
    'ai.msg_gluten_free': 'استبعد جميع الأطباق التي تحتوي على الغلوتين',
    
    // Dietary tags
    'dietary.vegan': 'نباتي صرف',
    'dietary.vegetarian': 'نباتي',
    'dietary.meat': 'لحم',
    'dietary.chicken': 'دجاج',
    'dietary.seafood': 'مأكولات بحرية',
    'dietary.glutenFree': 'خالي من الغلوتين',

  },
  he: {
    // Navigation
    'nav.menu': 'תפריט',
    'nav.search': 'חיפוש',
    'nav.ai_filter': 'מסנן AI',
    'nav.cart': 'עגלה',
    'nav.back_to_categories': 'חזרה לקטגוריות',
    'nav.back_to_menu': 'חזרה לתפריט',
    
    // Home page
    'home.explore_menu': 'גלה את התפריט שלנו',
    'home.discover_dishes': 'גלה את המנות שלנו המוכנות בקפידה מהמרכיבים הטובים ביותר',
    'home.welcome': 'ברוכים הבאים ל',
    'home.fresh_ingredients': 'מרכיבים טריים, טעמים אותנטיים',
    'home.popular_items': 'פריטים פופולריים',
    'home.popular_items_subtitle': 'מועדפי הלקוחות ומנות פופולריות',
    'home.new_items': 'פריטים חדשים',
    'home.new_items_subtitle': 'תוספות חדשות לתפריט שלנו',
    'home.new': 'חדש',
    
    // Categories
    'categories.no_categories': 'אין קטגוריות זמינות',
    'categories.check_back': 'אנא בדוק שוב מאוחר יותר או צור קשר עם המסעדה',
    'categories.item': 'פריט',
    'categories.items': 'פריטים',
    'categories.categories': 'קטגוריות',
    'categories.show_all': 'הצג הכל',
    'categories.show_less': 'הצג פחות',
    'categories.more_categories': 'קטגוריות נוספות',
    
    // Search
    'search.title': 'תוצאות חיפוש',
    'search.results_for': 'תוצאות עבור',
    'search.browse_all': 'עיין בכל הפריטים',
    'search.items_found': 'פריטים נמצאו',
    'search.placeholder': 'חפש מנות...',
    'search.no_items': 'לא נמצאו פריטים',
    'search.start_searching': 'התחל לחפש כדי למצוא פריטים',
    'search.try_adjusting': 'נסה להתאים את מונחי החיפוש או המסננים',
    'search.enter_search': 'הזן מונח חיפוש למעלה',
    
    // Filters
    'filters.title': 'מסננים',
    'filters.restaurant': 'מסעדה',
    'filters.all_restaurants': 'כל המסעדות',
    'filters.category': 'קטגוריה',
    'filters.all_categories': 'כל הקטגוריות',
    'filters.price_range': 'טווח מחירים',
    'filters.min_price': 'מחיר מינימום (₪)',
    'filters.max_price': 'מחיר מקסימום (₪)',
    'filters.sort_by': 'מיין לפי',
    'filters.price_low_high': 'מחיר (נמוך לגבוה)',
    'filters.price_high_low': 'מחיר (גבוה לנמוך)',
    'filters.apply': 'החל מסננים',
    'filters.clear': 'נקה הכל',
    
    // Cart
    'cart.title': 'העגלה שלך',
    'cart.empty': 'העגלה שלך ריקה',
    'cart.empty_subtitle': 'הוסף כמה פריטים טעימים כדי להתחיל',
    'cart.total': 'סה"כ:',
    'cart.checkout': 'תשלום',
    'cart.clear': 'נקה עגלה',
    'cart.remove': 'הסר',
    'cart.quantity': 'כמות:',
    
    // Item details
    'item.view_details': 'הצג פרטים',
    'item.add_to_cart': 'הוסף לעגלה',
    'item.choose_one': 'בחר אחד',
    'item.choose_multiple': 'בחר מרובה',
    'item.free': 'חינם',
    'item.loading': 'טוען...',
    
    // Company selector
    'company.select': 'בחר מסעדה',
    
    // Restaurants page
    'restaurants.title': 'בחר מסעדה',
    'restaurants.subtitle': 'בחר מסעדה כדי לחקור את התפריט שלה',
    'restaurants.change': 'החלף מסעדה',
    'restaurants.found': 'מסעדות נמצאו',
    'restaurants.search_placeholder': 'חפש מסעדות...',
    'restaurants.no_results': 'לא נמצאו מסעדות',
    'restaurants.no_restaurants': 'אין מסעדות זמינות',
    'restaurants.try_different_search': 'נסה מונח חיפוש אחר',
    'restaurants.check_back_later': 'אנא בדוק שוב מאוחר יותר',
    'restaurants.currently_selected': 'נבחר כעת',
    
    // Company info
    'company.working_hours': 'שעות פעילות',
    'company.follow_us': 'עקבו אחרינו',
    'company.open_now': 'פתוח עכשיו',
    'company.closed_now': 'סגור עכשיו',
    'company.closed_today': 'סגור היום',
    'company.closed': 'סגור',
    'company.instagram': 'אינסטגרם',
    'company.facebook': 'פייסבוק',
    'company.tiktok': 'טיקטוק',
    'company.whatsapp': 'וואטסאפ',
    
    // Language selector
    'language.english': 'English',
    'language.arabic': 'العربية',
    'language.hebrew': 'עברית',
    
    // AI Dietary Filter
    'ai.title': 'מסנן תזונה חכם',
    'ai.subtitle': 'ניתוח חכם של מזון',
    'ai.tell_preferences': 'ספר לבינה המלאכותית על ההעדפות שלך',
    'ai.placeholder': 'למשל: "אני רוצה מנות בלי בשר" או "הראה לי רק אפשרויות טבעוניות" או "אני מחפש מנות עוף"',
    'ai.analyzing': 'מנתח...',
    'ai.analyze_preferences': 'נתח העדפות',
    'ai.quick_filters': 'מסננים מהירים',
    'ai.active_filters': 'מסננים פעילים',
    'ai.clear_filters': 'נקה את כל המסננים',
    'ai.suggestions': 'הצעות בינה מלאכותית',
    'ai.how_it_works': 'איך הניתוח החכם עובד',
    'ai.works_1': '• הבינה המלאכותית מנתחת שמות מזון ותיאורים',
    'ai.works_2': '• מזהה רכיבים כמו בשר, עוף, חלב וכו\'',
    'ai.works_3': '• מסנן פריטי תפריט בהתבסס על הצרכים התזונתיים שלך',
    
    // Quick filter options
    'ai.vegetarian_only': 'צמחוני ',
    'ai.vegan_only': 'טבעוני ',
    'ai.no_meat': 'ללא בשר',
    'ai.meat_only': 'בשר ',
    'ai.chicken_only': 'עוף ',
    'ai.seafood_only': 'פירות ים ',
    'ai.gluten_free': 'ללא גלוטן',
    
    // Quick filter messages
    'ai.msg_vegetarian': 'הראה לי רק מנות צמחוניות',
    'ai.msg_vegan': 'הראה לי רק מנות טבעוניות',
    'ai.msg_no_meat': 'הוצא את כל מנות הבשר',
    'ai.msg_meat_only': 'הראה לי רק מנות עם בשר',
    'ai.msg_chicken_only': 'הראה לי רק מנות עוף',
    'ai.msg_seafood_only': 'הראה לי רק מנות דגים ופירות ים',
    'ai.msg_dairy_free': 'הוצא את כל מוצרי החלב',
    'ai.msg_gluten_free': 'הוצא את כל המנות המכילות גלוטן',
    
    // Dietary tags
    'dietary.vegan': 'טבעוני',
    'dietary.vegetarian': 'צמחוני',
    'dietary.meat': 'בשר',
    'dietary.chicken': 'עוף',
    'dietary.seafood': 'פירות ים',
    'dietary.dairy': 'חלב',
    'dietary.gluten': 'מכיל גלוטן',
    'dietary.glutenFree': 'לא מכיל גלוטן'

  },
};

const LanguageContext = createContext(undefined);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');

  const isRTL = language === 'ar' || language === 'he';

  useEffect(() => {
    // Set document direction and language
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}