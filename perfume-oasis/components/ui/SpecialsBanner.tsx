'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Sparkles, Tag, Clock } from 'lucide-react';

interface SpecialOffer {
  title: string;
  discount: string;
  description: string;
}

const offers: SpecialOffer[] = [
  {
    title: "Summer Collection",
    discount: "30% OFF",
    description: "Fresh fragrances for the season"
  },
  {
    title: "Limited Time Deal",
    discount: "Buy 2 Get 1 FREE",
    description: "On selected designer perfumes"
  },
  {
    title: "Flash Sale",
    discount: "Up to 50% OFF",
    description: "Ends midnight tonight!"
  }
];

export function SpecialsBanner() {
  const [currentOffer, setCurrentOffer] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentOffer((prev) => (prev + 1) % offers.length);
        setIsVisible(true);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const offer = offers[currentOffer];

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#0E5C4A] via-[#0A4A3B] to-[#083D30]">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(200,169,91,.1) 10px, rgba(200,169,91,.1) 20px)`,
          animation: 'slide 20s linear infinite'
        }} />
      </div>

      {/* Floating sparkles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <Sparkles
            key={i}
            className="absolute text-[#C8A95B] opacity-70 animate-pulse"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 2) * 40}%`,
              animationDelay: `${i * 0.5}s`,
              fontSize: `${16 + (i % 3) * 8}px`
            }}
          />
        ))}
      </div>

      <div className="relative container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left side - Animated offer content */}
          <div className="flex items-center gap-4 md:gap-6">
            <div className="relative">
              <Tag className="h-8 w-8 md:h-10 md:w-10 text-[#C8A95B] animate-bounce" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#C8A95B] rounded-full animate-ping" />
            </div>
            
            <div className={`transition-all duration-300 transform ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
            }`}>
              <div className="flex items-center gap-2 md:gap-3">
                <h3 className="text-2xl md:text-3xl font-bold text-white">
                  {offer.discount}
                </h3>
                <span className="text-[#C8A95B] text-lg md:text-xl font-semibold">
                  {offer.title}
                </span>
              </div>
              <p className="text-white/90 text-sm md:text-base mt-1">
                {offer.description}
              </p>
            </div>
          </div>

          {/* Right side - CTA button and timer */}
          <div className="flex items-center gap-4">
            {/* Countdown timer for flash sales */}
            {currentOffer === 2 && (
              <div className="hidden md:flex items-center gap-2 text-white/90">
                <Clock className="h-5 w-5" />
                <span className="text-sm font-medium">Ends in 6:23:45</span>
              </div>
            )}

            {/* CTA Button */}
            <Link 
              href="/sale"
              className="group inline-flex items-center gap-2 bg-[#C8A95B] text-[#0E5C4A] px-8 py-3 rounded-full font-semibold 
                         hover:bg-[#D4B66A] transition-colors duration-300 transform hover:scale-105
                         shadow-lg hover:shadow-xl"
            >
              Shop Specials
              <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Offer indicators */}
        <div className="flex justify-center gap-2 mt-4 md:hidden">
          {offers.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentOffer(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentOffer ? 'w-6 bg-[#C8A95B]' : 'w-1.5 bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(20px);
          }
        }
      `}</style>
    </section>
  );
}