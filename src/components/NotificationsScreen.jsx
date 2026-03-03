// src/components/NotificationsScreen.jsx
import Icon from "./Icon";
import { notifications } from "../../data/mockData";

export default function NotificationsScreen() {
  const today = notifications.filter((n) => n.today);
  const yesterday = notifications.filter((n) => !n.today);

  const Group = ({ title, items }) => (
    <div className="mb-4">
      <p
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "var(--text-muted)",
          marginBottom: 8,
          paddingLeft: 4,
        }}
      >
        {title}
      </p>
      <div className="card" style={{ padding: "4px 16px" }}>
        {items.map((n, i) => (
          <div
            key={n.id}
            className="tx-item anim-fade-up"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div
              className="tx-icon"
              style={{
                background: n.colorBg,
                width: 40,
                height: 40,
                borderRadius: 12,
              }}
            >
              <Icon name={n.icon} size={17} color={n.color} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--text-main)",
                  lineHeight: 1.4,
                }}
              >
                {n.text}
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  marginTop: 2,
                }}
              >
                {n.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
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
          background: "var(--surface)",
          padding: "16px 20px 14px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <h2
          style={{ fontSize: 18, fontWeight: 700, color: "var(--text-main)" }}
        >
          Notifications
        </h2>
      </div>

      <div style={{ padding: "16px", maxWidth: 480, margin: "0 auto" }}>
        <Icon title="Today" items={today} />
        <Icon title="Yesterday" items={yesterday} />
      </div>
    </div>
  );
}
