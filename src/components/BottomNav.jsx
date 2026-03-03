// src/components/BottomNav.jsx
import Icon from "./Icon";
import { navItems } from "../../data/mockData";

export default function BottomNav({ activeTab, onTabChange, onAdd }) {
  return (
    <nav className="nav-bar">
      {navItems.map((item) => {
        if (item.isFab) {
          return (
            <button
              key={item.id}
              className="fab"
              onClick={onAdd}
              aria-label="Add transaction"
            >
              <Icon name="plus" size={24} color="#fff" strokeWidth={2.5} />
            </button>
          );
        }
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            className={`nav-btn ${isActive ? "active" : ""}`}
            onClick={() => onTabChange(item.id)}
            aria-label={item.label}
          >
            <Icon
              name={item.icon}
              size={21}
              color={isActive ? "var(--secondary)" : "var(--text-light)"}
              strokeWidth={isActive ? 2.2 : 1.75}
            />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
