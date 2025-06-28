// components/ui/MobileStoryAd.tsx
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileStoryAdProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  cta?: string;
  href?: string;
  duration?: number; // Auto-close after duration (ms)
}

export function MobileStoryAd({ 
  isOpen, 
  onClose, 
  title = "Exclusive Offer",
  subtitle = "20% Off All Fragrances",
  cta = "Shop Now",
  href = "/shop",
  duration = 5000 
}: MobileStoryAdProps) {
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && duration) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            onClose();
            return 0;
          }
          return prev + (100 / (duration / 100));
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 md:hidden">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800">
        <div 
          className="h-full bg-gold-400 transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Story Content */}
      <div className="relative h-full">
        <Image 
          src="/images/vertical-designs/stories/PO-vertical-story-main.jpg"
          alt={title}
          fill
          className="object-cover"
          priority
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
        
        {/* Close Button */}
        <div className="absolute top-6 right-4">
          <button 
            onClick={onClose} 
            className="text-white/80 hover:text-white p-2 rounded-full bg-black/20 backdrop-blur-sm"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 pb-8">
          <div className="space-y-4 text-white">
            <h2 className="text-3xl font-bold">{title}</h2>
            <p className="text-xl">{subtitle}</p>
            <Button 
              size="lg"
              className="w-full bg-gold-400 hover:bg-gold-500 text-emerald-900 font-bold rounded-full"
              onClick={() => {
                router.push(href);
                onClose();
              }}
            >
              {cta}
            </Button>
            <p className="text-center text-sm text-white/60">
              Limited time offer • Terms apply
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
