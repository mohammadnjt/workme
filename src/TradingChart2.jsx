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

const round5 = (value) => parseFloat(value.toFixed(5));
const trimSeries = (arr, max = 120) =>
  arr.length > max ? arr.slice(arr.length - max) : arr;
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const BAR_INTERVAL_SECONDS = 30;

export default function TradingChart() {
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const timeScaleRef = useRef(null);
  const animationRef = useRef(null);
  const audioCtxRef = useRef(null);
  const hasBeepedRef = useRef(false);
// console.log('chartRef',chartRef.timeScale)
  const [isRunning, setIsRunning] = useState(true);
  const [chartType, setChartType] = useState("area");
  const [currentPrice, setCurrentPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);
  const [chartSize, setChartSize] = useState({ width: 960, height: 600 });
  const [projectionOffset, setProjectionOffset] = useState(5);
  const [targetLogicalIndex, setTargetLogicalIndex] = useState(null);
  const [projectionPixel, setProjectionPixel] = useState({x:5, y:0});

  const roundRandom = (value) => round5(value);

  const initialCandles = useMemo(() => {
    const candles = [];
    let currentTime = Math.floor(Date.now() / 1000) - 79 * BAR_INTERVAL_SECONDS;
    let price = 0.946;

    for (let i = 0; i < 80; i += 1) {
      const open = price;
      const change = (Math.random() - 0.5) * 0.00035;
      const close = open + change;
      const high = Math.max(open, close) + Math.random() * 0.00018;
      const low = Math.min(open, close) - Math.random() * 0.00018;

      candles.push({
        time: currentTime,
        open: roundRandom(open),
        high: roundRandom(high),
        low: roundRandom(low),
        close: roundRandom(close),
      });

      price = close;
      currentTime += BAR_INTERVAL_SECONDS;
    }
    return candles;
  }, []);

  const initialArea = useMemo(() => {
    const area = [];
    let currentTime = Math.floor(Date.now() / 1000) - 79 * BAR_INTERVAL_SECONDS;
    let price = 0.946;

    for (let i = 0; i < 80; i += 1) {
      const open = price;
      const change = (Math.random() - 0.5) * 0.00035;
      const close = open + change;

      area.push({
        time: currentTime,
        value: roundRandom(close),
      });

      price = close;
      currentTime += BAR_INTERVAL_SECONDS;
    }
    return area;
  }, []);

  const [candleData, setCandleData] = useState(initialCandles);
  const [areaData, setAreaData] = useState(initialArea);

  const processedCandleData = useMemo(() => {
    const sorted = [...candleData].sort((a, b) => a.time - b.time);
    return sorted.filter(
      (item, pos, arr) => pos === 0 || item.time > arr[pos - 1].time
    );
  }, [candleData]);

  const processedAreaData = useMemo(() => {
    const sorted = [...areaData].sort((a, b) => a.time - b.time);
    return sorted.filter(
      (item, pos, arr) => pos === 0 || item.time > arr[pos - 1].time
    );
  }, [areaData]);

  const updateCandle = useCallback((candles, time, patch) => {
    const index = candles.findIndex((c) => c.time === time);
    if (index === -1) return candles;
    const next = [...candles];
    next[index] = { ...next[index], ...patch };
    return next;
  }, []);

  const updateArea = useCallback((points, time, value) => {
    const index = points.findIndex((p) => p.time === time);
    if (index === -1) return points;
    const next = [...points];
    next[index] = { ...next[index], value: round5(value) };
    return next;
  }, []);

  const getLastPointCoordinates = useCallback(() => {
    if (!chartRef.current || !timeScaleRef.current || !seriesRef.current) return;
    console.log('logLastPointCoordinates')

    // const series = seriesRef.current;
    // const timeScale = timeScaleRef.current._timeScale();

    const lastLogicalIndex =
      chartType === "candlestick"
        ? processedCandleData.length - 1
        : processedAreaData.length - 1;

    if (lastLogicalIndex < 0) return;

    const lastValue =
      chartType === "candlestick"
        ? processedCandleData[lastLogicalIndex].close
        : processedAreaData[lastLogicalIndex].value;

    const x = timeScaleRef.current._timeScale.logicalToCoordinate(lastLogicalIndex);
    console.log('x>>>', x)
    const y = seriesRef.current._series.priceToCoordinate(lastValue);
    console.log('y>>>', y)

    if (x != null && y != null) {
      console.log("📍 مختصات آخرین نقطه در پن: ", { x, y });
    }
    return {x, y}
  }, [chartType, processedAreaData, processedCandleData]);

  const animateCandle = useCallback(
    ({ time, open, targetClose, targetHigh, targetLow, prevClose }) => {
      console.log('targetHigh', targetHigh)
      console.log('targetLow', targetLow)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      const duration = 650;
      const start = performance.now();

      const frame = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = easeOutCubic(progress);
        const interpolated = open + (targetClose - open) * eased;

        const close = round5(interpolated);
        const high = round5(Math.max(open, targetHigh, interpolated));
        const low = round5(Math.min(open, targetLow, interpolated));

        setCandleData((prev) => updateCandle(prev, time, { close, high, low }));
        setAreaData((prev) => updateArea(prev, time, close));

        setCurrentPrice(close);
        setPriceChange(round5(close - prevClose));

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(frame);
        } else {
          setCandleData((prev) =>
            updateCandle(prev, time, {
              close: targetClose,
              high: round5(Math.max(targetHigh, targetClose, open)),
              low: round5(Math.min(targetLow, targetClose, open)),
            })
          );
          setAreaData((prev) => updateArea(prev, time, targetClose));
          setCurrentPrice(targetClose);
          setPriceChange(round5(targetClose - prevClose));
        }
      };

      animationRef.current = requestAnimationFrame(frame);
    },
    [updateArea, updateCandle]
  );

  useEffect(() => {
    if (candleData.length > 0) {
      const last = candleData[candleData.length - 1].close;
      const prev =
        candleData.length >= 2 ? candleData[candleData.length - 2].close : last;
      setCurrentPrice(round5(last));
      setPriceChange(round5(last - prev));
    }
  }, [candleData]);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window === "undefined") return;
      setChartSize({
        width: Math.max(window.innerWidth - 600, 600),
        height: Math.max(window.innerHeight - 160, 480),
        // width: Math.max(window.innerWidth - 360, 640),
        // height: Math.max(window.innerHeight - 120, 480),
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (processedAreaData.length > 0 && targetLogicalIndex === null) {
      const lastIndex = processedAreaData.length - 1;
      setTargetLogicalIndex(lastIndex + projectionOffset);
    }
  }, [projectionOffset, processedAreaData, targetLogicalIndex]);

  useEffect(() => {
    if (!isRunning || candleData.length === 0) return;

    const interval = setInterval(() => {
      setCandleData((prevCandles) => {
        const lastCandle = prevCandles[prevCandles.length - 1];
        const prevClose = lastCandle.close;
        const newTime = lastCandle.time + BAR_INTERVAL_SECONDS;
        const open = prevClose;
        const change = (Math.random() - 0.5) * 0.0004;
        const targetClose = round5(open + change);
        const targetHigh = round5(
          Math.max(open, targetClose) + Math.random() * 0.00016
        );
        const targetLow = round5(
          Math.min(open, targetClose) - Math.random() * 0.00016
        );

        const newShell = {
          time: newTime,
          open: round5(open),
          high: round5(open),
          low: round5(open),
          close: round5(open),
        };

        const appended = [...prevCandles, newShell];
        const trimmedCandles = trimSeries(appended);

        setAreaData((prevArea) => {
          const newAreaPoint = { time: newTime, value: round5(open) };
          const appendedArea = [...prevArea, newAreaPoint];
          return trimSeries(appendedArea);
        });

        setCurrentPrice(round5(open));
        setPriceChange(0);

        requestAnimationFrame(() => {
          animateCandle({
            time: newTime,
            open: round5(open),
            targetClose,
            targetHigh,
            targetLow,
            prevClose,
          });
        });

        return trimmedCandles;
      });
    }, 2200);

    return () => {
      clearInterval(interval);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, animateCandle, candleData.length]);

  useEffect(() => {
    const rAF = requestAnimationFrame(() => {
      getLastPointCoordinates();
    });
    return () => cancelAnimationFrame(rAF);
  }, [getLastPointCoordinates, processedAreaData, processedCandleData, chartType]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const lastLogicalIndex =
    processedAreaData.length > 0 ? processedAreaData.length - 1 : 0;

  const remainingBars =
    targetLogicalIndex !== null
      ? Math.max(targetLogicalIndex - lastLogicalIndex, 0)
      : null;

  const playBeep = useCallback(() => {
    if (typeof window === "undefined") return;
    if (!audioCtxRef.current) {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = "triangle";
    oscillator.frequency.value = 960;
    gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.3);
  }, []);

  useEffect(() => {
    if (
      targetLogicalIndex !== null &&
      lastLogicalIndex >= targetLogicalIndex &&
      !hasBeepedRef.current
    ) {
      playBeep();
      hasBeepedRef.current = true;
    }
  }, [lastLogicalIndex, targetLogicalIndex, playBeep]);

  const updateProjectionCoordinate = useCallback(() => {
    if (!chartRef.current || !(timeScaleRef.current && timeScaleRef.current._timeScale) || !seriesRef.current) return;
console.log('updateProjectionCoordinate', targetLogicalIndex)
    const lastLogicalIndex =
      chartType === "candlestick"
        ? processedCandleData.length - 1
        : processedAreaData.length - 1;

    if (lastLogicalIndex < 0) return;

    const lastValue =
      chartType === "candlestick"
        ? processedCandleData[lastLogicalIndex].close
        : processedAreaData[lastLogicalIndex].value;

        console.log('timeScaleRef.current',timeScaleRef.current)
    const x = timeScaleRef.current._timeScale.logicalToCoordinate(lastLogicalIndex);
    // const x = timeScaleRef.current._timeScale.logicalToCoordinate(targetLogicalIndex);
    const y = seriesRef.current._series.priceToCoordinate(lastValue);
    if (x != null && y != null) {
      console.log('{x,y}', {x,y})
      setProjectionPixel({x,y});
    }
  }, [chartType, processedAreaData, processedCandleData, targetLogicalIndex]);

  useEffect(() => {
    updateProjectionCoordinate();
  }, [updateProjectionCoordinate, chartSize, processedAreaData]);

  useEffect(() => {
    const handleResize = () => {
      updateProjectionCoordinate();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateProjectionCoordinate]);

  useEffect(() => {
    if (!chartRef.current || !chartRef.current.timeScale) return;
    const scale = chartRef.current.timeScale();
    if (!scale) return;
    const handleVisibleLogicalRange = () => {
      updateProjectionCoordinate();
    };
    scale.subscribeVisibleLogicalRangeChange(handleVisibleLogicalRange);
    return () => {
      scale.unsubscribeVisibleLogicalRangeChange(handleVisibleLogicalRange);
    };
  }, [updateProjectionCoordinate]);

  const handleProjectionOffsetChange = (event) => {
    const parsed = parseInt(event.target.value, 10);
    const safeValue = Number.isNaN(parsed) ? 1 : Math.max(parsed, 1);
    console.log('handleProjectionOffsetChange')
    setProjectionOffset(safeValue);
    if (processedAreaData.length > 0) {
      const currentLastIndex = processedAreaData.length - 1;
      setTargetLogicalIndex(currentLastIndex + safeValue);
      hasBeepedRef.current = false;
      requestAnimationFrame(updateProjectionCoordinate);
    }
  };

  const baseRightOffset = Math.max(
    Math.round(processedAreaData.length * 0.15),
    4
  );
  const targetBuffer =
    targetLogicalIndex !== null
      ? Math.max(targetLogicalIndex - lastLogicalIndex + 3, 0)
      : 0;
  const rightOffsetBars = Math.max(baseRightOffset, targetBuffer);

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
        rightOffset: rightOffsetBars,
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
    [chartSize, rightOffsetBars]
  );

  const areaOptions = useMemo(
    () => ({
      lineColor: "rgba(54, 148, 255, 1)",
      topColor: "rgba(54, 148, 255, 0.45)",
      bottomColor: "rgba(33, 54, 95, 0)",
      lineWidth: 3,
      priceLineColor: "rgba(54, 148, 255, 0.85)",
      priceLineWidth: 2,
      priceLineStyle: 3,
      priceLineVisible: true,
      lastValueVisible: true,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 6,
      lastPriceAnimation: "Continuous",
      pointMarkersVisible: false,
    }),
    []
  );

  const candlestickOptions = useMemo(
    () => ({
      upColor: "#2ecc9c",
      downColor: "#ef5350",
      borderUpColor: "#2ecc9c",
      borderDownColor: "#ef5350",
      wickUpColor: "#2ecc9c",
      wickDownColor: "#ef5350",
      borderVisible: false,
      wickVisible: true,
    }),
    []
  );

  const areaMarkers = useMemo(() => {
    if (chartType !== "area" || processedAreaData.length === 0) return [];
    const last = processedAreaData[processedAreaData.length - 1];
    return [
      {
        time: last.time,
        position: "inBar",
        color: "#ffffff",
        shape: "circle",
        size: 3,
      },
    ];
  }, [processedAreaData, chartType]);

  if (candleData.length === 0) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(180deg, #0c121f 0%, #070b14 100%)",
          color: "#9aa3b5",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        در حال بارگذاری نمودار...
      </div>
    );
  }

  const foreCast = (op = 'buy') => {
    console.log('op',op)
    const {x,y} = getLastPointCoordinates();
    console.log('x',x)
    console.log('y',y)
    setProjectionPixel({x, y});
  }

  const priceColor = priceChange >= 0 ? "#2ecc9c" : "#ef5350";

  console.log('ProjectionPixel', projectionPixel)

  return (
    <div
      onClick={() => {
        if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
          audioCtxRef.current.resume();
        }
      }}
      style={{
        width: "100vw",
        height: "100vh",
        backgroundImage:
          "linear-gradient(180deg, rgba(5,8,17,0.92) 0%, rgba(9,14,25,1) 60%, rgba(3,5,11,1) 100%), url('https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        color: "#d8dfeb",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* پنل سمت چپ */}
      <div
        style={{
          width: "260px",
          backgroundColor: "rgba(11, 16, 26, 0.85)",
          borderRight: "1px solid rgba(70, 85, 120, 0.2)",
          backdropFilter: "blur(18px)",
          padding: "24px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* هدر نماد */}
        <div
          style={{
            borderBottom: "1px solid rgba(70, 85, 120, 0.15)",
            paddingBottom: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <span style={{ fontSize: "17px", fontWeight: 600 }}>
              AUD/CAD OTC
            </span>
            <span
              style={{
                fontSize: "11px",
                color: "#6f7c96",
                backgroundColor: "rgba(111,124,150,0.15)",
                padding: "4px 8px",
                borderRadius: "6px",
              }}
            >
              OTC
            </span>
          </div>
          <div style={{ fontSize: "11px", color: "#6f7c96" }}>
            {new Date().toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            UTC+1
          </div>
        </div>

        {/* انتخاب نوع نمودار */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setChartType("area")}
            style={{
              flex: 1,
              padding: "10px 12px",
              background:
                chartType === "area"
                  ? "linear-gradient(135deg, #326aff 0%, #29b6f6 100%)"
                  : "rgba(34, 45, 70, 0.65)",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: 600,
              transition: "all 0.25s ease",
              boxShadow:
                chartType === "area"
                  ? "0 8px 18px rgba(41, 150, 255, 0.25)"
                  : "none",
            }}
          >
            Area
          </button>
          <button
            onClick={() => setChartType("candlestick")}
            style={{
              flex: 1,
              padding: "10px 12px",
              background:
                chartType === "candlestick"
                  ? "linear-gradient(135deg, #7c4dff 0%, #536dfe 100%)"
                  : "rgba(34, 45, 70, 0.65)",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: 600,
              transition: "all 0.25s ease",
              boxShadow:
                chartType === "candlestick"
                  ? "0 8px 18px rgba(119, 90, 255, 0.28)"
                  : "none",
            }}
          >
            Candle
          </button>
        </div>

        {/* قیمت فعلی */}
        <div
          style={{
            background:
              "linear-gradient(180deg, rgba(32,46,71,0.75) 0%, rgba(20,29,48,0.9) 100%)",
            borderRadius: "12px",
            padding: "18px",
            border: "1px solid rgba(74, 99, 150, 0.2)",
            boxShadow: "0 12px 24px rgba(5, 12, 25, 0.45)",
          }}
        >
          <div
            style={{
              color: "#7f8dab",
              fontSize: "11px",
              marginBottom: "10px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Current Price
          </div>
          <div
            style={{
              color: priceColor,
              fontSize: "30px",
              fontWeight: 700,
              fontFamily: "'Roboto Mono', monospace",
            }}
          >
            {currentPrice.toFixed(5)}
          </div>
          <div
            style={{
              color: priceColor,
              fontSize: "12px",
              marginTop: "6px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>{priceChange >= 0 ? "▲" : "▼"}</span>
            <span>{Math.abs(priceChange).toFixed(5)}</span>
          </div>
        </div>

        {/* تنظیم فاصله ستون هدف */}
        <div
          style={{
            padding: "16px",
            borderRadius: "12px",
            border: "1px solid rgba(74, 99, 150, 0.2)",
            background: "rgba(23,32,52,0.55)",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <span style={{ fontSize: "12px", color: "#7f8dab" }}>
            Projection lead (bars)
          </span>
          <input
            type="number"
            min={5}
            value={projectionOffset}
            onChange={handleProjectionOffsetChange}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid rgba(74, 99, 150, 0.4)",
              backgroundColor: "rgba(16,22,38,0.8)",
              color: "#d8dfeb",
              fontFamily: "'Roboto Mono', monospace",
              fontSize: "14px",
              outline: "none",
            }}
          />
          {remainingBars !== null && (
            <span style={{ fontSize: "11px", color: "#9aa3b5" }}>
              فاصله باقی‌مانده: {remainingBars} کندل
            </span>
          )}
        </div>

        {/* وضعیت زنده */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "14px 16px",
            borderRadius: "10px",
            border: `1px solid ${
              isRunning
                ? "rgba(46, 204, 156, 0.35)"
                : "rgba(239, 83, 80, 0.35)"
            }`,
            backgroundColor: isRunning
              ? "rgba(46, 204, 156, 0.12)"
              : "rgba(239, 83, 80, 0.12)",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: isRunning ? "#2ecc9c" : "#ef5350",
              boxShadow: isRunning
                ? "0 0 12px rgba(46, 204, 156, 0.7)"
                : "0 0 12px rgba(239, 83, 80, 0.5)",
              animation: isRunning ? "pulse 2s ease-in-out infinite" : "none",
            }}
          />
          <span
            style={{
              color: isRunning ? "#2ecc9c" : "#ef5350",
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.08em",
            }}
          >
            {isRunning ? "LIVE" : "PAUSED"}
          </span>
        </div>

        {/* کلید توقف/ادامه */}
        <button
          onClick={() => setIsRunning((prev) => !prev)}
          style={{
            marginTop: "auto",
            padding: "14px",
            borderRadius: "12px",
            border: "none",
            cursor: "pointer",
            color: "#fff",
            fontSize: "13px",
            fontWeight: 600,
            letterSpacing: "0.05em",
            background: isRunning
              ? "linear-gradient(135deg, #ef5350 0%, #eb3b5a 100%)"
              : "linear-gradient(135deg, #2ecc9c 0%, #1abc9c 100%)",
            boxShadow: isRunning
              ? "0 12px 24px rgba(239, 83, 80, 0.35)"
              : "0 12px 24px rgba(26, 188, 156, 0.30)",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
        >
          {isRunning ? "⏸ توقف لحظه‌ای" : "▶️ ادامه جریان"}
        </button>
      </div>

      {/* ناحیه اصلی نمودار */}
      <div
        style={{
          flex: 1,
          position: "relative",
          padding: "24px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 18px",
            borderRadius: "14px",
            background:
              "linear-gradient(135deg, rgba(36,48,72,0.65) 0%, rgba(17,24,40,0.85) 100%)",
            border: "1px solid rgba(74, 99, 150, 0.2)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span
              style={{
                fontSize: "13px",
                color: "#7f8dab",
                letterSpacing: "0.08em",
              }}
            >
              Expiration Time
            </span>
            <span style={{ fontSize: "18px", fontWeight: 600 }}>00:00:45</span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "6px",
            }}
          >
            <span style={{ fontSize: "13px", color: "#7f8dab" }}>Timer</span>
            <span
              style={{
                fontSize: "20px",
                fontWeight: 600,
                letterSpacing: "0.1em",
              }}
            >
              00:28
            </span>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            position: "relative",
            borderRadius: "18px",
            overflow: "hidden",
            border: "1px solid rgba(45, 60, 92, 0.45)",
            background:
              "radial-gradient(circle at top, rgba(54, 148, 255, 0.12), transparent 65%), rgba(12, 17, 28, 0.92)",
            boxShadow: "0 24px 48px rgba(3, 8, 18, 0.55)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: "0",
              pointerEvents: "none",
              backgroundImage:
                "repeating-linear-gradient(to right, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 60px)",
            }}
          />
          <div style={{ position: "absolute", inset: 0, padding: "12px 0" }}>
            <Chart options={chartOptions} ref={chartRef}>
              <Pane>
                {chartType === "candlestick" ? (
                  <CandlestickSeries
                    ref={seriesRef}
                    data={processedCandleData}
                    reactive
                    options={candlestickOptions}
                  />
                ) : (
                  <AreaSeries
                    ref={seriesRef}
                    data={processedAreaData}
                    reactive
                    options={areaOptions}
                    markers={areaMarkers}
                  />
                )}
                <PriceScale id="right" />
              </Pane>
              <TimeScale ref={timeScaleRef} />
            </Chart>
          </div>

          {/* خط عمودی هدف */}
          {projectionPixel.x && (
            <div
              style={{
                position: "absolute",
                top: "30px",
                bottom: "12px",
                left: `${projectionPixel.x + targetLogicalIndex}px`,
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
          )}

          {/* لیبل قیمت بالا راست */}
          <div
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
          </div>
        </div>
      </div>

      {/* پنل سمت راست */}
      <div
        style={{
          width: "220px",
          padding: "24px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          backgroundColor: "rgba(11, 16, 26, 0.78)",
          borderLeft: "1px solid rgba(70, 85, 120, 0.2)",
          backdropFilter: "blur(14px)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            padding: "18px",
            borderRadius: "14px",
            border: "1px solid rgba(74, 99, 150, 0.25)",
            background:
              "linear-gradient(180deg, rgba(18,26,44,0.8) 0%, rgba(9,14,24,0.9) 100%)",
          }}
        >
          <span style={{ fontSize: "12px", color: "#7f8dab" }}>
            Trade Amount
          </span>
          <span
            style={{
              fontSize: "20px",
              fontWeight: 600,
              fontFamily: "'Roboto Mono', monospace",
            }}
          >
            \$100
          </span>
        </div>

        <div style={{ display: "grid", gap: "14px" }}>
          <button
            style={{
              padding: "14px",
              borderRadius: "14px",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: 700,
              color: "#fff",
              background:
                "linear-gradient(135deg, #2ecc9c 0%, #27ae60 100%)",
              boxShadow: "0 18px 32px rgba(39, 174, 96, 0.35)",
              letterSpacing: "0.08em",
            }}
            onClick={() => foreCast('buy')}
          >
            BUY ▲
          </button>
          <button
            style={{
              padding: "14px",
              borderRadius: "14px",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: 700,
              color: "#fff",
              background:
                "linear-gradient(135deg, #ef5350 0%, #d81b60 100%)",
              boxShadow: "0 18px 32px rgba(216, 27, 96, 0.35)",
              letterSpacing: "0.08em",
            }}
            // onClick={() => setProjectionPixel(3)}
          >
            SELL ▼
          </button>
        </div>

        <div
          style={{
            marginTop: "auto",
            fontSize: "11px",
            color: "#6f7c96",
            lineHeight: 1.6,
          }}
        >
          * این قسمت نمایشی است؛ برای اتصال واقعی می‌توانید آن را با API صرافی یا
          سرویس سیگنال خود هماهنگ کنید.
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.25); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}