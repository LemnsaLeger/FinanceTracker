// src/components/desktop/charts/DonutChart.jsx
// Pure SVG donut chart — no external charting library.
// Always receives `data` as a prop from DashboardPage or AnalyticsPage.
// data shape: [{ label: "Food & Dining", pct: 28, color: "#FF5722" }, ...]

const fmt = (n) => {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return (abs / 1_000_000).toFixed(1) + "M";
  if (abs >= 1_000) return (abs / 1_000).toFixed(0) + "K";
  return new Intl.NumberFormat("fr-CM").format(abs);
};

export default function DonutChart({ data = [], totalExpense = 0 }) {
  if (!data || data.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 140,
          color: "#bdbdbd",
          fontSize: 13,
        }}
      >
        No expense data yet
      </div>
    );
  }

  const r = 54;
  const cx = 70;
  const cy = 70;
  const strokeWidth = 16;
  const circ = 2 * Math.PI * r;

  // Normalise percentages so they always sum to 100
  const total = data.reduce((s, d) => s + d.pct, 0);
  const normalised = data.map((d) => ({
    ...d,
    pct: total > 0 ? (d.pct / total) * 100 : 0,
  }));

  let offset = 0;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      {/* SVG donut */}
      <svg
        width={140}
        height={140}
        viewBox="0 0 140 140"
        style={{ flexShrink: 0 }}
      >
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
        {normalised.map((d, i) => {
          const dash = (d.pct / 100) * circ;
          const gap = circ - dash;
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

        {/* Center — real total */}
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          fontSize={11}
          fill="#757575"
          fontFamily="DM Sans"
        >
          Expenses
        </text>
        <text
          x={cx}
          y={cy + 10}
          textAnchor="middle"
          fontSize={12}
          fontWeight="700"
          fill="#212121"
          fontFamily="DM Sans"
        >
          {fmt(totalExpense)}
        </text>
      </svg>

      {/* Legend */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {normalised.map((d) => (
          <div
            key={d.label}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 2,
                background: d.color,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 12, color: "#616161", flex: 1 }}>
              {d.label}
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#212121" }}>
              {Math.round(d.pct)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
