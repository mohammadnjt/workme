

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
        $10
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


export default RightSidebar;