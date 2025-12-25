// components/SimpleRealTimeChart.jsx
import React, { useEffect, useState } from 'react';
import { usePriceStore } from '../stores/usePriceStore';

export default function SimpleRealTimeChart({ symbol = 'XAUUSD' }) {
  const [chartData, setChartData] = useState([]);
  const symbolData = usePriceStore((state) => state.symbols[symbol]);

  // فقط برای دیباگ - حذف کن بعداً
  console.log('Chart rendering with data:', chartData.length);

  // مقداردهی اولیه و به روزرسانی داده‌ها
  useEffect(() => {
    if (!symbolData?.mid) return;

    const newDataPoint = {
      time: Date.now(),
      value: symbolData.mid,
    };

    setChartData(prev => {
      const newData = [...prev, newDataPoint];
      // محدود کردن به 50 نقطه برای جلوگیری از performance issues
      return newData.slice(-50);
    });
  }, [symbolData?.mid]); // فقط وقتی mid تغییر کرد

  if (chartData.length === 0) {
    return (
      <div className="bg-slate-800 rounded-lg p-4 text-center text-slate-400">
        Loading chart data for {symbol}...
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <h3 className="text-white font-semibold mb-4">
        {symbol} Chart - {chartData.length} points
      </h3>
      
      {/* چارت ساده با SVG */}
      <div className="h-64 bg-slate-900 rounded border border-slate-600 relative">
        <svg width="100%" height="100%" className="rounded">
          {/* خطوط راهنمای محور Y */}
          {[0, 1, 2, 3].map(i => (
            <line
              key={i}
              x1="0"
              y1={i * 25 + '%'}
              x2="100%"
              y2={i * 25 + '%'}
              stroke="#334155"
              strokeWidth="1"
            />
          ))}
          
          {/* خط چارت */}
          {chartData.length > 1 && (
            <polyline
              fill="none"
              stroke="#22c55e"
              strokeWidth="2"
              points={chartData
                .map((point, index) => {
                  const x = (index / (chartData.length - 1)) * 100;
                  const min = Math.min(...chartData.map(p => p.value));
                  const max = Math.max(...chartData.map(p => p.value));
                  const range = max - min || 1;
                  const y = 100 - ((point.value - min) / range) * 100;
                  return `${x},${y}`;
                })
                .join(' ')}
            />
          )}
        </svg>
        
        {/* نمایش قیمت فعلی */}
        {symbolData && (
          <div className="absolute top-2 right-2 bg-slate-800/90 px-2 py-1 rounded text-green-400 font-mono text-sm">
            {symbolData.mid?.toFixed(5)}
          </div>
        )}
      </div>
      
      <div className="flex justify-between text-xs text-slate-400 mt-2">
        <span>Simple Chart</span>
        <span>Real-time</span>
        <span>{chartData.length} points</span>
      </div>
    </div>
  );
}