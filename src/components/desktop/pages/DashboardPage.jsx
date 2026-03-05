// src/components/desktop/pages/DashboardPage.jsx
// Main dashboard: KPI row, charts row, recent transactions table.
// Receives txList as a prop — all data mutations happen in DesktopLayout.

import { useState } from "react";
import Icon from "../shared/Icon";
import BarChart from "../charts/BarChart";
import DonutChart from "../charts/DonutChart";
import { fmt, fmtShort } from "../shared/formatters";
import { card, ghostBtn, gradients } from "../shared/styles";
import { SPEND_CATEGORIES } from "../../../../data/desktopData";

// ─── KPI Hero Card ────────────────────────────────────────────────────────────
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
      {/* Decorative circles */}
      <div style={{ position:"absolute", top:-30, right:-30, width:120, height:120,
        borderRadius:"50%", background:"rgba(255,255,255,0.06)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:-40, left:40, width:100, height:100,
        borderRadius:"50%", background:"rgba(255,255,255,0.04)", pointerEvents:"none" }} />

      {icon && (
        <div style={{ width:36, height:36, borderRadius:10, background:"rgba(255,255,255,0.15)",
          display:"flex", alignItems:"center", justifyContent:"center", marginBottom:12 }}>
          <Icon name={icon} size={18} color="#fff" />
        </div>
      )}

      <p style={{ fontSize:11, color:"rgba(255,255,255,0.6)", fontWeight:600,
        letterSpacing:"1px", textTransform:"uppercase", marginBottom: icon ? 4 : 8 }}>
        {title}
      </p>
      <p style={{ fontSize: icon ? 24 : 32, fontWeight:800, letterSpacing:"-0.5px", marginBottom: badge ? 12 : 0 }}>
        {value}
      </p>
      {subtitle && <p style={{ fontSize:11, color:"rgba(255,255,255,0.6)", marginTop:4 }}>{subtitle}</p>}
      {badge && (
        <div style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(76,175,80,0.2)",
          borderRadius:100, padding:"4px 10px", width:"fit-content" }}>
          <Icon name="trending-up" size={13} color="#A5D6A7" />
          <span style={{ fontSize:12, color:"#A5D6A7", fontWeight:600 }}>{badge}</span>
        </div>
      )}
    </div>
  );
}

// ─── Budget Tracker ───────────────────────────────────────────────────────────
function BudgetTracker() {
  return (
    <div style={{ ...card, padding:"22px 24px" }}>
      <h3 style={{ fontSize:14, fontWeight:700, color:"#212121", marginBottom:16 }}>Budget Tracker</h3>
      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
        {SPEND_CATEGORIES.map((cat) => {
          const pct = Math.min((cat.spent / cat.budget) * 100, 100);
          return (
            <div key={cat.name}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:28, height:28, borderRadius:8,
                    background: cat.over ? "#FFEBEE" : cat.color + "18",
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Icon name={cat.icon} size={13} color={cat.over ? "#FF5722" : cat.color} />
                  </div>
                  <span style={{ fontSize:12, fontWeight:600, color:"#424242" }}>{cat.name}</span>
                </div>
                <div style={{ textAlign:"right" }}>
                  <span style={{ fontSize:12, fontWeight:700, color: cat.over ? "#FF5722" : "#212121" }}>
                    {fmtShort(cat.spent)}
                  </span>
                  <span style={{ fontSize:11, color:"#9e9e9e" }}> / {fmtShort(cat.budget)}</span>
                </div>
              </div>
              <div style={{ height:5, borderRadius:100, background:"#f0f0f0", overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${pct}%`, borderRadius:100, transition:"width 1s cubic-bezier(.22,1,.36,1)",
                  background: cat.over
                    ? "linear-gradient(90deg,#FF5722,#E53935)"
                    : `linear-gradient(90deg,${cat.color}88,${cat.color})` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Transaction Table ────────────────────────────────────────────────────────
function TransactionTable({ txList }) {
  const [hoveredId, setHoveredId] = useState(null);
  const preview = txList.slice(0, 8);

  const COLS = "2fr 1.2fr 1fr 1fr 100px";

  return (
    <div style={{ ...card, overflow:"hidden" }}>
      {/* Table header bar */}
      <div style={{ padding:"20px 24px 16px", display:"flex", justifyContent:"space-between",
        alignItems:"center", borderBottom:"1px solid #f5f5f5" }}>
        <div>
          <h3 style={{ fontSize:14, fontWeight:700, color:"#212121" }}>Recent Transactions</h3>
          <p style={{ fontSize:12, color:"#9e9e9e", marginTop:2 }}>
            Showing last {preview.length} entries
          </p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {[{ icon:"filter", label:"Filter" }, { icon:"download", label:"Export" }].map((btn) => (
            <button key={btn.label} style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 14px",
              borderRadius:10, border:"1.5px solid #e0e0e0", background:"#fff",
              fontSize:12, fontWeight:600, color:"#757575", cursor:"pointer" }}>
              <Icon name={btn.icon} size={13} color="#9e9e9e" /> {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Column labels */}
      <div style={{ display:"grid", gridTemplateColumns:COLS, padding:"10px 24px",
        background:"#fafafa", borderBottom:"1px solid #f0f0f0" }}>
        {["Description","Category","Date","Amount","Action"].map((h) => (
          <span key={h} style={{ fontSize:11, fontWeight:700, color:"#9e9e9e",
            letterSpacing:"0.5px", textTransform:"uppercase" }}>
            {h}
          </span>
        ))}
      </div>

      {/* Rows */}
      {preview.map((tx, i) => (
        <div
          key={tx.id}
          onMouseEnter={() => setHoveredId(tx.id)}
          onMouseLeave={() => setHoveredId(null)}
          style={{
            display:"grid", gridTemplateColumns:COLS,
            padding:"14px 24px", borderBottom:"1px solid #f9f9f9",
            background: hoveredId === tx.id ? "#fafcff" : "#fff",
            transition:"background 0.15s",
            animation:`fadeUp 0.4s cubic-bezier(.22,1,.36,1) ${i * 0.04}s both`,
          }}
        >
          {/* Name */}
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:tx.bg,
              display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Icon name={tx.icon} size={16} color={tx.color} />
            </div>
            <span style={{ fontSize:14, fontWeight:600, color:"#212121" }}>{tx.name}</span>
          </div>

          {/* Category */}
          <div style={{ display:"flex", alignItems:"center" }}>
            <span style={{ fontSize:12, padding:"3px 10px", borderRadius:100,
              background: tx.amount > 0 ? "#E8F5E9" : "#f5f5f5",
              color: tx.amount > 0 ? "#2E7D32" : "#616161", fontWeight:600 }}>
              {tx.category}
            </span>
          </div>

          {/* Date */}
          <div style={{ display:"flex", alignItems:"center" }}>
            <span style={{ fontSize:13, color:"#9e9e9e" }}>{tx.date}</span>
          </div>

          {/* Amount */}
          <div style={{ display:"flex", alignItems:"center" }}>
            <span style={{ fontSize:14, fontWeight:700,
              color: tx.amount > 0 ? "#2E7D32" : "#D32F2F" }}>
              {tx.amount > 0 ? "+" : "−"} FCFA {fmt(tx.amount)}
            </span>
          </div>

          {/* Hover actions */}
          <div style={{ display:"flex", alignItems:"center", gap:4,
            opacity: hoveredId === tx.id ? 1 : 0, transition:"opacity 0.15s" }}>
            <button style={{ ...ghostBtn, padding:6, borderRadius:8, background:"#f0f7ff" }}>
              <Icon name="edit" size={14} color="#2196F3" />
            </button>
            <button style={{ ...ghostBtn, padding:6, borderRadius:8, background:"#fff5f5" }}>
              <Icon name="trash" size={14} color="#EF5350" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── DashboardPage (composed) ─────────────────────────────────────────────────
export default function DashboardPage({ txList }) {
  const income  = txList.filter((t) => t.amount > 0).reduce((a, t) => a + t.amount, 0);
  const expense = Math.abs(txList.filter((t) => t.amount < 0).reduce((a, t) => a + t.amount, 0));

  return (
    <div style={{ padding:28, display:"flex", flexDirection:"column", gap:24, overflowY:"auto", flex:1 }}>

      {/* Row 1 — KPI cards */}
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:16 }}>
        <KpiCard
          title="Total Balance"
          value={`FCFA ${fmt(8420000)}`}
          gradient={gradients.blue}
          badge="+4% from last month"
        />
        <KpiCard
          title="Income"
          value={fmtShort(income)}
          subtitle="FCFA this month"
          icon="arrow-down-left"
          gradient={gradients.green}
        />
        <KpiCard
          title="Expenses"
          value={fmtShort(expense)}
          subtitle="FCFA this month"
          icon="arrow-up-right"
          gradient={gradients.red}
        />
      </div>

      {/* Row 2 — Charts + budget */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 320px", gap:16 }}>
        {/* Bar chart */}
        <div style={{ ...card, padding:"22px 24px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <div>
              <h3 style={{ fontSize:14, fontWeight:700, color:"#212121" }}>Monthly Overview</h3>
              <p style={{ fontSize:12, color:"#9e9e9e", marginTop:2 }}>Income vs Expenses</p>
            </div>
            <div style={{ display:"flex", gap:12 }}>
              {[{ c:"#4CAF50", l:"Income" }, { c:"#FF5722", l:"Expense" }].map((leg) => (
                <div key={leg.l} style={{ display:"flex", alignItems:"center", gap:5 }}>
                  <div style={{ width:8, height:8, borderRadius:2, background:leg.c }} />
                  <span style={{ fontSize:11, color:"#9e9e9e" }}>{leg.l}</span>
                </div>
              ))}
            </div>
          </div>
          <BarChart />
        </div>

        {/* Donut chart */}
        <div style={{ ...card, padding:"22px 24px" }}>
          <h3 style={{ fontSize:14, fontWeight:700, color:"#212121", marginBottom:4 }}>Expense Breakdown</h3>
          <p style={{ fontSize:12, color:"#9e9e9e", marginBottom:20 }}>By category this month</p>
          <DonutChart />
        </div>

        {/* Budget tracker */}
        <BudgetTracker />
      </div>

      {/* Row 3 — Transactions table */}
      <TransactionTable txList={txList} />
    </div>
  );
}
