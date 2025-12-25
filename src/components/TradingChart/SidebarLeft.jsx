import {formatSeconds} from './mockData';

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

export default SidebarLeft;