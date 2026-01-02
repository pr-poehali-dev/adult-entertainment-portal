import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BusinessService } from '@/types';
import { businessServicesApi } from '@/lib/api';
import { useAuth } from './AuthContext';

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
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [businessServices, setBusinessServices] = useState<BusinessService[]>([]);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await businessServicesApi.getServices('active');
        const mappedServices: BusinessService[] = response.services.map((s: any) => ({
          id: s.id.toString(),
          title: s.title,
          description: s.description,
          categoryId: s.category_id,
          images: s.images || [],
          status: s.status,
          createdAt: s.created_at,
          publishedAt: s.published_at
        }));
        setBusinessServices(mappedServices);
      } catch (error) {
        console.error('Failed to load services:', error);
      }
    };

    if (!authLoading && isAuthenticated) {
      loadServices();
    }
  }, [isAuthenticated, authLoading]);

  const addBusinessService = async (service: BusinessService) => {
    try {
      const response = await businessServicesApi.createService({
        categoryId: service.categoryId,
        title: service.title,
        description: service.description,
        images: service.images
      });
      const newService: BusinessService = {
        id: response.service.id.toString(),
        title: response.service.title,
        description: response.service.description,
        categoryId: response.service.category_id,
        images: response.service.images || [],
        status: response.service.status,
        createdAt: response.service.created_at,
        publishedAt: response.service.published_at
      };
      setBusinessServices(prev => [...prev, newService]);
    } catch (error) {
      console.error('Failed to add service:', error);
      throw error;
    }
  };

  const updateBusinessService = async (id: string, service: BusinessService) => {
    try {
      await businessServicesApi.updateService(parseInt(id), {
        title: service.title,
        description: service.description,
        images: service.images,
        status: service.status
      });
      setBusinessServices(prev => prev.map(s => s.id === id ? service : s));
    } catch (error) {
      console.error('Failed to update service:', error);
      throw error;
    }
  };

  const deleteBusinessService = async (id: string) => {
    try {
      await businessServicesApi.deleteService(parseInt(id));
      setBusinessServices(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Failed to delete service:', error);
      throw error;
    }
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