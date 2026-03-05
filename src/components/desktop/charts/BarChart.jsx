// src/components/desktop/charts/BarChart.jsx
// SVG-free bar chart built with CSS — no charting library needed.
// Receives data as a prop so it can be used on both Dashboard and Analytics pages.

import { MONTHLY_DATA } from "../../../../data/desktopData";

export default function BarChart({ data = MONTHLY_DATA }) {
  const maxVal = Math.max(...data.map((m) => m.income));

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120, padding: "0 4px" }}>
      {data.map((m, i) => (
        <div
          key={m.month}
          style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}
        >
          {/* Bar pair */}
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "flex-end",
              gap: 2,
              flex: 1,
              justifyContent: "center",
            }}
          >
            {/* Income bar */}
            <div
              style={{
                width: "45%",
                height: (m.income / maxVal) * 100,
                background: "#4CAF50",
                borderRadius: "3px 3px 0 0",
                opacity: 0.85,
                animation: `barGrow 0.8s cubic-bezier(.22,1,.36,1) ${i * 0.08}s both`,
                transformOrigin: "bottom",
              }}
            />
            {/* Expense bar */}
            <div
              style={{
                width: "45%",
                height: (m.expense / maxVal) * 100,
                background: "#FF5722",
                borderRadius: "3px 3px 0 0",
                opacity: 0.8,
                animation: `barGrow 0.8s cubic-bezier(.22,1,.36,1) ${i * 0.08 + 0.05}s both`,
                transformOrigin: "bottom",
              }}
            />
          </div>

          {/* Month label */}
          <span style={{ fontSize: 10, color: "#9e9e9e", fontWeight: 500 }}>{m.month}</span>
        </div>
      ))}
    </div>
  );
}
