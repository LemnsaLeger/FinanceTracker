// src/lib/AuthContext.js
// ─────────────────────────────────────────────────────────────────────────────
// React context that exposes the current Supabase session to every component.

//
// The context also handles:
//   • Listening to Supabase auth state changes (login, logout, token refresh)
//   • Persisting the last-visited route so we can restore it after login
// ─────────────────────────────────────────────────────────────────────────────

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

// ── Last-route persistence ────────────────────────────────────────────────────
const LAST_ROUTE_KEY = "ft_last_route";

export const saveLastRoute = (route) => {
  try { localStorage.setItem(LAST_ROUTE_KEY, route); } catch (_) {}
};

export const getLastRoute = () => {
  try { return localStorage.getItem(LAST_ROUTE_KEY) || "dashboard"; } catch (_) { return "dashboard"; }
};

export const clearLastRoute = () => {
  try { localStorage.removeItem(LAST_ROUTE_KEY); } catch (_) {}
};

// ── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined); // undefined = still loading
  const [user,    setUser]    = useState(null);

  useEffect(() => {
    // 1. Get the current session on first mount (handles page refresh)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // 2. Subscribe to future auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    session,
    user,
    // session === undefined means we haven't heard back from Supabase yet
    loading: session === undefined,
    isLoggedIn: !!session,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
