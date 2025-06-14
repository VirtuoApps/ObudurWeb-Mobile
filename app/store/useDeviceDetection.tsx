'use client';

import { setIsMobile } from './favoritesSlice';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

export const useDeviceDetection = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkMobileView = () => {
      const mobileState = window.innerWidth < 1024;
      dispatch(setIsMobile(mobileState));
    };

    // Check on mount
    checkMobileView();

    // Add resize listener
    window.addEventListener('resize', checkMobileView);

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobileView);
    };
  }, [dispatch]);
};