import { useContext } from 'react';
import { PerformanceContext } from './PerformanceContext';

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error("usePerformance must be used within a PerformanceProvider");
  }
  return context;
};
