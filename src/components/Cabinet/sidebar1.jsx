import React, { useCallback, useState } from 'react';
import { TrendingUp, TrendingDown, Plus, Minus } from 'lucide-react';
import useAudio from "../../hooks/useAudio";
import { formatTime } from '../../hooks/useHelper';
import { useAppStore } from '../../stores/useAppStore';
import { getSocket } from '../../services/socket';

export default function TradingPanel({ lastPointHandler = { current: { value: 1850, time: Date.now() } }, tradeHandler = { set: () => {} } }) {
  const socket = getSocket();
  const { tradeSettings, setTradeSettings, activeWallet, setActiveWallet } = useAppStore();
  const { playSound } = useAudio();
  
  const [localTime, setLocalTime] = useState(tradeSettings.lastTime);
  const [localAmount, setLocalAmount] = useState(tradeSettings.amount || 1);
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [isEditingAmount, setIsEditingAmount] = useState(false);
  
  const payout = { percent: 92, profit: 0.92, total: 1.92 };
  const getPointValue = (point) =>
  point?.value ?? point?.close ?? point?.price ?? null;


  // Time handlers
  const handleTimeChange = (increment) => {
    const newTime = Math.max(5, Math.min(3600, localTime + increment));
    setLocalTime(newTime);
    setTradeSettings({ lastTime: newTime });
  };

  const handleTimeInputChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setLocalTime(value === '' ? 0 : parseInt(value));
  };

  const handleTimeInputBlur = () => {
    const newTime = Math.max(5, Math.min(3600, localTime || 5));
    setLocalTime(newTime);
    setTradeSettings({ lastTime: newTime });
    setIsEditingTime(false);
  };

  const handleTimeInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleTimeInputBlur();
    } else if (e.key === 'Escape') {
      setLocalTime(tradeSettings.lastTime);
      setIsEditingTime(false);
    }
  };

  // Amount handlers
  const handleAmountChange = (increment) => {
    const newAmount = Math.max(1, localAmount + increment);
    setLocalAmount(newAmount);
    setTradeSettings({ amount: newAmount });
  };

  const handleAmountInputChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setLocalAmount(value === '' ? 0 : parseInt(value));
  };

  const handleAmountInputBlur = () => {
    const newAmount = Math.max(1, localAmount || 1);
    setLocalAmount(newAmount);
    setTradeSettings({ amount: newAmount });
    setIsEditingAmount(false);
  };

  const handleAmountInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAmountInputBlur();
    } else if (e.key === 'Escape') {
      setLocalAmount(tradeSettings.amount || 1);
      setIsEditingAmount(false);
    }
  };

  const handleTrade = useCallback(async (action = 'call') => {
    if (!lastPointHandler.current) return;
    const value = getPointValue(lastPointHandler.current);
    // const value = lastPointHandler.current.value;
    if (value == null) return;
    if (activeWallet.balance < localAmount) return;

    const requestId = crypto.randomUUID();

    console.log('hi', {
      cid: requestId,
      time: lastPointHandler.current.time,
      expireTime: lastPointHandler.current.time + localTime,
      targetValue: value,
      volume: localAmount,
      position: 'aboveBar',
      color: action === 'call' ? '#24b65a' : '#dc4243',
      shape: action === 'call' ? 'arrowUp' : 'arrowDown',
      text: action === 'call' ? `Buy ${Math.floor(value)}` : `Sell ${Math.floor(value)}`,
    })

    socket.emit('openOrder', {
      action: action,
      amount: localAmount,
      asset: tradeSettings.lastAsset || 'XAUUSD',
      isDemo: activeWallet.walletType === 'demo',
      optionType: 100,
      cid: requestId,
      time: localTime
    });

    const newMarker = {
      cid: requestId,
      time: lastPointHandler.current.time,
      expireTime: lastPointHandler.current.time + localTime,
      targetValue: value,
      volume: localAmount,
      position: 'aboveBar',
      color: action === 'call' ? '#24b65a' : '#dc4243',
      shape: action === 'call' ? 'arrowUp' : 'arrowDown',
      text: action === 'call' ? `Buy ${Math.floor(value)}` : `Sell ${Math.floor(value)}`,
    };

    playSound("deal-open");
    tradeHandler.set(newMarker);
    setActiveWallet({balance: activeWallet.balance - localAmount });
  }, [activeWallet, lastPointHandler, playSound, setActiveWallet, socket, tradeHandler, localTime, localAmount, tradeSettings.lastAsset]);

  // Mobile render
  const mobileRender = () => {
    return (
      <div className="rounded-lg select-none lg:hidden bg-[#2a3247]/95 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 gap-3 mb-3">
            {/* Time */}
            <div>
              <label className="text-slate-400 text-xs font-medium block mb-1">Time</label>
              <div className="bg-[#1e2332] rounded-lg p-2 flex items-center justify-between border border-[#3a4558]">
                <button 
                  onClick={() => handleTimeChange(-5)}
                  className="text-slate-400 hover:text-white p-1 transition-colors"
                  disabled={localTime <= 5}
                >
                  <Minus className="w-4 h-4" />
                </button>
                {isEditingTime ? (
                  <input
                    type="text"
                    value={localTime}
                    onChange={handleTimeInputChange}
                    onBlur={handleTimeInputBlur}
                    onKeyDown={handleTimeInputKeyDown}
                    className="bg-transparent text-white text-lg font-semibold text-center w-20 focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <span 
                    className="text-white text-lg font-semibold cursor-pointer hover:text-blue-400 transition-colors"
                    onClick={() => setIsEditingTime(true)}
                  >
                    {formatTime(localTime)}
                  </span>
                )}
                <button 
                  onClick={() => handleTimeChange(5)}
                  className="text-slate-400 hover:text-white p-1 transition-colors"
                  disabled={localTime >= 3600}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="text-slate-400 text-xs font-medium block mb-1">Amount</label>
              <div className="bg-[#1e2332] rounded-lg p-2 flex items-center justify-between border border-[#3a4558]">
                <button 
                  onClick={() => handleAmountChange(-1)}
                  className="text-slate-400 hover:text-white p-1 transition-colors"
                  disabled={localAmount <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                {isEditingAmount ? (
                  <input
                    type="text"
                    value={localAmount}
                    onChange={handleAmountInputChange}
                    onBlur={handleAmountInputBlur}
                    onKeyDown={handleAmountInputKeyDown}
                    className="bg-transparent text-white text-lg font-semibold text-center w-20 focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <span 
                    className="text-white text-lg font-semibold cursor-pointer hover:text-blue-400 transition-colors"
                    onClick={() => setIsEditingAmount(true)}
                  >
                    {localAmount}
                  </span>
                )}
                <button 
                  onClick={() => handleAmountChange(1)}
                  className="text-slate-400 hover:text-white p-1 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 mb-4 text-sm">
            <div className="text-slate-400">
              Payout <span className="text-slate-300">${(localAmount * payout.total).toFixed(2)}</span>
            </div>
            <div className="text-green-400 font-bold text-xl">
              +{payout.percent}%
            </div>
            <div className="text-slate-400">
              Profit <span className="text-green-400 font-semibold">+${(localAmount * payout.profit).toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => handleTrade('call')} 
              className="bg-green-500 hover:bg-green-600 text-white rounded-lg py-3.5 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 font-bold text-base"
            >
              <TrendingUp className="w-5 h-5" />
              BUY
            </button>

            <button 
              onClick={() => handleTrade('put')} 
              className="bg-red-500 hover:bg-red-600 text-white rounded-lg py-3.5 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 font-bold text-base"
            >
              <TrendingDown className="w-5 h-5" />
              SELL
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Desktop render
  return (
    <>
      {mobileRender()}

      <div className="lg:relative hidden lg:flex h-full">
        <div className="flex-1 ml-2 p-3 overflow-y-auto">
          <div className="max-w-xs space-y-3">
            {/* Time Input */}
            <div className="space-y-1">
              <label className="text-slate-400 text-xs font-medium">Time</label>
              <div className="bg-slate-800/80 rounded-lg p-2 flex items-center justify-between border border-slate-700/50">
                <button 
                  onClick={() => handleTimeChange(-5)}
                  className="text-slate-400 hover:text-white p-1 transition-colors"
                  disabled={localTime <= 5}
                >
                  <Minus className="w-3 h-3" />
                </button>
                {isEditingTime ? (
                  <input
                    type="text"
                    value={localTime}
                    onChange={handleTimeInputChange}
                    onBlur={handleTimeInputBlur}
                    onKeyDown={handleTimeInputKeyDown}
                    className="bg-transparent text-white text-center w-16 focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <span 
                    className="text-white cursor-pointer hover:text-blue-400 transition-colors"
                    onClick={() => setIsEditingTime(true)}
                  >
                    {formatTime(localTime)}
                  </span>
                )}
                <button 
                  onClick={() => handleTimeChange(5)}
                  className="text-slate-400 hover:text-white p-1 transition-colors"
                  disabled={localTime >= 3600}
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-1">
              <label className="text-slate-400 text-xs font-medium">Amount</label>
              <div className="bg-slate-800/80 rounded-lg p-2 flex items-center justify-between border border-slate-700/50">
                <button 
                  onClick={() => handleAmountChange(-1)}
                  className="text-slate-400 hover:text-white p-1 transition-colors"
                  disabled={localAmount <= 1}
                >
                  <Minus className="w-3 h-3" />
                </button>
                {isEditingAmount ? (
                  <input
                    type="text"
                    value={localAmount}
                    onChange={handleAmountInputChange}
                    onBlur={handleAmountInputBlur}
                    onKeyDown={handleAmountInputKeyDown}
                    className="bg-transparent text-white text-center w-16 focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <span 
                    className="text-white cursor-pointer hover:text-blue-400 transition-colors"
                    onClick={() => setIsEditingAmount(true)}
                  >
                    {localAmount}
                  </span>
                )}
                <button 
                  onClick={() => handleAmountChange(1)}
                  className="text-slate-400 hover:text-white p-1 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Payout Info */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-slate-400 text-xs font-medium">Payout</label>
                <span className="text-green-400 font-bold text-xs">+${(localAmount * payout.profit).toFixed(2)}</span>
              </div>
              <div className="bg-slate-800/80 rounded-lg p-3 border border-slate-700/50 text-center space-y-1">
                <div className="text-green-400 font-bold text-xl">
                  +{payout.percent}%
                </div>
                <div className="text-green-400 font-semibold text-sm">
                  +${(localAmount * payout.total).toFixed(2)}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button 
                onClick={() => handleTrade('call')} 
                className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl py-3 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-green-500/20 flex items-center justify-center gap-2 font-bold text-sm"
              >
                <TrendingUp className="w-4 h-4" />
                BUY
              </button>

              <button 
                onClick={() => handleTrade('put')} 
                className="w-full bg-red-500 hover:bg-red-600 text-white rounded-xl py-3 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-red-500/20 flex items-center justify-center gap-2 font-bold text-sm"
              >
                <TrendingDown className="w-4 h-4" />
                SELL
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}