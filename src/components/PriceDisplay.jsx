// components/MiniChart.jsx
import React from 'react';
import { usePriceStore } from '../stores/usePriceStore';

export default function MiniChart({ symbol = 'XAUUSD' }) {
  const symbolData = usePriceStore((state) => state.symbols[symbol]);

  // فقط نمایش ساده قیمت - بدون چارت پیچیده
  return (
    <div className="bg-slate-800 rounded-lg p-4 text-center">
      <div className="text-white font-semibold mb-2">{symbol}</div>
      
      {symbolData ? (
        <>
          <div className="text-3xl font-mono text-green-400 mb-2">
            {symbolData.mid?.toFixed(5)}
          </div>
          <div className={`text-sm ${
            symbolData.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {symbolData.changePercent >= 0 ? '▲' : '▼'} 
            {Math.abs(symbolData.changePercent).toFixed(2)}%
          </div>
        </>
      ) : (
        <div className="text-slate-400">Waiting for data...</div>
      )}
      
      <div className="text-xs text-slate-500 mt-2">
        Real-time price
      </div>
    </div>
  );
}