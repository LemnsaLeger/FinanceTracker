// src/components/desktop/shared/styles.js
// Reusable inline-style objects shared across desktop components.
// Keeping them here means one change propagates everywhere.

export const ghostBtn = {
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: 6,
  borderRadius: 8,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export const labelStyle = {
  fontSize: 11,
  fontWeight: 600,
  color: "#9e9e9e",
  letterSpacing: "0.5px",
  textTransform: "uppercase",
  display: "block",
  marginBottom: 6,
};

export const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  border: "1.5px solid #e0e0e0",
  borderRadius: 12,
  fontSize: 15,
  color: "#212121",
  background: "#fff",
  outline: "none",
  fontFamily: "inherit",
  transition: "border-color 0.2s",
  boxSizing: "border-box",
};

export const card = {
  background: "#fff",
  borderRadius: 16,
  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
};

/** Gradient presets used in KPI hero cards */
export const gradients = {
  blue:  "linear-gradient(135deg,#1a237e 0%,#1565c0 55%,#0277bd 100%)",
  green: "linear-gradient(135deg,#2E7D32,#388E3C)",
  red:   "linear-gradient(135deg,#B71C1C,#D32F2F)",
};

/** Global CSS injected once by DesktopLayout */
export const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #f9fafb; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 4px; }
  input, button, kbd { font-family: 'DM Sans', sans-serif; }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.94); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes barGrow {
    from { transform: scaleY(0); }
    to   { transform: scaleY(1); }
  }
`;
