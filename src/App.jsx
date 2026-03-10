// src/App.js


import { useState, useEffect } from "react";
import "./index.css";

// Auth
import { useAuth, saveLastRoute, getLastRoute } from "./lib/AuthContext";
import AuthScreen   from "./components/auth/AuthScreen";
import PasskeyPrompt, { shouldOfferPasskey } from "./components/auth/PasskeyPrompt";
import { usePasskey } from "./hooks/usePasskey";

// Layouts
import LandingPage   from "./components/LandingPage";
import DesktopLayout from "./components/desktop/DesktopLayout";

// Mobile screens
import HomeScreen          from "./components/HomeScreen";
import BottomNav           from "./components/BottomNav";
import AddTransactionSheet from "./components/AddTransactionSheet";
import InOutScreen         from "./components/InOutScreen";
import NotificationsScreen from "./components/NotificationsScreen";
import { transactions as seedTx } from "../data/mockData";
import { supabase } from "./lib/supabaseClient";

const DESKTOP_BREAKPOINT = 1024;

// ── Mobile app ────────────────────────────────────────────────────────────────
function MobileApp({ initialTab = "home" }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showAdd,   setShowAdd]   = useState(false);
  const [txList,    setTxList]    = useState([]);

  // Persist last visited tab so we can restore it after re-login
  useEffect(() => { saveLastRoute(activeTab); }, [activeTab]);

  // Load transactions from Supabase
  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setTxList(data);
      else setTxList(seedTx); // fall back to seed data if table not set up yet
    };
    load();
  }, []);

  const handleSave = async (tx) => {
    const icons  = { food:"utensils", transport:"car", bills:"zap",
                     subscription:"repeat", income:"briefcase", cash:"landmark" };
    const colors = {
      food:         { color:"#E53935", colorBg:"#FFEBEE" },
      subscription: { color:"#2196F3", colorBg:"#E3F2FD" },
      bills:        { color:"#FF9800", colorBg:"#FFF3E0" },
      transport:    { color:"#9C27B0", colorBg:"#F3E5F5" },
      income:       { color:"#4CAF50", colorBg:"#E8F5E9" },
      cash:         { color:"#757575", colorBg:"#F5F5F5" },
    };
    const c = colors[tx.category] || colors.cash;
    const newTx = {
      name:     tx.description,
      category: tx.category,
      date:     new Date().toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" }),
      amount:   tx.amount,
      icon:     icons[tx.category] || "receipt",
      ...c,
    };

    // Try saving to Supabase; fall back to local state
    const { data, error } = await supabase
      .from("transactions").insert([newTx]).select().single();

    setTxList((prev) => [error ? { id: Date.now(), ...newTx } : data, ...prev]);
  };

  const renderTab = () => {
    switch (activeTab) {
      case "analytics": return <InOutScreen txList={txList} />;
      case "wallet":    return <NotificationsScreen />;
      default:          return <HomeScreen txList={txList} />;
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", position: "relative", minHeight: "100vh" }}>
      {renderTab()}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} onAdd={() => setShowAdd(true)} />
      {showAdd && <AddTransactionSheet onClose={() => setShowAdd(false)} onSave={handleSave} />}
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  const { isLoggedIn, loading } = useAuth();
  const { isSupported }         = usePasskey();

  // "landing" | "auth" | "passkey-prompt" | "app"
  const [screen,    setScreen]    = useState("landing");
  const [lastRoute, setLastRoute] = useState("dashboard");
  const [offerPasskey, setOfferPasskey] = useState(false);

  const isDesktop = window.innerWidth >= DESKTOP_BREAKPOINT;

  // If user is already logged in (page refresh / returning visit),
  // skip landing + auth and go straight to the app.
  useEffect(() => {
    if (loading) return;
    if (isLoggedIn) {
      setLastRoute(getLastRoute());
      setScreen("app");
    }
  }, [isLoggedIn, loading]);

  // Show loading spinner while Supabase resolves the session
  if (loading) {
    return (
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center",
        justifyContent:"center", fontFamily:"DM Sans, sans-serif", color:"#9e9e9e" }}>
        <svg width={32} height={32} viewBox="0 0 24 24" fill="none"
          stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round"
          style={{ animation:"spin 0.8s linear infinite" }}>
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/>
        </svg>
        <style>{"@keyframes spin { to { transform: rotate(360deg); } }"}</style>
      </div>
    );
  }

  // ── Landing ───────────────────────────────────────────────────────────────
  if (screen === "landing") {
    return <LandingPage onEnter={() => setScreen("auth")} />;
  }

  // ── Auth ──────────────────────────────────────────────────────────────────
  if (screen === "auth") {
    return (
      <AuthScreen
        onSuccess={async (route) => {
          setLastRoute(route);
          // Check if we should offer passkey registration
          const supported = await isSupported();
          if (supported && shouldOfferPasskey()) {
            setOfferPasskey(true);
            setScreen("passkey-prompt");
          } else {
            setScreen("app");
          }
        }}
      />
    );
  }

  // ── Passkey prompt (one-time, after first login) ──────────────────────────
  if (screen === "passkey-prompt") {
    return (
      <>
        {/* Render the app blurred in the background */}
        <div style={{ filter:"blur(3px)", pointerEvents:"none" }}>
          {isDesktop ? <DesktopLayout initialPage={lastRoute} /> : <MobileApp initialTab={lastRoute} />}
        </div>
        <PasskeyPrompt onDone={() => setScreen("app")} />
      </>
    );
  }

  // ── App ───────────────────────────────────────────────────────────────────
  return isDesktop
    ? <DesktopLayout initialPage={lastRoute} />
    : <MobileApp initialTab={lastRoute} />;
}
