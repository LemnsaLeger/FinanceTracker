// src/components/desktop/TopBar.jsx
// Fixed top navigation bar: breadcrumb, search, notifications, avatar.
// The hamburger button toggles sidebar collapse — state lives in DesktopLayout.

import Icon from "./shared/Icon";
import { ghostBtn } from "./shared/styles";

const PAGE_LABELS = {
  dashboard: "Dashboard",
  analytics:  "Analytics",
  wallet:    "Wallet",
  profile:   "Profile",
};

export default function TopBar({ page, onToggleSidebar }) {
  return (
    <header
      style={{
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 28px",
        borderBottom: "1px solid #f0f0f0",
        background: "#fff",
        flexShrink: 0,
      }}
    >
      {/* ── Left: hamburger + page title ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={onToggleSidebar} style={ghostBtn} title="Toggle sidebar">
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 18, height: 2, background: "#9e9e9e", borderRadius: 2 }} />
            ))}
          </div>
        </button>

        <h1 style={{ fontSize: 18, fontWeight: 700, color: "#212121" }}>
          {PAGE_LABELS[page] ?? page}
        </h1>

        <span
          style={{
            fontSize: 12,
            color: "#9e9e9e",
            background: "#f5f5f5",
            padding: "3px 10px",
            borderRadius: 100,
          }}
        >
          March 2026
        </span>
      </div>

      {/* ── Right: search, bell, avatar ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Search bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#f9fafb",
            border: "1.5px solid #f0f0f0",
            borderRadius: 11,
            padding: "8px 14px",
          }}
        >
          <Icon name="search" size={15} color="#9e9e9e" />
          <input
            placeholder="Search transactions…"
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: 13,
              color: "#212121",
              width: 180,
            }}
          />
          <kbd
            style={{
              fontSize: 10,
              color: "#bdbdbd",
              background: "#efefef",
              padding: "1px 5px",
              borderRadius: 4,
            }}
          >
            ⌘K
          </kbd>
        </div>

        {/* Notification bell */}
        <button
          style={{
            ...ghostBtn,
            position: "relative",
            padding: 10,
            borderRadius: 11,
            background: "#f9fafb",
            border: "1.5px solid #f0f0f0",
          }}
          title="Notifications"
        >
          <Icon name="bell" size={17} color="#757575" />
          <div
            style={{
              position: "absolute",
              top: 7,
              right: 7,
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#FF5722",
              border: "2px solid #fff",
            }}
          />
        </button>

        {/* Avatar */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 11,
            background: "linear-gradient(135deg,#1565C0,#0277BD)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          title="Darby Vallendito"
        >
          <span style={{ fontSize: 13, color: "#fff", fontWeight: 700 }}>DV</span>
        </div>
      </div>
    </header>
  );
}
