// src/App.jsx
import { useState, useEffect } from "react";
import "./App.css";
import "./index.css";

import { useAuth, saveLastRoute, getLastRoute } from "./lib/AuthContext";
import AuthScreen from "./components/auth/AuthScreen";
import PasskeyPrompt, {
  shouldOfferPasskey,
} from "./components/auth/PasskeyPrompt";
import { usePasskey } from "./hooks/usePasskey";
import { useTransactions } from "./hooks/useTransactions";
import { useNotifications } from "./hooks/useNotifications";

import LandingPage from "./components/LandingPage";
import DesktopLayout from "./components/desktop/DesktopLayout";

import HomeScreen from "./components/HomeScreen";
import BottomNav from "./components/BottomNav";
import AddTransactionSheet from "./components/AddTransactionSheet";
import InOutScreen from "./components/InOutScreen";
import NotificationsScreen from "./components/NotificationsScreen";
import Icon from "./components/Icon";

const DESKTOP_BREAKPOINT = 1024;

// ── Loading spinner ───────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "DM Sans, sans-serif",
      }}
    >
      <svg
        width={32}
        height={32}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#4CAF50"
        strokeWidth="2.5"
        strokeLinecap="round"
        style={{ animation: "spin 0.8s linear infinite" }}
      >
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
      </svg>
      <style>{"@keyframes spin { to { transform: rotate(360deg); } }"}</style>
    </div>
  );
}

// ── Mobile App ────────────────────────────────────────────────────────────────
function MobileApp({ initialTab = "home" }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showAdd, setShowAdd] = useState(false);

  const { txList, loading, addTransaction } = useTransactions();
  const { notifications, unreadCount, markAllRead, seenIds } =
    useNotifications(txList);

  // Persist last visited tab
  useEffect(() => {
    saveLastRoute(activeTab);
  }, [activeTab]);

  // Mark notifications read when opening notifications tab
  useEffect(() => {
    if (activeTab === "notifications") markAllRead();
  }, [activeTab]); // eslint-disable-line

  const handleSave = async (raw) => {
    await addTransaction(raw);
  };

  const renderTab = () => {
    switch (activeTab) {
      case "analytics":
        return <InOutScreen txList={txList} loading={loading} />;
      case "notifications":
        return (
          <NotificationsScreen
            notifications={notifications}
            unreadCount={unreadCount}
            markAllRead={markAllRead}
            seenIds={seenIds}
          />
        );
      default:
        return <HomeScreen txList={txList} loading={loading} />;
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
        unreadCount={unreadCount}
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

// ── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  const { isLoggedIn, loading } = useAuth();
  const { isSupported } = usePasskey();

  const [screen, setScreen] = useState("landing");
  const [lastRoute, setLastRoute] = useState("dashboard");

  const isDesktop = window.innerWidth >= DESKTOP_BREAKPOINT;

  // Skip to app if already logged in (page refresh)
  useEffect(() => {
    if (loading) return;
    if (isLoggedIn) {
      setLastRoute(getLastRoute());
      setScreen("app");
    }
  }, [isLoggedIn, loading]);

  if (loading) return <Spinner />;

  if (screen === "landing") {
    return <LandingPage onEnter={() => setScreen("auth")} />;
  }

  if (screen === "auth") {
    return (
      <AuthScreen
        onSuccess={async (route) => {
          setLastRoute(route);
          const supported = await isSupported();
          if (supported && shouldOfferPasskey()) {
            setScreen("passkey-prompt");
          } else {
            setScreen("app");
          }
        }}
      />
    );
  }

  if (screen === "passkey-prompt") {
    return (
      <>
        <div style={{ filter: "blur(3px)", pointerEvents: "none" }}>
          {isDesktop ?
            <DesktopLayout initialPage={lastRoute} />
          : <MobileApp initialTab={lastRoute} />}
        </div>
        <PasskeyPrompt onDone={() => setScreen("app")} />
      </>
    );
  }

  return isDesktop ?
      <DesktopLayout initialPage={lastRoute} />
    : <MobileApp initialTab={lastRoute} />;
}
