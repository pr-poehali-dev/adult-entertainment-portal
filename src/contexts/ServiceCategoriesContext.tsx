import { createContext, useContext, useState, ReactNode } from 'react';
import { ServiceCategory } from '@/types';
import { businessServiceCategories } from '@/data/businessServiceCategories';

interface ServiceCategoriesContextValue {
  serviceCategories: ServiceCategory[];
  setServiceCategories: React.Dispatch<React.SetStateAction<ServiceCategory[]>>;
}

const ServiceCategoriesContext = createContext<ServiceCategoriesContextValue | undefined>(undefined);

export const ServiceCategoriesProvider = ({ children }: { children: ReactNode }) => {
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>(businessServiceCategories);

  return (
    <ServiceCategoriesContext.Provider value={{ serviceCategories, setServiceCategories }}>
      {children}
    </ServiceCategoriesContext.Provider>
  );
};

export const useServiceCategories = () => {
  const context = useContext(ServiceCategoriesContext);
  if (!context) {
    throw new Error('useServiceCategories must be used within ServiceCategoriesProvider');
  }
  return context;
};
