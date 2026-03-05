// src/components/desktop/charts/DonutChart.jsx
// Pure SVG donut chart — no external charting library.
// Data is passed as a prop; defaults to DONUT_DATA from desktopData.

import { DONUT_DATA } from "../../../../data/desktopData";

export default function DonutChart({ data = DONUT_DATA }) {
  const r = 54;
  const cx = 70;
  const cy = 70;
  const strokeWidth = 16;
  const circ = 2 * Math.PI * r;

  let offset = 0;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      {/* SVG donut */}
      <svg width={140} height={140} viewBox="0 0 140 140" style={{ flexShrink: 0 }}>
        {/* Track ring */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#f5f5f5"
          strokeWidth={strokeWidth}
        />

        {/* Slices */}
        {data.map((d, i) => {
          const dash = (d.pct / 100) * circ;
          const gap  = circ - dash;
          const dashOffset = -(offset * (circ / 100)) + circ * 0.25;
          offset += d.pct;

          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={d.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={dashOffset}
              style={{ opacity: 0.9, transition: "stroke-dasharray 1s ease" }}
            />
          );
        })}

        {/* Center label */}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize={11} fill="#757575" fontFamily="DM Sans">
          Total
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize={13} fontWeight="700" fill="#212121" fontFamily="DM Sans">
          1.42M
        </text>
      </svg>

      {/* Legend */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {data.map((d) => (
          <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: "#616161", flex: 1 }}>{d.label}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#212121" }}>{d.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
