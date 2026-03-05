// src/components/desktop/pages/AnalyticsPage.jsx
// Full analytics view: summary stats, trend charts, filterable + sortable transaction table.

import { useState } from "react";
import Icon from "../shared/Icon";
import BarChart from "../charts/BarChart";
import DonutChart from "../charts/DonutChart";
import { fmt, fmtShort } from "../shared/formatters";
import { card } from "../shared/styles";

// ─── Summary stat card ────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color, raw }) {
  return (
    <div style={{ ...card, padding:20, display:"flex", alignItems:"center", gap:14 }}>
      <div style={{ width:44, height:44, borderRadius:13, background: color + "18",
        display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        <Icon name={icon} size={20} color={color} />
      </div>
      <div>
        <p style={{ fontSize:11, color:"#9e9e9e", fontWeight:600, letterSpacing:"0.5px",
          textTransform:"uppercase", marginBottom:4 }}>
          {label}
        </p>
        <p style={{ fontSize:20, fontWeight:800, color:"#212121", letterSpacing:"-0.5px" }}>
          {raw ? value : fmtShort(value)}
        </p>
      </div>
    </div>
  );
}

// ─── AnalyticsPage ────────────────────────────────────────────────────────────
export default function AnalyticsPage({ txList }) {
  const [tab, setTab]       = useState("all");       // all | income | expenses
  const [search, setSearch] = useState("");
  const [sort, setSort]     = useState("date");
  const [sortDir, setSortDir] = useState("desc");

  // Derived stats
  const totalIncome  = txList.filter((t) => t.amount > 0).reduce((a, t) => a + t.amount, 0);
  const totalExpense = Math.abs(txList.filter((t) => t.amount < 0).reduce((a, t) => a + t.amount, 0));
  const avgTx        = Math.abs(txList.reduce((a, t) => a + t.amount, 0)) / txList.length;

  // Filtered + sorted rows
  const filtered = txList
    .filter((tx) => tab === "all" ? true : tab === "income" ? tx.amount > 0 : tx.amount < 0)
    .filter((tx) =>
      tx.name.toLowerCase().includes(search.toLowerCase()) ||
      tx.category.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const dir = sortDir === "desc" ? -1 : 1;
      if (sort === "amount") return (Math.abs(b.amount) - Math.abs(a.amount)) * dir;
      return (b.id - a.id) * dir;
    });

  const netTotal = filtered.reduce((a, t) => a + t.amount, 0);

  const toggleSort = (col) => {
    if (sort === col) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else { setSort(col); setSortDir("desc"); }
  };

  const COLS = "2fr 1.2fr 1fr 1fr 1fr";

  const tabItems = [
    { id:"all", label:"All" },
    { id:"income", label:"Income" },
    { id:"expenses", label:"Expenses" },
  ];

  const colHeaders = [
    { key:"name", label:"Description" },
    { key:"category", label:"Category" },
    { key:"date", label:"Date" },
    { key:"amount", label:"Amount" },
    { key:"type", label:"Type" },
  ];

  return (
    <div style={{ padding:28, display:"flex", flexDirection:"column", gap:20, overflowY:"auto", flex:1 }}>

      {/* Row 1 — Summary stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
        <StatCard label="Total Income"    value={totalIncome}     icon="trending-up"   color="#4CAF50" />
        <StatCard label="Total Expenses"  value={totalExpense}    icon="trending-down"  color="#FF5722" />
        <StatCard label="Transactions"    value={txList.length}   icon="receipt"        color="#2196F3" raw />
        <StatCard label="Avg. Transaction" value={avgTx}          icon="bar-chart"      color="#9C27B0" />
      </div>

      {/* Row 2 — Charts */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <div style={{ ...card, padding:"22px 24px" }}>
          <h3 style={{ fontSize:14, fontWeight:700, color:"#212121", marginBottom:4 }}>6-Month Trend</h3>
          <p style={{ fontSize:12, color:"#9e9e9e", marginBottom:20 }}>Income vs Expense comparison</p>
          <BarChart />
        </div>
        <div style={{ ...card, padding:"22px 24px" }}>
          <h3 style={{ fontSize:14, fontWeight:700, color:"#212121", marginBottom:4 }}>Category Split</h3>
          <p style={{ fontSize:12, color:"#9e9e9e", marginBottom:20 }}>Expense distribution</p>
          <DonutChart />
        </div>
      </div>

      {/* Row 3 — Filterable sortable table */}
      <div style={{ ...card, overflow:"hidden" }}>

        {/* Filter bar */}
        <div style={{ padding:"16px 24px", borderBottom:"1px solid #f0f0f0",
          display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>

          {/* Tab toggle */}
          <div style={{ display:"flex", gap:4, background:"#f5f5f5", borderRadius:10, padding:4 }}>
            {tabItems.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  padding:"7px 16px", borderRadius:8, border:"none", cursor:"pointer",
                  fontSize:12, fontWeight:600, transition:"all 0.15s",
                  background: tab === t.id ? "#fff" : "transparent",
                  color: tab === t.id
                    ? (t.id === "income" ? "#2E7D32" : t.id === "expenses" ? "#D32F2F" : "#2196F3")
                    : "#9e9e9e",
                  boxShadow: tab === t.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ display:"flex", alignItems:"center", gap:8, background:"#f9fafb",
            border:"1.5px solid #f0f0f0", borderRadius:10, padding:"7px 12px", flex:1, maxWidth:280 }}>
            <Icon name="search" size={14} color="#9e9e9e" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or category…"
              style={{ border:"none", outline:"none", background:"transparent", fontSize:13, color:"#212121", width:"100%" }}
            />
          </div>

          {/* Right actions */}
          <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
            {[{ icon:"calendar", label:"Date Range" }, { icon:"download", label:"Export CSV" }].map((btn) => (
              <button key={btn.label} style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 14px",
                borderRadius:10, border:"1.5px solid #e0e0e0", background:"#fff",
                fontSize:12, fontWeight:600, color:"#757575", cursor:"pointer" }}>
                <Icon name={btn.icon} size={13} color="#9e9e9e" /> {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Column headers (sortable) */}
        <div style={{ display:"grid", gridTemplateColumns:COLS, padding:"10px 24px",
          background:"#fafafa", borderBottom:"1px solid #f0f0f0" }}>
          {colHeaders.map((col) => (
            <button
              key={col.key}
              onClick={() => toggleSort(col.key)}
              style={{ display:"flex", alignItems:"center", gap:4, background:"none", border:"none",
                cursor:"pointer", fontSize:11, fontWeight:700, textTransform:"uppercase",
                letterSpacing:"0.5px", textAlign:"left",
                color: sort === col.key ? "#2196F3" : "#9e9e9e" }}
            >
              {col.label}
              {sort === col.key && (
                <Icon name={sortDir === "desc" ? "chevron-down" : "arrow-up"} size={12} color="#2196F3" />
              )}
            </button>
          ))}
        </div>

        {/* Data rows */}
        <div style={{ maxHeight:400, overflowY:"auto" }}>
          {filtered.length === 0 ? (
            <div style={{ padding:"48px 24px", textAlign:"center", color:"#9e9e9e" }}>
              <Icon name="receipt" size={36} color="#e0e0e0" />
              <p style={{ marginTop:12, fontSize:14, fontWeight:500 }}>No transactions found</p>
            </div>
          ) : (
            filtered.map((tx, i) => (
              <div
                key={tx.id}
                style={{
                  display:"grid", gridTemplateColumns:COLS,
                  padding:"13px 24px", borderBottom:"1px solid #f9f9f9",
                  transition:"background 0.15s",
                  animation:`fadeUp 0.3s ease ${i * 0.03}s both`,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#fafcff")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
              >
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:32, height:32, borderRadius:9, background:tx.bg,
                    display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Icon name={tx.icon} size={14} color={tx.color} />
                  </div>
                  <span style={{ fontSize:13, fontWeight:600, color:"#212121" }}>{tx.name}</span>
                </div>

                <div style={{ display:"flex", alignItems:"center" }}>
                  <span style={{ fontSize:12, padding:"2px 8px", borderRadius:100,
                    background:"#f5f5f5", color:"#616161", fontWeight:600 }}>
                    {tx.category}
                  </span>
                </div>

                <div style={{ display:"flex", alignItems:"center" }}>
                  <span style={{ fontSize:12, color:"#9e9e9e" }}>{tx.date}</span>
                </div>

                <div style={{ display:"flex", alignItems:"center" }}>
                  <span style={{ fontSize:13, fontWeight:700,
                    color: tx.amount > 0 ? "#2E7D32" : "#D32F2F" }}>
                    {tx.amount > 0 ? "+" : "-"} {fmt(tx.amount)}
                  </span>
                </div>

                <div style={{ display:"flex", alignItems:"center" }}>
                  <span style={{ fontSize:11, padding:"3px 10px", borderRadius:100, fontWeight:700,
                    background: tx.amount > 0 ? "#E8F5E9" : "#FFEBEE",
                    color: tx.amount > 0 ? "#2E7D32" : "#D32F2F" }}>
                    {tx.amount > 0 ? "Income" : "Expense"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{ padding:"12px 24px", background:"#fafafa", borderTop:"1px solid #f0f0f0",
          display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:12, color:"#9e9e9e" }}>{filtered.length} transactions</span>
          <span style={{ fontSize:12, color:"#9e9e9e" }}>
            Net:{" "}
            <strong style={{ color: netTotal >= 0 ? "#2E7D32" : "#D32F2F" }}>
              {netTotal >= 0 ? "+" : "-"} FCFA {fmt(Math.abs(netTotal))}
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
}
