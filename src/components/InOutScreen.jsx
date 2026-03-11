// src/components/InOutScreen.jsx
import { useState } from "react";
import Icon from "./Icon";

const fmt = (n) => new Intl.NumberFormat("fr-CM").format(Math.abs(n));

export default function InOutScreen({ txList = [], loading = false }) {
  const [tab, setTab] = useState("expenses");

  const income = txList
    .filter((t) => t.amount > 0)
    .reduce((a, t) => a + t.amount, 0);
  const expense = Math.abs(
    txList.filter((t) => t.amount < 0).reduce((a, t) => a + t.amount, 0),
  );
  const balance = income - expense;

  const filtered = txList.filter((tx) =>
    tab === "expenses" ? tx.amount < 0 : tx.amount > 0,
  );

  return (
    <div
      className="font-inter"
      style={{
        background: "var(--bg-app)",
        minHeight: "100vh",
        paddingBottom: "calc(var(--nav-height) + 20px)",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg,#1a237e 0%,#1565c0 100%)",
          padding: "16px 20px 48px",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>
            In & Out
          </h2>
        </div>
        <p
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.6)",
            marginBottom: 4,
          }}
        >
          Total Balance
        </p>
        <p
          className="font-bold"
          style={{ fontSize: 30, color: "#fff", letterSpacing: "-0.8px" }}
        >
          {loading ? "…" : `FCFA ${fmt(balance)}`}
        </p>
        <div className="flex gap-4 mt-3">
          <div className="flex items-center gap-2">
            <Icon name="arrow-down-left" size={14} color="#A5D6A7" />
            <span style={{ fontSize: 13, color: "#A5D6A7", fontWeight: 500 }}>
              {loading ? "…" : `+FCFA ${fmt(income)}`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="arrow-up-right" size={14} color="#FFAB91" />
            <span style={{ fontSize: 13, color: "#FFAB91", fontWeight: 500 }}>
              {loading ? "…" : `-FCFA ${fmt(expense)}`}
            </span>
          </div>
        </div>
      </div>

      {/* Tab + list */}
      <div
        style={{
          padding: "0 16px",
          marginTop: -24,
          maxWidth: 480,
          margin: "-24px auto 0",
        }}
      >
        <div
          className="card flex"
          style={{ padding: 4, gap: 0, marginBottom: 12 }}
        >
          {["expenses", "earnings"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="btn flex-1"
              style={{
                padding: "11px",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: tab === t ? 700 : 500,
                background:
                  tab === t ?
                    t === "expenses" ?
                      "var(--alert)"
                    : "var(--primary)"
                  : "transparent",
                color: tab === t ? "#fff" : "var(--text-muted)",
                boxShadow: tab === t ? "0 4px 12px rgba(0,0,0,0.15)" : "none",
              }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-3 px-1">
          <span
            style={{
              fontSize: 13,
              color: "var(--text-muted)",
              fontWeight: 500,
            }}
          >
            {loading ? "Loading…" : `${filtered.length} transactions`}
          </span>
        </div>

        <div className="card" style={{ padding: "4px 16px" }}>
          {loading ?
            <div className="flex flex-col items-center py-10 gap-3">
              <svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{ animation: "spin 0.8s linear infinite" }}
              >
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
              </svg>
              <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
            </div>
          : filtered.length === 0 ?
            <div className="flex flex-col items-center py-10 gap-3">
              <Icon name="receipt" size={40} color="var(--text-light)" />
              <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
                No {tab} yet
              </p>
            </div>
          : filtered.map((tx, i) => (
              <div
                key={tx.id}
                className="tx-item anim-fade-up"
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <div
                  className="tx-icon"
                  style={{ background: tx.bg ?? "#f5f5f5" }}
                >
                  <Icon
                    name={tx.icon ?? "receipt"}
                    size={18}
                    color={tx.color ?? "#9e9e9e"}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--text-main)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {tx.name}
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--text-muted)",
                      marginTop: 2,
                    }}
                  >
                    {tx.category} · {tx.date}
                  </p>
                </div>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    color: tx.amount > 0 ? "var(--primary)" : "var(--alert)",
                  }}
                >
                  {tx.amount > 0 ? "+" : "−"}
                  {fmt(tx.amount)}
                </p>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}
