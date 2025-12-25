// hooks/useChartOptimization.js
import { useMemo } from 'react';
import { usePriceStore } from '../stores/usePriceStore';

export const useChartOptimization = (symbol, maxPoints = 200, throttleMs = 100) => {
  const priceHistory = usePriceStore((state) => state.priceHistory[symbol] || []);
  const symbolData = usePriceStore((state) => state.symbols[symbol]);

  // بهینه‌سازی داده‌های تاریخچه
  const optimizedHistory = useMemo(() => {
    if (priceHistory.length <= maxPoints) {
      return priceHistory;
    }

    // نمونه‌برداری برای کاهش تعداد نقاط هنگام نمایش تاریخچه طولانی
    const step = Math.ceil(priceHistory.length / maxPoints);
    return priceHistory.filter((_, index) => index % step === 0);
  }, [priceHistory, maxPoints]);

  // داده‌های چارت با فرمت مناسب
  const chartData = useMemo(() => {
    return optimizedHistory.map(item => ({
      time: Math.floor(new Date(item.timestamp).getTime() / 1000),
      value: item.mid,
    }));
  }, [optimizedHistory]);

  // آخرین قیمت برای به روزرسانی real-time
  const latestPrice = useMemo(() => {
    if (!symbolData?.mid) return null;
    
    return {
      time: Math.floor(Date.now() / 1000),
      value: symbolData.mid,
    };
  }, [symbolData]);

  return {
    chartData,
    latestPrice,
    hasData: chartData.length > 0,
    currentPrice: symbolData?.mid,
    priceChange: symbolData?.changePercent,
  };
};