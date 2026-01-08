import { useState } from 'react';
import { CatalogItem, AgencyType, UserAd } from '@/types';
import { MOCK_AGENCY_GIRLS, MOCK_USER_ADS } from './mockData';

export const useCatalogState = () => {
  const [agencyGirls, setAgencyGirls] = useState<CatalogItem[]>(MOCK_AGENCY_GIRLS);
  const [userAds, setUserAds] = useState<UserAd[]>(MOCK_USER_ADS);
  const [showAgencyPayment, setShowAgencyPayment] = useState(false);
  const [pendingAgencyName, setPendingAgencyName] = useState('');
  const [pendingAgencyType, setPendingAgencyType] = useState<AgencyType | null>(null);
  const [showGirlForm, setShowGirlForm] = useState(false);
  const [editingGirl, setEditingGirl] = useState<CatalogItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingDuration, setBookingDuration] = useState('1');
  const [bookingNote, setBookingNote] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('rating');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedAge, setSelectedAge] = useState<string>('all');
  const [selectedHeight, setSelectedHeight] = useState<string>('all');
  const [selectedBodyType, setSelectedBodyType] = useState<string>('all');
  const [selectedSellerId, setSelectedSellerId] = useState<number | null>(null);
  const [selectedPartyId, setSelectedPartyId] = useState<number | null>(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState<number | null>(null);
  const [selectedServiceCategory, setSelectedServiceCategory] = useState<{ id: string; name: string } | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [orderChats, setOrderChats] = useState<any[]>([]);
  const [selectedOrderChatId, setSelectedOrderChatId] = useState<number | null>(null);

  return {
    agencyGirls,
    setAgencyGirls,
    userAds,
    setUserAds,
    showAgencyPayment,
    setShowAgencyPayment,
    pendingAgencyName,
    setPendingAgencyName,
    pendingAgencyType,
    setPendingAgencyType,
    showGirlForm,
    setShowGirlForm,
    editingGirl,
    setEditingGirl,
    searchQuery,
    setSearchQuery,
    favorites,
    setFavorites,
    selectedServiceId,
    setSelectedServiceId,
    showBookingModal,
    setShowBookingModal,
    bookingDate,
    setBookingDate,
    bookingTime,
    setBookingTime,
    bookingDuration,
    setBookingDuration,
    bookingNote,
    setBookingNote,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    selectedCountry,
    setSelectedCountry,
    selectedLocation,
    setSelectedLocation,
    selectedAge,
    setSelectedAge,
    selectedHeight,
    setSelectedHeight,
    selectedBodyType,
    setSelectedBodyType,
    selectedSellerId,
    setSelectedSellerId,
    selectedPartyId,
    setSelectedPartyId,
    selectedApplicationId,
    setSelectedApplicationId,
    selectedServiceCategory,
    setSelectedServiceCategory,
    bookings,
    setBookings,
    orderChats,
    setOrderChats,
    selectedOrderChatId,
    setSelectedOrderChatId,
  };
};
