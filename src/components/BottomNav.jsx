// src/components/BottomNav.jsx
// Pass unreadCount prop to show notification indicator on the bell tab.

import Icon from "./Icon";

const NAV_ITEMS = [
  { id: "home", icon: "home", label: "Home" },
  { id: "analytics", icon: "bar-chart", label: "In & Out" },
  { id: "notifications", icon: "bell", label: "Alerts" },
];

export default function BottomNav({
  activeTab,
  onTabChange,
  onAdd,
  unreadCount = 0,
}) {
  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "var(--nav-height, 68px)",
        background: "var(--surface)",
        borderTop: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        padding: "0 8px",
        maxWidth: 480,
        margin: "0 auto",
        zIndex: 40,
      }}
    >
      {/* Left two tabs */}
      {NAV_ITEMS.slice(0, 2).map((item) => (
        <NavTab
          key={item.id}
          item={item}
          active={activeTab === item.id}
          onTabChange={onTabChange}
        />
      ))}

      {/* FAB — add transaction */}
      <button
        onClick={onAdd}
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, var(--primary), var(--primary-dark, #388E3C))",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 16px rgba(76,175,80,0.4)",
          flexShrink: 0,
          transition: "transform 0.15s",
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.93)")}
        onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        onTouchStart={(e) => (e.currentTarget.style.transform = "scale(0.93)")}
        onTouchEnd={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <Icon name="plus" size={22} color="#fff" />
      </button>

      {/* Notifications tab with dot */}
      <NavTab
        item={NAV_ITEMS[2]}
        active={activeTab === "notifications"}
        onTabChange={onTabChange}
        badge={unreadCount}
      />

      {/* Profile */}
      <NavTab
        item={{ id: "profile", icon: "user", label: "Profile" }}
        active={activeTab === "profile"}
        onTabChange={onTabChange}
      />
    </nav>
  );
}

function NavTab({ item, active, onTabChange, badge = 0 }) {
  return (
    <button
      onClick={() => onTabChange(item.id)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "6px 10px",
        borderRadius: 12,
        position: "relative",
        flex: 1,
      }}
    >
      <div style={{ position: "relative" }}>
        <Icon
          name={item.icon}
          size={21}
          color={
            active ? "var(--secondary, #2196F3)" : "var(--text-muted, #757575)"
          }
        />
        {/* Unread badge dot */}
        {badge > 0 && (
          <div
            style={{
              position: "absolute",
              top: -3,
              right: -4,
              minWidth: 15,
              height: 15,
              borderRadius: 100,
              background: "#FF5722",
              border: "2px solid var(--surface, #fff)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: 8,
                color: "#fff",
                fontWeight: 800,
                lineHeight: 1,
              }}
            >
              {badge > 9 ? "9+" : badge}
            </span>
          </div>
        )}
      </div>
      <span
        style={{
          fontSize: 10,
          fontWeight: active ? 700 : 500,
          color:
            active ? "var(--secondary, #2196F3)" : "var(--text-muted, #757575)",
        }}
      >
        {item.label}
      </span>
    </button>
  );
}
