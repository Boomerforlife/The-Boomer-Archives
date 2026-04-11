import React, { useEffect, useState } from 'react';

const LoadingScreen = ({ isLoading, onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [textIndex, setTextIndex] = useState(0);

  const loadingTexts = [
    "Preparing the archives...",
    "Gathering vellum scrolls...",
    "Dusting off mind manuscripts...",
    "Arranging the card catalog...",
    "Brewing ink for the presses...",
    "Warming up the typesetter..."
  ];

  useEffect(() => {
    if (!isLoading) {
      setIsFading(true);
      setTimeout(() => {
        onLoadingComplete?.();
      }, 800);
      return;
    }

    // Progress animation - faster for 1s total
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 25 + 15;
      });
    }, 100);

    // Text cycling
    const textInterval = setInterval(() => {
      setTextIndex(prev => (prev + 1) % loadingTexts.length);
    }, 1500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, [isLoading, onLoadingComplete, loadingTexts.length]);

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-800 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ backgroundColor: '#CEC1AB' }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a574' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center max-w-xl w-full px-8">
        
        

        {/* Title */}
        <h1 className="font-headline text-3xl md:text-4xl italic font-bold text-on-surface mb-2 text-center">
          The Boomer Archives
        </h1>
        <p className="text-on-surface-variant text-sm uppercase tracking-[0.3em] mb-10">
          Est. 2026
        </p>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden mb-6">
          <div 
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* Progress Text */}
        <div className="flex items-center justify-between w-full mb-4">
          <span className="text-xs text-on-surface-variant uppercase tracking-wider">
            Loading
          </span>
          <span className="text-xs text-primary font-mono">
            {Math.min(Math.round(progress), 100)}%
          </span>
        </div>

        {/* Cycling Text */}
        <div className="h-6 overflow-hidden">
          <p 
            key={textIndex}
            className="text-sm text-on-surface-variant italic animate-fade-in-up text-center"
          >
            {loadingTexts[textIndex]}
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
          <div className="w-16 h-px bg-outline-variant/50" />
          <span className="material-symbols-outlined text-outline-variant text-sm">
            more_horiz
          </span>
          <div className="w-16 h-px bg-outline-variant/50" />
        </div>
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-8 left-8 w-12 h-12 border-l-2 border-t-2 border-outline-variant/30" />
      <div className="absolute top-8 right-8 w-12 h-12 border-r-2 border-t-2 border-outline-variant/30" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-l-2 border-b-2 border-outline-variant/30" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-r-2 border-b-2 border-outline-variant/30" />
    </div>
  );
};

export default LoadingScreen;
