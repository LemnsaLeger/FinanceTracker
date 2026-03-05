// src/data/desktopData.js
// All seed data and static lookup maps for the desktop finance app.

// ─── Transactions ────────────────────────────────────────────────────────────
export const SEED_TRANSACTIONS = [
  { id:1,  name:"Dropbox Plan",        category:"Subscription",  date:"08 Mar 2026", amount:-144000,  icon:"cloud",       color:"#0061FF", bg:"#EEF3FF" },
  { id:2,  name:"Spotify Subscription",category:"Subscription",  date:"08 Mar 2026", amount:-24000,   icon:"music",       color:"#1DB954", bg:"#E8F8EE" },
  { id:3,  name:"ATM Withdrawal",      category:"Cash",          date:"07 Mar 2026", amount:-220000,  icon:"landmark",    color:"#757575", bg:"#F5F5F5" },
  { id:4,  name:"KFC Restaurant",      category:"Food & Dining", date:"07 Mar 2026", amount:-140000,  icon:"utensils",    color:"#E53935", bg:"#FFEBEE" },
  { id:5,  name:"Freelance Work",      category:"Income",        date:"06 Mar 2026", amount:4210000,  icon:"briefcase",   color:"#4CAF50", bg:"#E8F5E9" },
  { id:6,  name:"YouTube Ads Revenue", category:"Income",        date:"06 Mar 2026", amount:320000,   icon:"play-circle", color:"#FF0000", bg:"#FFEBEE" },
  { id:7,  name:"MTN Mobile Data",     category:"Bills",         date:"05 Mar 2026", amount:-15000,   icon:"wifi",        color:"#FF6F00", bg:"#FFF3E0" },
  { id:8,  name:"Tax on Interest",     category:"Tax",           date:"05 Mar 2026", amount:-30000,   icon:"receipt",     color:"#FF5722", bg:"#FBE9E7" },
  { id:9,  name:"Monthly Salary",      category:"Income",        date:"01 Mar 2026", amount:3500000,  icon:"briefcase",   color:"#4CAF50", bg:"#E8F5E9" },
  { id:10, name:"ENEO Electricity",    category:"Bills",         date:"04 Mar 2026", amount:-80000,   icon:"zap",         color:"#FF9800", bg:"#FFF3E0" },
  { id:11, name:"Shoprite Groceries",  category:"Food & Dining", date:"03 Mar 2026", amount:-145000,  icon:"utensils",    color:"#E53935", bg:"#FFEBEE" },
  { id:12, name:"Taxi Fare",           category:"Transport",     date:"02 Mar 2026", amount:-12000,   icon:"car",         color:"#9C27B0", bg:"#F3E5F5" },
];

// ─── Budget categories ────────────────────────────────────────────────────────
export const SPEND_CATEGORIES = [
  { name:"Subscriptions", icon:"repeat",   spent:168000, budget:200000, color:"#2196F3" },
  { name:"Food & Dining", icon:"utensils", spent:285000, budget:250000, color:"#FF5722", over:true },
  { name:"Bills",         icon:"zap",      spent:95000,  budget:150000, color:"#FF9800" },
  { name:"Transport",     icon:"car",      spent:12000,  budget:50000,  color:"#9C27B0" },
];

// ─── Monthly trend data ───────────────────────────────────────────────────────
export const MONTHLY_DATA = [
  { month:"Oct", income:3200000, expense:980000  },
  { month:"Nov", income:3800000, expense:1200000 },
  { month:"Dec", income:4100000, expense:1650000 },
  { month:"Jan", income:3500000, expense:1100000 },
  { month:"Feb", income:4200000, expense:1380000 },
  { month:"Mar", income:3850000, expense:1420000 },
];

// ─── Donut chart slices ───────────────────────────────────────────────────────
export const DONUT_DATA = [
  { label:"Food",          pct:28, color:"#FF5722" },
  { label:"Bills",         pct:18, color:"#FF9800" },
  { label:"Subscriptions", pct:22, color:"#2196F3" },
  { label:"Transport",     pct:8,  color:"#9C27B0" },
  { label:"Income",        pct:24, color:"#4CAF50" },
];

// ─── Category → icon / color map (used when saving new transactions) ─────────
export const CATEGORY_META = {
  food:         { icon:"utensils",  color:"#E53935", bg:"#FFEBEE" },
  transport:    { icon:"car",       color:"#9C27B0", bg:"#F3E5F5" },
  bills:        { icon:"zap",       color:"#FF9800", bg:"#FFF3E0" },
  subscription: { icon:"repeat",    color:"#2196F3", bg:"#E3F2FD" },
  income:       { icon:"briefcase", color:"#4CAF50", bg:"#E8F5E9" },
  cash:         { icon:"landmark",  color:"#757575", bg:"#F5F5F5" },
};

// ─── Sidebar navigation items ─────────────────────────────────────────────────
export const NAV_ITEMS = [
  { id:"dashboard", label:"Dashboard", icon:"home"        },
  { id:"analytics", label:"Analytics", icon:"bar-chart"   },
  { id:"wallet",    label:"Wallet",    icon:"credit-card" },
  { id:"profile",   label:"Profile",   icon:"user"        },
];
