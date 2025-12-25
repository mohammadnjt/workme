/* eslint-disable no-unused-vars */
// stores/usePriceStore.js
import { create } from 'zustand';

export const usePriceStore = create((set, get) => ({
  // داده‌های قیمت برای تمام نمادها
  symbols: {},
  
  // سابقه قیمت برای نمودارها
  priceHistory: {},
  
  // استیت‌های محاسباتی
  calculations: {
    averages: {},
    trends: {},
    volatilities: {},
  },
  
  // Actions
  updateSymbolData: (symbol, data) => set((state) => {
    const previousData = state.symbols[symbol];
    const now = new Date().toISOString();
    
    return {
      symbols: {
        ...state.symbols,
        [symbol]: {
          ...data,
          previousPrice: previousData?.mid,
          lastUpdate: now,
          change: previousData ? data.mid - previousData.mid : 0,
          changePercent: previousData ? ((data.mid - previousData.mid) / previousData.mid) * 100 : 0,
        }
      }
    };
  }),
  
  addToPriceHistory: (symbol, priceData) => set((state) => {
    const currentHistory = state.priceHistory[symbol] || [];
    const newHistory = [...currentHistory, {
      ...priceData,
      timestamp: new Date().toISOString(),
    }].slice(-1000); // فقط 1000 نقطه داده آخر
    
    return {
      priceHistory: {
        ...state.priceHistory,
        [symbol]: newHistory,
      }
    };
  }),
  
  // محاسبات real-time
  calculateTrend: (symbol) => {
    const state = get();
    const history = state.priceHistory[symbol] || [];
    if (history.length < 2) return 'neutral';
    
    const recentPrices = history.slice(-10);
    const firstPrice = recentPrices[0]?.mid;
    const lastPrice = recentPrices[recentPrices.length - 1]?.mid;
    
    if (lastPrice > firstPrice) return 'up';
    if (lastPrice < firstPrice) return 'down';
    return 'neutral';
  },
  
  // Selectors
  getSymbolsList: () => {
    const state = get();
    return Object.keys(state.symbols);
  },
  
  getActiveSymbols: () => {
    const state = get();
    return Object.entries(state.symbols)
      .filter(([symbol, data]) => data.lastUpdate)
      .map(([symbol, data]) => ({
        symbol,
        ...data
      }));
  },
}));