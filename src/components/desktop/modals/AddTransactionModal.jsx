// src/components/desktop/modals/AddTransactionModal.jsx
// Bottom-sheet-style modal for adding a new transaction.
// Keyboard: Escape closes; Ctrl/Cmd+N opens (wired in DesktopLayout).

import { useState, useRef, useEffect } from "react";
import Icon from "../shared/Icon";
import { labelStyle, inputStyle, ghostBtn } from "../shared/styles";

const CATEGORIES = ["food", "transport", "bills", "subscription", "income", "cash"];

export default function AddTransactionModal({ onClose, onSave }) {
  const [type, setType]   = useState("expense");
  const [amount, setAmount] = useState("");
  const [desc, setDesc]   = useState("");
  const [cat, setCat]     = useState("food");
  const inputRef = useRef();

  // Auto-focus the amount field when modal opens
  useEffect(() => { inputRef.current?.focus(); }, []);

  const rawDigits = amount.replace(/\D/g, "");
  const displayAmount = rawDigits
    ? new Intl.NumberFormat("fr-CM").format(parseInt(rawDigits))
    : "";

  const isValid   = rawDigits && desc.trim();
  const accentColor = type === "expense" ? "#FF5722" : "#4CAF50";
  const btnGradient = type === "expense"
    ? "linear-gradient(135deg,#FF5722,#E53935)"
    : "linear-gradient(135deg,#4CAF50,#388E3C)";

  const handleSave = () => {
    if (!isValid) return;
    onSave({
      type,
      amount: parseInt(rawDigits) * (type === "expense" ? -1 : 1),
      name: desc.trim(),
      category: cat,
    });
    onClose();
  };

  return (
    // Backdrop
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        animation: "fadeIn 0.2s ease",
      }}
    >
      {/* Modal panel */}
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: 32,
          width: "100%",
          maxWidth: 440,
          boxShadow: "0 24px 64px rgba(0,0,0,0.15)",
          animation: "scaleIn 0.3s cubic-bezier(.22,1,.36,1)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#212121" }}>New Transaction</h2>
          <button onClick={onClose} style={ghostBtn}>
            <Icon name="x" size={18} color="#757575" />
          </button>
        </div>

        {/* Type toggle */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 20,
            background: "#f9fafb",
            borderRadius: 12,
            padding: 4,
          }}
        >
          {["expense", "income"].map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: 9,
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14,
                transition: "all 0.2s",
                background: type === t ? "#fff" : "transparent",
                color: type === t ? (t === "expense" ? "#FF5722" : "#4CAF50") : "#9e9e9e",
                boxShadow: type === t ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
              }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Amount */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Amount (FCFA)</label>
          <input
            ref={inputRef}
            type="tel"
            inputMode="numeric"
            placeholder="0"
            value={displayAmount}
            onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
            style={{
              ...inputStyle,
              fontSize: 22,
              fontWeight: 700,
              borderColor: rawDigits ? accentColor : "#e0e0e0",
            }}
          />
        </div>

        {/* Description */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Description</label>
          <input
            type="text"
            placeholder="e.g. Lunch at restaurant"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            style={inputStyle}
          />
        </div>

        {/* Category chips */}
        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Category</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 100,
                  border: `1.5px solid ${cat === c ? "#2196F3" : "#e0e0e0"}`,
                  background: cat === c ? "#E3F2FD" : "#fff",
                  color: cat === c ? "#2196F3" : "#757575",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={!isValid}
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: 14,
            border: "none",
            cursor: isValid ? "pointer" : "not-allowed",
            fontWeight: 700,
            fontSize: 15,
            color: "#fff",
            background: isValid ? btnGradient : "#e0e0e0",
            boxShadow: isValid ? "0 8px 24px rgba(0,0,0,0.15)" : "none",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <Icon name="check" size={16} color="#fff" />
          Save Transaction
        </button>

        <p style={{ textAlign: "center", marginTop: 12, fontSize: 11, color: "#bdbdbd" }}>
          Press{" "}
          <kbd style={{ background: "#f0f0f0", padding: "1px 5px", borderRadius: 4, fontSize: 10 }}>
            Enter
          </kbd>{" "}
          to save ·{" "}
          <kbd style={{ background: "#f0f0f0", padding: "1px 5px", borderRadius: 4, fontSize: 10 }}>
            Esc
          </kbd>{" "}
          to cancel
        </p>
      </div>
    </div>
  );
}
