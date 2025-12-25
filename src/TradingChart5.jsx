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

/* ---------------------------- تنظیمات عمومی ---------------------------- */
const BAR_INTERVAL_SECONDS = 60; // هر کندل دقیقه‌ای
const REALTIME_UPDATE_MS = 2000; // آپدیت لحظه‌ای
const MAX_DATA_POINTS = 240;
const TRADE_AMOUNT = 10;
const PAYOUT_MULTIPLIER = 1.92;

const round5 = (value) => parseFloat(value.toFixed(5));
const trimSeries = (arr, max = MAX_DATA_POINTS) =>
  arr.length > max ? arr.slice(arr.length - max) : arr;
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

/* ----------------------------- تولید دیتای اولیه ----------------------------- */
const createInitialCandles = () => {
  const candles = [];
  const count = 120;
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

/* ------------------------------- هوک صدا ------------------------------- */
const useCoinAudio = () => {
  const audioCtxRef = useRef(null);

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

/* ----------------------------- سایدبار سمت چپ ----------------------------- */
const SidebarLeft = ({
  chartType,
  onChartTypeChange,
  currentPrice,
  priceChange,
  projectionSeconds,
  onProjectionSecondsChange,
  remainingSeconds,
  isRunning,
  onToggleRunning,
}) => {
  const priceColor = priceChange >= 0 ? "#2ecc9c" : "#ef5350";

  return (
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
          <span style={{ fontSize: "17px", fontWeight: 600 }}>AUD/CAD OTC</span>
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

      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={() => onChartTypeChange("area")}
          style={{
            flex: 1,
            padding: "10px 12px",
            background:
              chartType === "area"
                ? "linear-gradient(135deg, #326aff 0%, #29b6f6 100%)"
                : "rgba(34,45,70,0.65)",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: 600,
            transition: "all 0.25s ease",
            boxShadow:
              chartType === "area"
                ? "0 8px 18px rgba(41,150,255,0.25)"
                : "none",
          }}
        >
          Area
        </button>
        <button
          onClick={() => onChartTypeChange("candlestick")}
          style={{
            flex: 1,
            padding: "10px 12px",
            background:
              chartType === "candlestick"
                ? "linear-gradient(135deg, #7c4dff 0%, #536dfe 100%)"
                : "rgba(34,45,70,0.65)",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: 600,
            transition: "all 0.25s ease",
            boxShadow:
              chartType === "candlestick"
                ? "0 8px 18px rgba(119,90,255,0.28)"
                : "none",
          }}
        >
          Candle
        </button>
      </div>

      <div
        style={{
          background:
            "linear-gradient(180deg, rgba(32,46,71,0.75) 0%, rgba(20,29,48,0.9) 100%)",
          borderRadius: "12px",
          padding: "18px",
          border: "1px solid rgba(74,99,150,0.2)",
          boxShadow: "0 12px 24px rgba(5,12,25,0.45)",
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

      <div
        style={{
          padding: "16px",
          borderRadius: "12px",
          border: "1px solid rgba(74,99,150,0.2)",
          background: "rgba(23,32,52,0.55)",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <span style={{ fontSize: "12px", color: "#7f8dab" }}>
          Projection lead (seconds)
        </span>
        <input
          type="number"
          min={1}
          value={projectionSeconds}
          onChange={onProjectionSecondsChange}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: "8px",
            border: "1px solid rgba(74,99,150,0.4)",
            backgroundColor: "rgba(16,22,38,0.8)",
            color: "#d8dfeb",
            fontFamily: "'Roboto Mono', monospace",
            fontSize: "14px",
            outline: "none",
          }}
        />
        <span style={{ fontSize: "11px", color: "#9aa3b5" }}>
          فاصله باقی‌مانده: {formatSeconds(remainingSeconds)}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "14px 16px",
          borderRadius: "10px",
          border: `1px solid ${
            isRunning ? "rgba(46,204,156,0.35)" : "rgba(239,83,80,0.35)"
          }`,
          backgroundColor: isRunning
            ? "rgba(46,204,156,0.12)"
            : "rgba(239,83,80,0.12)",
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
              ? "0 0 12px rgba(46,204,156,0.7)"
              : "0 0 12px rgba(239,83,80,0.5)",
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

      <button
        onClick={onToggleRunning}
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
            ? "0 12px 24px rgba(239,83,80,0.35)"
            : "0 12px 24px rgba(26,188,156,0.30)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
      >
        {isRunning ? "⏸ توقف لحظه‌ای" : "▶️ ادامه جریان"}
      </button>
    </div>
  );
};

/* ----------------------------- سایدبار سمت راست ----------------------------- */
const RightSidebar = ({ onBuy, onSell }) => (
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
        border: "1px solid rgba(74,99,150,0.25)",
        background:
          "linear-gradient(180deg, rgba(18,26,44,0.8) 0%, rgba(9,14,24,0.9) 100%)",
      }}
    >
      <span style={{ fontSize: "12px", color: "#7f8dab" }}>Trade Amount</span>
      <span
        style={{
          fontSize: "20px",
          fontWeight: 600,
          fontFamily: "'Roboto Mono', monospace",
        }}
      >
        \$10
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
          background: "linear-gradient(135deg, #2ecc9c 0%, #27ae60 100%)",
          boxShadow: "0 18px 32px rgba(39,174,96,0.35)",
          letterSpacing: "0.08em",
        }}
        onClick={onBuy}
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
          background: "linear-gradient(135deg, #ef5350 0%, #d81b60 100%)",
          boxShadow: "0 18px 32px rgba(216,27,96,0.35)",
          letterSpacing: "0.08em",
        }}
        onClick={onSell}
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
);

/* ----------------------------- اوورلی معاملات ----------------------------- */
const TradesOverlay = ({
  trades,
  priceSeries,
  getCoordinateForIndex,
  getCoordinateForPrice,
  now,
}) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      zIndex: 2000,
    }}
  >
    {trades.map((trade) => {
      const entryIndex = priceSeries.findIndex(
        (point) => point.time === trade.entryTime
      );
      if (entryIndex === -1) return null;

      const entryX = getCoordinateForIndex(entryIndex);
      const entryY = getCoordinateForPrice(trade.entryPrice);
      if (entryX == null || entryY == null) return null;

      const targetLogical = entryIndex + trade.logicalLead;
      const targetX = getCoordinateForIndex(targetLogical);
      const accent = trade.side === "buy" ? "#2ecc9c" : "#ef5350";
      const pendingSeconds =
        trade.status === "pending"
          ? Math.max(0, Math.ceil((trade.targetTimestamp - now) / 1000))
          : 0;

      const resultX =
        trade.resultIndex != null
          ? getCoordinateForIndex(trade.resultIndex)
          : targetX;
      const resultY =
        trade.resultPrice != null
          ? getCoordinateForPrice(trade.resultPrice)
          : null;

      const profitValue =
        trade.status === "won"
          ? TRADE_AMOUNT * (PAYOUT_MULTIPLIER - 1)
          : TRADE_AMOUNT;
      const profitLabel =
        trade.status === "won"
          ? `+\$${profitValue.toFixed(2)}`
          : `-\$${profitValue.toFixed(2)}`;

      return (
        <React.Fragment key={trade.id}>
          {/* نقطه ورود */}
          <div
            style={{
              position: "absolute",
              left: `${entryX}px`,
              top: `${entryY}px`,
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "#ffffff",
              border: `2px solid ${accent}`,
              transform: "translate(-50%, -50%)",
              boxShadow: `0 0 12px ${accent}`,
            }}
          />

          {/* خط افقی تا تارگت (فقط در حالت پندینگ) */}
          {trade.status === "pending" &&
            targetX != null &&
            Math.abs(targetX - entryX) > 2 && (
              <div
                style={{
                  position: "absolute",
                  left: `${Math.min(entryX, targetX)}px`,
                  top: `${entryY}px`,
                  width: `${Math.abs(targetX - entryX)}px`,
                  height: "2px",
                  backgroundColor: accent,
                  boxShadow: `0 0 8px ${accent}`,
                }}
              />
            )}

          {/* لیبل ماهیت معامله */}
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

          {/* نقطه و لیبل نتیجه (۵ ثانیه نمایش) */}
          {trade.status !== "pending" && resultX != null && resultY != null && (
            <>
              <div
                style={{
                  position: "absolute",
                  left: `${resultX}px`,
                  top: `${resultY}px`,
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
                  left: `${resultX}px`,
                  top: `${resultY}px`,
                  transform: "translate(-50%, calc(-100% - 24px))",
                  background:
                    trade.status === "won"
                      ? "linear-gradient(135deg, rgba(46,204,156,0.95) 0%, rgba(39,174,96,0.95) 100%)"
                      : "linear-gradient(135deg, rgba(239,83,80,0.95) 0%, rgba(214,48,49,0.95) 100%)",
                  color: "#fff",
                  padding: "10px 14px",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow:
                    trade.status === "won"
                      ? "0 14px 28px rgba(46,204,156,0.35)"
                      : "0 14px 28px rgba(239,83,80,0.35)",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    fontFamily: "'Roboto Mono', monospace",
                  }}
                >
                  {profitLabel}
                </span>
                <span
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    backgroundColor: "#ffffff",
                    color: trade.status === "won" ? "#2ecc9c" : "#ef5350",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: 700,
                  }}
                >
                  {trade.status === "won" ? "✔" : "✖"}
                </span>
              </div>
            </>
          )}
        </React.Fragment>
      );
    })}
  </div>
);

/* ----------------------------- کامپوننت اصلی ----------------------------- */
export default function TradingChart() {
  const initialCandles = useMemo(() => createInitialCandles(), []);
  const initialArea = useMemo(
    () => initialCandles.map((candle) => ({ time: candle.time, value: candle.close })),
    [initialCandles]
  );

  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const timeScaleRef = useRef(null);

  const { playSound, audioCtxRef } = useCoinAudio();

  const [isRunning, setIsRunning] = useState(true);
  const [chartType, setChartType] = useState("area");
  const [chartSize, setChartSize] = useState({ width: 960, height: 600 });
  const [projectionSeconds, setProjectionSeconds] = useState(90);
  const [targetLogicalIndex, setTargetLogicalIndex] = useState(null);
  const [targetAnchorTimestamp, setTargetAnchorTimestamp] = useState(Date.now());
  const [projectionPixel, setProjectionPixel] = useState({ x: null, y: null });

  const [candleData, setCandleData] = useState(initialCandles);
  const [areaData, setAreaData] = useState(initialArea);

  const [currentPrice, setCurrentPrice] = useState(
    initialCandles[initialCandles.length - 1]?.close ?? 0
  );
  const [priceChange, setPriceChange] = useState(() => {
    if (initialCandles.length < 2) return 0;
    return round5(
      initialCandles[initialCandles.length - 1].close -
        initialCandles[initialCandles.length - 2].close
    );
  });

  const [trades, setTrades] = useState([]);
  const [now, setNow] = useState(Date.now());

  const priceSeries = useMemo(() => {
    const sorted = [...candleData].sort((a, b) => a.time - b.time);
    return sorted.filter(
      (item, idx, arr) => idx === 0 || item.time > arr[idx - 1].time
    );
  }, [candleData]);

  const areaSeries = useMemo(() => {
    const sorted = [...areaData].sort((a, b) => a.time - b.time);
    return sorted.filter(
      (item, idx, arr) => idx === 0 || item.time > arr[idx - 1].time
    );
  }, [areaData]);

  const leadSeconds = Math.max(1, projectionSeconds);
  const logicalLead = leadSeconds / BAR_INTERVAL_SECONDS;

  /* اندازه نمودار با تغییر سایز صفحه */
  useEffect(() => {
    const handleResize = () => {
      if (typeof window === "undefined") return;
      setChartSize({
        width: Math.max(window.innerWidth - 600, 640),
        height: Math.max(window.innerHeight - 180, 520),
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* تیک تیک زمان برای تایمرها */
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, []);

  /* تعیین تارگت اصلی با تغییر دیتا یا ثانیه */
  useEffect(() => {
    if (priceSeries.length === 0) return;
    setTargetLogicalIndex(priceSeries.length - 1 + logicalLead);
    setTargetAnchorTimestamp(Date.now());
  }, [priceSeries.length, logicalLead]);

  /* قیمت فعلی و تغییرات */
  useEffect(() => {
    if (candleData.length === 0) return;
    const last = candleData[candleData.length - 1];
    const prev =
      candleData.length >= 2 ? candleData[candleData.length - 2] : last;
    setCurrentPrice(round5(last.close));
    setPriceChange(round5(last.close - prev.close));
  }, [candleData]);

  /* آپدیت لحظه‌ای داخل کندل جاری */
  useEffect(() => {
    if (!isRunning || candleData.length === 0) return;

    const realtimeInterval = setInterval(() => {
      setCandleData((prevCandles) => {
        if (prevCandles.length === 0) return prevCandles;
        const copy = [...prevCandles];
        const lastIndex = copy.length - 1;
        const lastCandle = copy[lastIndex];

        const drift =
          (Math.random() > 0.5 ? 1 : -1) *
          (0.00012 + Math.random() * 0.00028) *
          (0.4 + Math.random());
        const noise =
          (Math.random() - 0.5) * (0.0002 + Math.random() * 0.0002);

        const newClose = round5(lastCandle.close + drift + noise);
        copy[lastIndex] = {
          ...lastCandle,
          close: newClose,
          high: Math.max(lastCandle.high, newClose),
          low: Math.min(lastCandle.low, newClose),
        };

        setAreaData((prevArea) => {
          if (prevArea.length === 0) return prevArea;
          const areaCopy = [...prevArea];
          const lastAreaIndex = areaCopy.length - 1;
          areaCopy[lastAreaIndex] = {
            ...areaCopy[lastAreaIndex],
            value: newClose,
          };
          return areaCopy;
        });

        return copy;
      });
    }, REALTIME_UPDATE_MS);

    return () => clearInterval(realtimeInterval);
  }, [isRunning, candleData.length]);

  /* ساخت کندل‌های جدید هر دقیقه */
  useEffect(() => {
    if (!isRunning || candleData.length === 0) return;

    const candleInterval = setInterval(() => {
      setCandleData((prevCandles) => {
        if (prevCandles.length === 0) return prevCandles;
        const copy = [...prevCandles];
        const last = copy[copy.length - 1];
        const newTime = last.time + BAR_INTERVAL_SECONDS;
        const open = round5(last.close);

        copy.push({
          time: newTime,
          open,
          high: open,
          low: open,
          close: open,
        });

        const trimmed = trimSeries(copy);

        setAreaData((prevArea) => {
          const areaCopy = [...prevArea, { time: newTime, value: open }];
          return trimSeries(areaCopy);
        });

        return trimmed;
      });
    }, BAR_INTERVAL_SECONDS * 1000);

    return () => clearInterval(candleInterval);
  }, [isRunning, candleData.length]);

  /* محاسبه مختصات تارگت اصلی */
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const scale = timeScaleRef.current?._timeScale;
      const seriesInstance = seriesRef.current?._series;
      if (
        !scale ||
        !seriesInstance ||
        targetLogicalIndex == null ||
        priceSeries.length === 0
      ) {
        setProjectionPixel({ x: null, y: null });
        return;
      }

      const lastPrice =
        chartType === "candlestick"
          ? priceSeries[priceSeries.length - 1].close
          : areaSeries[areaSeries.length - 1]?.value ??
            priceSeries[priceSeries.length - 1].close;

      setProjectionPixel({
        x: scale.logicalToCoordinate(targetLogicalIndex) ?? null,
        y: seriesInstance.priceToCoordinate(lastPrice) ?? null,
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [chartType, priceSeries, areaSeries, targetLogicalIndex]);

  /* هندل کواردینیت‌ها برای اوورلی */
  const getCoordinateForIndex = useCallback((logicalIndex) => {
    const scale = timeScaleRef.current?._timeScale;
    if (!scale || logicalIndex == null || Number.isNaN(logicalIndex)) return null;
    return scale.logicalToCoordinate(logicalIndex);
  }, []);

  const getCoordinateForPrice = useCallback((price) => {
    const seriesInstance = seriesRef.current?._series;
    if (!seriesInstance || price == null || Number.isNaN(price)) return null;
    return seriesInstance.priceToCoordinate(price);
  }, []);

  /* مدیریت صداها و نتیجه معاملات */
  const currentPriceRef = useRef(currentPrice);
  const latestIndexRef = useRef(priceSeries.length - 1);
  useEffect(() => {
    currentPriceRef.current = currentPrice;
  }, [currentPrice]);
  useEffect(() => {
    latestIndexRef.current = priceSeries.length - 1;
  }, [priceSeries.length]);

  useEffect(() => {
    if (!isRunning) return;
    const evaluator = setInterval(() => {
      const ts = Date.now();
      setTrades((prev) =>
        prev.map((trade) => {
          if (trade.status !== "pending" || ts < trade.targetTimestamp) return trade;

          const resultPrice = currentPriceRef.current;
          const didWin =
            trade.side === "buy"
              ? resultPrice >= trade.entryPrice
              : resultPrice <= trade.entryPrice;

          playSound(didWin ? "win" : "lose");

          return {
            ...trade,
            status: didWin ? "won" : "lost",
            resultPrice,
            resultIndex: latestIndexRef.current,
            completedAt: ts,
            expiresAt: ts + 5000,
          };
        })
      );
    }, 200);

    return () => clearInterval(evaluator);
  }, [isRunning, playSound]);

  /* حذف معاملات بعد از ۵ ثانیه از نمایش نتیجه */
  useEffect(() => {
    const janitor = setInterval(() => {
      const ts = Date.now();
      setTrades((prev) =>
        prev.filter(
          (trade) =>
            trade.status === "pending" ||
            (trade.expiresAt != null && trade.expiresAt > ts)
        )
      );
    }, 500);

    return () => clearInterval(janitor);
  }, []);

  /* خرید/فروش */
  const handlePlaceTrade = useCallback(
    (side) => {
      if (priceSeries.length === 0 || targetLogicalIndex == null) return;
      const lastIndex = priceSeries.length - 1;
      const entryCandle = priceSeries[lastIndex];

      const trade = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        side,
        entryTime: entryCandle.time,
        entryPrice: entryCandle.close,
        logicalLead,
        targetTimestamp: Date.now() + leadSeconds * 1000,
        status: "pending",
        resultPrice: null,
        resultIndex: null,
        completedAt: null,
        expiresAt: null,
      };

      playSound("place");
      setTrades((prev) => [...prev, trade]);
    },
    [priceSeries, targetLogicalIndex, logicalLead, leadSeconds, playSound]
  );

  const remainingSeconds = Math.max(
    0,
    Math.ceil(
      (targetAnchorTimestamp + leadSeconds * 1000 - now) / 1000
    )
  );

  const priceColor = priceChange >= 0 ? "#2ecc9c" : "#ef5350";

  const chartOptions = useMemo(
    () => ({
      layout: {
        background: { type: "solid", color: "transparent" },
        textColor: "#9aa3b5",
        fontSize: 12,
        fontFamily: "'Inter', sans-serif",
      },
      grid: {
        horzLines: { color: "rgba(80,96,130,0.08)" },
        vertLines: { color: "rgba(80,96,130,0.04)" },
      },
      width: chartSize.width,
      height: chartSize.height,
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: { top: 0.25, bottom: 0.15 },
        entireTextOnly: true,
      },
      timeScale: {
        borderVisible: false,
        rightOffset: Math.max(
          Math.round(priceSeries.length * 0.15),
          Math.max(
            targetLogicalIndex != null
              ? targetLogicalIndex - (priceSeries.length - 1) + 3
              : 0,
            4
          )
        ),
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
        vertLine: { color: "rgba(130,160,210,0.4)", width: 1, style: 3 },
        horzLine: { color: "rgba(130,160,210,0.4)", width: 1, style: 3 },
      },
    }),
    [chartSize, priceSeries.length, targetLogicalIndex]
  );

  const areaOptions = useMemo(
    () => ({
      lineColor: "rgba(54,148,255,1)",
      topColor: "rgba(54,148,255,0.45)",
      bottomColor: "rgba(33,54,95,0)",
      lineWidth: 3,
      priceLineColor: "rgba(54,148,255,0.85)",
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
    if (chartType !== "area" || areaSeries.length === 0) return [];
    const last = areaSeries[areaSeries.length - 1];
    return [
      {
        time: last.time,
        position: "inBar",
        color: "#ffffff",
        shape: "circle",
        size: 3,
      },
    ];
  }, [areaSeries, chartType]);

  if (priceSeries.length === 0) {
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
console.log('projectionPixel', projectionPixel)
  return (
    <div
      onClick={() => {
        const ctx = audioCtxRef.current;
        if (ctx && ctx.state === "suspended") ctx.resume();
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
      <SidebarLeft
        chartType={chartType}
        onChartTypeChange={setChartType}
        currentPrice={currentPrice}
        priceChange={priceChange}
        projectionSeconds={projectionSeconds}
        onProjectionSecondsChange={(event) => {
          const parsed = parseInt(event.target.value, 10);
          const safe = Number.isFinite(parsed) ? Math.max(1, parsed) : 1;
          setProjectionSeconds(safe);
        }}
        remainingSeconds={remainingSeconds}
        isRunning={isRunning}
        onToggleRunning={() => setIsRunning((prev) => !prev)}
      />

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
            border: "1px solid rgba(74,99,150,0.2)",
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
              Projection timer
            </span>
            <span style={{ fontSize: "18px", fontWeight: 600 }}>
              {formatSeconds(remainingSeconds)}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "6px",
            }}
          >
            <span style={{ fontSize: "13px", color: "#7f8dab" }}>
              Current price
            </span>
            <span
              style={{
                fontSize: "20px",
                fontWeight: 600,
                letterSpacing: "0.1em",
                color: priceColor,
                fontFamily: "'Roboto Mono', monospace",
              }}
            >
              {currentPrice.toFixed(5)}
            </span>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            position: "relative",
            borderRadius: "18px",
            overflow: "hidden",
            border: "1px solid rgba(45,60,92,0.45)",
            background:
              "radial-gradient(circle at top, rgba(54,148,255,0.12), transparent 65%), rgba(12,17,28,0.92)",
            boxShadow: "0 24px 48px rgba(3,8,18,0.55)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
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
                    data={priceSeries}
                    reactive
                    options={candlestickOptions}
                  />
                ) : (
                  <AreaSeries
                    ref={seriesRef}
                    data={areaSeries}
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

          <TradesOverlay
            trades={trades}
            priceSeries={priceSeries}
            getCoordinateForIndex={getCoordinateForIndex}
            getCoordinateForPrice={getCoordinateForPrice}
            now={now}
          />

          {projectionPixel.x != null && (
            <div
              style={{
                position: "absolute",
                top: "30px",
                bottom: "12px",
                left: `${projectionPixel.x}px`,
                width: "0px",
                borderLeft: "2px dashed rgba(255,193,7,0.85)",
                boxShadow: "0 0 12px rgba(255,193,7,0.4)",
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
        </div>
      </div>

      <RightSidebar
        onBuy={() => handlePlaceTrade("buy")}
        onSell={() => handlePlaceTrade("sell")}
      />

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.25); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}