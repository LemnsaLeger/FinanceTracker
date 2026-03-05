// src/components/desktop/DesktopLayout.jsx
// ─────────────────────────────────────────────────────────────────────────────
// THE SINGLE RENDER for the entire desktop experience.
//
// Responsibilities:
//   • Owns app-level state: active page, sidebar collapsed, modal open, txList(transaction list)
//   • Wires keyboard shortcuts (Ctrl/Cmd+N, Escape)
//   • Injects global CSS once
//   • Delegates every visual concern to a dedicated child component
//
// Import this in App.js and render it for screens >= 1024px.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";

// Layout chrome
import Sidebar  from "./Sidebar";
import TopBar   from "./TopBar";

// Pages
import DashboardPage   from "./pages/DashboardPage";
import AnalyticsPage   from "./pages/AnalyticsPage";
import PlaceholderPage from "../../../PlaceholderPage";

// Modal
import AddTransactionModal from "./modals/AddTransactionModal";

// Data
import { SEED_TRANSACTIONS, CATEGORY_META } from "../../../data/desktopData";
import { todayLabel } from "./shared/formatters";
import { globalCSS }  from "./shared/styles";

// ─── Page router map ──────────────────────────────────────────────────────────
// Add new pages here — no switch/if chains needed in the render.
const PAGES = {
  dashboard: (txList) => <DashboardPage txList={txList} />,
  analytics: (txList) => <AnalyticsPage txList={txList} />,
  wallet:    ()       => <PlaceholderPage icon="credit-card" title="Wallet" />,
  profile:   ()       => <PlaceholderPage icon="user"        title="Profile" />,
};

// ─── Transaction factory ──────────────────────────────────────────────────────
function buildTransaction({ type, amount, name, category }) {
  const meta = CATEGORY_META[category] ?? CATEGORY_META.cash;
  return {
    id:       Date.now(),
    name,
    category: category.charAt(0).toUpperCase() + category.slice(1),
    date:     todayLabel(),
    amount,          // already signed by AddTransactionModal
    icon:     meta.icon,
    color:    meta.color,
    bg:       meta.bg,
  };
}

// ─── DesktopLayout ────────────────────────────────────────────────────────────
export default function DesktopLayout() {
  const [page,      setPage]      = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [txList,    setTxList]    = useState(SEED_TRANSACTIONS);

  // ── Keyboard shortcuts ────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      // Ctrl/Cmd + N → open modal
      if ((e.metaKey || e.ctrlKey) && e.key === "n") {
        e.preventDefault();
        setShowModal(true);
      }
      // Escape → close modal
      if (e.key === "Escape") {
        setShowModal(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ── Transaction handler ───────────────────────────────────────────────────
  const handleSave = (raw) => {
    setTxList((prev) => [buildTransaction(raw), ...prev]);
  };

  // ── Resolve the current page component ───────────────────────────────────
  const renderPage = PAGES[page] ?? PAGES.dashboard;

  return (
    <>
      {/* Global CSS — injected once, scoped to this tree */}
      <style>{globalCSS}</style>

      <div
        style={{
          display:    "flex",
          height:     "100vh",
          overflow:   "hidden",
          background: "#f9fafb",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* ── Left sidebar ── */}
        <Sidebar
          active={page}
          onChange={setPage}
          onAdd={() => setShowModal(true)}
          collapsed={collapsed}
        />

        {/* ── Main content column ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <TopBar
            page={page}
            onToggleSidebar={() => setCollapsed((c) => !c)}
          />

          {/* Page area — scrollable */}
          {renderPage(txList)}
        </div>
      </div>

      {/* ── Add transaction modal (portal-like, above everything) ── */}
      {showModal && (
        <AddTransactionModal
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
}
