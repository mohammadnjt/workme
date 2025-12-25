// hooks/useApp.js
import { useAppStore } from '../stores/useAppStore';
import { usePriceStore } from '../stores/usePriceStore';

export const useApp = () => {
  const socketState = useAppStore((state) => state.socket);
  const authState = useAppStore((state) => state.auth);
  const settings = useAppStore((state) => state.settings);
  const updateSettings = useAppStore((state) => state.updateSettings);
  
  const symbols = usePriceStore((state) => state.symbols);
  const getCurrentPrice = usePriceStore((state) => state.getCurrentPrice);

  return {
    // Socket
    isConnected: socketState.isConnected,
    connectionId: socketState.connectionId,
    
    // Auth
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    
    // Settings
    settings,
    updateSettings,
    
    // Prices
    symbols,
    getCurrentPrice,
  };
};