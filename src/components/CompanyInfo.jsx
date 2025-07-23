import React from 'react';
import { Clock, Instagram, MessageCircle, Facebook, Video } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function CompanyInfo({ company }) {
  const { t, language } = useLanguage();

  if (!company?.settings) return null;

  const { settings } = company;
  
  let workingHours = {};
  try {
    workingHours = JSON.parse(settings.working_hours || '{}');
  } catch (error) {
  }

  const dayNames = {
    en: {
      Sunday: 'Sunday',
      Monday: 'Monday',
      Tuesday: 'Tuesday',
      Wednesday: 'Wednesday',
      Thursday: 'Thursday',
      Friday: 'Friday',
      Saturday: 'Saturday'
    },
    ar: {
      Sunday: 'الأحد',
      Monday: 'الاثنين',
      Tuesday: 'الثلاثاء',
      Wednesday: 'الأربعاء',
      Thursday: 'الخميس',
      Friday: 'الجمعة',
      Saturday: 'السبت'
    },
    he: {
      Sunday: 'ראשון',
      Monday: 'שני',
      Tuesday: 'שלישי',
      Wednesday: 'רביעי',
      Thursday: 'חמישי',
      Friday: 'שישי',
      Saturday: 'שבת'
    }
  };

  const getCurrentDayStatus = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todayHours = workingHours[today];
    
    if (!todayHours || !todayHours.from || !todayHours.to) {
      return { isOpen: false, status: t('company.closed_today') };
    }

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [fromHour, fromMin] = todayHours.from.split(':').map(Number);
    const [toHour, toMin] = todayHours.to.split(':').map(Number);
    
    const openTime = fromHour * 60 + fromMin;
    const closeTime = toHour * 60 + toMin;
    
    const isOpen = currentTime >= openTime && currentTime <= closeTime;
    
    return {
      isOpen,
      status: isOpen ? t('company.open_now') : t('company.closed_now'),
      hours: `${todayHours.from} - ${todayHours.to}`
    };
  };

  const socialLinks = [
    {
      platform: 'instagram',
      url: settings.instagram && settings.instagram.trim() !== '' ? settings.instagram : null,
      icon: Instagram,
      color: 'text-pink-600 hover:text-pink-700'
    },
    {
      platform: 'facebook',
      url: settings.facebook && settings.facebook.trim() !== '' ? settings.facebook : null,
      icon: Facebook,
      color: 'text-blue-600 hover:text-blue-700'
    },
    {
      platform: 'tiktok',
      url: settings.tiktok && settings.tiktok.trim() !== '' ? settings.tiktok : null,
      icon: Video,
      color: 'text-gray-900 hover:text-gray-700'
    },
    {
      platform: 'whatsapp',
      url: settings.whatsapp && settings.whatsapp.trim() !== '' ? `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}` : null,
      icon: MessageCircle,
      color: 'text-green-600 hover:text-green-700'
    }
  ].filter(link => link.url !== null);

  const dayStatus = getCurrentDayStatus();

  return (
    <div className="bg-white border-t" style={{ minHeight: '200px' }}>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {Object.keys(workingHours).length > 0 && (
            <div>
              <div className="flex items-center mb-3 sm:mb-4">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 mr-2 sm:mr-3" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  {t('company.working_hours')}
                </h3>
              </div>
              
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-3 sm:mb-4 ${
                dayStatus.isOpen 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  dayStatus.isOpen ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                {dayStatus.status}
                {dayStatus.hours && ` (${dayStatus.hours})`}
              </div>

              <div className="space-y-2">
                {Object.entries(workingHours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between items-center py-1 sm:py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-sm sm:text-base text-gray-700 font-medium">
                      {dayNames[language]?.[day] || day}
                    </span>
                    <span className="text-sm sm:text-base text-gray-600">
                      {hours.from && hours.to 
                        ? `${hours.from} - ${hours.to}`
                        : t('company.closed')
                      }
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {socialLinks.length > 0 && (
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                {t('company.follow_us')}
              </h3>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {socialLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors ${link.color}`}
                    >
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                      <span className="text-sm sm:text-base font-medium capitalize">
                        {t(`company.${link.platform}`)}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {settings.slogan && (
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-lg sm:text-xl text-gray-600 italic">
              "{settings.slogan}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}