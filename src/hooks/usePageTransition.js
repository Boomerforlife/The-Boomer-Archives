import { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export const usePageTransition = () => {
  const navigate = useNavigate();
  const overlayRef = useRef(null);

  const setOverlayRef = useCallback((ref) => {
    overlayRef.current = ref;
  }, []);

  const navigateWithTransition = useCallback(async (to) => {
    if (!overlayRef.current) {
      navigate(to);
      return;
    }

    // Cover the page
    await overlayRef.current.coverPage();
    
    // Navigate
    navigate(to);
    
    // Small delay to let new page render
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Reveal the page
    await overlayRef.current.revealPage();
  }, [navigate]);

  const initialReveal = useCallback(async () => {
    if (!overlayRef.current) return;
    
    // Small delay on initial load
    await new Promise(resolve => setTimeout(resolve, 100));
    await overlayRef.current.revealPage();
  }, []);

  return {
    setOverlayRef,
    navigateWithTransition,
    initialReveal
  };
};

export default usePageTransition;
