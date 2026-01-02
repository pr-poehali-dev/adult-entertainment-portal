import { useToast } from '@/hooks/use-toast';
import type { AdminDataContextValue, Ad, PriceSettings } from './AdminDataProvider';
import { ServiceCategory } from '@/types';

interface AdminHandlersProps {
  data: AdminDataContextValue;
  children: (handlers: {
    blockUser: (userId: number) => void;
    blockSeller: (sellerId: number) => void;
    updateSellerBalance: (sellerId: number, newBalance: number) => void;
    blockClient: (clientId: number) => void;
    updateClientBalance: (clientId: number, newBalance: number) => void;
    approveService: (serviceId: number) => void;
    createAd: (ad: Omit<Ad, 'id'>) => void;
    deleteAd: (adId: number) => void;
    sendMessageToUser: (userId: number, message: string) => void;
    updatePrices: (newPrices: PriceSettings) => void;
    addServiceCategory: (category: Omit<ServiceCategory, 'id'>) => void;
    editServiceCategory: (id: string, category: Omit<ServiceCategory, 'id'>) => void;
    deleteServiceCategory: (id: string) => void;
  }) => React.ReactNode;
}

export const AdminHandlers = ({ data, children }: AdminHandlersProps) => {
  const { toast } = useToast();

  const blockUser = (userId: number) => {
    data.setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, status: u.status === 'blocked' ? 'active' : 'blocked' } : u
    ));
    const user = data.users.find(u => u.id === userId);
    toast({
      title: "Статус изменен",
      description: `Пользователь #${userId} был ${user?.status === 'active' ? 'заблокирован' : 'разблокирован'}`,
    });
  };

  const blockSeller = (sellerId: number) => {
    data.setSellers(prev => prev.map(s => 
      s.id === sellerId ? { ...s, status: s.status === 'blocked' ? 'active' : 'blocked' } : s
    ));
    const seller = data.sellers.find(s => s.id === sellerId);
    toast({
      title: "Статус изменен",
      description: `${seller?.name} ${seller?.status === 'active' ? 'заблокирован' : 'разблокирован'}`,
    });
  };

  const updateSellerBalance = (sellerId: number, newBalance: number) => {
    data.setSellers(prev => prev.map(s => 
      s.id === sellerId ? { ...s, balance: newBalance } : s
    ));
  };

  const blockClient = (clientId: number) => {
    data.setClients(prev => prev.map(c => 
      c.id === clientId ? { ...c, status: c.status === 'blocked' ? 'active' : 'blocked' } : c
    ));
    const client = data.clients.find(c => c.id === clientId);
    toast({
      title: "Статус изменен",
      description: `${client?.name} ${client?.status === 'active' ? 'заблокирован' : 'разблокирован'}`,
    });
  };

  const updateClientBalance = (clientId: number, newBalance: number) => {
    data.setClients(prev => prev.map(c => 
      c.id === clientId ? { ...c, balance: newBalance } : c
    ));
  };

  const approveService = (serviceId: number) => {
    toast({
      title: "Услуга одобрена",
      description: `Услуга #${serviceId} прошла модерацию`,
    });
  };

  const createAd = (ad: Omit<Ad, 'id'>) => {
    const newAd = {
      ...ad,
      id: data.ads.length > 0 ? Math.max(...data.ads.map(a => a.id)) + 1 : 1,
    };
    data.setAds(prev => [...prev, newAd]);
  };

  const deleteAd = (adId: number) => {
    data.setAds(prev => prev.filter(a => a.id !== adId));
  };

  const sendMessageToUser = (userId: number, message: string) => {
    const user = data.clients.find(c => c.id === userId);
    if (!user) return;

    const newMessage = {
      id: data.adminMessages.length > 0 ? Math.max(...data.adminMessages.map(m => m.id)) + 1 : 1,
      userId,
      userName: user.name,
      message,
      timestamp: new Date().toISOString(),
      isFromAdmin: true,
    };
    
    data.setAdminMessages(prev => [...prev, newMessage]);
  };

  const updatePrices = (newPrices: PriceSettings) => {
    data.setPrices(newPrices);
    toast({
      title: "Цены обновлены",
      description: "Новые цены на услуги вступили в силу",
    });
  };

  const addServiceCategory = (category: Omit<ServiceCategory, 'id'>) => {
    const newId = (Math.max(...data.serviceCategories.map(c => parseInt(c.id)), 0) + 1).toString();
    data.setServiceCategories(prev => [...prev, { ...category, id: newId }]);
  };

  const editServiceCategory = (id: string, category: Omit<ServiceCategory, 'id'>) => {
    data.setServiceCategories(prev => prev.map(c => 
      c.id === id ? { ...category, id } : c
    ));
  };

  const deleteServiceCategory = (id: string) => {
    data.setServiceCategories(prev => prev.filter(c => c.id !== id));
  };

  return <>{children({
    blockUser,
    blockSeller,
    updateSellerBalance,
    blockClient,
    updateClientBalance,
    approveService,
    createAd,
    deleteAd,
    sendMessageToUser,
    updatePrices,
    addServiceCategory,
    editServiceCategory,
    deleteServiceCategory,
  })}</>;
};