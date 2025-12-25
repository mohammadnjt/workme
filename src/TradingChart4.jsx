// components/TradingChart.jsx
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
import { usePriceStore } from "./stores/usePriceStore";
import axios from "./services/axiosInstance";

const round5 = (value) => parseFloat(value.toFixed(5));
const trimSeries = (arr, max = 120) =>
  arr.length > max ? arr.slice(arr.length - max) : arr;
const BAR_INTERVAL_SECONDS = 30;
const TRADE_AMOUNT = 10;
const PAYOUT_MULTIPLIER = 1.92;

const formatSeconds = (totalSeconds) => {
  const clamped = Math.max(totalSeconds, 0);
  const minutes = Math.floor(clamped / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(clamped % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
};

/* ------------------------------- هوک صدا ------------------------------- */
const useCoinAudio = (audioCtxRef) => {
  // const audioCtxRef = useRef(null);

  const ensureContext = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!audioCtxRef.current) {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playSequence = useCallback(
    (tones) => {
      const ctx = ensureContext();
      if (!ctx) return;
      const startAt = ctx.currentTime;

      tones.forEach(({ freq, offset, duration, gain = 0.22, type = "sine" }) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, startAt + offset);

        g.gain.setValueAtTime(0.0001, startAt + offset);
        g.gain.exponentialRampToValueAtTime(gain, startAt + offset + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, startAt + offset + duration);

        osc.connect(g);
        g.connect(ctx.destination);

        osc.start(startAt + offset);
        osc.stop(startAt + offset + duration + 0.05);
      });
    },
    [ensureContext]
  );

  const playSound = useCallback(
    (type) => {
      switch (type) {
        case "place":
          playSequence([
            { freq: 900, offset: 0, duration: 0.14, gain: 0.25, type: "triangle" },
            { freq: 1200, offset: 0.1, duration: 0.12, gain: 0.22, type: "sine" },
          ]);
          break;
        case "win":
          playSequence([
            { freq: 700, offset: 0, duration: 0.16, gain: 0.28, type: "triangle" },
            { freq: 950, offset: 0.14, duration: 0.16, gain: 0.30, type: "triangle" },
            { freq: 1250, offset: 0.28, duration: 0.2, gain: 0.32, type: "triangle" },
          ]);
          break;
        case "lose":
          playSequence([
            { freq: 620, offset: 0, duration: 0.18, gain: 0.26, type: "sawtooth" },
            { freq: 420, offset: 0.16, duration: 0.16, gain: 0.2, type: "sawtooth" },
          ]);
          break;
        default:
          break;
      }
    },
    [playSequence]
  );

  return { playSound, audioCtxRef };
};

export default function TradingChart({ symbol = "XAUUSD" }) {
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const timeScaleRef = useRef(null);
  const audioCtxRef = useRef(null);
  const prevMidRef = useRef(null);

  const symbolData = usePriceStore((state) => state.symbols[symbol]);

  const [chartType, setChartType] = useState("area");
  const [currentPrice, setCurrentPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);
  const [chartSize, setChartSize] = useState({ width: 960, height: 600 });
  const [projectionOffset, setProjectionOffset] = useState(5);
  const [targetLogicalIndex, setTargetLogicalIndex] = useState(null);
  const [projectionPixel, setProjectionPixel] = useState({ x: null, y: null });
  const [trades, setTrades] = useState([]);
  console.log('chartSize',chartSize)

  const { playSound } = useCoinAudio(audioCtxRef);

  const [candleData, setCandleData] = useState([]);
  const [areaData, setAreaData] = useState([]);
  const [areaData2, setAreaData2] = useState([]);
  console.log('areaData',areaData)
  console.log('areaData2',areaData2)

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
  console.log('processedAreaData', processedAreaData)

  // get cached Data
  useEffect(() => {
    if(chartType === 'area')
      axios.get('/symbols/area/XAUUSD?startTime=2025-11-07')
      .then((res) => {
        setAreaData2(res.data.data)
        console.log('eres', res.data)
      })
      .catch((error) => console.log('error get history', error))
    else if(chartType === 'canlde')
      axios.get('/symbols/canldes/XAUUSD')
      .then((res) => {
        setCandleData(res.data.data)
        console.log('eres', res)
      })
      .catch((error) => console.log('error get history', error))
  }, [chartType])

  useEffect(() => {
    const midValue = symbolData?.mid;
    const numericMid =
      typeof midValue === "number" ? midValue : Number(midValue);

    if (!Number.isFinite(numericMid)) return;
    if (prevMidRef.current === numericMid) return;
    prevMidRef.current = numericMid;

    const price = round5(numericMid);
    const nowSeconds = Math.floor(Date.now() / 1000);
    const bucketTime =
      Math.floor(nowSeconds / BAR_INTERVAL_SECONDS) * BAR_INTERVAL_SECONDS;

    setAreaData2((prev) => {
      const point = { time: nowSeconds, value: price };
      if (prev.length === 0) {
        return [point];
      }
      const last = prev[prev.length - 1];
      if (last.time === point.time) {
        if (last.value === price) return prev;
        const next = [...prev];
        next[next.length - 1] = point;
        return next;
      }
      const appended = [...prev, point];
      return trimSeries(appended);
    });

    // setAreaData((prev) => {
    //   const point = { time: nowSeconds, value: price };
    //   if (prev.length === 0) {
    //     return [point];
    //   }
    //   const last = prev[prev.length - 1];
    //   if (last.time === point.time) {
    //     if (last.value === price) return prev;
    //     const next = [...prev];
    //     next[next.length - 1] = point;
    //     return next;
    //   }
    //   const appended = [...prev, point];
    //   return trimSeries(appended);
    // });

    setCandleData((prev) => {
      if (prev.length === 0) {
        return [
          {
            time: bucketTime,
            open: price,
            high: price,
            low: price,
            close: price,
          },
        ];
      }

      const last = prev[prev.length - 1];

      if (last.time === bucketTime) {
        const updated = {
          ...last,
          high: round5(Math.max(last.high, price)),
          low: round5(Math.min(last.low, price)),
          close: price,
        };
        const next = [...prev];
        next[next.length - 1] = updated;
        return next;
      }

      if (bucketTime > last.time) {
        const newCandle = {
          time: bucketTime,
          open: price,
          high: price,
          low: price,
          close: price,
        };
        const appended = [...prev, newCandle];
        return trimSeries(appended);
      }

      return prev;
    });

    checkTrading();
  }, [symbolData?.mid]);

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
      console.log('window.innerWidth',window.innerWidth)
      if (typeof window === "undefined") return;
      setChartSize({
        width: Math.max(window.innerWidth - 310, 100),
        height: Math.max(window.innerHeight - 150, 850),
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const checkTrading = () => {
    const ts = Date.now() / 1000;
    if (trades.find((trade) => trade.expiresAt != null && trade.expiresAt > ts)) {
      setTrades(
        trades.filter(
          (trade) => !(trade.expiresAt != null && trade.expiresAt > ts)
        )
      );
    }
  };

  const dataSeries =
    chartType === "candlestick" ? processedCandleData : areaData2;
    // chartType === "candlestick" ? processedCandleData : processedAreaData;

  useEffect(() => {
    if (dataSeries.length === 0) return;
    const lastIndex = dataSeries.length - 1;
    const desiredTarget = lastIndex + projectionOffset;
    if (targetLogicalIndex !== desiredTarget) {
      setTargetLogicalIndex(desiredTarget);
    }
  }, [dataSeries, projectionOffset, targetLogicalIndex]);

  const getLogicalCoordinate = useCallback((logicalIndex) => {
    const scale = timeScaleRef.current?._timeScale;
    if (!scale) return null;
    const coordinate = scale.logicalToCoordinate(logicalIndex);
    return coordinate == null ? null : coordinate;
  }, []);

  const getPriceCoordinate = useCallback((price) => {
    const series = seriesRef.current?._series;
    if (!series) return null;
    const coordinate = series.priceToCoordinate(price);
    return coordinate == null ? null : coordinate;
  }, []);

  const updateProjectionCoordinate = useCallback(() => {
    if (
      !chartRef.current ||
      !timeScaleRef.current ||
      !timeScaleRef.current._timeScale ||
      !seriesRef.current
    )
      return;
    if (targetLogicalIndex == null) return;

    const targetX =
      timeScaleRef.current._timeScale.logicalToCoordinate(targetLogicalIndex);

    const lastIndex = dataSeries.length - 1;
    if (lastIndex < 0) return;

    const lastValue =
      chartType === "candlestick"
        ? processedCandleData[lastIndex].close
        : areaData2[lastIndex].value;
        // : processedAreaData[lastIndex].value;

    const targetY = seriesRef.current._series.priceToCoordinate(lastValue);

    if (targetX != null && targetY != null) {
      setProjectionPixel({ x: targetX, y: targetY });
    } else {
      setProjectionPixel({ x: null, y: null });
    }
  }, [
    chartType,
    dataSeries,
    // processedAreaData,
    areaData2,
    processedCandleData,
    targetLogicalIndex,
  ]);

  useEffect(() => {
    updateProjectionCoordinate();
  }, [updateProjectionCoordinate, chartSize, targetLogicalIndex]);

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

  useEffect(() => {
    if (dataSeries.length === 0 || trades.length === 0) return;

    const lastTime = dataSeries[dataSeries.length - 1].time;
    const pendingTrades = trades.filter(
      (trade) => trade.status === "pending" && lastTime >= trade.targetTime
    );
    if (pendingTrades.length === 0) return;

    setTrades((prevTrades) => {
      const newlyResolved = [];

      const updatedTrades = prevTrades.map((trade) => {
        if (trade.status !== "pending" || lastTime < trade.targetTime) {
          return trade;
        }

        const targetPoint = dataSeries.find(
          (point) => point.time === trade.targetTime
        );
        if (!targetPoint) {
          return trade;
        }

        const finalPrice =
          chartType === "candlestick"
            ? targetPoint.close
            : targetPoint.value;

        const didWin =
          trade.side === "buy"
            ? finalPrice >= trade.entryPrice
            : finalPrice <= trade.entryPrice;

        const updated = {
          ...trade,
          status: didWin ? "won" : "lost",
          resultPrice: finalPrice,
          resultTime: targetPoint.time,
          returnAmount: didWin ? trade.stake * PAYOUT_MULTIPLIER : 0,
          expiresAt: Date.now() / 1000 + 5,
        };

        newlyResolved.push(updated);
        return updated;
      });

      const currentTime = Date.now() / 1000;
      const filteredTrades = updatedTrades.filter(
        (trade) =>
          trade.status === "pending" ||
          !trade.expiresAt ||
          trade.expiresAt > currentTime
      );

      newlyResolved.forEach((n) =>
        playSound(n.status === "won" ? "win" : "lose")
      );

      return filteredTrades;
    });
  }, [trades, dataSeries, chartType, playSound]);

  const lastLogicalIndex =
    processedAreaData.length > 0 ? processedAreaData.length - 1 : 0;

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
        autoScale: true,
        // tickMarkFormatter: (price) => {

        //   if (price < 1) {
        //     const decimals = price.toFixed(2); // دو رقم اعشار
        //     return `${decimals.split('.')[1]}`; // نمایش صدم‌های قیمت
        //   } else {
        //     const intPart = Math.floor(price);
        //     return `${intPart.toString().padStart(2, '0')}`;
        //   }
        // },
      },
      timeScale: {
        borderVisible: false,
        rightOffset: rightOffsetBars,
        barSpacing: 15,
        fixLeftEdge: true,
        lockVisibleTimeRangeOnResize: true,
        timeVisible: true,
        secondsVisible: true,
        shiftVisibleRangeOnNewBar: true,
        rightBarStaysOnScroll: true,
        tickMarkFormatter: (time) => {
          // time در lightweight-charts معمولاً Unix timestamp (ثانیه) است
          const date = new Date(time * 1000);
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          const seconds = date.getSeconds();

          // فقط هر 30 ثانیه برچسب نمایش داده شود
          if (seconds === 0) {
            return `${hours}:${minutes}`; // بدون ثانیه
          } else if (seconds === 30 || seconds === 31 || seconds === 29) {
            return `${hours}:${minutes}:30`;
            // return `${hours}:${minutes}:${seconds.toString().padStart(2, '0')}`;
          }
          return ''; // برای سایر ثانیه‌ها برچسبی نمایش داده نشود
        },
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

  // if (candleData.length === 0) {
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

  const priceColor = priceChange >= 0 ? "#2ecc9c" : "#ef5350";
  const latestTime =
    dataSeries.length > 0 ? dataSeries[dataSeries.length - 1].time : 0;

  return (
    <div
      className="h-full"
      onClick={() => {
        if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
          audioCtxRef.current.resume();
        }
      }}
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
            inset: "0",
            pointerEvents: "none",
            backgroundImage:
              "repeating-linear-gradient(to right, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 60px)",
          }}
        />
        <div style={{ position: "absolute", inset: 0, padding: "12px 0", height: "100%" }}>
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
                  data={areaData2}
                  // data={processedAreaData}
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

        <div
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
            const timerLabel = formatSeconds(remainingSeconds);
            const isBuy = trade.side === "buy";
            const accent = isBuy ? "#2ecc9c" : "#ef5350";

            const entryLabel = `${isBuy ? "▲" : "▼"} \\$${trade.stake.toFixed(0)}`;

            const pendingSeconds =
              trade.status === "pending"
                ? Math.max(0, Math.ceil((trade.targetTime - Date.now()) / 1000))
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
                    background:
                      trade.side === "buy"
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
                      trade.side === "buy"
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
                    {trade.side === "buy" ? "▲" : "▼"} ${TRADE_AMOUNT.toFixed(0)}
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
                          backgroundColor:
                            trade.status === "won" ? "#2ecc9c" : "#ef5350",
                          border: "2px solid #ffffff",
                          transform: "translate(-50%, -50%)",
                          boxShadow: `0 0 12px ${
                            trade.status === "won" ? "#2ecc9c" : "#ef5350"
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
        </div>

        {projectionPixel.x != null && (
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
        )}

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
  );
}
