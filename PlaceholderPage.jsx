// src/components/desktop/pages/PlaceholderPage.jsx
// Reusable "coming soon" placeholder for pages not yet built.
// Pass `icon` and `title` as props.

import Icon from "./src/components/desktop/shared/Icon";

export default function PlaceholderPage({ icon = "pie-chart", title = "Coming Soon" }) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        color: "#9e9e9e",
      }}
    >
      <Icon name={icon} size={48} color="#e0e0e0" />
      <p style={{ fontSize: 16, fontWeight: 600 }}>{title} — Coming Soon</p>
      <p style={{ fontSize: 13 }}>This section is under construction.</p>
    </div>
  );
}
