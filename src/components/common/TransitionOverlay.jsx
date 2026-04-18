import React, { useState, useCallback, useImperativeHandle, forwardRef } from 'react';

const BLOCK_COUNT = 10;

const TransitionOverlay = forwardRef(({ initialRevealed = false }, ref) => {
  const [isRevealed, setIsRevealed] = useState(initialRevealed);
  const [isAnimating, setIsAnimating] = useState(false);

  const revealPage = useCallback(() => {
    return new Promise((resolve) => {
      setIsAnimating(true);
      setIsRevealed(true);
      
      // Wait for animation to complete (max delay + duration)
      const maxDelay = (BLOCK_COUNT - 1) * 50; // 50ms stagger
      const duration = 800; // CSS transition duration
      
      setTimeout(() => {
        setIsAnimating(false);
        resolve();
      }, maxDelay + duration);
    });
  }, []);

  const coverPage = useCallback(() => {
    return new Promise((resolve) => {
      setIsAnimating(true);
      setIsRevealed(false);
      
      // Wait for cover animation
      const maxDelay = (BLOCK_COUNT - 1) * 50;
      const duration = 600;
      
      setTimeout(() => {
        setIsAnimating(false);
        resolve();
      }, maxDelay + duration);
    });
  }, []);

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    revealPage,
    coverPage,
    isAnimating: () => isAnimating
  }));

  const blocks = Array.from({ length: BLOCK_COUNT }, (_, i) => i);

  return (
    <div 
      className="fixed inset-0 z-[9999] pointer-events-none flex flex-col"
      aria-hidden="true"
    >
      {/* Top Row */}
      <div className="flex flex-1">
        {blocks.map((i) => (
          <div
            key={`top-${i}`}
            className="flex-1 bg-[#CEC1AB] curtain-block-top"
            style={{
              transformOrigin: 'top',
              transform: isRevealed ? 'scaleY(0)' : 'scaleY(1)',
              transition: 'transform 800ms cubic-bezier(0.77, 0, 0.175, 1)',
              transitionDelay: isRevealed ? `${i * 50}ms` : `${(BLOCK_COUNT - 1 - i) * 30}ms`,
            }}
          />
        ))}
      </div>

      {/* Bottom Row */}
      <div className="flex flex-1">
        {blocks.map((i) => (
          <div
            key={`bottom-${i}`}
            className="flex-1 bg-[#B59E7D] curtain-block-bottom"
            style={{
              transformOrigin: 'bottom',
              transform: isRevealed ? 'scaleY(0)' : 'scaleY(1)',
              transition: 'transform 800ms cubic-bezier(0.77, 0, 0.175, 1)',
              transitionDelay: isRevealed ? `${i * 50}ms` : `${(BLOCK_COUNT - 1 - i) * 30}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
});

TransitionOverlay.displayName = 'TransitionOverlay';

export default TransitionOverlay;
