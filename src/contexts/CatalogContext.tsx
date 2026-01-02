import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CatalogItem } from '@/types';
import { catalogApi, NetworkError } from '@/lib/api';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

interface CatalogContextType {
  catalogItems: CatalogItem[];
  addCatalogItem: (item: Omit<CatalogItem, 'id' | 'createdAt' | 'isActive' | 'viewCount' | 'responses'>) => Promise<void>;
  updateCatalogItem: (id: number, updates: Partial<CatalogItem>) => Promise<void>;
  deleteCatalogItem: (id: number) => Promise<void>;
  refreshCatalog: (filters?: { location?: string; category?: string; active?: boolean }) => Promise<void>;
  isLoading: boolean;
}

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

export const useCatalog = () => {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog must be used within CatalogProvider');
  }
  return context;
};

interface CatalogProviderProps {
  children: ReactNode;
}

export const CatalogProvider = ({ children }: CatalogProviderProps) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCatalog = async (filters?: { location?: string; category?: string; active?: boolean }) => {
    setIsLoading(true);
    try {
      const response = await catalogApi.getItems(filters);
      const mappedItems: CatalogItem[] = response.items.map((item: any) => ({
        id: item.id,
        userId: item.user_id,
        category: item.category,
        title: item.title,
        description: item.description,
        location: item.location,
        price: item.price,
        images: item.images || [],
        isActive: item.is_active,
        createdAt: item.created_at,
        viewCount: item.view_count || 0,
        responses: []
      }));
      setCatalogItems(mappedItems);
    } catch (error) {
      console.error('Failed to load catalog:', error);
      if (error instanceof NetworkError) {
        toast({
          title: 'Проблемы с сетью',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Ошибка загрузки',
          description: 'Не удалось загрузить каталог',
          variant: 'destructive'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      refreshCatalog({ active: true });
    }
  }, [isAuthenticated, authLoading]);

  const addCatalogItem = async (item: Omit<CatalogItem, 'id' | 'createdAt' | 'isActive' | 'viewCount' | 'responses'>) => {
    try {
      const response = await catalogApi.createItem({
        title: item.title,
        description: item.description,
        category: item.category,
        location: item.location,
        price: item.price,
        images: item.images
      });
      
      const newItem: CatalogItem = {
        id: response.item.id,
        userId: response.item.user_id,
        category: response.item.category,
        title: response.item.title,
        description: response.item.description,
        location: response.item.location,
        price: response.item.price,
        images: response.item.images || [],
        isActive: response.item.is_active,
        createdAt: response.item.created_at,
        viewCount: 0,
        responses: []
      };
      
      setCatalogItems(prev => [newItem, ...prev]);
      
      toast({
        title: 'Успех',
        description: 'Объявление создано'
      });
    } catch (error) {
      console.error('Failed to add catalog item:', error);
      if (error instanceof NetworkError) {
        toast({
          title: 'Проблемы с сетью',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Ошибка',
          description: 'Не удалось создать объявление',
          variant: 'destructive'
        });
      }
      throw error;
    }
  };

  const updateCatalogItem = async (id: number, updates: Partial<CatalogItem>) => {
    try {
      await catalogApi.updateItem(id, {
        title: updates.title,
        description: updates.description,
        price: updates.price,
        images: updates.images,
        is_active: updates.isActive
      });
      
      setCatalogItems(prev => 
        prev.map(item => item.id === id ? { ...item, ...updates } : item)
      );
      
      toast({
        title: 'Успех',
        description: 'Объявление обновлено'
      });
    } catch (error) {
      console.error('Failed to update catalog item:', error);
      if (error instanceof NetworkError) {
        toast({
          title: 'Проблемы с сетью',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Ошибка',
          description: 'Не удалось обновить объявление',
          variant: 'destructive'
        });
      }
      throw error;
    }
  };

  const deleteCatalogItem = async (id: number) => {
    try {
      await catalogApi.deleteItem(id);
      setCatalogItems(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: 'Успех',
        description: 'Объявление удалено'
      });
    } catch (error) {
      console.error('Failed to delete catalog item:', error);
      if (error instanceof NetworkError) {
        toast({
          title: 'Проблемы с сетью',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Ошибка',
          description: 'Не удалось удалить объявление',
          variant: 'destructive'
        });
      }
      throw error;
    }
  };

  return (
    <CatalogContext.Provider
      value={{
        catalogItems,
        addCatalogItem,
        updateCatalogItem,
        deleteCatalogItem,
        refreshCatalog,
        isLoading
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
};