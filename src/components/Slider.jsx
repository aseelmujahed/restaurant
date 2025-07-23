import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { apiService } from '../services/api';

export function Slider({ selectedCompany }) {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    if (selectedCompany) {
      const fetchSliders = async () => {
        setIsLoading(true);
        try {
          const response = await apiService.getSliders(selectedCompany.id);
          if (response.success) {
            setSlides(response.data.sliders || []);
          } else {
            setSlides([]);
          }
        } catch (error) {
          setSlides([]);
        } finally {
          setIsLoading(false);
        }
      };
      fetchSliders();
    } else {
      setSlides([]);
      setIsLoading(false);
    }
  }, [selectedCompany]);

  useEffect(() => {
    if (slides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % slides.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (isLoading) {
    return (
      <div className="relative h-64 md:h-96 lg:h-[500px] bg-gray-200 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="relative h-64 md:h-96 lg:h-[500px] bg-gray-200 flex items-center justify-center">
        <div className="text-center text-black">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            {t('home.welcome')} {selectedCompany?.name || 'Our Restaurant'}
          </h2>
          <p className="text-lg md:text-xl opacity-90">{t('home.fresh_ingredients')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-64 md:h-96 lg:h-[500px] overflow-hidden">
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title || `Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      
            {slide.title && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <h2 className="text-3xl md:text-5xl font-bold mb-4">{slide.title}</h2>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full transition-all duration-200"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full transition-all duration-200"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}