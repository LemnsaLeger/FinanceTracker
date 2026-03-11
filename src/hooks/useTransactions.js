// src/hooks/useTransactions.js
// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for transaction data across the entire app.
// Both desktop (DesktopLayout) and mobile (App.jsx MobileApp) use this hook.
//
// Provides:
//   txList          — all transactions for the logged-in user, newest first
//   loading         — true while initial fetch is in progress
//   error           — string if fetch failed, null otherwise
//   addTransaction  — saves a new transaction to Supabase + updates local state
//   deleteTransaction — removes a transaction from Supabase + local state
//   refetch         — manually re-fetch from Supabase
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import { CATEGORY_META } from "../../data/desktopData";

// Build a full transaction object from the raw form data
function buildTransaction(raw, userId) {
  const key = raw.category?.toLowerCase() ?? "cash";
  const meta = CATEGORY_META[key] ?? CATEGORY_META.cash;
  const signed =
    raw.type === "expense" ? -Math.abs(raw.amount) : Math.abs(raw.amount);

  return {
    user_id: userId,
    name: raw.name ?? raw.description ?? "Transaction",
    category: key.charAt(0).toUpperCase() + key.slice(1),
    type: raw.type ?? (signed < 0 ? "expense" : "income"),
    amount: signed,
    icon: meta.icon,
    color: meta.color,
    bg: meta.bg,
    date: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  };
}

export function useTransactions() {
  const [txList, setTxList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Fetch all transactions for the current user ───────────────────────────
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setTxList([]);
        return;
      }

      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTxList(data ?? []);
    } catch (err) {
      setError(err.message);
      setTxList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // ── Add a new transaction ─────────────────────────────────────────────────
  const addTransaction = useCallback(async (raw) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Not logged in" };

    const newTx = buildTransaction(raw, user.id);

    const { data, error } = await supabase
      .from("transactions")
      .insert([newTx])
      .select()
      .single();

    if (error) return { error: error.message };

    // Optimistically prepend to local list
    setTxList((prev) => [data, ...prev]);
    return { data };
  }, []);

  // ── Delete a transaction ──────────────────────────────────────────────────
  const deleteTransaction = useCallback(async (id) => {
    const { error } = await supabase.from("transactions").delete().eq("id", id);

    if (error) return { error: error.message };

    setTxList((prev) => prev.filter((t) => t.id !== id));
    return { success: true };
  }, []);

  return {
    txList,
    loading,
    error,
    addTransaction,
    deleteTransaction,
    refetch: fetchTransactions,
  };
}
