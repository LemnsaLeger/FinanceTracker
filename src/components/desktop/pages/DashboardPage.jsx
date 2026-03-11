// src/components/desktop/pages/DashboardPage.jsx
import { useState, useMemo } from "react";
import Icon from "../shared/Icon";
import BarChart from "../charts/BarChart";
import DonutChart from "../charts/DonutChart";
import { fmt, fmtShort } from "../shared/formatters";
import { card, ghostBtn, gradients } from "../shared/styles";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const CATEGORY_COLORS = {
  "Food & Dining": "#FF5722",
  Subscription: "#2196F3",
  Bills: "#FF9800",
  Transport: "#9C27B0",
  Cash: "#757575",
  Tax: "#FF5722",
  Income: "#4CAF50",
};
const CATEGORY_ICONS = {
  "Food & Dining": "utensils",
  Subscription: "repeat",
  Bills: "zap",
  Transport: "car",
  Cash: "landmark",
  Tax: "receipt",
  Income: "briefcase",
};
const CATEGORY_BUDGETS = {
  "Food & Dining": 250000,
  Bills: 150000,
  Subscription: 200000,
  Transport: 50000,
  Cash: 300000,
};
const MONTH_SHORTS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function getMonthKey(dateStr) {
  const d = new Date(dateStr);
  if (!isNaN(d)) return `${d.getFullYear()}-${d.getMonth()}`;
  const months = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };
  const p = dateStr.split(" ");
  if (p.length === 3) return `${p[2]}-${months[p[1]]}`;
  return "0";
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ title, value, subtitle, icon, gradient, badge }) {
  return (
    <div
      style={{
        ...card,
        background: gradient,
        padding: "22px 24px",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -30,
          right: -30,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.06)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -40,
          left: 40,
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.04)",
          pointerEvents: "none",
        }}
      />
      {icon && (
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "rgba(255,255,255,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
          }}
        >
          <Icon name={icon} size={18} color="#fff" />
        </div>
      )}
      <p
        style={{
          fontSize: 11,
          color: "rgba(255,255,255,0.6)",
          fontWeight: 600,
          letterSpacing: "1px",
          textTransform: "uppercase",
          marginBottom: icon ? 4 : 8,
        }}
      >
        {title}
      </p>
      <p
        style={{
          fontSize: icon ? 24 : 32,
          fontWeight: 800,
          letterSpacing: "-0.5px",
          marginBottom: badge ? 12 : 0,
        }}
      >
        {value}
      </p>
      {subtitle && (
        <p
          style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 4 }}
        >
          {subtitle}
        </p>
      )}
      {badge && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(76,175,80,0.2)",
            borderRadius: 100,
            padding: "4px 10px",
            width: "fit-content",
          }}
        >
          <Icon name="trending-up" size={13} color="#A5D6A7" />
          <span style={{ fontSize: 12, color: "#A5D6A7", fontWeight: 600 }}>
            {badge}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Budget Tracker (driven by real txList) ───────────────────────────────────
function BudgetTracker({ txList }) {
  // Sum expenses by category for current month
  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${now.getMonth()}`;

  const spentByCategory = useMemo(() => {
    const result = {};
    txList
      .filter((t) => t.amount < 0)
      .forEach((tx) => {
        if (getMonthKey(tx.created_at ?? tx.date) !== currentMonthKey) return;
        const cat = tx.category ?? "Cash";
        result[cat] = (result[cat] ?? 0) + Math.abs(tx.amount);
      });
    return result;
  }, [txList, currentMonthKey]);

  const rows = Object.entries(CATEGORY_BUDGETS).map(([name, budget]) => ({
    name,
    icon: CATEGORY_ICONS[name] ?? "tag",
    color: CATEGORY_COLORS[name] ?? "#9e9e9e",
    spent: spentByCategory[name] ?? 0,
    budget,
    over: (spentByCategory[name] ?? 0) > budget,
  }));

  return (
    <div style={{ ...card, padding: "22px 24px" }}>
      <h3
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: "#212121",
          marginBottom: 16,
        }}
      >
        Budget Tracker
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {rows.map((cat) => {
          const pct = Math.min((cat.spent / cat.budget) * 100, 100);
          return (
            <div key={cat.name}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: cat.over ? "#FFEBEE" : cat.color + "18",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon
                      name={cat.icon}
                      size={13}
                      color={cat.over ? "#FF5722" : cat.color}
                    />
                  </div>
                  <span
                    style={{ fontSize: 12, fontWeight: 600, color: "#424242" }}
                  >
                    {cat.name}
                  </span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: cat.over ? "#FF5722" : "#212121",
                    }}
                  >
                    {fmtShort(cat.spent)}
                  </span>
                  <span style={{ fontSize: 11, color: "#9e9e9e" }}>
                    {" "}
                    / {fmtShort(cat.budget)}
                  </span>
                </div>
              </div>
              <div
                style={{
                  height: 5,
                  borderRadius: 100,
                  background: "#f0f0f0",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${pct}%`,
                    borderRadius: 100,
                    transition: "width 1s cubic-bezier(.22,1,.36,1)",
                    background:
                      cat.over ?
                        "linear-gradient(90deg,#FF5722,#E53935)"
                      : `linear-gradient(90deg,${cat.color}88,${cat.color})`,
                  }}
                />
              </div>
            </div>
          );
        })}
        {rows.every((r) => r.spent === 0) && (
          <p
            style={{
              fontSize: 13,
              color: "#9e9e9e",
              textAlign: "center",
              padding: "8px 0",
            }}
          >
            No expenses recorded this month yet.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Transaction Table ────────────────────────────────────────────────────────
function TransactionTable({ txList, loading, deleteTransaction }) {
  const [hoveredId, setHoveredId] = useState(null);
  const preview = txList.slice(0, 8);
  const COLS = "2fr 1.2fr 1fr 1fr 100px";

  if (loading) {
    return (
      <div
        style={{ ...card, padding: 40, textAlign: "center", color: "#9e9e9e" }}
      >
        <p style={{ fontSize: 14 }}>Loading transactions…</p>
      </div>
    );
  }

  return (
    <div style={{ ...card, overflow: "hidden" }}>
      <div
        style={{
          padding: "20px 24px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #f5f5f5",
        }}
      >
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#212121" }}>
            Recent Transactions
          </h3>
          <p style={{ fontSize: 12, color: "#9e9e9e", marginTop: 2 }}>
            {txList.length === 0 ?
              "No transactions yet"
            : `Showing last ${preview.length} of ${txList.length}`}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { icon: "filter", label: "Filter" },
            { icon: "download", label: "Export" },
          ].map((btn) => (
            <button
              key={btn.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 14px",
                borderRadius: 10,
                border: "1.5px solid #e0e0e0",
                background: "#fff",
                fontSize: 12,
                fontWeight: 600,
                color: "#757575",
                cursor: "pointer",
              }}
            >
              <Icon name={btn.icon} size={13} color="#9e9e9e" /> {btn.label}
            </button>
          ))}
        </div>
      </div>

      {txList.length === 0 ?
        <div
          style={{
            padding: "48px 24px",
            textAlign: "center",
            color: "#9e9e9e",
          }}
        >
          <Icon name="receipt" size={36} color="#e0e0e0" />
          <p style={{ marginTop: 12, fontSize: 14, fontWeight: 500 }}>
            No transactions yet
          </p>
          <p style={{ fontSize: 12, marginTop: 4 }}>
            Press Ctrl+N to add your first one.
          </p>
        </div>
      : <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: COLS,
              padding: "10px 24px",
              background: "#fafafa",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            {["Description", "Category", "Date", "Amount", "Action"].map(
              (h) => (
                <span
                  key={h}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#9e9e9e",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  {h}
                </span>
              ),
            )}
          </div>

          {preview.map((tx, i) => (
            <div
              key={tx.id}
              onMouseEnter={() => setHoveredId(tx.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                display: "grid",
                gridTemplateColumns: COLS,
                padding: "14px 24px",
                borderBottom: "1px solid #f9f9f9",
                background: hoveredId === tx.id ? "#fafcff" : "#fff",
                transition: "background 0.15s",
                animation: `fadeUp 0.4s cubic-bezier(.22,1,.36,1) ${i * 0.04}s both`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: tx.bg ?? "#f5f5f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon
                    name={tx.icon ?? "receipt"}
                    size={16}
                    color={tx.color ?? "#9e9e9e"}
                  />
                </div>
                <span
                  style={{ fontSize: 14, fontWeight: 600, color: "#212121" }}
                >
                  {tx.name}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center" }}>
                <span
                  style={{
                    fontSize: 12,
                    padding: "3px 10px",
                    borderRadius: 100,
                    background: tx.amount > 0 ? "#E8F5E9" : "#f5f5f5",
                    color: tx.amount > 0 ? "#2E7D32" : "#616161",
                    fontWeight: 600,
                  }}
                >
                  {tx.category}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ fontSize: 13, color: "#9e9e9e" }}>
                  {tx.date}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center" }}>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: tx.amount > 0 ? "#2E7D32" : "#D32F2F",
                  }}
                >
                  {tx.amount > 0 ? "+" : "−"} FCFA {fmt(tx.amount)}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  opacity: hoveredId === tx.id ? 1 : 0,
                  transition: "opacity 0.15s",
                }}
              >
                <button
                  style={{
                    ...ghostBtn,
                    padding: 6,
                    borderRadius: 8,
                    background: "#f0f7ff",
                  }}
                >
                  <Icon name="edit" size={14} color="#2196F3" />
                </button>
                <button
                  onClick={() => deleteTransaction(tx.id)}
                  style={{
                    ...ghostBtn,
                    padding: 6,
                    borderRadius: 8,
                    background: "#fff5f5",
                  }}
                >
                  <Icon name="trash" size={14} color="#EF5350" />
                </button>
              </div>
            </div>
          ))}
        </>
      }
    </div>
  );
}

// ─── DashboardPage ────────────────────────────────────────────────────────────
export default function DashboardPage({
  txList = [],
  loading = false,
  deleteTransaction,
}) {
  // Real computed values from txList
  const income = txList
    .filter((t) => t.amount > 0)
    .reduce((a, t) => a + t.amount, 0);
  const expense = Math.abs(
    txList.filter((t) => t.amount < 0).reduce((a, t) => a + t.amount, 0),
  );
  const balance = income - expense;

  // Build last 6 months of trend data from real transactions
  const monthlyData = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const label = MONTH_SHORTS[d.getMonth()];
      const monthTx = txList.filter(
        (t) => getMonthKey(t.created_at ?? t.date) === key,
      );
      return {
        month: label,
        income: monthTx
          .filter((t) => t.amount > 0)
          .reduce((a, t) => a + t.amount, 0),
        expense: Math.abs(
          monthTx.filter((t) => t.amount < 0).reduce((a, t) => a + t.amount, 0),
        ),
      };
    });
  }, [txList]);

  // Build donut data from real expenses
  const donutData = useMemo(() => {
    const totalExpense = txList
      .filter((t) => t.amount < 0)
      .reduce((a, t) => a + Math.abs(t.amount), 0);
    if (totalExpense === 0) return [];
    const catTotals = {};
    txList
      .filter((t) => t.amount < 0)
      .forEach((tx) => {
        catTotals[tx.category] =
          (catTotals[tx.category] ?? 0) + Math.abs(tx.amount);
      });
    return Object.entries(catTotals).map(([label, val]) => ({
      label,
      pct: Math.round((val / totalExpense) * 100),
      color: CATEGORY_COLORS[label] ?? "#9e9e9e",
    }));
  }, [txList]);

  return (
    <div
      style={{
        padding: 28,
        display: "flex",
        flexDirection: "column",
        gap: 24,
        overflowY: "auto",
        flex: 1,
      }}
    >
      {/* Row 1 — KPI */}
      <div
        style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 16 }}
      >
        <KpiCard
          title="Total Balance"
          value={`FCFA ${fmt(balance)}`}
          gradient={gradients.blue}
          badge={
            income > 0 ?
              `${Math.round((income / (income + expense)) * 100)}% income ratio`
            : undefined
          }
        />
        <KpiCard
          title="Income"
          value={fmtShort(income)}
          subtitle="FCFA total"
          icon="arrow-down-left"
          gradient={gradients.green}
        />
        <KpiCard
          title="Expenses"
          value={fmtShort(expense)}
          subtitle="FCFA total"
          icon="arrow-up-right"
          gradient={gradients.red}
        />
      </div>

      {/* Row 2 — Charts + budget */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 320px",
          gap: 16,
        }}
      >
        <div style={{ ...card, padding: "22px 24px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#212121" }}>
                Monthly Overview
              </h3>
              <p style={{ fontSize: 12, color: "#9e9e9e", marginTop: 2 }}>
                Income vs Expenses
              </p>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              {[
                { c: "#4CAF50", l: "Income" },
                { c: "#FF5722", l: "Expense" },
              ].map((leg) => (
                <div
                  key={leg.l}
                  style={{ display: "flex", alignItems: "center", gap: 5 }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 2,
                      background: leg.c,
                    }}
                  />
                  <span style={{ fontSize: 11, color: "#9e9e9e" }}>
                    {leg.l}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <BarChart data={monthlyData} />
        </div>

        <div style={{ ...card, padding: "22px 24px" }}>
          <h3
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#212121",
              marginBottom: 4,
            }}
          >
            Expense Breakdown
          </h3>
          <p style={{ fontSize: 12, color: "#9e9e9e", marginBottom: 20 }}>
            By category (all time)
          </p>
          {donutData.length > 0 ?
            <DonutChart data={donutData} />
          : <p style={{ fontSize: 13, color: "#9e9e9e", padding: "20px 0" }}>
              No expenses recorded yet.
            </p>
          }
        </div>

        <BudgetTracker txList={txList} />
      </div>

      {/* Row 3 — Table */}
      <TransactionTable
        txList={txList}
        loading={loading}
        deleteTransaction={deleteTransaction}
      />
    </div>
  );
}
