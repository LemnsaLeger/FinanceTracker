// src/components/desktop/shared/formatters.js
// Pure formatting helpers — no React, no side effects.
// Import these wherever you need currency or number formatting.

/**
 * Format a number as FCFA with thousands separators (fr-CM locale).
 * Always returns the absolute value — sign should be applied by the caller.
 * @param {number} n
 * @returns {string}  e.g. "1 420 000"
 */
export const fmt = (n) =>
  new Intl.NumberFormat("fr-CM").format(Math.abs(n));

/**
 * Compact format for large numbers — used in KPI cards where space is limited.
 * @param {number} n
 * @returns {string}  e.g. "1.4M" | "350K" | "8 000"
 */
export const fmtShort = (n) => {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return (abs / 1_000_000).toFixed(1) + "M";
  if (abs >= 1_000)     return (abs / 1_000).toFixed(0) + "K";
  return fmt(n);
};

/**
 * Format today's date as "DD Mon YYYY" (e.g. "08 Mar 2026").
 * Used when saving a new transaction without an explicit date.
 * @returns {string}
 */
export const todayLabel = () =>
  new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
