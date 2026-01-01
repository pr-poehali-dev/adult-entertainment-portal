import { createContext, useContext, useState, ReactNode } from 'react';
import { BusinessService } from '@/types';

interface BusinessServicesContextType {
  businessServices: BusinessService[];
  addBusinessService: (service: BusinessService) => void;
  updateBusinessService: (id: string, service: BusinessService) => void;
  deleteBusinessService: (id: string) => void;
  getActiveBusinessServices: () => BusinessService[];
}

const BusinessServicesContext = createContext<BusinessServicesContextType | undefined>(undefined);

export const useBusinessServices = () => {
  const context = useContext(BusinessServicesContext);
  if (!context) {
    throw new Error('useBusinessServices must be used within BusinessServicesProvider');
  }
  return context;
};

interface BusinessServicesProviderProps {
  children: ReactNode;
}

export const BusinessServicesProvider = ({ children }: BusinessServicesProviderProps) => {
  const [businessServices, setBusinessServices] = useState<BusinessService[]>([]);

  const addBusinessService = (service: BusinessService) => {
    setBusinessServices(prev => [...prev, service]);
  };

  const updateBusinessService = (id: string, service: BusinessService) => {
    setBusinessServices(prev => prev.map(s => s.id === id ? service : s));
  };

  const deleteBusinessService = (id: string) => {
    setBusinessServices(prev => prev.filter(s => s.id !== id));
  };

  const getActiveBusinessServices = () => {
    return businessServices.filter(s => s.status === 'active');
  };

  return (
    <BusinessServicesContext.Provider
      value={{
        businessServices,
        addBusinessService,
        updateBusinessService,
        deleteBusinessService,
        getActiveBusinessServices,
      }}
    >
      {children}
    </BusinessServicesContext.Provider>
  );
};
