import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TransitionLink from '../common/TransitionLink';

const SideNavBar = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [isNearEdge, setIsNearEdge] = useState(false);
  
  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', icon: 'home', label: 'Home' },
    { path: '/member', icon: 'person', label: 'Profile' },
    { path: '/archive', icon: 'auto_stories', label: 'Archive' },
    { path: '/archive', icon: 'search', label: 'Search' },
  ];

  useEffect(() => {
    let hideTimeout;

    const handleMouseMove = (e) => {
      // Check if mouse is within 60px of left edge
      const nearEdge = e.clientX < 60;
      setIsNearEdge(nearEdge);
      
      if (nearEdge) {
        clearTimeout(hideTimeout);
        setIsVisible(true);
      } else {
        hideTimeout = setTimeout(() => {
          if (e.clientX > 280) {
            setIsVisible(false);
          }
        }, 300);
      }
    };

    const handleSidebarMouseEnter = () => {
      clearTimeout(hideTimeout);
      setIsVisible(true);
    };

    const handleSidebarMouseLeave = () => {
      hideTimeout = setTimeout(() => {
        setIsVisible(false);
      }, 200);
    };

    window.addEventListener('mousemove', handleMouseMove);

    const sidebar = document.getElementById('auto-hide-sidebar');
    if (sidebar) {
      sidebar.addEventListener('mouseenter', handleSidebarMouseEnter);
      sidebar.addEventListener('mouseleave', handleSidebarMouseLeave);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(hideTimeout);
      if (sidebar) {
        sidebar.removeEventListener('mouseenter', handleSidebarMouseEnter);
        sidebar.removeEventListener('mouseleave', handleSidebarMouseLeave);
      }
    };
  }, []);

  return (
    <>
      {/* Edge trigger area */}
      <div 
        className="hidden lg:block fixed left-0 top-0 w-16 h-screen z-40"
        style={{ background: isNearEdge ? 'rgba(240, 224, 204, 0.1)' : 'transparent' }}
      />
      
      <aside 
        id="auto-hide-sidebar"
        className={`hidden lg:flex fixed left-0 top-0 h-screen w-64 border-r border-outline-variant/20 flex-col p-6 bg-surface/95 backdrop-blur-md z-40 pt-24 transition-transform duration-500 ease-out ${
          isVisible ? 'translate-x-0' : '-translate-x-[calc(100%-20px)]'
        }`}
      >
        <div className="mb-12">
          <h2 className="font-serif text-on-surface text-xl">The Archivist</h2>
          <p className="text-xs font-medium uppercase tracking-widest label-text text-on-surface-variant mt-1">
            Curating the tactile.
          </p>
        </div>
        
        <nav className="flex flex-col gap-2 flex-grow">
          {navItems.map((item) => (
            <TransitionLink
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-300 ease-out group ${
                isActive(item.path)
                  ? 'text-on-surface font-bold bg-surface-container-high'
                  : 'text-on-surface-variant hover:bg-surface-variant hover:translate-x-1'
              }`}
            >
              <span className={`material-symbols-outlined transition-transform duration-300 ${
                isActive(item.path) ? '' : 'group-hover:scale-110'
              }`}>{item.icon}</span>
              <span className="text-xs font-medium uppercase tracking-widest label-text">
                {item.label}
              </span>
            </TransitionLink>
          ))}
        </nav>
        
        <TransitionLink
          to="/press-room"
          className="mt-auto bg-primary text-on-primary py-3 px-4 rounded-md text-xs font-medium uppercase tracking-widest label-text hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-center"
        >
          New Entry
        </TransitionLink>
      </aside>
    </>
  );
};

export default SideNavBar;
