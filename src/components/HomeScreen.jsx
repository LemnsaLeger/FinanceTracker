// src/components/HomeScreen.jsx
import { useState } from "react";
import Icon from "./Icon";
import {
  balanceData,
  spendingCategories,
  user,
} from "../../data/mockData";

const fmt = (n) => new Intl.NumberFormat("fr-CM").format(Math.abs(n));

function BalanceCard() {
  const [hidden, setHidden] = useState(false);

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
            Welcome back
          </p>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>
            {user.name}
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
          <button
            className="btn btn-ghost"
            style={{
              padding: 8,
              borderRadius: 10,
              background: "rgba(255,255,255,0.12)",
            }}
          >
            <Icon
              name="more-horizontal"
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
          Active Total Balance
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
          FCFA {fmt(balanceData.total)}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <div
            className="category-chip"
            style={{
              background: "rgba(76,175,80,0.22)",
              color: "#A5D6A7",
              fontSize: 12,
              padding: "4px 10px",
            }}
          >
            <Icon name="trending-up" size={12} color="#A5D6A7" />
            Up by {balanceData.changePercent}% from last month
          </div>
        </div>
      </div>

      {/* Income / Expenses row */}
      <div className="flex gap-3" style={{ position: "relative", zIndex: 1 }}>
        {[
          {
            label: "Income",
            amount: balanceData.income,
            icon: "arrow-down-left",
            color: "#A5D6A7",
          },
          {
            label: "Expenses",
            amount: balanceData.expenses,
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

function SpendingBreakdown() {
  return (
    <div className="card anim-fade-up delay-2" style={{ padding: "18px 16px" }}>
      <div className="flex items-center justify-between mb-4">
        <h3
          style={{ fontSize: 15, fontWeight: 700, color: "var(--text-main)" }}
        >
          Spending Breakdown
        </h3>
        <button
          className="btn btn-ghost"
          style={{
            padding: "4px 8px",
            fontSize: 12,
            color: "var(--secondary)",
          }}
        >
          This month
          <Icon name="chevron-right" size={13} color="var(--secondary)" />
        </button>
      </div>
      <div className="flex flex-col gap-4">
        {spendingCategories.map((cat) => {
          const pct = Math.min((cat.spent / cat.budget) * 100, 100);
          const over = cat.overBudget;
          return (
            <div key={cat.id}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="tx-icon"
                    style={{
                      background:
                        over ? "var(--alert-light)" : cat.color + "18",
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                    }}
                  >
                    <Icon
                      name={cat.icon}
                      size={15}
                      color={over ? "var(--alert)" : cat.color}
                    />
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--text-main)",
                      }}
                    >
                      {cat.name}
                    </p>
                    <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      {fmt(cat.spent)} / {fmt(cat.budget)}
                    </p>
                  </div>
                </div>
                {over && (
                  <span
                    className="category-chip"
                    style={{
                      background: "var(--alert-light)",
                      color: "var(--alert)",
                      fontSize: 10,
                      padding: "3px 8px",
                    }}
                  >
                    Over
                  </span>
                )}
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    "--progress-width": `${pct}%`,
                    width: `${pct}%`,
                    background:
                      over ? "var(--alert)" : (
                        `linear-gradient(90deg, ${cat.color}99, ${cat.color})`
                      ),
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RecentTransactions({ txList }) {
  return (
    <div className="card anim-fade-up delay-3" style={{ padding: "18px 16px" }}>
      <div className="flex items-center justify-between mb-2">
        <h3
          style={{ fontSize: 15, fontWeight: 700, color: "var(--text-main)" }}
        >
          Recent Transactions
        </h3>
        <button
          className="btn btn-ghost"
          style={{
            padding: "4px 8px",
            fontSize: 12,
            color: "var(--secondary)",
          }}
        >
          See all
          <Icon name="chevron-right" size={13} color="var(--secondary)" />
        </button>
      </div>
      {txList.map((tx, i) => (
        <div
          key={tx.id}
          className="tx-item"
          style={{ animationDelay: `${0.3 + i * 0.05}s` }}
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
              style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}
            >
              {tx.category.charAt(0).toUpperCase() + tx.category.slice(1)} ·{" "}
              {tx.date}
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
            {tx.amount > 0 ? "+" : "−"}
            {fmt(tx.amount)}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function HomeScreen({ txList }) {
  return (
    <div
      className="font-inter"
      style={{
        background: "var(--bg-app)",
        minHeight: "100vh",
        paddingBottom: "calc(var(--nav-height) + 20px)",
      }}
    >
      {/* App Header */}
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
              position: "relative",
            }}
          >
            <Icon name="search" size={19} color="var(--text-muted)" />
          </button>
          <button
            className="btn btn-ghost"
            style={{
              padding: 8,
              borderRadius: 11,
              background: "var(--bg-app)",
              position: "relative",
            }}
          >
            <Icon name="bell" size={19} color="var(--text-muted)" />
            <span className="notif-dot" />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div
        style={{
          padding: "16px 16px 0",
          maxWidth: 480,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <BalanceCard />
        <SpendingBreakdown />
        <RecentTransactions txList={txList} />
      </div>
    </div>
  );
}
