// src/components/desktop/Sidebar.jsx
// Left sidebar navigation. Supports collapsed (icon-only, 72px) mode.
// Receives active page and callbacks — no internal routing state.

import Icon from "./shared/Icon";
import { NAV_ITEMS } from "../../../data/desktopData";

export default function Sidebar({ active, onChange, onAdd, collapsed }) {
  return (
    <aside
      style={{
        width: collapsed ? 72 : 220,
        minHeight: "100vh",
        background: "#fff",
        borderRight: "1px solid #f0f0f0",
        display: "flex",
        flexDirection: "column",
        padding: collapsed ? "24px 12px" : "24px 16px",
        gap: 4,
        transition: "width 0.3s cubic-bezier(.22,1,.36,1)",
        flexShrink: 0,
      }}
    >
      {/* ── Logo ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 4px",
          marginBottom: 28,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 11,
            background: "#4CAF50",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon name="wallet" size={17} color="#fff" />
        </div>
        {!collapsed && (
          <span style={{ fontWeight: 800, fontSize: 15, color: "#212121", whiteSpace: "nowrap" }}>
            FinanceTrack
          </span>
        )}
      </div>

      {/* ── Add Transaction CTA ── */}
      <button
        onClick={onAdd}
        title="Add Transaction (Ctrl+N)"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: collapsed ? "11px" : "11px 14px",
          borderRadius: 12,
          border: "none",
          cursor: "pointer",
          background: "linear-gradient(135deg,#4CAF50,#388E3C)",
          color: "#fff",
          fontWeight: 700,
          fontSize: 13,
          marginBottom: 16,
          justifyContent: collapsed ? "center" : "flex-start",
          boxShadow: "0 4px 14px rgba(76,175,80,0.3)",
          transition: "all 0.2s",
        }}
      >
        <Icon name="plus" size={17} color="#fff" />
        {!collapsed && "Add Transaction"}
      </button>

      {/* ── Nav items ── */}
      {NAV_ITEMS.map((item) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            title={item.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: collapsed ? "11px" : "11px 14px",
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              background: isActive ? "#E3F2FD" : "transparent",
              color: isActive ? "#2196F3" : "#757575",
              fontWeight: isActive ? 700 : 500,
              fontSize: 14,
              justifyContent: collapsed ? "center" : "flex-start",
              transition: "all 0.15s",
              position: "relative",
            }}
          >
            {/* Active indicator bar */}
            {isActive && (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: "20%",
                  height: "60%",
                  width: 3,
                  background: "#2196F3",
                  borderRadius: "0 3px 3px 0",
                }}
              />
            )}
            <Icon name={item.icon} size={18} color={isActive ? "#2196F3" : "#9e9e9e"} />
            {!collapsed && item.label}
          </button>
        );
      })}

      {/* ── Spacer ── */}
      <div style={{ flex: 1 }} />

      {/* ── Settings (bottom) ── */}
      <button
        title="Settings"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: collapsed ? "11px" : "11px 14px",
          width: "100%",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: "#9e9e9e",
          fontSize: 14,
          fontWeight: 500,
          borderRadius: 12,
          justifyContent: collapsed ? "center" : "flex-start",
        }}
      >
        <Icon name="settings" size={18} color="#bdbdbd" />
        {!collapsed && "Settings"}
      </button>
    </aside>
  );
}
