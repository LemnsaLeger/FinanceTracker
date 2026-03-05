import { useState } from "react";
import "./index.css";

import LandingPage from "./components/LandingPage";
import DesktopLayout from "./components/desktop/DesktopLayout";

// Your existing mobile screens
import HomeScreen from "./components/HomeScreen";
import BottomNav from "./components/BottomNav";
import AddTransactionSheet from "./components/AddTransactionSheet";
import InOutScreen from "./components/InOutScreen";
import NotificationsScreen from "./components/NotificationsScreen";
import { transactions as seedTx } from "../data/mockData";

const DESKTOP_BREAKPOINT = 1024;

// ── Mobile app (your existing code, unchanged) ────────────────────────────
function MobileApp() {
  const [activeTab, setActiveTab] = useState("home");
  const [showAdd, setShowAdd] = useState(false);
  const [txList, setTxList] = useState(seedTx);

  const handleSave = (tx) => {
    const icons = {
      food: "utensils",
      transport: "car",
      bills: "zap",
      subscription: "repeat",
      income: "briefcase",
      cash: "landmark",
    };
    const colors = {
      food: { color: "#E53935", colorBg: "#FFEBEE" },
      subscription: { color: "#2196F3", colorBg: "#E3F2FD" },
      bills: { color: "#FF9800", colorBg: "#FFF3E0" },
      transport: { color: "#9C27B0", colorBg: "#F3E5F5" },
      income: { color: "#4CAF50", colorBg: "#E8F5E9" },
      cash: { color: "#757575", colorBg: "#F5F5F5" },
    };
    const c = colors[tx.category] || colors.cash;
    setTxList((prev) => [
      {
        id: Date.now(),
        name: tx.description,
        category: tx.category,
        date: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        amount: tx.amount,
        icon: icons[tx.category] || "receipt",
        ...c,
      },
      ...prev,
    ]);
  };

  const renderTab = () => {
    switch (activeTab) {
      case "analytics":
        return <InOutScreen txList={txList} />;
      case "wallet":
        return <NotificationsScreen />;
      default:
        return <HomeScreen txList={txList} />;
    }
  };

  return (
    <div
      style={{
        maxWidth: 480,
        margin: "0 auto",
        position: "relative",
        minHeight: "100vh",
      }}
    >
      {renderTab()}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAdd={() => setShowAdd(true)}
      />
      {showAdd && (
        <AddTransactionSheet
          onClose={() => setShowAdd(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("landing");
  const isDesktop = window.innerWidth >= DESKTOP_BREAKPOINT;

  if (screen === "landing") {
    return <LandingPage onEnter={() => setScreen("app")} />;
  }

  return isDesktop ? <DesktopLayout /> : <MobileApp />;
}
