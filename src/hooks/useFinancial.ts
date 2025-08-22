import { useContext } from 'react';
import { FinancialContext } from '../context/FinancialContext';

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (context === undefined) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
};
