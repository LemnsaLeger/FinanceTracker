// src/components/NotificationsScreen.jsx
// Real notification screen driven by useNotifications hook.
// Marks all as read when opened. Shows unread badge on each item.

import { useEffect } from "react";
import Icon from "./Icon";

const timeAgo = (dateStr) => {
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
};

const TYPE_LABELS = {
  in: "Received",
  out: "Spent",
  warning: "Alert",
  summary: "Summary",
};

export default function NotificationsScreen({
  notifications = [],
  unreadCount = 0,
  markAllRead,
  seenIds = new Set(),
}) {
  // Mark all as read when this screen is opened
  useEffect(() => {
    if (unreadCount > 0) markAllRead?.();
  }, []); // eslint-disable-line

  // Group notifications by date label
  const groups = notifications.reduce((acc, notif) => {
    const d = new Date(notif.time);
    const now = new Date();
    let label;
    if (isNaN(d)) {
      label = "Earlier";
    } else {
      const diffDays = Math.floor((now - d) / 86400000);
      if (diffDays === 0) label = "Today";
      else if (diffDays === 1) label = "Yesterday";
      else if (diffDays < 7) label = "This week";
      else label = "Earlier";
    }
    if (!acc[label]) acc[label] = [];
    acc[label].push(notif);
    return acc;
  }, {});

  const GROUP_ORDER = ["Today", "Yesterday", "This week", "Earlier"];

  return (
    <div
      style={{
        background: "var(--bg-app)",
        minHeight: "100vh",
        paddingBottom: "calc(var(--nav-height) + 20px)",
        fontFamily: "inherit",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "var(--surface)",
          padding: "16px 20px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--border-subtle)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h2
            style={{ fontSize: 18, fontWeight: 700, color: "var(--text-main)" }}
          >
            Notifications
          </h2>
          {unreadCount > 0 && (
            <span
              style={{
                background: "#FF5722",
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                borderRadius: 100,
                padding: "2px 8px",
                minWidth: 20,
                textAlign: "center",
              }}
            >
              {unreadCount}
            </span>
          )}
        </div>
        {notifications.length > 0 && (
          <button
            onClick={markAllRead}
            style={{
              background: "none",
              border: "none",
              fontSize: 13,
              color: "var(--secondary)",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Empty state */}
      {notifications.length === 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 100,
            gap: 12,
            color: "var(--text-muted)",
          }}
        >
          <Icon name="bell" size={48} color="var(--border-subtle)" />
          <p style={{ fontSize: 16, fontWeight: 600 }}>No notifications yet</p>
          <p
            style={{
              fontSize: 13,
              color: "var(--text-light)",
              textAlign: "center",
              maxWidth: 240,
            }}
          >
            Add transactions to start seeing activity alerts and summaries here.
          </p>
        </div>
      )}

      {/* Grouped notification list */}
      <div style={{ padding: "16px 16px 0", maxWidth: 480, margin: "0 auto" }}>
        {GROUP_ORDER.filter((g) => groups[g]).map((groupLabel) => (
          <div key={groupLabel} style={{ marginBottom: 20 }}>
            {/* Group header */}
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--text-light)",
                letterSpacing: "0.8px",
                textTransform: "uppercase",
                marginBottom: 8,
                paddingLeft: 4,
              }}
            >
              {groupLabel}
            </p>

            <div
              style={{
                background: "var(--surface)",
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
              }}
            >
              {groups[groupLabel].map((notif, i) => {
                const isUnread = !seenIds.has(notif.id);
                const isLast = i === groups[groupLabel].length - 1;
                return (
                  <div
                    key={notif.id}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                      padding: "14px 16px",
                      borderBottom:
                        isLast ? "none" : "1px solid var(--border-subtle)",
                      background: isUnread ? `${notif.bg}55` : "transparent",
                      position: "relative",
                      transition: "background 0.2s",
                    }}
                  >
                    {/* Unread dot */}
                    {isUnread && (
                      <div
                        style={{
                          position: "absolute",
                          top: 18,
                          right: 14,
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background: notif.color,
                        }}
                      />
                    )}

                    {/* Icon */}
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        background: notif.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon name={notif.icon} size={18} color={notif.color} />
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          marginBottom: 2,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: notif.color,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {TYPE_LABELS[notif.type] ?? notif.type}
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: isUnread ? 700 : 600,
                          color: "var(--text-main)",
                          marginBottom: 3,
                        }}
                      >
                        {notif.title}
                      </p>
                      <p
                        style={{
                          fontSize: 12,
                          color: "var(--text-muted)",
                          lineHeight: 1.5,
                        }}
                      >
                        {notif.message}
                      </p>
                      <p
                        style={{
                          fontSize: 11,
                          color: "var(--text-light)",
                          marginTop: 5,
                        }}
                      >
                        {timeAgo(notif.time)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
