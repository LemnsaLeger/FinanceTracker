// src/components/desktop/DesktopLayout.jsx
import { useState, useEffect } from "react";

import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import DashboardPage from "./pages/DashboardPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import NotificationsPage from "./pages/NotificationsPage";
import PlaceholderPage from "../../../PlaceholderPage";
import AddTransactionModal from "./modals/AddTransactionModal";

import { useTransactions } from "../../hooks/useTransactions";
import { useNotifications } from "../../hooks/useNotifications";
import { globalCSS } from "./shared/styles";

const PAGES = {
  dashboard: (props) => <DashboardPage {...props} />,
  analytics: (props) => <AnalyticsPage {...props} />,
  notifications: (props) => <NotificationsPage {...props} />,
  wallet: () => <PlaceholderPage icon="credit-card" title="Wallet" />,
  profile: () => <PlaceholderPage icon="user" title="Profile" />,
};

export default function DesktopLayout({ initialPage = "dashboard" }) {
  const [page, setPage] = useState(initialPage);
  const [collapsed, setCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { txList, loading, addTransaction, deleteTransaction } =
    useTransactions();
  const { notifications, unreadCount, markAllRead, seenIds } =
    useNotifications(txList);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "n") {
        e.preventDefault();
        setShowModal(true);
      }
      if (e.key === "Escape") setShowModal(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleSave = async (raw) => {
    await addTransaction(raw);
  };

  const pageProps = {
    txList,
    loading,
    deleteTransaction,
    notifications,
    unreadCount,
    markAllRead,
    seenIds,
  };
  const renderPage = PAGES[page] ?? PAGES.dashboard;

  return (
    <>
      <style>{globalCSS}</style>
      <div
        style={{
          display: "flex",
          height: "100vh",
          overflow: "hidden",
          background: "#f9fafb",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <Sidebar
          active={page}
          onChange={setPage}
          onAdd={() => setShowModal(true)}
          collapsed={collapsed}
        />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <TopBar
            page={page}
            onToggleSidebar={() => setCollapsed((c) => !c)}
            unreadCount={unreadCount}
            onBellClick={() => setPage("notifications")}
          />
          {renderPage(pageProps)}
        </div>
      </div>

      {showModal && (
        <AddTransactionModal
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
}
