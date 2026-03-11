// src/components/desktop/charts/BarChart.jsx
// CSS bar chart — no charting library needed.
// Always receives `data` as a prop from DashboardPage or AnalyticsPage.
// data shape: [{ month: "Mar", income: 3850000, expense: 1420000 }, ...]

export default function BarChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div
        style={{
          height: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#bdbdbd",
          fontSize: 13,
        }}
      >
        No data yet
      </div>
    );
  }

  const maxVal = Math.max(...data.map((m) => Math.max(m.income, m.expense)), 1);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 8,
        height: 120,
        padding: "0 4px",
      }}
    >
      {data.map((m, i) => (
        <div
          key={m.month}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
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
                height: `${(m.income / maxVal) * 100}%`,
                minHeight: m.income > 0 ? 3 : 0,
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
                height: `${(m.expense / maxVal) * 100}%`,
                minHeight: m.expense > 0 ? 3 : 0,
                background: "#FF5722",
                borderRadius: "3px 3px 0 0",
                opacity: 0.8,
                animation: `barGrow 0.8s cubic-bezier(.22,1,.36,1) ${i * 0.08 + 0.05}s both`,
                transformOrigin: "bottom",
              }}
            />
          </div>

          {/* Month label */}
          <span style={{ fontSize: 10, color: "#9e9e9e", fontWeight: 500 }}>
            {m.month}
          </span>
        </div>
      ))}
    </div>
  );
}
