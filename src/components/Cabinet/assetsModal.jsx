import React, { useState, useEffect, useRef } from 'react';
import { X, Search, DollarSign, Bitcoin, Droplet, FileText, TrendingUp, Star, Calendar, ChevronDown } from 'lucide-react';

const ASSET_CATEGORIES = {
  currencies: { icon: DollarSign, label: 'Currencies' },
  crypto: { icon: Bitcoin, label: 'Crypto' },
  commodities: { icon: Droplet, label: 'Commodities' },
  indices: { icon: FileText, label: 'Indices' },
  stocks: { icon: TrendingUp, label: 'Stocks' },
};

const ASSETS = [
  { name: 'AED/CNY OTC', payout: 92, category: 'currencies', favorite: false },
  { name: 'AUD/CAD OTC', payout: 92, category: 'currencies', favorite: false },
  { name: 'AUD/CHF', payout: 92, category: 'currencies', favorite: false },
  { name: 'AUD/CHF OTC', payout: 92, category: 'currencies', favorite: false },
  { name: 'AUD/NZD OTC', payout: 92, category: 'currencies', favorite: false },
  { name: 'AUD/USD OTC', payout: 92, category: 'currencies', favorite: false },
  { name: 'CAD/CHF OTC', payout: 92, category: 'currencies', favorite: false },
  { name: 'CAD/JPY OTC', payout: 92, category: 'currencies', favorite: false },
  { name: 'EUR/CHF', payout: 92, category: 'currencies', favorite: false },
  { name: 'EUR/GBP', payout: 92, category: 'currencies', favorite: false },
  { name: 'EUR/USD OTC', payout: 92, category: 'currencies', favorite: false },
  { name: 'GBP/USD OTC', payout: 92, category: 'currencies', favorite: false },
  { name: 'USD/JPY OTC', payout: 92, category: 'currencies', favorite: false },
];

export default function AssetSelectorModal({ onClose, currentAsset = 'EUR/USD OTC', onSelectAsset }) {
  const [isClosing, setIsClosing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('currencies');
  const [assets, setAssets] = useState(ASSETS);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  const toggleFavorite = (index) => {
    setAssets(prev => prev.map((asset, i) => 
      i === index ? { ...asset, favorite: !asset.favorite } : asset
    ));
  };

  const filteredAssets = assets.filter(asset => 
    asset.category === selectedCategory &&
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAsset = (assetName) => {
    onSelectAsset?.(assetName);
    handleClose();
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
      />

      {/* Modal */}
      <div 
        ref={modalRef}
        className={`fixed top-8 left-4 right-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl w-auto max-w-[600px] mx-auto shadow-2xl z-50 overflow-hidden transition-all duration-300 ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}
        style={{
          animation: isClosing ? 'scaleOut 0.3s ease-out forwards' : 'scaleIn 0.3s ease-out forwards',
          maxHeight: '70vh'
        }}
      >
        <style>{`
          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.95) translateY(-8px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
          @keyframes scaleOut {
            from {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
            to {
              opacity: 0;
              transform: scale(0.95) translateY(-8px);
            }
          }
          .scrollbar-thin::-webkit-scrollbar {
            width: 4px;
          }
          .scrollbar-thin::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
          }
          .scrollbar-thin::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 2px;
          }
          .scrollbar-thin::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.5);
          }
        `}</style>

        {/* Header */}
        <div className='p-3 border-b border-white/20'>
          <div className='flex items-center justify-between mb-3'>
            <div className='flex items-center gap-2'>
              <h2 className='text-white text-lg font-semibold'>{currentAsset}</h2>
              <ChevronDown className='w-4 h-4 text-white/60' />
            </div>
            <button 
              onClick={handleClose}
              className='text-white/60 hover:text-white transition-colors'
            >
              <X className='w-5 h-5' />
            </button>
          </div>

          {/* Category Tabs */}
          <div className='flex gap-1 mb-3'>
            {Object.entries(ASSET_CATEGORIES).map(([key, category]) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`flex-1 p-2 rounded-lg transition-all ${
                    selectedCategory === key
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <IconComponent className='w-4 h-4 mx-auto' />
                </button>
              );
            })}
          </div>

          {/* Search and Filter Row */}
          <div className='flex gap-2'>
            <div className='flex-1 bg-white/5 rounded-lg border border-white/20 flex items-center px-2'>
              <input
                type='text'
                placeholder='Search'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='flex-1 bg-transparent text-white py-2 text-sm outline-none placeholder-white/50'
              />
              <Search className='w-4 h-4 text-white/60' />
            </div>
            <button className='bg-white/5 border border-white/20 rounded-lg p-2 hover:bg-white/10 transition-colors'>
              <Star className='w-4 h-4 text-white/60' />
            </button>
            <button className='bg-white/5 border border-dashed border-white/20 rounded-lg p-2 hover:bg-white/10 transition-colors'>
              <Calendar className='w-4 h-4 text-white/60' />
            </button>
          </div>
        </div>

        {/* Assets List */}
        <div className='p-3'>
          <div className='flex items-center justify-between mb-2'>
            <h3 className='text-white/60 text-xs font-medium'>
              {ASSET_CATEGORIES[selectedCategory].label}
            </h3>
            <button className='text-white/60 hover:text-white text-xs flex items-center gap-1'>
              Payout <ChevronDown className='w-3 h-3' />
            </button>
          </div>

          <div className='space-y-1 max-h-[300px] overflow-y-auto scrollbar-thin'>
            {filteredAssets.map((asset, index) => (
              <div
                key={index}
                onClick={() => handleSelectAsset(asset.name)}
                className='flex items-center justify-between py-2 px-2 hover:bg-white/10 rounded-lg cursor-pointer transition-colors group'
              >
                <div className='flex items-center gap-2'>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(index);
                    }}
                    className='transition-colors'
                  >
                    <Star
                      className={`w-4 h-4 ${
                        asset.favorite
                          ? 'fill-orange-400 text-orange-400'
                          : 'text-white/40 group-hover:text-white/60'
                      }`}
                    />
                  </button>
                  <span className='text-white/80 text-sm group-hover:text-white transition-colors'>
                    {asset.name}
                  </span>
                </div>
                <span className='text-white/60 text-sm group-hover:text-white/80 transition-colors'>
                  +{asset.payout}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}