//useNotifications.js;
// src/hooks/useNotifications.js
// ─────────────────────────────────────────────────────────────────────────────
// Derives smart notifications from the real transaction list.
// No extra Supabase table needed — notifications are computed on the fly.
//
// Notification types generated:
//   • "in"       — every income transaction
//   • "out"      — every expense transaction
//   • "warning"  — when a category exceeds its budget threshold (70%+)
//   • "summary"  — one monthly financial summary per calendar month
//
// Returns:
//   notifications   — sorted array of notification objects, newest first
//   unreadCount     — number of notifications the user hasn't seen yet
//   markAllRead     — call this when the user opens the notifications screen
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo, useState, useCallback } from "react";

// How much of a budget limit triggers a warning (70%)
const BUDGET_WARNING_THRESHOLD = 0.7;

// Soft monthly budget limits per category (FCFA) — used for warning generation
const CATEGORY_BUDGETS = {
  "Food & Dining": 250000,
  Bills: 150000,
  Subscription: 200000,
  Transport: 50000,
  Cash: 300000,
  Tax: 100000,
};

const fmt = (n) => new Intl.NumberFormat("fr-CM").format(Math.abs(n));

function getMonthKey(dateStr) {
  // Accepts "08 Mar 2026" or ISO strings
  const d = new Date(dateStr);
  if (!isNaN(d))
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  // Parse "DD Mon YYYY" manually
  const months = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };
  const parts = dateStr.split(" ");
  if (parts.length === 3) {
    const m = months[parts[1]];
    return `${parts[2]}-${String(m + 1).padStart(2, "0")}`;
  }
  return "unknown";
}

function getMonthLabel(monthKey) {
  if (monthKey === "unknown") return "This month";
  const [year, month] = monthKey.split("-");
  return new Date(parseInt(year), parseInt(month) - 1).toLocaleString("en-GB", {
    month: "long",
    year: "numeric",
  });
}

export function useNotifications(txList) {
  // Track which notification IDs have been seen
  const [seenIds, setSeenIds] = useState(() => {
    try {
      const stored = localStorage.getItem("ft_seen_notif_ids");
      return new Set(stored ? JSON.parse(stored) : []);
    } catch {
      return new Set();
    }
  });

  const notifications = useMemo(() => {
    if (!txList || txList.length === 0) return [];

    const notifs = [];

    // ── 1. Per-transaction in/out notifications ───────────────────────────
    txList.forEach((tx) => {
      const isIncome = tx.amount > 0;
      notifs.push({
        id: `tx-${tx.id}`,
        type: isIncome ? "in" : "out",
        title: isIncome ? "Money received" : "Money spent",
        message:
          isIncome ?
            `+FCFA ${fmt(tx.amount)} from ${tx.name}`
          : `-FCFA ${fmt(tx.amount)} on ${tx.name}`,
        category: tx.category,
        icon: isIncome ? "arrow-down-left" : "arrow-up-right",
        color: isIncome ? "#4CAF50" : "#FF5722",
        bg: isIncome ? "#E8F5E9" : "#FFEBEE",
        time: tx.created_at ?? tx.date,
        txId: tx.id,
      });
    });

    // ── 2. Budget warnings — group expenses by category per month ─────────
    const monthCatSpend = {};
    txList
      .filter((t) => t.amount < 0)
      .forEach((tx) => {
        const mk = getMonthKey(tx.created_at ?? tx.date);
        const key = `${mk}::${tx.category}`;
        if (!monthCatSpend[key])
          monthCatSpend[key] = {
            total: 0,
            month: mk,
            category: tx.category,
            lastDate: tx.created_at ?? tx.date,
          };
        monthCatSpend[key].total += Math.abs(tx.amount);
        monthCatSpend[key].lastDate = tx.created_at ?? tx.date;
      });

    Object.values(monthCatSpend).forEach((entry) => {
      const limit = CATEGORY_BUDGETS[entry.category];
      if (!limit) return;
      const pct = entry.total / limit;
      if (pct >= BUDGET_WARNING_THRESHOLD) {
        const over = pct >= 1;
        notifs.push({
          id: `budget-${entry.month}-${entry.category}`,
          type: "warning",
          title:
            over ?
              `Over budget — ${entry.category}`
            : `Budget alert — ${entry.category}`,
          message:
            over ?
              `You've exceeded your ${entry.category} budget for ${getMonthLabel(entry.month)} by FCFA ${fmt(entry.total - limit)}`
            : `You've used ${Math.round(pct * 100)}% of your ${entry.category} budget for ${getMonthLabel(entry.month)}`,
          icon: "zap",
          color: over ? "#D32F2F" : "#FF9800",
          bg: over ? "#FFEBEE" : "#FFF3E0",
          time: entry.lastDate,
        });
      }
    });

    // ── 3. Monthly summary — one per calendar month ───────────────────────
    const monthGroups = {};
    txList.forEach((tx) => {
      const mk = getMonthKey(tx.created_at ?? tx.date);
      if (!monthGroups[mk])
        monthGroups[mk] = {
          income: 0,
          expense: 0,
          count: 0,
          lastDate: tx.created_at ?? tx.date,
        };
      if (tx.amount > 0) monthGroups[mk].income += tx.amount;
      else monthGroups[mk].expense += Math.abs(tx.amount);
      monthGroups[mk].count++;
    });

    Object.entries(monthGroups).forEach(([mk, data]) => {
      const net = data.income - data.expense;
      const saved = net > 0;
      notifs.push({
        id: `summary-${mk}`,
        type: "summary",
        title: `${getMonthLabel(mk)} summary`,
        message: `Income: FCFA ${fmt(data.income)} · Expenses: FCFA ${fmt(data.expense)} · ${
          saved ?
            `Saved FCFA ${fmt(net)} 🎉`
          : `Overspent by FCFA ${fmt(Math.abs(net))} ⚠️`
        } across ${data.count} transactions`,
        icon: "bar-chart",
        color: "#2196F3",
        bg: "#E3F2FD",
        time: data.lastDate,
      });
    });

    // Sort newest first using the time field
    return notifs.sort((a, b) => new Date(b.time) - new Date(a.time));
  }, [txList]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !seenIds.has(n.id)).length,
    [notifications, seenIds],
  );

  const markAllRead = useCallback(() => {
    const allIds = notifications.map((n) => n.id);
    const next = new Set(allIds);
    setSeenIds(next);
    try {
      localStorage.setItem("ft_seen_notif_ids", JSON.stringify(allIds));
    } catch (e) {
      console.error("Failed to save seen notification IDs", e);
    }
  }, [notifications]);

  return { notifications, unreadCount, markAllRead };
}
