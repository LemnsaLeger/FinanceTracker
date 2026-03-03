// src/App.js
import { useState } from "react";
import "./index.css";
import LandingPage from "./components/LandingPage";
import { transactions as seedTx } from "../data/mockData";

export default function App() {
  const [screen, setScreen] = useState("landing"); // landing | app
  const [activeTab, setActiveTab] = useState("home");
  const [txList, setTxList] = useState(seedTx);

  const handleSave = (tx) => {
    const icons = {
      food: "utensils",
      subscription: "repeat",
      bills: "zap",
      transport: "car",
      income: "trending-up",
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

  if (screen === "landing") {
    return <LandingPage onEnter={() => setScreen("app")} />;
  }

  const renderTab = () => {
    switch (activeTab) {
      case "analytics":
        return "Analytics coming soon!";
      case "wallet":
        return "Wallet details coming soon!";
      case "profile":
        return (
          <div
            className="font-inter flex flex-col items-center justify-center"
            style={{
              minHeight: "100vh",
              background: "var(--bg-app)",
              paddingBottom: "var(--nav-height)",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 20,
                background: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <span style={{ fontSize: 28 }}>👤</span>
            </div>
            <p
              style={{
                fontWeight: 700,
                fontSize: 18,
                color: "var(--text-main)",
                marginBottom: 4,
              }}
            >
              lego
            </p>
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
              lego@example.com
            </p>
          </div>
        );



      default:
        return <HomeScreen txList={txList} />;
    }
  };
}
