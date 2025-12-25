/* ---------------------------- تنظیمات عمومی ---------------------------- */
const BAR_INTERVAL_SECONDS = 60; // هر کندل دقیقه‌ای
const REALTIME_UPDATE_MS = 2000; // آپدیت لحظه‌ای
const MAX_DATA_POINTS = 240;
const TRADE_AMOUNT = 10;
const PAYOUT_MULTIPLIER = 1.92;

const round5 = (value) => parseFloat(value.toFixed(5));
export function trimSeries(arr, max = MAX_DATA_POINTS){
    arr.length > max ? arr.slice(arr.length - max) : arr;
}
export function formatSeconds(totalSeconds) {
  const clamped = Math.max(totalSeconds, 0);
  const minutes = Math.floor(clamped / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(clamped % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export function createInitialCandles () {
  console.log('createInitialCandles',)
  const candles = [];
  const count = 100;
  let currentTime =
    Math.floor(Date.now() / 1000) - (count - 1) * BAR_INTERVAL_SECONDS;
  let direction = Math.random() > 0.5 ? 1 : -1;
  let volatility = 0.00018 + Math.random() * 0.00022;
  let price = 0.946;

  for (let i = 0; i < count; i += 1) {
    const open = price;
    if (Math.random() < 0.2) direction *= -1;
    if (Math.random() < 0.25) volatility = 0.00015 + Math.random() * 0.00035;

    const drift = direction * volatility * (0.6 + Math.random());
    const noise = (Math.random() - 0.5) * volatility * 1.4;
    const close = round5(open + drift + noise);

    const high = round5(
      Math.max(open, close) + Math.random() * volatility * 0.9
    );
    const low = round5(Math.min(open, close) - Math.random() * volatility * 0.9);

    candles.push({ time: currentTime, open: round5(open), high, low, close });
    price = close;
    currentTime += BAR_INTERVAL_SECONDS;
  }
  return candles;
};


export {
    BAR_INTERVAL_SECONDS,
    REALTIME_UPDATE_MS,
    MAX_DATA_POINTS,
    TRADE_AMOUNT,
    PAYOUT_MULTIPLIER,
    round5
}

