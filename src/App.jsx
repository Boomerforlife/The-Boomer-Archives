import React, { useState, useEffect, useRef, createContext, useContext, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ArchivePage from './pages/ArchivePage';
import ArticlePage from './pages/ArticlePage';
import PressRoom from './pages/PressRoom';
import MemberPage from './pages/MemberPage';
import LegalBlooper from './pages/LegalBlooper';
import ColophonBlooper from './pages/ColophonBlooper';
import LoadingScreen from './components/common/LoadingScreen';
import TransitionOverlay from './components/common/TransitionOverlay';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';

// Create context for page transition
const PageTransitionContext = createContext(null);

export const usePageTransitionContext = () => useContext(PageTransitionContext);

// Wrapper to handle loading and transitions
function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const overlayRef = useRef(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Promise-based cover page function
  const coverPage = useCallback(async () => {
    if (!overlayRef.current) return;
    setIsTransitioning(true);
    await overlayRef.current.coverPage();
  }, []);

  // Promise-based reveal page function
  const revealPage = useCallback(async () => {
    if (!overlayRef.current) return;
    await overlayRef.current.revealPage();
    setIsTransitioning(false);
  }, []);

  // Navigate with transition sequence
  const navigateWithTransition = useCallback(async (to) => {
    await coverPage();
    navigate(to);
    window.scrollTo(0, 0);
    // Small delay for new page to render
    await new Promise(resolve => setTimeout(resolve, 50));
    await revealPage();
  }, [navigate, coverPage, revealPage]);

  // Initial app load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsInitialLoad(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Note: Loading screen handles initial reveal animation
  // Page transitions only happen on navigation between pages

  // Scroll to top on route change (without transition)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <LoadingScreen 
        isLoading={isLoading} 
        onLoadingComplete={() => {}}
      />
      {/* Transition overlay starts revealed (hidden) - only shows during navigation */}
      <TransitionOverlay ref={overlayRef} initialRevealed={true} />
      <PageTransitionContext.Provider value={{ navigateWithTransition, isTransitioning }}>
        <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/archive" element={<ArchivePage />} />
            <Route path="/read/:id" element={<ArticlePage />} />
            <Route path="/press-room" element={<PressRoom />} />
            <Route path="/member" element={<MemberPage />} />
            <Route path="/legal" element={<LegalBlooper />} />
            <Route path="/colophon" element={<ColophonBlooper />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </PageTransitionContext.Provider>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
