// src/components/AddTransactionSheet.jsx
import { useState, useRef, useEffect } from "react";
import Icon from "./Icon";

import "../App.css";

const categories = [
  {
    id: "food",
    label: "Food",
    icon: "utensils",
    color: "#E53935",
    bg: "#FFEBEE",
  },
  {
    id: "subscription",
    label: "Subscription",
    icon: "repeat",
    color: "#2196F3",
    bg: "#E3F2FD",
  },
  { id: "bills", label: "Bills", icon: "zap", color: "#FF9800", bg: "#FFF3E0" },
  {
    id: "transport",
    label: "Transport",
    icon: "car",
    color: "#9C27B0",
    bg: "#F3E5F5",
  },
  {
    id: "income",
    label: "Income",
    icon: "trending-up",
    color: "#4CAF50",
    bg: "#E8F5E9",
  },
  {
    id: "cash",
    label: "Cash",
    icon: "landmark",
    color: "#757575",
    bg: "#F5F5F5",
  },
];

const fmt = (n) =>
  n === "" ? "" : (
    new Intl.NumberFormat("fr-CM").format(Number(String(n).replace(/\D/g, "")))
  );

export default function AddTransactionSheet({ onClose, onSave }) {
  const [type, setType] = useState("expense");
  const [rawAmount, setRawAmount] = useState("");
  const [category, setCategory] = useState("food");
  const [description, setDescription] = useState("");
  const inputRef = useRef();

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 150);
  }, []);

  const handleAmountChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "");
    setRawAmount(digits);
  };

  const handleSave = () => {
    if (!rawAmount || !description) return;
    const amount = parseInt(rawAmount) * (type === "expense" ? -1 : 1);
    onSave({ type, amount, category, description });
    onClose();
  };

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div
        className="anim-slide-up"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "var(--surface)",
          borderRadius: "24px 24px 0 0",
          padding: "0 20px 20px",
          maxHeight: "88vh",
          overflowY: "auto",
          zIndex: 50,
          maxWidth: "100%",
          margin: "0 auto",
        }}
      >
        {/* Handle */}
        <div
          style={{
            padding: "14px 0 8px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 36,
              height: 4,
              borderRadius: 100,
              background: "var(--border-subtle)",
            }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2
            style={{ fontSize: 18, fontWeight: 700, color: "var(--text-main)" }}
          >
            Add Transaction
          </h2>
          <button
            className="btn btn-ghost"
            style={{ padding: "6px", borderRadius: 10 }}
            onClick={onClose}
          >
            <Icon name="x" size={20} color="var(--text-muted)" />
          </button>
        </div>

        {/* Type Toggle */}
        <div
          className="flex mb-6"
          style={{
            background: "var(--bg-app)",
            borderRadius: 14,
            padding: 4,
          }}
        >
          {["expense", "income"].map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className="btn flex-1"
              style={{
                padding: "10px",
                borderRadius: 11,
                fontSize: 14,
                background: type === t ? "var(--surface)" : "transparent",
                color:
                  type === t ?
                    t === "expense" ?
                      "var(--alert)"
                    : "var(--primary)"
                  : "var(--text-muted)",
                boxShadow: type === t ? "var(--shadow-card)" : "none",
                fontWeight: type === t ? 700 : 500,
              }}
            >
              <Icon
                name={t === "expense" ? "arrow-up-right" : "arrow-down-left"}
                size={15}
                color={
                  type === t ?
                    t === "expense" ?
                      "var(--alert)"
                    : "var(--primary)"
                  : "var(--text-light)"
                }
              />
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Amount */}
        <div className="mb-5">
          <label
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--text-muted)",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            Amount (FCFA)
          </label>
          <div
            className="flex items-center gap-2 mt-2"
            style={{
              border: `2px solid ${
                rawAmount ?
                  type === "expense" ?
                    "var(--alert)"
                  : "var(--primary)"
                : "var(--border-subtle)"
              }`,
              borderRadius: 14,
              padding: "12px 16px",
              transition: "border-color 0.2s",
            }}
          >
            <span
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "var(--text-light)",
              }}
            >
              FCFA
            </span>
            <input
              ref={inputRef}
              type="tel"
              inputMode="numeric"
              placeholder="0"
              value={rawAmount ? fmt(rawAmount) : ""}
              onChange={handleAmountChange}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: 26,
                fontWeight: 800,
                color: "var(--text-main)",
                background: "transparent",
                fontFamily: "Inter, sans-serif",
                letterSpacing: "-0.5px",
              }}
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-5">
          <label
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--text-muted)",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            Description
          </label>
          <input
            className="ft-input mt-2"
            type="text"
            placeholder="e.g. Lunch at office"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Category */}
        <div className="mb-7">
          <label
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--text-muted)",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              marginBottom: 10,
              display: "block",
            }}
          >
            Category
          </label>
          <div className="scroll-row">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className="btn flex-col"
                style={{
                  padding: "12px 14px",
                  borderRadius: 14,
                  flexShrink: 0,
                  gap: 6,
                  minWidth: 72,
                  background: category === cat.id ? cat.bg : "var(--bg-app)",
                  border: `2px solid ${category === cat.id ? cat.color + "55" : "transparent"}`,
                  flexDirection: "column",
                  fontSize: 11,
                  color: category === cat.id ? cat.color : "var(--text-muted)",
                  fontWeight: category === cat.id ? 700 : 500,
                }}
              >
                <Icon
                  name={cat.icon}
                  size={18}
                  color={category === cat.id ? cat.color : "var(--text-light)"}
                />
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="btn btn-primary w-full"
          style={{
            padding: "16px",
            fontSize: 16,
            background:
              rawAmount && description ?
                type === "expense" ?
                  "var(--alert)"
                : "var(--primary)"
              : "var(--border-subtle)",
            color: rawAmount && description ? "#fff" : "var(--text-light)",
            boxShadow:
              rawAmount && description ?
                type === "expense" ?
                  "0 8px 24px rgba(255,87,34,0.3)"
                : "var(--shadow-hero)"
              : "none",
          }}
          disabled={!rawAmount || !description}
        >
          <Icon
            name="check"
            size={18}
            color={rawAmount && description ? "#fff" : "var(--text-light)"}
          />
          Save Transaction
        </button>
      </div>
    </>
  );
}
