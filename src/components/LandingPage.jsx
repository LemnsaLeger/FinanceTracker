// src/components/LandingPage.jsx
import Icon from "./Icon";
import "../App.css"; // For the animation keyframes used in this component

const features = [
  {
    icon: "bar-chart-2",
    color: "#2196F3",
    bg: "#E3F2FD",
    title: "Real-time Analytics",
    desc: "See where every franc goes with clear charts.",
  },
  {
    icon: "shield",
    color: "#4CAF50",
    bg: "#E8F5E9",
    title: "Bank-grade Security",
    desc: "Your data is encrypted and always private.",
  },
  {
    icon: "smartphone",
    color: "#FF5722",
    bg: "#FBE9E7",
    title: "Mobile-first Design",
    desc: "Log expenses in seconds, right from your phone.",
  },
];

export default function LandingPage({ onEnter }) {
  return (
    <div className="landing-hero font-inter">
      {/* Header */}
      <header className="header">
        <div className="flex items-center gap-2">
          <Icon name="wallet" size={18} color="#fff" strokeWidth={2} />
          <span
            className="font-bold text-lg"
            style={{ color: "var(--text-main)" }}
          >
            FinanceTrack
          </span>
        </div>
        <button
          onClick={onEnter}
          className="btn btn-ghost text-sm px-4 py-2"
          style={{ color: "var(--secondary)", fontWeight: 600 }}
        >
          Log in
        </button>
      </header>

      {/* Hero */}
      <main className="flex flex-col items-center text-center px-6 pt-10 pb-6 flex-1">
        {/* Badge */}
        <div
          className="anim-fade-up category-chip"
          style={{
            background: "var(--primary-light)",
            color: "var(--primary-dark)",
          }}
        >
          <Icon name="trending-up" size={13} color="var(--primary-dark)" />
          Trusted by 50,000+ users
        </div>

        {/* Headline */}
        <h1
          className="anim-fade-up delay-1 font-bold leading-tight mb-4"
          style={{
            fontSize: "clamp(28px, 7vw, 36px)",
            color: "var(--text-main)",
            maxWidth: 340,
          }}
        >
          Take full control of{" "}
          <span style={{ color: "var(--primary)" }}>your money</span>
        </h1>

        <p
          className="anim-fade-up delay-2 mb-8"
          style={{
            fontSize: 16,
            color: "var(--text-muted)",
            maxWidth: 300,
            lineHeight: 1.65,
          }}
        >
          Track income, manage expenses, and reach your financial goals: all in
          one beautifully simple app.
        </p>

        {/* CTA */}
        <button
          onClick={onEnter}
          className="anim-fade-up delay-3 btn btn-primary w-full mb-4"
          style={{
            padding: "17px 24px",
            fontSize: 16,
            maxWidth: 320,
            borderRadius: 16,
          }}
        >
          <Icon name="trending-up" size={18} color="#fff" />
          Get Started — It's Free
        </button>

        <button
          onClick={onEnter}
          className="anim-fade-up delay-4 btn btn-ghost"
          style={{
            color: "var(--text-muted)",
            fontSize: 14,
            padding: "10px 20px",
          }}
        >
          View Demo Dashboard →
        </button>

        {/* Mock UI Preview Card */}
        <div
          className="anim-scale-in delay-5 card mt-10 w-full text-left"
          style={{ maxWidth: 340, padding: "20px" }}
        >
          <div className="flex items-center justify-between mb-4">
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--text-muted)",
              }}
            >
              Active Total Balance
            </span>
            <span
              className="category-chip"
              style={{
                background: "var(--primary-light)",
                color: "var(--primary-dark)",
                fontSize: 11,
              }}
            >
              <Icon name="trending-up" size={11} color="var(--primary-dark)" />
              +4% this month
            </span>
          </div>
          <div
            className="font-bold mb-4"
            style={{
              fontSize: 28,
              color: "var(--text-main)",
              letterSpacing: "-0.5px",
            }}
          >
            FCFA 8,420,000
          </div>
          {/* Mini transactions */}
          {[
            { name: "Dropbox Plan", amt: "-144,000", color: "var(--alert)" },
            {
              name: "Freelance Work",
              amt: "+4,210,000",
              color: "var(--primary)",
            },
          ].map((t) => (
            <div
              key={t.name}
              className="flex items-center justify-between py-2"
              style={{ borderBottom: "1px solid var(--border-subtle)" }}
            >
              <span
                style={{
                  fontSize: 13,
                  color: "var(--text-main)",
                  fontWeight: 500,
                }}
              >
                {t.name}
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: t.color }}>
                {t.amt}
              </span>
            </div>
          ))}
        </div>

        {/* Features */}
        <div
          className="anim-fade-up delay-6 w-full mt-10"
          style={{ maxWidth: 340 }}
        >
          <p
            className="font-bold mb-6"
            style={{ fontSize: 18, color: "var(--text-main)" }}
          >
            Everything you need
          </p>
          <div className="flex flex-col gap-3">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="card flex items-center gap-4"
                style={{
                  padding: "16px 18px",
                  animationDelay: `${0.3 + i * 0.07}s`,
                }}
              >
                <div
                  className="tx-icon flex-shrink-0"
                  style={{ background: f.bg, width: 42, height: 42 }}
                >
                  <Icon name={f.icon} size={18} color={f.color} />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "var(--text-main)",
                    }}
                  >
                    {f.title}
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--text-muted)",
                      marginTop: 2,
                    }}
                  >
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p
          className="mt-8 mb-4"
          style={{ fontSize: 12, color: "var(--text-light)" }}
        >
          No credit card required · Cancel anytime
        </p>
      </main>
    </div>
  );
}
