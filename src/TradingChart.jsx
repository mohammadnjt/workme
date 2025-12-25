import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  Chart,
  CandlestickSeries,
  AreaSeries,
  PriceScale,
  TimeScale,
  Pane,
} from "lightweight-charts-react-components";
// import axios from "./services/axiosInstance";
import { usePriceStore } from "./stores/usePriceStore";

// const round5 = (value) => parseFloat(value.toFixed(5));
// const trimSeriesInPlace = (arr, max = 120) => {
//   if (arr.length > max) {
//     arr.splice(0, arr.length - max);
//   }
// };
// const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
// const BAR_INTERVAL_SECONDS = 30;
// const TRADE_AMOUNT = 10;
// const PAYOUT_MULTIPLIER = 1.92;

// const formatSeconds = (totalSeconds) => {
//   const clamped = Math.max(totalSeconds, 0);
//   const minutes = Math.floor(clamped / 60)
//     .toString()
//     .padStart(2, "0");
//   const seconds = Math.floor(clamped % 60)
//     .toString()
//     .padStart(2, "0");
//   return `${minutes}:${seconds}`;
// };

// const useCoinAudio = (audioCtxRef) => {
//   const ensureContext = useCallback(() => {
//     if (typeof window === "undefined") return null;
//     if (!audioCtxRef.current) {
//       const AudioContextClass =
//         window.AudioContext || window.webkitAudioContext;
//       audioCtxRef.current = new AudioContextClass();
//     }
//     if (audioCtxRef.current.state === "suspended") {
//       audioCtxRef.current.resume();
//     }
//     return audioCtxRef.current;
//   }, [audioCtxRef]);

//   const playSequence = useCallback(
//     (tones) => {
//       const ctx = ensureContext();
//       if (!ctx) return;
//       const startAt = ctx.currentTime;

//       tones.forEach(({ freq, offset, duration, gain = 0.22, type = "sine" }) => {
//         const osc = ctx.createOscillator();
//         const g = ctx.createGain();

//         osc.type = type;
//         osc.frequency.setValueAtTime(freq, startAt + offset);

//         g.gain.setValueAtTime(0.0001, startAt + offset);
//         g.gain.exponentialRampToValueAtTime(gain, startAt + offset + 0.01);
//         g.gain.exponentialRampToValueAtTime(0.0001, startAt + offset + duration);

//         osc.connect(g);
//         g.connect(ctx.destination);

//         osc.start(startAt + offset);
//         osc.stop(startAt + offset + duration + 0.05);
//       });
//     },
//     [ensureContext]
//   );

//   const playSound = useCallback(
//     (type) => {
//       switch (type) {
//         case "place":
//           playSequence([
//             { freq: 900, offset: 0, duration: 0.14, gain: 0.25, type: "triangle" },
//             { freq: 1200, offset: 0.1, duration: 0.12, gain: 0.22, type: "sine" },
//           ]);
//           break;
//         case "win":
//           playSequence([
//             { freq: 700, offset: 0, duration: 0.16, gain: 0.28, type: "triangle" },
//             { freq: 950, offset: 0.14, duration: 0.16, gain: 0.3, type: "triangle" },
//             { freq: 1250, offset: 0.28, duration: 0.2, gain: 0.32, type: "triangle" },
//           ]);
//           break;
//         case "lose":
//           playSequence([
//             { freq: 620, offset: 0, duration: 0.18, gain: 0.26, type: "sawtooth" },
//             { freq: 420, offset: 0.16, duration: 0.16, gain: 0.2, type: "sawtooth" },
//           ]);
//           break;
//         default:
//           break;
//       }
//     },
//     [playSequence]
//   );

//   return { playSound, audioCtxRef };
// };

// const createInitialCandles = () => {
//   const candles = [];
//   let currentTime = Math.floor(Date.now() / 1000) - 79 * BAR_INTERVAL_SECONDS;
//   let price = 0.946;

//   for (let i = 0; i < 80; i += 1) {
//     const open = price;
//     const change = (Math.random() - 0.5) * 0.00035;
//     const close = open + change;
//     const high = Math.max(open, close) + Math.random() * 0.00018;
//     const low = Math.min(open, close) - Math.random() * 0.00018;

//     candles.push({
//       time: currentTime,
//       open: round5(open),
//       high: round5(high),
//       low: round5(low),
//       close: round5(close),
//     });

//     price = close;
//     currentTime += BAR_INTERVAL_SECONDS;
//   }
//   return candles;
// };

// const createInitialArea = () => {
//   const area = [];
//   let currentTime = Math.floor(Date.now() / 1000) - 79 * BAR_INTERVAL_SECONDS;
//   let price = 0.946;

//   for (let i = 0; i < 80; i += 1) {
//     const open = price;
//     const change = (Math.random() - 0.5) * 0.00035;
//     const close = open + change;

//     area.push({
//       time: currentTime,
//       value: round5(close),
//     });

//     price = close;
//     currentTime += BAR_INTERVAL_SECONDS;
//   }
//   return area;
// };

export default function TradingChart({ symbol = "XAUUSD" }) {
  const chartRef = useRef(null);
  const timeScaleRef = useRef(null);
  const areaSeriesRef = useRef(null);
  // const candleSeriesRef = useRef(null);
  // const animationAreaRef = useRef(null);
  // const animationCandleRef = useRef(null);
  // const audioCtxRef = useRef(null);
  // const prevMidRef = useRef(null);

  // const initialCandles = useMemo(createInitialCandles, []);
  // const initialArea = useMemo(createInitialArea, []);

  // const areaDataRef = useRef();
  // const candleDataRef = useRef([...initialCandles]);

  // const [chartType, setChartType] = useState("area");
  // const [currentPrice, setCurrentPrice] = useState(() => {
  //   const last = initialArea[initialArea.length - 1];
  //   return last ? last.value : 0;
  // });
  // const [priceChange, setPriceChange] = useState(() => {
  //   if (initialArea.length < 2) return 0;
  //   const last = initialArea[initialArea.length - 1].value;
  //   const prev = initialArea[initialArea.length - 2].value;
  //   return round5(last - prev);
  // });
  const [chartSize, setChartSize] = useState({ width: 960, height: 600 });
  // const [projectionOffset, setProjectionOffset] = useState(5);
  // const [targetLogicalIndex, setTargetLogicalIndex] = useState(
  //   initialArea.length ? initialArea.length - 1 + 5 : null
  // );
  // const [projectionPixel, setProjectionPixel] = useState({ x: null, y: null });
  // const [trades, setTrades] = useState([]);

  const symbolData = usePriceStore((state) => state.symbols[symbol]);
  console.log('symbolData',symbolData)
  console.log('areaSeriesRef',areaSeriesRef)
  // const { playSound } = useCoinAudio(audioCtxRef);

  // const dataSeries =
  //   chartType === "candlestick" ? candleDataRef.current : areaDataRef.current;
  // const dataSeriesLength = dataSeries.length;
  // const lastSeriesPoint = dataSeriesLength
  //   ? dataSeries[dataSeriesLength - 1]
  //   : null;

  // const updateTargetLogicalIndex = useCallback(
  //   (seriesLength) => {
  //     if (!seriesLength) return;
  //     const desired = seriesLength - 1 + projectionOffset;
  //     setTargetLogicalIndex((prev) =>
  //       prev === desired ? prev : desired
  //     );
  //   },
  //   [projectionOffset]
  // );

  // useEffect(() => {
  //   updateTargetLogicalIndex(dataSeriesLength);
  // }, [dataSeriesLength, updateTargetLogicalIndex]);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window === "undefined") return;
      setChartSize({
        width: Math.max(window.innerWidth - 310, 600),
        height: Math.max(window.innerHeight - 150, 480),
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // const getLogicalCoordinate = useCallback((logicalIndex) => {
  //   const scale = timeScaleRef.current?._timeScale;
  //   if (!scale) return null;
  //   const coordinate = scale.logicalToCoordinate(logicalIndex);
  //   return coordinate == null ? null : coordinate;
  // }, []);

  // const getPriceCoordinate = useCallback(
  //   (price) => {
  //     const activeSeries =
  //       chartType === "candlestick"
  //         ? candleSeriesRef.current?._series
  //         : areaSeriesRef.current?._series;
  //     if (!activeSeries) return null;
  //     const coordinate = activeSeries.priceToCoordinate(price);
  //     return coordinate == null ? null : coordinate;
  //   },
  //   [chartType]
  // );

  // const updateProjectionCoordinate = useCallback(() => {
  //   if (!targetLogicalIndex || dataSeriesLength === 0) return;
  //   const timeScale = timeScaleRef.current?._timeScale;
  //   const activeSeries =
  //     chartType === "candlestick"
  //       ? candleSeriesRef.current?._series
  //       : areaSeriesRef.current?._series;

  //   if (!timeScale || !activeSeries) return;

  //   const last =
  //     chartType === "candlestick"
  //       ? candleDataRef.current[candleDataRef.current.length - 1]
  //       : areaDataRef.current[areaDataRef.current.length - 1];
  //   if (!last) return;

  //   const lastValue =
  //     chartType === "candlestick" ? last.close : last.value;

  //   const targetX = timeScale.logicalToCoordinate(targetLogicalIndex);
  //   const targetY = activeSeries.priceToCoordinate(lastValue);

  //   setProjectionPixel({
  //     x: targetX ?? null,
  //     y: targetY ?? null,
  //   });
  // }, [chartType, targetLogicalIndex, dataSeriesLength]);

  // useEffect(() => {
  //   updateProjectionCoordinate();
  // }, [updateProjectionCoordinate, chartSize, chartType, currentPrice]);

  // useEffect(() => {
  //   const handleVisibleRange = () => {
  //     updateProjectionCoordinate();
  //   };
  //   const chartInstance = chartRef.current;
  //   if (!chartInstance || typeof chartInstance.timeScale !== "function") return;
  //   const scale = chartInstance.timeScale();
  //   if (!scale || typeof scale.subscribeVisibleLogicalRangeChange !== "function")
  //     return;
  //   scale.subscribeVisibleLogicalRangeChange(handleVisibleRange);
  //   return () => {
  //     scale.unsubscribeVisibleLogicalRangeChange(handleVisibleRange);
  //   };
  // }, [updateProjectionCoordinate]);

  // useEffect(() => {
  //   return () => {
  //     cancelAnimationFrame(animationAreaRef.current);
  //     cancelAnimationFrame(animationCandleRef.current);
  //   };
  // }, []);

  // const animateAreaTick = useCallback(
  //   ({ time, value }) => {
  //     const arr = areaDataRef.current;
  //     let point = arr[arr.length - 1];
  //     let startValue;
  //     let previousValue;

  //     if (!point || point.time < time) {
  //       const prevVal = point ? point.value : round5(value);
  //       const newPoint = { time, value: prevVal };
  //       arr.push(newPoint);
  //       trimSeriesInPlace(arr);
  //       point = arr[arr.length - 1];
  //       startValue = prevVal;
  //       previousValue = prevVal;
  //       if (chartType === "area" && areaSeriesRef.current?._series) {
  //         areaSeriesRef.current._series.update(newPoint);
  //       }
  //       updateTargetLogicalIndex(arr.length);
  //     } else if (point.time === time) {
  //       startValue = point.value;
  //       previousValue =
  //         arr.length >= 2 ? arr[arr.length - 2].value : point.value;
  //     } else {
  //       return;
  //     }

  //     const targetValue = round5(value);

  //     if (animationAreaRef.current) {
  //       cancelAnimationFrame(animationAreaRef.current);
  //     }

  //     const duration = 420;
  //     const start = performance.now();

  //     const step = (now) => {
  //       const progress = Math.min((now - start) / duration, 1);
  //       const eased = easeOutCubic(progress);
  //       const nextValue = round5(
  //         startValue + (targetValue - startValue) * eased
  //       );

  //       point.value = nextValue;

  //       if (chartType === "area" && areaSeriesRef.current?._series) {
  //         areaSeriesRef.current._series.update({
  //           time: point.time,
  //           value: nextValue,
  //         });
  //       }

  //       if (chartType === "area") {
  //         setCurrentPrice(nextValue);
  //         setPriceChange(round5(nextValue - previousValue));
  //       }

  //       updateProjectionCoordinate();

  //       if (progress < 1) {
  //         animationAreaRef.current = requestAnimationFrame(step);
  //       } else {
  //         point.value = targetValue;
  //         if (chartType === "area" && areaSeriesRef.current?._series) {
  //           areaSeriesRef.current._series.update({
  //             time: point.time,
  //             value: targetValue,
  //           });
  //         }
  //       }
  //     };

  //     animationAreaRef.current = requestAnimationFrame(step);
  //   },
  //   [chartType, updateProjectionCoordinate, updateTargetLogicalIndex]
  // );

  // const animateCandleTick = useCallback(
  //   ({ time, price }) => {
  //     const candles = candleDataRef.current;
  //     let candle = candles[candles.length - 1];

  //     if (!candle || candle.time < time) {
  //       const open = candle ? candle.close : round5(price);
  //       const newCandle = {
  //         time,
  //         open,
  //         high: open,
  //         low: open,
  //         close: open,
  //       };
  //       candles.push(newCandle);
  //       trimSeriesInPlace(candles);
  //       candle = candles[candles.length - 1];
  //       if (chartType === "candlestick" && candleSeriesRef.current?._series) {
  //         candleSeriesRef.current._series.update(newCandle);
  //       }
  //       updateTargetLogicalIndex(candles.length);
  //     } else if (candle.time > time) {
  //       return;
  //     }

  //     const starting = {
  //       close: candle.close,
  //       high: candle.high,
  //       low: candle.low,
  //     };

  //     const targetClose = round5(price);
  //     const targetHigh = round5(Math.max(price, candle.high, candle.open));
  //     const targetLow = round5(Math.min(price, candle.low, candle.open));

  //     const prevClose =
  //       candles.length >= 2
  //         ? candles[candles.length - 2].close
  //         : candle.open;

  //     if (animationCandleRef.current) {
  //       cancelAnimationFrame(animationCandleRef.current);
  //     }

  //     const duration = 650;
  //     const start = performance.now();

  //     const step = (now) => {
  //       const progress = Math.min((now - start) / duration, 1);
  //       const eased = easeOutCubic(progress);

  //       const nextClose = round5(
  //         starting.close + (targetClose - starting.close) * eased
  //       );
  //       const nextHigh = round5(
  //         Math.max(
  //           candle.open,
  //           starting.high + (targetHigh - starting.high) * eased,
  //           nextClose
  //         )
  //       );
  //       const nextLow = round5(
  //         Math.min(
  //           candle.open,
  //           starting.low + (targetLow - starting.low) * eased,
  //           nextClose
  //         )
  //       );

  //       candle.close = nextClose;
  //       candle.high = nextHigh;
  //       candle.low = nextLow;

  //       if (chartType === "candlestick" && candleSeriesRef.current?._series) {
  //         candleSeriesRef.current._series.update({
  //           time: candle.time,
  //           open: candle.open,
  //           high: nextHigh,
  //           low: nextLow,
  //           close: nextClose,
  //         });
  //       }

  //       if (chartType === "candlestick") {
  //         setCurrentPrice(nextClose);
  //         setPriceChange(round5(nextClose - prevClose));
  //       }

  //       updateProjectionCoordinate();

  //       if (progress < 1) {
  //         animationCandleRef.current = requestAnimationFrame(step);
  //       } else {
  //         candle.close = targetClose;
  //         candle.high = targetHigh;
  //         candle.low = targetLow;

  //         if (chartType === "candlestick" && candleSeriesRef.current?._series) {
  //           candleSeriesRef.current._series.update({
  //             time: candle.time,
  //             open: candle.open,
  //             high: candle.high,
  //             low: candle.low,
  //             close: candle.close,
  //           });
  //         }
  //       }
  //     };

  //     animationCandleRef.current = requestAnimationFrame(step);
  //   },
  //   [chartType, updateProjectionCoordinate, updateTargetLogicalIndex]
  // );

  // const checkTrading = useCallback(() => {
  //   const now = Date.now() / 1000;
  //   setTrades((prev) =>
  //     prev.filter(
  //       (trade) =>
  //         trade.status === "pending" ||
  //         trade.expiresAt == null ||
  //         trade.expiresAt > now
  //     )
  //   );
  // }, []);

  // useEffect(() => {// real-time data effect
  //   const midValue = symbolData?.mid;
  //   const numericMid =
  //     typeof midValue === "number" ? midValue : Number(midValue);

  //   if (!Number.isFinite(numericMid)) return;
  //   if (prevMidRef.current === numericMid) return;
  //   prevMidRef.current = numericMid;

  //   const price = round5(numericMid);
  //   const nowSeconds = Math.floor(Date.now() / 1000);
  //   const bucketTime =
  //     Math.floor(nowSeconds / BAR_INTERVAL_SECONDS) * BAR_INTERVAL_SECONDS;

  //   animateAreaTick({ time: nowSeconds, value: price });
  //   animateCandleTick({ time: bucketTime, price });

  //   checkTrading();
  // }, [symbolData?.mid, animateAreaTick, animateCandleTick, checkTrading]);

  // useEffect(() => { // data fetching effect
  //   let isMounted = true;

  //   if (chartType === "area") {
  //     axios
  //       .get("/symbols/area/XAUUSD?startTime=2025-11-07")
  //       .then((res) => {
  //         if (!isMounted) return;
  //         const raw = Array.isArray(res.data?.data) ? res.data.data : [];
  //         const sanitized = raw
  //           .map((point) => ({
  //             time: Number(point.time),
  //             value: round5(Number(point.value)),
  //           }))
  //           .filter((point) => Number.isFinite(point.time) && Number.isFinite(point.value))
  //           .sort((a, b) => a.time - b.time);

  //         if (sanitized.length) {
  //           areaDataRef.current = sanitized;
  //           trimSeriesInPlace(areaDataRef.current);
  //           if (areaSeriesRef.current?._series) {
  //             areaSeriesRef.current._series.setData(areaDataRef.current);
  //           }
  //           updateTargetLogicalIndex(areaDataRef.current.length);
  //           const last = areaDataRef.current[areaDataRef.current.length - 1];
  //           const prev =
  //             areaDataRef.current.length >= 2
  //               ? areaDataRef.current[areaDataRef.current.length - 2].value
  //               : last.value;
  //           setCurrentPrice(last.value);
  //           setPriceChange(round5(last.value - prev));
  //           updateProjectionCoordinate();
  //         }
  //       })
  //       .catch(() => {});
  //   } else {
  //     axios
  //       .get("/symbols/canldes/XAUUSD")
  //       .then((res) => {
  //         if (!isMounted) return;
  //         const raw = Array.isArray(res.data?.data) ? res.data.data : [];
  //         const sanitized = raw
  //           .map((item) => ({
  //             time: Number(item.time),
  //             open: round5(Number(item.open)),
  //             high: round5(Number(item.high)),
  //             low: round5(Number(item.low)),
  //             close: round5(Number(item.close)),
  //           }))
  //           .filter(
  //             (item) =>
  //               Number.isFinite(item.time) &&
  //               Number.isFinite(item.open) &&
  //               Number.isFinite(item.high) &&
  //               Number.isFinite(item.low) &&
  //               Number.isFinite(item.close)
  //           )
  //           .sort((a, b) => a.time - b.time);

  //         if (sanitized.length) {
  //           candleDataRef.current = sanitized;
  //           trimSeriesInPlace(candleDataRef.current);
  //           if (candleSeriesRef.current?._series) {
  //             candleSeriesRef.current._series.setData(candleDataRef.current);
  //           }
  //           updateTargetLogicalIndex(candleDataRef.current.length);
  //           const last = candleDataRef.current[candleDataRef.current.length - 1];
  //           const prev =
  //             candleDataRef.current.length >= 2
  //               ? candleDataRef.current[candleDataRef.current.length - 2].close
  //               : last.close;
  //           setCurrentPrice(last.close);
  //           setPriceChange(round5(last.close - prev));
  //           updateProjectionCoordinate();
  //         }
  //       })
  //       .catch(() => {});
  //   }

  //   return () => {
  //     isMounted = false;
  //   };
  // }, [chartType, updateTargetLogicalIndex, updateProjectionCoordinate]);

  // useEffect(() => { // chart type switch effect
  //   if (chartType === "area") {
  //     const last = areaDataRef.current[areaDataRef.current.length - 1];
  //     const prev =
  //       areaDataRef.current.length >= 2
  //         ? areaDataRef.current[areaDataRef.current.length - 2].value
  //         : last?.value ?? 0;
  //     if (last) {
  //       setCurrentPrice(last.value);
  //       setPriceChange(round5(last.value - prev));
  //     }
  //     if (areaSeriesRef.current?._series) {
  //       areaSeriesRef.current._series.setData(areaDataRef.current);
  //     }
  //   } else {
  //     const last = candleDataRef.current[candleDataRef.current.length - 1];
  //     const prev =
  //       candleDataRef.current.length >= 2
  //         ? candleDataRef.current[candleDataRef.current.length - 2].close
  //         : last?.close ?? 0;
  //     if (last) {
  //       setCurrentPrice(last.close);
  //       setPriceChange(round5(last.close - prev));
  //     }
  //     if (candleSeriesRef.current?._series) {
  //       candleSeriesRef.current._series.setData(candleDataRef.current);
  //     }
  //   }
  //   updateProjectionCoordinate();
  // }, [chartType, updateProjectionCoordinate]);

  // useEffect(() => { // trade resolution effect
  //   if (!trades.length) return;

  //   const resolvedTrades = [];

  //   setTrades((prevTrades) => {
  //     const series =
  //       chartType === "candlestick"
  //         ? candleDataRef.current
  //         : areaDataRef.current;
  //     if (!series.length) return prevTrades;

  //     const lastTime = series[series.length - 1].time;
  //     if (lastTime == null) return prevTrades;

  //     const updated = prevTrades.map((trade) => {
  //       if (trade.status !== "pending" || lastTime < trade.targetTime) {
  //         return trade;
  //       }

  //       const targetPoint = series.find(
  //         (point) => point.time === trade.targetTime
  //       );
  //       if (!targetPoint) {
  //         return trade;
  //       }

  //       const finalPrice =
  //         chartType === "candlestick"
  //           ? targetPoint.close
  //           : targetPoint.value;

  //       const didWin =
  //         trade.side === "buy"
  //           ? finalPrice >= trade.entryPrice
  //           : finalPrice <= trade.entryPrice;

  //       const updatedTrade = {
  //         ...trade,
  //         status: didWin ? "won" : "lost",
  //         resultPrice: finalPrice,
  //         resultTime: targetPoint.time,
  //         returnAmount: didWin ? trade.stake * PAYOUT_MULTIPLIER : 0,
  //         expiresAt: Date.now() / 1000 + 5,
  //       };

  //       resolvedTrades.push(updatedTrade);
  //       return updatedTrade;
  //     });

  //     const now = Date.now() / 1000;
  //     return updated.filter(
  //       (trade) =>
  //         trade.status === "pending" ||
  //         trade.expiresAt == null ||
  //         trade.expiresAt > now
  //     );
  //   });

  //   resolvedTrades.forEach((trade) =>
  //     playSound(trade.status === "won" ? "win" : "lose")
  //   );
  // }, [trades, chartType, playSound]);

  // const baseRightOffset = Math.max(Math.round(dataSeriesLength * 0.15), 4);
  // const targetBuffer =
  //   targetLogicalIndex != null && dataSeriesLength
  //     ? Math.max(targetLogicalIndex - (dataSeriesLength - 1) + 3, 0)
  //     : 0;
  // const rightOffsetBars = Math.max(baseRightOffset, targetBuffer);

  const chartOptions = useMemo(
    () => ({
      layout: {
        background: { type: "solid", color: "transparent" },
        textColor: "#9aa3b5",
        fontSize: 12,
        fontFamily: "'Inter', sans-serif",
      },
      grid: {
        horzLines: { color: "rgba(80, 96, 130, 0.08)" },
        vertLines: { color: "rgba(80, 96, 130, 0.04)" },
      },
      width: chartSize.width,
      height: chartSize.height,
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: {
          top: 0.25,
          bottom: 0.15,
        },
        entireTextOnly: true,
      },
      timeScale: {
        borderVisible: false,
        rightOffset: 10,
        // rightOffset: rightOffsetBars,
        barSpacing: 12,
        fixLeftEdge: true,
        lockVisibleTimeRangeOnResize: true,
        timeVisible: true,
        secondsVisible: false,
        shiftVisibleRangeOnNewBar: false,
        rightBarStaysOnScroll: true,
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: "rgba(130, 160, 210, 0.4)",
          width: 1,
          style: 3,
        },
        horzLine: {
          color: "rgba(130, 160, 210, 0.4)",
          width: 1,
          style: 3,
        },
      },
    }),
    [chartSize]
    // [chartSize, rightOffsetBars]
  );

  const areaOptions = useMemo(
    () => ({
      lineColor: "rgba(54, 148, 255, 1)",
      topColor: "rgba(54, 148, 255, 0.45)",
      bottomColor: "rgba(33, 54, 95, 0)",
      lineWidth: 1.5,
      priceLineColor: "rgba(54, 148, 255, 0.85)",
      priceLineWidth: 1,
      priceLineStyle: 3,
      priceLineVisible: true,
      lastValueVisible: true,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 4,
      lastPriceAnimation: "Continuous",
      pointMarkersVisible: false,
    }),
    []
  );

  // const candlestickOptions = useMemo(
  //   () => ({
  //     upColor: "#2ecc9c",
  //     downColor: "#ef5350",
  //     borderUpColor: "#2ecc9c",
  //     borderDownColor: "#ef5350",
  //     wickUpColor: "#2ecc9c",
  //     wickDownColor: "#ef5350",
  //     borderVisible: false,
  //     wickVisible: true,
  //   }),
  //   []
  // );

  // const lastAreaPointTime =
  //   chartType === "area" && lastSeriesPoint ? lastSeriesPoint.time : null;
  // const lastAreaPointValue =
  //   chartType === "area" && lastSeriesPoint ? lastSeriesPoint.value : null;

  // const areaMarkers = useMemo(() => {
  //   if (chartType !== "area" || lastAreaPointTime == null) return [];
  //   return [
  //     {
  //       time: lastAreaPointTime,
  //       position: "inBar",
  //       color: "#ffffff",
  //       shape: "circle",
  //       size: 3,
  //     },
  //   ];
  // }, [chartType, lastAreaPointTime]);
  // }, [chartType, lastAreaPointTime, lastAreaPointValue]);

  // if (!dataSeriesLength) {
  //   return (
  //     <div
  //       style={{
  //         width: "100vw",
  //         height: "100vh",
  //         display: "flex",
  //         alignItems: "center",
  //         justifyContent: "center",
  //         background:
  //           "linear-gradient(180deg, #0c121f 0%, #070b14 100%)",
  //         color: "#9aa3b5",
  //         fontFamily: "'Inter', sans-serif",
  //       }}
  //     >
  //       در حال بارگذاری نمودار...
  //     </div>
  //   );
  // }

  // const priceColor = priceChange >= 0 ? "#2ecc9c" : "#ef5350";
  // const latestTime = lastSeriesPoint?.time ?? 0;

  return (
    <div
      className="h-full"
      // onClick={() => {
      //   if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      //     audioCtxRef.current.resume();
      //   }
      // }}
    >
      <div
        style={{
          flex: 1,
          height: "100%",
          position: "relative",
          borderRadius: "18px",
          overflow: "hidden",
          border: "1px solid rgba(45, 60, 92, 0.45)",
          boxShadow: "0 24px 48px rgba(3, 8, 18, 0.55)",
        }}
      >
        <div
          style={{
            height: "100%",
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage:
              "repeating-linear-gradient(to right, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 60px)",
          }}
        />
        <div style={{ position: "absolute", inset: 0, padding: "12px 0", height: "100%" }}>
          <Chart options={chartOptions} ref={chartRef}>
            <Pane>
              {/* {chartType === "candlestick" ? (
                <CandlestickSeries
                  ref={candleSeriesRef}
                  data={candleDataRef.current}
                  reactive
                  options={candlestickOptions}
                />
              ) : ( */}
                <AreaSeries
                  ref={areaSeriesRef}
                  data={[]}
                  reactive
                  options={areaOptions}
                  // markers={areaMarkers}
                />
              {/* )} */}
              <PriceScale id="right" />
            </Pane>
            <TimeScale ref={timeScaleRef} />
          </Chart>
        </div>

        {/* <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 2000,
          }}
        >
          {trades.map((trade) => {
            const entryIndex = dataSeries.findIndex(
              (point) => point.time === trade.entryTime
            );
            if (entryIndex === -1) {
              return null;
            }

            const entryX = getLogicalCoordinate(entryIndex);
            const entryY = getPriceCoordinate(trade.entryPrice);
            if (entryX == null || entryY == null) {
              return null;
            }

            const futureTargetIndex = entryIndex + trade.barsToTarget;
            const targetX = getLogicalCoordinate(futureTargetIndex);
            const resultY =
              trade.status !== "pending" && trade.resultPrice != null
                ? getPriceCoordinate(trade.resultPrice)
                : null;

            const remainingSeconds = trade.targetTime - latestTime;
            const isBuy = trade.side === "buy";
            const accent = isBuy ? "#2ecc9c" : "#ef5350";

            const pendingSeconds =
              trade.status === "pending"
                ? Math.max(
                    0,
                    Math.ceil(trade.targetTime - Date.now() / 1000)
                  )
                : 0;

            const isWin = trade.status === "won";
            const resultLabel =
              trade.status === "pending"
                ? ""
                : `${isWin ? "+" : "-"}\\$${(
                    isWin ? trade.returnAmount : trade.stake
                  ).toFixed(2)}`;

            return (
              <React.Fragment key={trade.id}>
                {targetX != null && trade.status === "pending" && (
                  <div
                    style={{
                      position: "absolute",
                      top: "30px",
                      bottom: "12px",
                      left: `${targetX}px`,
                      borderLeft: "2px dashed rgba(255, 193, 7, 0.75)",
                      boxShadow: "0 0 12px rgba(255, 193, 7, 0.35)",
                    }}
                  />
                )}
                <div
                  style={{
                    position: "absolute",
                    left: `${entryX}px`,
                    top: `${entryY + 10}px`,
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "#ffffff",
                    border: `2px solid ${accent}`,
                    transform: "translate(-50%, -50%)",
                    boxShadow: `0 0 12px ${accent}`,
                  }}
                />
                {trade.status === "pending" &&
                  targetX != null &&
                  Math.abs(targetX - entryX) > 2 && (
                    <div
                      style={{
                        position: "absolute",
                        left: `${Math.min(entryX, targetX)}px`,
                        top: `${entryY + 10}px`,
                        width: `${Math.abs(targetX - entryX)}px`,
                        height: "2px",
                        backgroundColor: accent,
                        boxShadow: `0 0 8px ${accent}`,
                      }}
                    />
                  )}

                <div
                  style={{
                    position: "absolute",
                    left: `${entryX}px`,
                    top: `${entryY}px`,
                    transform: "translate(-50%, calc(-100% - 18px))",
                    background: isBuy
                      ? "linear-gradient(135deg, rgba(46,204,156,0.9) 0%, rgba(33,150,83,0.9) 100%)"
                      : "linear-gradient(135deg, rgba(239,83,80,0.9) 0%, rgba(214,48,49,0.9) 100%)",
                    color: "#fff",
                    padding: "8px 12px",
                    borderRadius: "12px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px",
                    boxShadow: `0 10px 24px ${
                      isBuy
                        ? "rgba(46,204,156,0.35)"
                        : "rgba(239,83,80,0.35)"
                    }`,
                    opacity: trade.status === "pending" ? 1 : 0.35,
                  }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {trade.side === "buy" ? "▲" : "▼"} \\$
                    {TRADE_AMOUNT.toFixed(0)}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 500,
                      letterSpacing: "0.08em",
                    }}
                  >
                    {trade.status === "pending"
                      ? formatSeconds(pendingSeconds)
                      : "00:00"}
                  </span>
                </div>

                {trade.status !== "pending" &&
                  targetX != null &&
                  resultY != null && (
                    <>
                      <div
                        style={{
                          position: "absolute",
                          left: `${targetX}px`,
                          top: `${resultY + 10}px`,
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          backgroundColor: isWin ? "#2ecc9c" : "#ef5350",
                          border: "2px solid #ffffff",
                          transform: "translate(-50%, -50%)",
                          boxShadow: `0 0 12px ${
                            isWin ? "#2ecc9c" : "#ef5350"
                          }`,
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          left: `${targetX}px`,
                          top: `${resultY}px`,
                          transform: "translate(-50%, -120%)",
                          background: isWin
                            ? "linear-gradient(135deg, rgba(46,204,156,0.95) 0%, rgba(39,174,96,0.95) 100%)"
                            : "linear-gradient(135deg, rgba(239,83,80,0.95) 0%, rgba(214,48,49,0.95) 100%)",
                          color: "#fff",
                          padding: "10px 14px",
                          borderRadius: "14px",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          boxShadow: isWin
                            ? "0 14px 28px rgba(46,204,156,0.35)"
                            : "0 14px 28px rgba(239,83,80,0.35)",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                          }}
                        >
                          {resultLabel}
                        </span>
                        <span
                          style={{
                            width: "18px",
                            height: "18px",
                            borderRadius: "50%",
                            backgroundColor: "#fff",
                            color: isWin ? accent : "#d63031",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "11px",
                            fontWeight: 700,
                          }}
                        >
                          {isWin ? "✔" : "✖"}
                        </span>
                      </div>
                    </>
                  )}
              </React.Fragment>
            );
          })}
        </div> */}

        {/* {projectionPixel.x != null && (
          <div
            style={{
              position: "absolute",
              top: "30px",
              bottom: "12px",
              left: `${projectionPixel.x}px`,
              width: "0px",
              borderLeft: "2px dashed rgba(255, 193, 7, 0.85)",
              boxShadow: "0 0 12px rgba(255, 193, 7, 0.4)",
              pointerEvents: "none",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: "-24px",
                left: "-24px",
                background:
                  "linear-gradient(135deg, rgba(28,32,45,0.92) 0%, rgba(53,62,87,0.92) 100%)",
                color: "#ffc107",
                padding: "4px 8px",
                borderRadius: "6px",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Target
            </span>
          </div>
        )} */}

        {/* <div
          style={{
            position: "absolute",
            right: "18px",
            top: "24px",
            background:
              "linear-gradient(135deg, rgba(15,22,36,0.9) 0%, rgba(32,47,74,0.9) 100%)",
            borderRadius: "12px",
            padding: "12px 16px",
            border: "1px solid rgba(74, 99, 150, 0.2)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            boxShadow: "0 16px 30px rgba(8, 13, 28, 0.45)",
          }}
        >
          <span
            style={{
              backgroundColor: priceColor,
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              boxShadow: `0 0 12px ${priceColor}`,
            }}
          />
          <span
            style={{
              fontFamily: "'Roboto Mono', monospace",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            {currentPrice.toFixed(5)}
          </span>
        </div> */}
      </div>
    </div>
  );
}