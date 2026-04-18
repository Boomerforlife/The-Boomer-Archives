import React, { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePageTransitionContext } from '../../App';

export const TransitionLink = ({ to, children, className, ...props }) => {
  const { navigateWithTransition, isTransitioning } = usePageTransitionContext();
  const navigate = useNavigate();

  const handleClick = useCallback(async (e) => {
    e.preventDefault();
    
    if (isTransitioning) return; // Prevent double clicks
    
    // Check if same page
    if (to === window.location.pathname) return;
    
    // Navigate with transition
    await navigateWithTransition(to);
  }, [to, isTransitioning, navigateWithTransition]);

  return (
    <Link 
      to={to} 
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </Link>
  );
};

export default TransitionLink;
