// src/components/desktop/pages/NotificationsPage.jsx
// Desktop wrapper for the notifications screen.
// Receives notifications, unreadCount, markAllRead, seenIds from DesktopLayout.

import { useEffect } from "react";
import Icon from "../shared/Icon";
import { card } from "../shared/styles";

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

const GROUP_ORDER = ["Today", "Yesterday", "This week", "Earlier"];

export default function NotificationsPage({
  notifications = [],
  unreadCount = 0,
  markAllRead,
  seenIds = new Set(),
}) {
  // Mark all as read when page is opened
  useEffect(() => {
    if (unreadCount > 0) markAllRead?.();
  }, []); // eslint-disable-line

  // Group by date label
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

  return (
    <div
      style={{
        padding: 28,
        display: "flex",
        flexDirection: "column",
        gap: 20,
        overflowY: "auto",
        flex: 1,
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#212121" }}>
            Notifications
          </h2>
          <p style={{ fontSize: 13, color: "#9e9e9e", marginTop: 2 }}>
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
          </p>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={markAllRead}
            style={{
              background: "none",
              border: "1.5px solid #e0e0e0",
              borderRadius: 10,
              padding: "7px 14px",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              color: "#2196F3",
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
            ...card,
            padding: 64,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            color: "#9e9e9e",
          }}
        >
          <Icon name="bell" size={44} color="#e0e0e0" />
          <p style={{ fontSize: 16, fontWeight: 600 }}>No notifications yet</p>
          <p style={{ fontSize: 13, color: "#bdbdbd" }}>
            Add transactions to see activity alerts and monthly summaries here.
          </p>
        </div>
      )}

      {/* Groups */}
      {GROUP_ORDER.filter((g) => groups[g]).map((groupLabel) => (
        <div key={groupLabel}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#9e9e9e",
              letterSpacing: "0.8px",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            {groupLabel}
          </p>
          <div style={{ ...card, overflow: "hidden" }}>
            {groups[groupLabel].map((notif, i) => {
              const isUnread = !seenIds.has(notif.id);
              const isLast = i === groups[groupLabel].length - 1;
              return (
                <div
                  key={notif.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 14,
                    padding: "16px 24px",
                    borderBottom: isLast ? "none" : "1px solid #f5f5f5",
                    background: isUnread ? `${notif.bg}44` : "#fff",
                    position: "relative",
                    transition: "background 0.2s",
                  }}
                >
                  {/* Unread dot */}
                  {isUnread && (
                    <div
                      style={{
                        position: "absolute",
                        top: 20,
                        right: 20,
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: notif.color,
                      }}
                    />
                  )}

                  {/* Icon */}
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 13,
                      background: notif.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon name={notif.icon} size={20} color={notif.color} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 3,
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
                      <span style={{ fontSize: 11, color: "#bdbdbd" }}>
                        {timeAgo(notif.time)}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: isUnread ? 700 : 600,
                        color: "#212121",
                        marginBottom: 4,
                      }}
                    >
                      {notif.title}
                    </p>
                    <p
                      style={{
                        fontSize: 13,
                        color: "#757575",
                        lineHeight: 1.5,
                      }}
                    >
                      {notif.message}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
