import React from 'react';

import { 
  TRADE_AMOUNT, 
  formatSeconds,
  PAYOUT_MULTIPLIER,

} from './mockData';

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

export default TradesOverlay;