// src/components/Icon.jsx
// A thin wrapper around lucide-react to render icons by string name.

import {
  Home,
  BarChart2,
  Plus,
  CreditCard,
  User,
  Bell,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  Cloud,
  Music,
  Landmark,
  Utensils,
  Briefcase,
  PlayCircle,
  Wifi,
  Receipt,
  Repeat,
  Zap,
  Car,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  ChevronLeft,
  X,
  Check,
  DollarSign,
  Wallet,
  Shield,
  Smartphone,
  Gift,
  Eye,
  EyeOff,
  MoreHorizontal,
  Filter,
  Download,
  Settings,
  LogOut,
  PieChart,
} from "lucide-react";

const icons = {
  home: Home,
  "bar-chart-2": BarChart2,
  plus: Plus,
  "credit-card": CreditCard,
  user: User,
  bell: Bell,
  search: Search,
  "arrow-up-right": ArrowUpRight,
  "arrow-down-left": ArrowDownLeft,
  cloud: Cloud,
  music: Music,
  landmark: Landmark,
  utensils: Utensils,
  briefcase: Briefcase,
  "play-circle": PlayCircle,
  wifi: Wifi,
  receipt: Receipt,
  repeat: Repeat,
  zap: Zap,
  car: Car,
  "trending-up": TrendingUp,
  "trending-down": TrendingDown,
  "chevron-right": ChevronRight,
  "chevron-left": ChevronLeft,
  x: X,
  check: Check,
  "dollar-sign": DollarSign,
  wallet: Wallet,
  shield: Shield,
  smartphone: Smartphone,
  gift: Gift,
  eye: Eye,
  "eye-off": EyeOff,
  "more-horizontal": MoreHorizontal,
  filter: Filter,
  download: Download,
  settings: Settings,
  "log-out": LogOut,
  "pie-chart": PieChart,
};

export default function Icon({
  name,
  size = 20,
  color,
  strokeWidth = 1.75,
  className = "",
}) {
  const Component = icons[name];
  if (!Component) return null;
  return (
    <Component
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      className={className}
    />
  );
}
