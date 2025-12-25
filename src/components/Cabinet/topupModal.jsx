import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';

export default function DepositModal({ onClose }) {
  const [isClosing, setIsClosing] = useState(false);
  const [hasPromoCode, setHasPromoCode] = useState(true);
  const [amount, setAmount] = useState('30');
  const [promoCode, setPromoCode] = useState('BLACK5');
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

  return (
    <>
      {/* Modal - positioned like BalanceModal */}
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
        `}</style>

        <div className='p-3'>
          {/* Header */}
          <div className='flex items-start justify-between mb-3'>
            <div>
              <h2 className='text-white text-base font-semibold mb-0.5'>Quick account top-up</h2>
              <p className='text-[#8b95ab] text-xs'>Make a deposit to start earning</p>
            </div>
            <button 
              onClick={handleClose}
              className='text-[#6b7588] hover:text-white transition-colors'
            >
              <X className='w-4 h-4' />
            </button>
          </div>

          {/* Payment Method Label */}
          <div className='mb-1.5'>
            <label className='text-white text-xs'>Payment Method</label>
          </div>

          {/* Payment Method Dropdown 1 */}
          <div className='mb-2'>
            <button className='w-full bg-[#1e2332] border border-[#3a4558] rounded-md p-2 flex items-center gap-1.5 hover:border-[#4a5568] transition-colors'>
              <div className='w-5 h-5 bg-white rounded flex items-center justify-center'>
                <div className='w-3 h-3 bg-[#26a17b] rounded-full'></div>
              </div>
              <span className='text-white text-xs flex-1 text-left truncate'>Tether (USDT) TRC-20</span>
              <ChevronDown className='w-3.5 h-3.5 text-[#6b7588]' />
            </button>
          </div>

          {/* Payment Method Dropdown 2 */}
          <div className='mb-2'>
            <button className='w-full bg-[#1e2332] border border-[#3a4558] rounded-md p-2 flex items-center gap-1.5 hover:border-[#4a5568] transition-colors'>
              <div className='relative'>
                <div className='w-5 h-5 bg-[#26a17b] rounded-full flex items-center justify-center'>
                  <span className='text-white text-xs font-bold'>₮</span>
                </div>
                <div className='absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full flex items-center justify-center'>
                  <span className='text-[7px]'>🔥</span>
                </div>
              </div>
              <span className='text-white text-xs flex-1 text-left truncate'>Tether (USDT) TRC-20</span>
              <ChevronDown className='w-3.5 h-3.5 text-[#6b7588]' />
            </button>
          </div>

          {/* Amount Input */}
          <div className='mb-2'>
            <div className='relative'>
              <input
                type='text'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className='w-full bg-[#1e2332] border border-[#3a4558] rounded-md p-2 text-white text-sm pr-8 focus:outline-none focus:border-[#4a5568] transition-colors'
                placeholder='30'
              />
              <div className='absolute right-2 top-1/2 -translate-y-1/2 text-[#6b7588] text-sm'>
                $
              </div>
            </div>
          </div>

          {/* Promo Code Checkbox */}
          <div className='mb-2'>
            <label className='flex items-center gap-1.5 cursor-pointer group'>
              <div 
                onClick={() => setHasPromoCode(!hasPromoCode)}
                className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                  hasPromoCode 
                    ? 'bg-[#009af9] border-[#009af9]' 
                    : 'bg-transparent border-[#4a5568] group-hover:border-[#6b7588]'
                }`}
              >
                {hasPromoCode && <Check className='w-2.5 h-2.5 text-white' />}
              </div>
              <span className='text-white text-xs'>I have a promo code</span>
            </label>
          </div>

          {/* Promo Code Section */}
          {hasPromoCode && (
            <div className='mb-3'>
              <label className='text-white text-xs block mb-1.5'>Promo code</label>
              <input
                type='text'
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className='w-full bg-[#1e2332] border border-[#3a4558] rounded-md p-2 text-white text-xs focus:outline-none focus:border-[#4a5568] transition-colors'
                placeholder='Enter promo code'
              />
            </div>
          )}

          {/* Continue Button */}
          <button className='w-full bg-transparent border border-[#00a86b] text-[#00a86b] py-2 rounded-md text-xs font-medium hover:bg-[#00a86b] hover:text-white transition-all'>
            Continue and pay ${amount}
          </button>
        </div>
      </div>
    </>
  );
}