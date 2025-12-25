// stores/useAppStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAppStore = create(
  persist(
    (set, get) => ({
      // وضعیت اتصال Socket
      socket: {
        isConnected: false,
        lastConnection: null,
      },
      
      // داده‌های قیمت لحظه‌ای
      prices: {},
      
      // وضعیت کاربر و احراز هویت
      auth: {
        isAuthenticated: false,
        user: null,
        token: null,
      },
      
      // تنظیمات کاربر
      settings: {
        theme: 'dark',
        language: 'fa',
        notifications: true,
        autoTrade: false,
      },

      // تنظیمات تریدینگ
      tradeSettings: {
        chartType: "area",
        lastAsset: "XAUUSD",
        lastTime: 5,
        timeframe: '1m', // 1m, 5m, 15m, 1h, 4h
        amount: 10,
        payout: 92
      },
      
      // تاریخچه معاملات
      tradeHistory: [],
      wallets: [],
      activeWallet: {
        balance: 0,
        currency: "USD",
        walletType: 'real'
      },
      
      incBalance: (active) => set((state) => ({
        activeWallet: {
          ...state.activeWallet,
          // balance: (state.activeWallet.balance + active.balance).toFixed(2)
          balance: state.activeWallet.balance + active.balance
        }
      })),

      setActiveWallet: (active) => set((state) => ({
        activeWallet: {
          ...state.activeWallet,
          ...active
        }
      })),

      setWallets: (newWallets) => set({ 
        wallets: newWallets 
      }),
      
      setTradeSettings: (settings) => set((state) => ({
        tradeSettings: {
          ...state.tradeSettings, // حفظ تنظیمات قبلی
          ...settings // به‌روزرسانی با تنظیمات جدید
        }
        // tradeSettings: {
        //   chartType: settings.chartType || state.tradeSettings.chartType,
        //   lastAsset: settings.lastAsset || state.tradeSettings.lastAsset,
        //   lastTime: settings.lastTime !== undefined ? settings.lastTime : state.tradeSettings.lastTime,
        //   amount: settings.amount !== undefined ? settings.amount : state.tradeSettings.amount,
        //   payout: settings.payout !== undefined ? settings.payout : state.tradeSettings.payout
        // }
      })),

      // Actions برای Socket
      setSocketConnected: () => set((store) => ({
        socket: {
          ...store.socket,
          isConnected: true,
          lastConnection: new Date().toISOString(),
        }
      })),
      
      setSocketDisconnected: () => set((state) => ({
        socket: {
          ...state.socket,
          isConnected: false,
          connectionId: null,
        }
      })),
      
      // Actions برای قیمت‌ها
      updatePrice: (symbol, priceData) => set((state) => ({
        prices: {
          ...state.prices,
          [symbol]: {
            ...priceData,
            lastUpdate: new Date().toISOString(),
          }
        }
      })),
      
      // Actions برای احراز هویت
      setAuth: (userData) => set({
        auth: {
          isAuthenticated: userData.isAuthenticated || false,
          user: userData.user,
          token: userData.token,
        }
      }),
      
      clearAuth: () => set({
        auth: {
          isAuthenticated: false,
          user: null,
          token: null,
        }
      }),
      
      // Actions برای تنظیمات
      updateSettings: (newSettings) => set((state) => ({
        settings: {
          ...state.settings,
          ...newSettings,
        }
      })),
      
      // Actions برای تاریخچه معاملات
      addTrade: (trade) => set((state) => ({
        tradeHistory: [trade, ...state.tradeHistory].slice(0, 100) // فقط 100 مورد آخر
      })),
      
      clearTradeHistory: () => set({
        tradeHistory: []
      }),
      
      // Selectors (Computed values)
      getCurrentPrice: (symbol) => {
        const state = get();
        return state.prices[symbol] || null;
      },
      
      getPriceChange: (symbol) => {
        const state = get();
        const price = state.prices[symbol];
        if (!price || !price.previousPrice) return 0;
        return ((price.mid - price.previousPrice) / price.previousPrice) * 100;
      },
      
      isSymbolActive: (symbol) => {
        const state = get();
        return !!state.prices[symbol];
      },
    }),
    {
      name: 'app-storage', // نام برای localStorage
      partialize: (state) => ({
        auth: state.auth,
        settings: state.settings,
        tradeHistory: state.tradeHistory,
      }), // فقط این موارد در localStorage ذخیره شوند
    }
  )
);