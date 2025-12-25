import React, { useState, useEffect, useRef } from 'react';
import { Wallet, Gift, ArrowDownUp, ChevronDown, Lock, Plus } from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';
import { getSocket } from '../../services/socket';

export default function BalanceModal({ onClose }) {
  const socket = getSocket();
  const { wallets, activeWallet, setActiveWallet, setWallets } = useAppStore();
  
  const [isClosing, setIsClosing] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [showTopUpForm, setShowTopUpForm] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
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

  const handleWalletSwitch = () => {
    const swichedWallet = wallets.find((w) => w.walletType !== activeWallet.walletType);

    if (!swichedWallet) return;
    
    setIsSwapping(true);
    setShowTopUpForm(false);
    setTimeout(() => {
      setActiveWallet({
        balance: swichedWallet.balance,
        walletType: swichedWallet.walletType,
        currency: swichedWallet.currency
      });
      setIsSwapping(false);
    }, 300);
  };

  const handleTopUpClick = () => {
    if (activeWallet.walletType === 'demo') {
      setShowTopUpForm(!showTopUpForm);
    } else {
      console.log('Real wallet top-up');
    }
  };

  const handleDeposit = () => {
    const amount = parseFloat(topUpAmount);
    
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const newBalance = activeWallet.balance + amount;
    
    socket.emit('deposit-wallet', {walletType: activeWallet.walletType , amount:newBalance})
    console.log(`✅ Added $${amount} to Demo wallet. New balance: $${newBalance}`);
    
    setActiveWallet({
      ...activeWallet,
      balance: newBalance
    });

    setWallets(wallets.map(w => 
      w.walletType === 'demo' 
        ? { ...w, balance: newBalance }
        : w
    ));

    setTopUpAmount('');
    setShowTopUpForm(false);
  };

  return (
    <div 
      ref={modalRef}
      className={`bg-[#262c41] border border-[#343e52] rounded-lg
        shadow-[0_8px_20px_rgba(0,0,0,0.3)]
        pointer-events-auto
        absolute z-50 top-12 right-[10px]
        w-[320px]
        select-none
        ${isClosing ? 'animate-slideUp' : 'animate-slideDown'}
      `}
      style={{
        animation: isClosing ? 'slideUp 0.3s ease-out forwards' : 'slideDown 0.3s ease-out forwards'
      }}
    >
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-15px);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-8px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(8px);
          }
        }
        @keyframes expandDown {
          from {
            opacity: 0;
            max-height: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            max-height: 180px;
            transform: translateY(0);
          }
        }
        @keyframes collapseUp {
          from {
            opacity: 1;
            max-height: 180px;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            max-height: 0;
            transform: translateY(-8px);
          }
        }
        .fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .fade-out {
          animation: fadeOut 0.3s ease-out forwards;
        }
        .expand-down {
          animation: expandDown 0.3s ease-out forwards;
        }
        .collapse-up {
          animation: collapseUp 0.3s ease-out forwards;
        }
      `}</style>

      {/* Active Wallet Account */}
      <div className={`p-3 border-b border-[#343e52] ${isSwapping ? 'fade-out' : 'fade-in'}`}>
        <div className='flex items-start justify-between mb-2'>
          <div className='flex items-center gap-2'>
            <div className='bg-[#1f2536] p-1.5 rounded-md'>
              {activeWallet.walletType === 'real' ? 
                <Wallet className='w-5 h-5 text-[#7d8da6]' />:
                <div className='w-5 h-5 text-[#7d8da6] flex items-center justify-center text-base'>🎓</div>
              }
            </div>
            <div>
              <div className='text-white text-xs font-medium'>{activeWallet.walletType === 'real' ? 'QT Real': 'QT Demo'}</div>
              <div className='text-white text-xl font-bold'>${activeWallet.balance.toLocaleString()}</div>
            </div>
          </div>
          <div className='border border-[#009af980] text-[#009af9] px-2 py-0.5 rounded text-xs'>
            {activeWallet.currency}
          </div>
        </div>
        
        {activeWallet.walletType === 'real' ? (
          <div className='flex gap-1.5'>
            <button 
              onClick={handleTopUpClick}
              className='flex-1 bg-[#00a86b] hover:bg-[#009860] text-white py-2 rounded-md flex items-center justify-center gap-1.5 transition-colors'
            >
              <Wallet className='w-3.5 h-3.5' />
              <span className='text-xs font-medium'>Top up</span>
            </button>
            <button className='bg-[#1f2536] hover:bg-[#2a3247] text-white p-2 rounded-md transition-colors'>
              <Gift className='w-4 h-4 text-[#7d8da6]' />
            </button>
            <button className='bg-[#1f2536] hover:bg-[#2a3247] text-white p-2 rounded-md transition-colors'>
              <ArrowDownUp className='w-4 h-4 text-[#7d8da6]' />
            </button>
          </div>
        ) : (
          <div className='space-y-1.5'>
            <div className='flex gap-1.5'>
              <button 
                onClick={handleTopUpClick}
                className='flex-1 bg-[#00a86b] hover:bg-[#009860] text-white py-2 rounded-md flex items-center justify-center gap-1.5 transition-colors'
              >
                <Plus className='w-3.5 h-3.5' />
                <span className='text-xs font-medium'>Top up</span>
              </button>
            </div>

            {showTopUpForm && (
              <div className='expand-down overflow-hidden'>
                <div className='bg-[#1f2536] rounded-md p-2.5 space-y-2'>
                  <div>
                    <label className='text-slate-400 text-xs font-medium block mb-1'>
                      Amount to add
                    </label>
                    <div className='relative'>
                      <span className='absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-sm'>$</span>
                      <input
                        type='number'
                        value={topUpAmount}
                        onChange={(e) => setTopUpAmount(e.target.value)}
                        placeholder='0.00'
                        className='w-full bg-[#262c41] text-white pl-6 pr-2 py-1.5 rounded-md border border-[#343e52] focus:border-[#00a86b] focus:outline-none transition-colors text-sm'
                      />
                    </div>
                  </div>

                  <div className='grid grid-cols-4 gap-1.5'>
                    {[1000, 5000, 10000, 50000].map(amount => (
                      <button
                        key={amount}
                        onClick={() => setTopUpAmount(amount.toString())}
                        className='bg-[#262c41] hover:bg-[#343e52] text-slate-300 text-xs py-1 rounded border border-[#343e52] transition-colors'
                      >
                        ${amount / 1000}k
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleDeposit}
                    className='w-full bg-[#00a86b] hover:bg-[#009860] text-white py-1.5 rounded-md font-medium transition-colors text-xs'
                  >
                    Deposit
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Inactive Wallet Account */}
      <div 
        className={`p-3 border-b border-[#343e52] cursor-pointer hover:bg-[#2a3247] transition-colors ${isSwapping ? 'fade-out' : 'fade-in'}`}
        onClick={() => handleWalletSwitch()}
        style={{ animationDelay: '0.05s' }}
      >
        <div className='flex items-center gap-2'>
          <div className='bg-[#1f2536] p-1.5 rounded-md'>
              {activeWallet.walletType === 'demo' ? 
                <Wallet className='w-5 h-5 text-[#7d8da6]' />:
                <div className='w-5 h-5 text-[#7d8da6] flex items-center justify-center text-base'>🎓</div>
              } 
          </div>
          <div className='flex-1'>
            <div className='text-white text-xs'>{activeWallet.walletType === 'demo' ? 'QT Real': 'QT Demo'}</div>
            <div className='text-[#7d8da6] text-xs'>${wallets.find((w) => w.walletType !== activeWallet.walletType).balance.toLocaleString()}</div>
          </div>
          <ChevronDown className='w-4 h-4 text-[#7d8da6] transform -rotate-90' />
        </div>
      </div>

      {/* Forex Account */}
      <div className={`p-3 border-b border-[#343e52] ${isSwapping ? 'fade-out' : 'fade-in'}`} style={{ animationDelay: '0.1s' }}>
        <div className='flex items-center gap-2'>
          <div className='bg-[#1f2536] p-1.5 rounded-md'>
            <div className='w-5 h-5 text-[#7d8da6] flex items-center justify-center'>
              <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                <circle cx='10' cy='6' r='2' />
                <circle cx='5' cy='14' r='2' />
                <circle cx='15' cy='14' r='2' />
                <path d='M10 8v2M5 12l5-4M15 12l-5-4' stroke='currentColor' strokeWidth='1.5' fill='none' />
              </svg>
            </div>
          </div>
          <div className='flex-1'>
            <div className='text-white text-xs'>Forex</div>
          </div>
          <ChevronDown className='w-4 h-4 text-[#7d8da6]' />
        </div>
      </div>

      {/* My Safe */}
      <div className={`p-3 border-b border-[#343e52] ${isSwapping ? 'fade-out' : 'fade-in'}`} style={{ animationDelay: '0.15s' }}>
        <div className='flex items-center gap-2'>
          <div className='bg-[#1f2536] p-1.5 rounded-md'>
            <Lock className='w-5 h-5 text-[#7d8da6]' />
          </div>
          <div className='flex-1'>
            <div className='text-white text-xs'>My Safe</div>
          </div>
          <button className='bg-[#00a86b] hover:bg-[#009860] text-white px-3 py-1 rounded-md text-xs transition-colors'>
            Open
          </button>
        </div>
      </div>

      {/* Profile Button */}
      <div className={`p-3 ${isSwapping ? 'fade-out' : 'fade-in'}`} style={{ animationDelay: '0.2s' }}>
        <button className='w-full bg-[#1f2536] hover:bg-[#2a3247] text-white py-2 rounded-md flex items-center justify-center gap-1.5 transition-colors text-xs'>
          <span>Profile</span>
          <span className='text-base'>»</span>
        </button>
      </div>
    </div>
  );
}