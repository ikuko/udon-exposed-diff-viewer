import { useState, useEffect } from 'react';

const getViewportHeight = () => {
  // We multiply by 0.01 to get a value for a single vh unit
  return window.innerHeight * 0.01;
};

export const useViewportHeight = () => {
  useEffect(() => {
    const setVh = () => {
      document.documentElement.style.setProperty('--vh', `${getViewportHeight()}px`);
    };

    setVh(); // Set on initial load

    window.addEventListener('resize', setVh);
    window.addEventListener('orientationchange', setVh);

    return () => {
      window.removeEventListener('resize', setVh);
      window.removeEventListener('orientationchange', setVh);
    };
  }, []);
};
