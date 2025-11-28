import { useState } from 'react';
import { PrivateAlbum, Currency, Wallet } from '@/types';
import Icon from '@/components/ui/icon';
import { PinCodeModal } from './PinCodeModal';
import { AlbumViewModal } from './AlbumViewModal';

interface PrivateAlbumsProps {
  albums: PrivateAlbum[];
  wallet: Wallet;
  onPurchase: (albumId: number, price: number, currency: Currency) => void;
}

const getCurrencySymbol = (currency: Currency): string => {
  const symbols: Record<Currency, string> = {
    RUB: '₽',
    USD: '$',
    EUR: '€',
    BTC: '₿',
    ETH: 'Ξ',
    USDT: '₮'
  };
  return symbols[currency] || currency;
};

export default function PrivateAlbums({ albums, wallet, onPurchase }: PrivateAlbumsProps) {
  const [selectedAlbum, setSelectedAlbum] = useState<PrivateAlbum | null>(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showAlbumModal, setShowAlbumModal] = useState(false);

  if (!albums || albums.length === 0) {
    return null;
  }

  const handleAlbumClick = (album: PrivateAlbum) => {
    setSelectedAlbum(album);
    if (album.isPurchased) {
      setShowPinModal(true);
    } else {
      handlePurchase(album);
    }
  };

  const handlePurchase = (album: PrivateAlbum) => {
    const userBalance = wallet.balances.find(b => b.currency === album.currency);
    if (userBalance && userBalance.amount >= album.price) {
      onPurchase(album.id, album.price, album.currency);
      const updatedAlbum = { ...album, isPurchased: true };
      setSelectedAlbum(updatedAlbum);
      setShowPinModal(true);
    }
  };

  const handlePinSuccess = () => {
    setShowPinModal(false);
    setShowAlbumModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Icon name="Lock" size={24} className="text-primary" />
        <h2 className="text-2xl font-bold">Закрытые альбомы</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {albums.map((album) => (
          <button
            key={album.id}
            onClick={() => handleAlbumClick(album)}
            className="relative group bg-card border border-border rounded-lg overflow-hidden hover:border-primary transition-colors"
          >
            <div className="relative aspect-[3/4]">
              <img
                src={album.coverImage}
                alt={album.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {!album.isPurchased && (
                <div className="absolute inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Icon name="Lock" size={48} className="text-white mx-auto" />
                    <div className="text-white font-bold text-xl">
                      {album.price.toLocaleString()} {getCurrencySymbol(album.currency)}
                    </div>
                  </div>
                </div>
              )}

              {album.isPurchased && (
                <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                  <Icon name="Check" size={14} />
                  Куплено
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-bold text-lg mb-1">{album.title}</h3>
                {album.description && (
                  <p className="text-sm text-white/80 line-clamp-2">{album.description}</p>
                )}
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <Icon name="Image" size={14} />
                  <span>{album.mediaCount} материалов</span>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors pointer-events-none" />
          </button>
        ))}
      </div>

      {selectedAlbum && showPinModal && (
        <PinCodeModal
          album={selectedAlbum}
          onClose={() => {
            setShowPinModal(false);
            setSelectedAlbum(null);
          }}
          onSuccess={handlePinSuccess}
        />
      )}

      {selectedAlbum && showAlbumModal && (
        <AlbumViewModal
          album={selectedAlbum}
          onClose={() => {
            setShowAlbumModal(false);
            setSelectedAlbum(null);
          }}
        />
      )}
    </div>
  );
}
