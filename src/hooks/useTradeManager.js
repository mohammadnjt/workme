import { useState, useRef, useCallback, useEffect } from 'react';
import useAudio from './useAudio';
import { calculateProfit } from './useHelper';
import { useAppStore } from "../stores/useAppStore";
import { getSocket } from '../services/socket';

const useTradeManager = () => {
  const socket = getSocket();
  const [trades, setTrades] = useState([]);
  const [profitMarkers, setProfitMarkers] = useState([]);
const {incBalance} = useAppStore();
  const { playSound } = useAudio();
  
  const processedTradesRef = useRef(new Set());
  const profitMarkerTimeoutRef = useRef(new Map());
  const tradesRef = useRef(trades); // ref برای دسترسی به latest trades

  // به روز رسانی ref وقتی trades تغییر می‌کند
  useEffect(() => {
    tradesRef.current = trades;
  }, [trades]);

  const showProfitMarker = useCallback((trade, isWin) => {
    console.log("trade showProfitMarker:", trade)
    const profit = trade.volume * 1.92;
    const markerId = `profit-${trade.id}-${Date.now()}`;
    
    const marker = {
      time: trade.expireTime,
      position: 'aboveBar',
      color: isWin ? '#10B981' : '#EF4444',
      shape: 'circle',
      text: `${isWin ? '🎉 WIN' : '💸 LOSE'}: $${isWin ? profit : trade.volume}`,
      id: markerId,
      size: 1.3
    };

    setProfitMarkers(prev => {
      const filtered = prev.filter(m => !m.id.includes(`profit-${trade.id}-`));
      return [...filtered, marker];
    });

    const timeoutId = setTimeout(() => {
      setProfitMarkers(prev => prev.filter(m => m.id !== markerId));
      profitMarkerTimeoutRef.current.delete(markerId);
    }, 5000);

    console.log('profit:::',profit)
    if (isWin)
        incBalance({balance: profit});

    profitMarkerTimeoutRef.current.set(markerId, timeoutId);
  }, []);

  // اضافه کردن معامله جدید
  const addTrade = useCallback((newTrade) => {
    console.log('addTrade', newTrade)
    setTrades(prev => [...prev, newTrade]);
  }, []);

  // حذف معامله دستی
  const removeTrade = useCallback((tradeId) => {
    setTrades(prev => prev.filter(trade => trade.id !== tradeId));
  }, []);

  const checkStatusTrade = useCallback((lastPoint) => {
    if (!lastPoint || !tradesRef.current.length) return;

    const expiredTrades = tradesRef.current.filter(trade => 
      trade.expireTime <= lastPoint.time && 
      !processedTradesRef.current.has(`${trade.id}-${trade.expireTime}`)
    );

    if (expiredTrades.length === 0) return;

    // پردازش هر معامله منقضی شده
    expiredTrades.forEach(trade => {
      const tradeKey = `${trade.id}-${trade.expireTime}`;
      processedTradesRef.current.add(tradeKey);

      const isWin = trade.shape === "arrowUp" 
        ? lastPoint.value > trade.targetValue 
        : lastPoint.value < trade.targetValue;

      playSound(isWin ? "deal-win" : "deal-loose");
      showProfitMarker(trade, isWin, lastPoint);
    });

    // حذف معاملات منقضی شده از state
    setTrades(prev => prev.filter(trade => trade.expireTime > lastPoint.time));
  }, [playSound, showProfitMarker]); // حذف trades از dependencies

  const tradeStatus = useCallback((data) => {
    if (!tradesRef.current.length) return;
    const isWin = data.status === 'win';
    console.log('data trade status::', data)

    const expiredTrades = tradesRef.current.find(trade => trade.cid === data.cid);
    console.log('expiredTrades',expiredTrades)
    if (!expiredTrades) return;

    if (isWin)
      incBalance({balance: data.profit});


    playSound(isWin ? "deal-win" : "deal-loose");

    const marker = {
      time: data.timestamp,
      position: 'aboveBar',
      color: isWin ? '#10B981' : '#EF4444',
      shape: 'circle',
      text: `${isWin ? '🎉 WIN' : '💸 LOSE'}: $${data.profit}`,
      cid: data.cid,
      size: 1.3
    };

    setProfitMarkers(prev => [...prev, marker]);

    // const timeoutId = 
    setTimeout(() => {
      // setTrades(prev => prev.filter(m => m.cid !== data.cid));
      setTrades(prev => prev.filter(m => m.cid !== data.cid));
      setProfitMarkers(prev => prev.filter(m => m.cid !== data.cid));

    }, 5000);
    
    // profitMarkerTimeoutRef.current.delete(data.cid);
    // profitMarkerTimeoutRef.current.set(data.cid, timeoutId);

    // setTrades(prev => [...prev, marker]);
    // showProfitMarker(trade, isWin, lastPoint);
  }, [playSound])

  // پاکسازی
  useEffect(() => {
    return () => {
      profitMarkerTimeoutRef.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  return {
    trades,
    profitMarkers,
    addTrade,
    removeTrade,
    setTrades,
    tradeStatus
  };
};

export default useTradeManager;