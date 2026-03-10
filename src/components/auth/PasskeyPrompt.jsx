// src/components/auth/PasskeyPrompt.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Shown once after a user's FIRST successful email+password login.
// Asks if they want to enable biometric (fingerprint / Face ID) login.
//
// Usage: render this in App.js right after login, before navigating to the app.
// Pass onDone() to proceed regardless of their choice.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { usePasskey } from "../../hooks/usePasskey";

const PASSKEY_OFFERED_KEY = "ft_passkey_offered";

export function shouldOfferPasskey() {
  try { return localStorage.getItem(PASSKEY_OFFERED_KEY) !== "true"; }
  catch { return false; }
}

export function markPasskeyOffered() {
  try { localStorage.setItem(PASSKEY_OFFERED_KEY, "true"); } catch (_) {}
}

export default function PasskeyPrompt({ onDone }) {
  const [loading, setLoading] = useState(false);
  const [status,  setStatus]  = useState(null); // null | "success" | "error"
  const { registerPasskey } = usePasskey();

  const handleEnable = async () => {
    setLoading(true);
    const result = await registerPasskey();
    markPasskeyOffered();
    if (result.success) {
      setStatus("success");
      setTimeout(onDone, 1500);
    } else if (result.cancelled) {
      onDone();
    } else {
      setStatus("error");
      setTimeout(onDone, 2000);
    }
    setLoading(false);
  };

  const handleSkip = () => {
    markPasskeyOffered();
    onDone();
  };

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.45)",
      backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 200, padding: 20,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{
        background: "#fff", borderRadius: 24, padding: "36px 32px",
        width: "100%", maxWidth: 380, textAlign: "center",
        boxShadow: "0 16px 56px rgba(0,0,0,0.18)",
        animation: "authSlideUp 0.4s cubic-bezier(.22,1,.36,1) both",
      }}>
        {/* Icon */}
        <div style={{
          width: 64, height: 64, borderRadius: 20,
          background: "linear-gradient(135deg,#E8F5E9,#C8E6C9)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px",
        }}>
          <svg width={30} height={30} viewBox="0 0 24 24" fill="none"
            stroke="#2E7D32" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"/>
            <path d="M14 13.12c0 2.38 0 6.38-1 8.88"/>
            <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02"/>
            <path d="M2 12a10 10 0 0 1 18-6"/>
            <path d="M2 17a10 10 0 0 0 .5 1"/>
            <path d="M12 2a10 10 0 0 1 8 4"/>
            <path d="M7 19.4A10 10 0 0 1 2 12"/>
            <path d="M12 6a6 6 0 0 1 6 6c0 .34-.01.68-.04 1"/>
            <path d="M8.66 20.67A6 6 0 0 1 6 12"/>
          </svg>
        </div>

        {status === "success" ? (
          <>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#212121", marginBottom: 8 }}>
              ✅ Biometrics enabled!
            </h2>
            <p style={{ fontSize: 14, color: "#9e9e9e" }}>
              Next time you can log in with just your fingerprint or face.
            </p>
          </>
        ) : status === "error" ? (
          <>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#212121", marginBottom: 8 }}>
              Couldn't set up biometrics
            </h2>
            <p style={{ fontSize: 14, color: "#9e9e9e" }}>No worries — you can use your password.</p>
          </>
        ) : (
          <>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#212121", marginBottom: 10, letterSpacing: "-0.3px" }}>
              Enable biometric login?
            </h2>
            <p style={{ fontSize: 14, color: "#757575", lineHeight: 1.6, marginBottom: 28 }}>
              Log in next time with just your fingerprint or Face ID — no password needed.
            </p>

            {/* Enable button */}
            <button
              onClick={handleEnable}
              disabled={loading}
              style={{
                width: "100%", padding: "14px", borderRadius: 14,
                border: "none", cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit", fontWeight: 700, fontSize: 15,
                color: "#fff",
                background: "linear-gradient(135deg,#4CAF50,#388E3C)",
                boxShadow: "0 6px 20px rgba(76,175,80,0.3)",
                marginBottom: 10, opacity: loading ? 0.7 : 1,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              {loading ? "Setting up…" : "Yes, enable biometrics"}
            </button>

            {/* Skip */}
            <button
              onClick={handleSkip}
              style={{
                width: "100%", padding: "12px", borderRadius: 14,
                border: "1.5px solid #e0e0e0", cursor: "pointer",
                fontFamily: "inherit", fontWeight: 600, fontSize: 14,
                color: "#9e9e9e", background: "#fff",
              }}
            >
              Skip for now
            </button>

            <p style={{ fontSize: 11, color: "#bdbdbd", marginTop: 14 }}>
              Your fingerprint never leaves your device.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
