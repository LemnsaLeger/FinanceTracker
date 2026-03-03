// src/components/InOutScreen.jsx
import { useState } from "react";
import Icon from "./Icon";

const fmt = (n) => new Intl.NumberFormat("fr-CM").format(Math.abs(n));

export default function InOutScreen({ txList }) {
  const [tab, setTab] = useState("expenses");

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
          background: "linear-gradient(135deg, #1a237e 0%, #1565c0 100%)",
          padding: "16px 20px 48px",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>
            In & Out
          </h2>
          <button
            className="btn btn-ghost"
            style={{
              padding: 8,
              borderRadius: 11,
              background: "rgba(255,255,255,0.12)",
            }}
          >
            <Icon name="search" size={18} color="rgba(255,255,255,0.8)" />
          </button>
        </div>
        <p
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.6)",
            marginBottom: 4,
          }}
        >
          Active Total Balance
        </p>
        <p
          className="font-bold"
          style={{ fontSize: 30, color: "#fff", letterSpacing: "-0.8px" }}
        >
          FCFA 8,420,000
        </p>
        <div className="flex items-center gap-2 mt-2">
          <Icon name="trending-up" size={14} color="#A5D6A7" />
          <span style={{ fontSize: 13, color: "#A5D6A7", fontWeight: 500 }}>
            Up by 4% from last month
          </span>
        </div>
      </div>

      {/* Tab Toggle (overlapping card) */}
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

        {/* Sort row */}
        <div className="flex items-center justify-between mb-3 px-1">
          <span
            style={{
              fontSize: 13,
              color: "var(--text-muted)",
              fontWeight: 500,
            }}
          >
            {filtered.length} transactions
          </span>
          <button
            className="btn btn-ghost"
            style={{
              padding: "6px 10px",
              fontSize: 12,
              color: "var(--text-muted)",
              gap: 4,
            }}
          >
            <Icon name="filter" size={13} color="var(--text-muted)" />
            Sort by
          </button>
        </div>

        {/* Transaction list */}
        <div className="card" style={{ padding: "4px 16px" }}>
          {filtered.length === 0 ?
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
                <div className="tx-icon" style={{ background: tx.colorBg }}>
                  <Icon name={tx.icon} size={18} color={tx.color} />
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
                    {tx.category.charAt(0).toUpperCase() + tx.category.slice(1)}{" "}
                    · {tx.date}
                  </p>
                </div>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: tx.amount > 0 ? "var(--primary)" : "var(--alert)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tx.amount > 0 ? "+" : "-"}
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
