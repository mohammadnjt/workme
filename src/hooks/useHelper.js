// useHelper.js

/**
 * تبدیل سریع داده به ASCII
 * @param {any} data - داده ورودی (هر نوعی می‌تواند باشد)
 * @returns {number[]} آرایه‌ای از کدهای ASCII
 */
export const toAscii = (data) => {
  const str = typeof data === 'object' ? JSON.stringify(data) : String(data);
  return Array.from(str).map(char => char.charCodeAt(0));
};

/**
 * تبدیل سریع ASCII به داده اصلی
 * @param {number[]} asciiArray - آرایه‌ای از کدهای ASCII
 * @returns {any} داده اصلی
 */
export const fromAscii = (asciiArray) => {
  const str = asciiArray.map(code => String.fromCharCode(code)).join('');
  try { 
    return JSON.parse(str); 
  } catch { 
    return str; 
  }
};

// /**
//  * تبدیل به ASCII با فرمت هگزادسیمال
//  * @param {any} data - داده ورودی
//  * @returns {string[]} آرایه‌ای از کدهای هگزادسیمال
//  */
// export const toAsciiHex = (data) => {
//   const asciiArray = toAscii(data);
//   return asciiArray.map(code => code.toString(16).padStart(2, '0'));
// };

// /**
//  * تبدیل از ASCII هگزادسیمال
//  * @param {string[]} hexArray - آرایه‌ای از کدهای هگزادسیمال
//  * @returns {any} داده اصلی
//  */
// export const fromAsciiHex = (hexArray) => {
//   const asciiArray = hexArray.map(hex => parseInt(hex, 16));
//   return fromAscii(asciiArray);
// };

// /**
//  * تبدیل به رشته ASCII با جداکننده
//  * @param {any} data - داده ورودی
//  * @param {string} separator - جداکننده (پیش‌فرض: فاصله)
//  * @returns {string} رشته ASCII
//  */
// export const toAsciiString = (data, separator = ' ') => {
//   const asciiArray = toAscii(data);
//   return asciiArray.map(code => code.toString()).join(separator);
// };

// /**
//  * تبدیل از رشته ASCII
//  * @param {string} asciiString - رشته ASCII با جداکننده
//  * @param {string} separator - جداکننده (پیش‌فرض: فاصله)
//  * @returns {any} داده اصلی
//  */
// export const fromAsciiString = (asciiString, separator = ' ') => {
//   const asciiArray = asciiString.split(separator).map(Number);
//   return fromAscii(asciiArray);
// };

// /**
//  * بررسی اینکه آیا داده قابل تبدیل به ASCII است
//  * @param {any} data - داده ورودی
//  * @returns {boolean} 
//  */
// export const isAsciiConvertible = (data) => {
//   try {
//     const str = typeof data === 'object' ? JSON.stringify(data) : String(data);
//     return str.length > 0;
//   } catch {
//     return false;
//   }
// };

// /**
//  * دریافت اطلاعات درباره داده ASCII
//  * @param {number[]} asciiArray - آرایه ASCII
//  * @returns {object} اطلاعات داده
//  */
// export const getAsciiInfo = (asciiArray) => {
//   const originalData = fromAscii(asciiArray);
//   return {
//     length: asciiArray.length,
//     originalType: typeof originalData,
//     isJSON: typeof originalData === 'object',
//     sample: originalData.length > 100 ? 
//       originalData.toString().substring(0, 100) + '...' : 
//       originalData.toString()
//   };
// };

/**
 * تبدیل عدد به فرمت تایمر
 * @param {number} seconds 
 * @returns {string} فرمت ثانیه:دقیقه:ساعت 
 */
export const formatTime = (seconds) => {
  // محاسبه ساعت، دقیقه و ثانیه
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  // تبدیل به فرمت دو رقمی با صفر ابتدا
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = secs.toString().padStart(2, '0');
  
  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

export const calculateProfit = (trade, lastPoint) => {
  const priceDiff = Math.abs(lastPoint.value - trade.targetValue);
  const profit = priceDiff * trade.volume;
  return profit.toFixed(2);
};

// export پیش‌فرض تمام توابع
export default {
  toAscii,
  fromAscii,
  formatTime,
  calculateProfit
};