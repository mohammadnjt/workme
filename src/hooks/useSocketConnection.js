// hooks/useSocketConnection.js
import { useEffect } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { usePriceStore } from '../stores/usePriceStore';
import { connectSocket } from '../services/socket';
import useUserIP from '../hooks/useUserIP';
// import { fromAscii } from './useHelper';

export const useSocketConnection = () => {
  const { ip } = useUserIP();
console.log('connectSocket',connectSocket)
  const {
    setSocketConnected,
    setSocketDisconnected,
  } = useAppStore();
  
  const {
    updateSymbolData,
    addToPriceHistory,
  } = usePriceStore();

  useEffect(() => {
    // اتصال به Socket.IO
    const socket = connectSocket(ip);
    // socketInstance.connect();

    const handleConnect = () => {
      console.log("Connected to Socket.IO server");
      setSocketConnected(socket);
    };

    const handleDisconnect = () => {
      console.log("Disconnected from Socket.IO server");
      setSocketDisconnected();
    };

    const handlePriceUpdate = (priceData) => {
      console.log('priceData', priceData)
      const { symbol, ...data } = priceData;
      
      // TODO: ascii to json fromAscii()

      // بروزرسانی store قیمت
      updateSymbolData(symbol, data);
      addToPriceHistory(symbol, data);
      
      console.error(`Price update for ${symbol}:`, data.mid);
    };

    const handleTradeUpdate = (tradeData) => {
      // مدیریت به روزرسانی معاملات
      const { addTrade } = useAppStore.getState();
      addTrade(tradeData);
    };

    // رویدادهای Socket
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("price_update", handlePriceUpdate);
    socket.on("trade_executed", handleTradeUpdate);
    socket.on("symbol_subscribed", (data) => {
      console.log(`Subscribed to ${data.symbol}`);
    });

    // Cleanup
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("price_update", handlePriceUpdate);
      socket.off("trade_executed", handleTradeUpdate);
      socket.off("symbol_subscribed");
      socket.disconnect();
    };
  }, [setSocketConnected, setSocketDisconnected, updateSymbolData, addToPriceHistory]);

  return {
    // می‌توانید stateهای اضافی یا متدها را اینجا return کنید
  };
};