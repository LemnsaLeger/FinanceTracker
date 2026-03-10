// src/components/auth/AuthScreen.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Full-screen auth UI. Handles:
//   • Sign up (email + password)
//   • Log in  (email + password)
//   • Biometric login button (if passkey registered on this device)
//   • "Forgot password" email reset
//   • Error messages and loading states
//
// After successful auth, calls onSuccess(lastRoute) so App.js can navigate.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from "react";
import { supabase } from "../../lib/supabaseClient";
import { getLastRoute } from "../../lib/AuthContext";
import { usePasskey } from "../../hooks/usePasskey";

// ── Inline styles (no Tailwind dependency) ────────────────────────────────────
const S = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(160deg, #f0f9ff 0%, #e8f5e9 50%, #fff 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 16px",
    fontFamily: "'DM Sans', 'Inter', sans-serif",
  },
  card: {
    background: "#fff",
    borderRadius: 24,
    padding: "40px 36px",
    width: "100%",
    maxWidth: 420,
    boxShadow: "0 8px 48px rgba(0,0,0,0.10)",
    animation: "authSlideUp 0.45s cubic-bezier(.22,1,.36,1) both",
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 14,
    background: "linear-gradient(135deg,#4CAF50,#388E3C)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
    boxShadow: "0 6px 20px rgba(76,175,80,0.3)",
  },
  title: {
    fontSize: 24,
    fontWeight: 800,
    color: "#212121",
    textAlign: "center",
    marginBottom: 6,
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: 14,
    color: "#9e9e9e",
    textAlign: "center",
    marginBottom: 32,
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: "#616161",
    letterSpacing: "0.4px",
    textTransform: "uppercase",
    display: "block",
    marginBottom: 7,
  },
  input: {
    width: "100%",
    padding: "13px 16px",
    border: "1.5px solid #e0e0e0",
    borderRadius: 12,
    fontSize: 15,
    color: "#212121",
    background: "#fafafa",
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
    marginBottom: 16,
  },
  inputFocus: {
    borderColor: "#4CAF50",
    boxShadow: "0 0 0 3px rgba(76,175,80,0.12)",
    background: "#fff",
  },
  btnPrimary: {
    width: "100%",
    padding: "15px",
    borderRadius: 14,
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
    fontWeight: 700,
    fontSize: 15,
    color: "#fff",
    background: "linear-gradient(135deg,#4CAF50,#388E3C)",
    boxShadow: "0 6px 20px rgba(76,175,80,0.3)",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 12,
  },
  btnBiometric: {
    width: "100%",
    padding: "13px",
    borderRadius: 14,
    border: "1.5px solid #e0e0e0",
    cursor: "pointer",
    fontFamily: "inherit",
    fontWeight: 600,
    fontSize: 14,
    color: "#424242",
    background: "#fff",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 12,
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    margin: "20px 0",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: "#f0f0f0",
  },
  dividerText: {
    fontSize: 12,
    color: "#bdbdbd",
    fontWeight: 500,
  },
  toggleRow: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
    color: "#9e9e9e",
  },
  toggleBtn: {
    background: "none",
    border: "none",
    color: "#4CAF50",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: 14,
  },
  forgotBtn: {
    background: "none",
    border: "none",
    color: "#9e9e9e",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: 13,
    padding: 0,
    marginBottom: 20,
    textDecoration: "underline",
    textDecorationColor: "transparent",
    transition: "color 0.15s",
  },
  error: {
    background: "#FFEBEE",
    border: "1px solid #FFCDD2",
    borderRadius: 10,
    padding: "10px 14px",
    fontSize: 13,
    color: "#C62828",
    marginBottom: 16,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  success: {
    background: "#E8F5E9",
    border: "1px solid #C8E6C9",
    borderRadius: 10,
    padding: "10px 14px",
    fontSize: 13,
    color: "#2E7D32",
    marginBottom: 16,
  },
};

// ── Fingerprint SVG icon ──────────────────────────────────────────────────────
const FingerprintIcon = ({ size = 20, color = "#424242" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
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
);

// ── Spinner ───────────────────────────────────────────────────────────────────
const Spinner = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" style={{ animation: "spin 0.8s linear infinite" }}>
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
  </svg>
);

// ── AuthScreen ────────────────────────────────────────────────────────────────
export default function AuthScreen({ onSuccess }) {
  const [mode,       setMode]       = useState("login");   // login | signup | forgot
  const [email,      setEmail]      = useState("");
  const [password,   setPassword]   = useState("");
  const [showPass,   setShowPass]   = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);
  const [message,    setMessage]    = useState(null);
  const [focusedField, setFocused]  = useState(null);
  const [showBiometric, setShowBiometric] = useState(false);

  const emailRef = useRef();
  const { loginWithPasskey, hasRegisteredPasskey, isSupported } = usePasskey();

  // Auto-focus email on mount
  useEffect(() => { emailRef.current?.focus(); }, []);

  // Check if biometric login is available on this device
  useEffect(() => {
    const check = async () => {
      const supported = await isSupported();
      setShowBiometric(supported && hasRegisteredPasskey());
    };
    check();
  }, [isSupported, hasRegisteredPasskey]);

  const clearMessages = () => { setError(null); setMessage(null); };

  // ── Email + password login ─────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError("Please fill in all fields.");
    setLoading(true);
    clearMessages();

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(
        error.message.includes("Invalid login")
          ? "Incorrect email or password. Please try again."
          : error.message
      );
      setLoading(false);
      return;
    }

    onSuccess(getLastRoute());
  };

  // ── Sign up ────────────────────────────────────────────────────────────────
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError("Please fill in all fields.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    setLoading(true);
    clearMessages();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setMessage("Check your email for a confirmation link, then log in.");
    setMode("login");
    setLoading(false);
  };

  // ── Forgot password ────────────────────────────────────────────────────────
  const handleForgot = async (e) => {
    e.preventDefault();
    if (!email) return setError("Enter your email address first.");
    setLoading(true);
    clearMessages();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) { setError(error.message); setLoading(false); return; }

    setMessage("Password reset link sent — check your inbox.");
    setMode("login");
    setLoading(false);
  };

  // ── Biometric login ────────────────────────────────────────────────────────
  const handleBiometric = async () => {
    setLoading(true);
    clearMessages();
    const result = await loginWithPasskey();
    if (result.success) {
      onSuccess(getLastRoute());
    } else if (!result.cancelled) {
      setError("Biometric login failed. Please use your email and password.");
    }
    setLoading(false);
  };

  const inputStyle = (field) => ({
    ...S.input,
    ...(focusedField === field ? S.inputFocus : {}),
  });

  const isLogin  = mode === "login";
  const isForgot = mode === "forgot";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes authSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .auth-input-wrap { position: relative; }
        .pass-toggle {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: #9e9e9e;
          display: flex; align-items: center; padding: 4px;
        }
        .btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(76,175,80,0.35) !important; }
        .btn-biometric:hover { background: #f9fafb !important; border-color: #4CAF50 !important; color: #2E7D32 !important; }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none !important; }
      `}</style>

      <div style={S.page}>
        <div style={S.card}>

          {/* Logo */}
          <div style={S.logo}>
            <svg width={26} height={26} viewBox="0 0 24 24" fill="none"
              stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/>
              <path d="M12 22V7"/>
              <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
            </svg>
          </div>

          {/* Title */}
          <h1 style={S.title}>
            {isLogin ? "Welcome back" : isForgot ? "Reset password" : "Create account"}
          </h1>
          <p style={S.subtitle}>
            {isLogin
              ? "Log in to your FinanceTracker account"
              : isForgot
              ? "We'll send a reset link to your email"
              : "Start tracking your money today"}
          </p>

          {/* Error / success banners */}
          {error   && <div style={S.error}>⚠️ {error}</div>}
          {message && <div style={S.success}>✅ {message}</div>}

          {/* ── Form ── */}
          <form onSubmit={isLogin ? handleLogin : isForgot ? handleForgot : handleSignup}>

            {/* Email */}
            <label style={S.label}>Email</label>
            <input
              ref={emailRef}
              type="email"
              placeholder="you@example.com"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              style={inputStyle("email")}
            />

            {/* Password (hidden for forgot mode) */}
            {!isForgot && (
              <>
                <label style={S.label}>Password</label>
                <div className="auth-input-wrap" style={{ marginBottom: 8 }}>
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder={isLogin ? "Your password" : "Min. 8 characters"}
                    value={password}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                    style={{ ...inputStyle("password"), paddingRight: 44, marginBottom: 0 }}
                  />
                  <button
                    type="button"
                    className="pass-toggle"
                    onClick={() => setShowPass((s) => !s)}
                    tabIndex={-1}
                  >
                    {showPass ? (
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>

                {/* Forgot password link */}
                {isLogin && (
                  <div style={{ textAlign: "right", marginBottom: 20 }}>
                    <button
                      type="button"
                      style={S.forgotBtn}
                      onClick={() => { setMode("forgot"); clearMessages(); }}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={S.btnPrimary}
            >
              {loading ? <Spinner /> : null}
              {loading
                ? "Please wait…"
                : isLogin
                ? "Log In"
                : isForgot
                ? "Send Reset Link"
                : "Create Account"}
            </button>
          </form>

          {/* Biometric login */}
          {showBiometric && isLogin && (
            <>
              <div style={S.divider}>
                <div style={S.dividerLine} />
                <span style={S.dividerText}>or</span>
                <div style={S.dividerLine} />
              </div>
              <button
                type="button"
                className="btn-biometric"
                onClick={handleBiometric}
                disabled={loading}
                style={S.btnBiometric}
              >
                <FingerprintIcon size={20} color="#4CAF50" />
                Use Biometrics / Fingerprint
              </button>
            </>
          )}

          {/* Mode toggle */}
          <div style={S.toggleRow}>
            {isForgot ? (
              <>
                Remember it?{" "}
                <button style={S.toggleBtn} onClick={() => { setMode("login"); clearMessages(); }}>
                  Back to login
                </button>
              </>
            ) : isLogin ? (
              <>
                Don't have an account?{" "}
                <button style={S.toggleBtn} onClick={() => { setMode("signup"); clearMessages(); }}>
                  Sign up free
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button style={S.toggleBtn} onClick={() => { setMode("login"); clearMessages(); }}>
                  Log in
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
