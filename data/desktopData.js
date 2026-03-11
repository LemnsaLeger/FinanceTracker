// src/data/desktopData.js
// Static lookup maps only — seed transactions removed.
// Real transaction data comes from Supabase via useTransactions hook.

// ─── Category → icon / color / bg (used when saving new transactions) ────────
export const CATEGORY_META = {
  food: { icon: "utensils", color: "#E53935", bg: "#FFEBEE" },
  "food & dining": { icon: "utensils", color: "#E53935", bg: "#FFEBEE" },
  transport: { icon: "car", color: "#9C27B0", bg: "#F3E5F5" },
  bills: { icon: "zap", color: "#FF9800", bg: "#FFF3E0" },
  subscription: { icon: "repeat", color: "#2196F3", bg: "#E3F2FD" },
  income: { icon: "briefcase", color: "#4CAF50", bg: "#E8F5E9" },
  cash: { icon: "landmark", color: "#757575", bg: "#F5F5F5" },
  tax: { icon: "receipt", color: "#FF5722", bg: "#FBE9E7" },
};

// ─── Sidebar navigation items ─────────────────────────────────────────────────
export const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "home" },
  { id: "analytics", label: "Analytics", icon: "bar-chart" },
  { id: "notifications", label: "Notifications", icon: "bell" },
  { id: "wallet", label: "Wallet", icon: "credit-card" },
  { id: "profile", label: "Profile", icon: "user" },
];
