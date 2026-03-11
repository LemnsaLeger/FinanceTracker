// src/components/HomeScreen.jsx
import { useState } from "react";
import Icon from "./Icon";

const fmt = (n) => new Intl.NumberFormat("fr-CM").format(Math.abs(n));

function BalanceCard({ txList }) {
  const [hidden, setHidden] = useState(false);

  const income = txList
    .filter((t) => t.amount > 0)
    .reduce((a, t) => a + t.amount, 0);
  const expense = Math.abs(
    txList.filter((t) => t.amount < 0).reduce((a, t) => a + t.amount, 0),
  );
  const balance = income - expense;

  return (
    <div className="balance-card anim-fade-up">
      <div
        className="flex items-start justify-between mb-1"
        style={{ position: "relative", zIndex: 1 }}
      >
        <div>
          <p
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.65)",
              fontWeight: 500,
              marginBottom: 2,
            }}
          >
            My Finances
          </p>
        </div>
        <div className="flex gap-2" style={{ position: "relative", zIndex: 1 }}>
          <button
            onClick={() => setHidden(!hidden)}
            className="btn btn-ghost"
            style={{
              padding: 8,
              borderRadius: 10,
              background: "rgba(255,255,255,0.12)",
            }}
          >
            <Icon
              name={hidden ? "eye-off" : "eye"}
              size={17}
              color="rgba(255,255,255,0.75)"
            />
          </button>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          marginTop: 20,
          marginBottom: 20,
        }}
      >
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
          style={{
            fontSize: 34,
            color: "#fff",
            letterSpacing: "-1px",
            filter: hidden ? "blur(10px)" : "none",
            transition: "filter 0.3s ease",
          }}
        >
          FCFA {fmt(balance)}
        </p>
      </div>

      {/* Income / Expenses row */}
      <div className="flex gap-3" style={{ position: "relative", zIndex: 1 }}>
        {[
          {
            label: "Income",
            amount: income,
            icon: "arrow-down-left",
            color: "#A5D6A7",
          },
          {
            label: "Expenses",
            amount: expense,
            icon: "arrow-up-right",
            color: "#FFAB91",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="flex-1 flex items-center gap-2"
            style={{
              background: "rgba(255,255,255,0.1)",
              borderRadius: 12,
              padding: "10px 12px",
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 9,
                background: "rgba(255,255,255,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name={item.icon} size={14} color={item.color} />
            </div>
            <div>
              <p
                style={{
                  fontSize: 10,
                  color: "rgba(255,255,255,0.55)",
                  fontWeight: 500,
                }}
              >
                {item.label}
              </p>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>
                {hidden ? "••••" : fmt(item.amount)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentTransactions({ txList }) {
  const recent = txList.slice(0, 10);
  return (
    <div className="card anim-fade-up delay-3" style={{ padding: "18px 16px" }}>
      <div className="flex items-center justify-between mb-2">
        <h3
          style={{ fontSize: 15, fontWeight: 700, color: "var(--text-main)" }}
        >
          Recent Transactions
        </h3>
      </div>

      {recent.length === 0 ?
        <div className="flex flex-col items-center py-8 gap-3">
          <Icon name="receipt" size={36} color="var(--text-light)" />
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            No transactions yet
          </p>
          <p
            style={{
              color: "var(--text-light)",
              fontSize: 12,
              textAlign: "center",
            }}
          >
            Tap the + button below to add your first one.
          </p>
        </div>
      : recent.map((tx, i) => (
          <div
            key={tx.id}
            className="tx-item"
            style={{ animationDelay: `${0.3 + i * 0.05}s` }}
          >
            <div className="tx-icon" style={{ background: tx.bg ?? "#f5f5f5" }}>
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
  );
}

export default function HomeScreen({ txList = [], loading = false }) {
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
          background: "var(--surface)",
          padding: "14px 20px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "var(--primary)" }}
          >
            <Icon name="wallet" size={16} color="#fff" strokeWidth={2} />
          </div>
          <span
            style={{ fontWeight: 700, fontSize: 16, color: "var(--text-main)" }}
          >
            FinanceTrack
          </span>
        </div>
        <div className="flex gap-2">
          <button
            className="btn btn-ghost"
            style={{
              padding: 8,
              borderRadius: 11,
              background: "var(--bg-app)",
            }}
          >
            <Icon name="search" size={19} color="var(--text-muted)" />
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading ?
        <div
          style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}
        >
          <svg
            width={28}
            height={28}
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
      : <div
          style={{
            padding: "16px 16px 0",
            maxWidth: 480,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <BalanceCard txList={txList} />
          <RecentTransactions txList={txList} />
        </div>
      }
    </div>
  );
}
