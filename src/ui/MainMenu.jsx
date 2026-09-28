import { formatRupees } from "../game/economy/economyData";

export default function MainMenu({ onEnter, onControls, economy }) {
  const cash = economy?.cash ?? 1500;
  const earned = economy?.totalEarned ?? 0;
  const paidRuns = economy?.missionsCompleted ?? 0;
  const bestPayout = economy?.bestPayout ?? 0;

  return (
    <main className="menu">
      <div className="glow glowA" />
      <div className="glow glowB" />
      <div className="grid-glow" />

      <nav>
        <div className="brand">
          <span className="brandMark">CR</span>
          <span>CITY RUSH</span>
        </div>
        <span className="status"><i /> CITY SYSTEM ONLINE</span>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">PHASE 7 • MONEY + ECONOMY</p>
          <h1>YOUR CITY.<br /><em>YOUR RIDE.</em><br />YOUR RUN.</h1>
          <p className="lead">
            Earn cash by clearing driving missions. Your wallet now persists in the browser,
            so every successful run builds your CITY RUSH bankroll for the garage and upgrades ahead.
          </p>

          <div className="actions">
            <button className="primary" onClick={onEnter}>
              ENTER CHANDIGARH <b>→</b>
            </button>
            <button className="secondary" onClick={onControls}>CONTROLS</button>
          </div>

          <div className="stats">
            <div><strong>₹{formatRupees(cash)}</strong><span>WALLET</span></div>
            <div><strong>₹{formatRupees(earned)}</strong><span>TOTAL EARNED</span></div>
            <div><strong>{paidRuns}</strong><span>PAID RUNS</span></div>
            <div><strong>P7</strong><span>ECONOMY LIVE</span></div>
          </div>
        </div>

        <aside className="mission-preview">
          <div className="preview-top">
            <span>CHANDIGARH // 01</span>
            <span className="live-dot"><i /> ECONOMY LIVE</span>
          </div>

          <div className="preview-map">
            <span className="road r1" /><span className="road r2" /><span className="road r3" />
            <span className="road r4" /><span className="road r5" />
            <span className="node n1" /><span className="node n2" /><span className="node n3" />
            <span className="node n4" /><span className="node n5" />
            <span className="route-line" />
            <div className="route-car">₹</div>
          </div>

          <div className="preview-title">
            <span>PLAYER ECONOMY</span>
            <strong>BUILD YOUR BANKROLL</strong>
            <small>Finish routes → get paid → prepare for the garage.</small>
          </div>

          <div className="preview-metrics">
            <div><b>₹500</b><span>MIN PAYOUT</span></div>
            <div><b>₹1,200</b><span>MAX PAYOUT</span></div>
            <div><b>{bestPayout ? "₹" + formatRupees(bestPayout) : "—"}</b><span>BEST PAYOUT</span></div>
          </div>
        </aside>
      </section>

      <footer>
        <span>CHANDIGARH • REWARI • GURUGRAM • DELHI</span>
        <span>v0.7.0 • MONEY + ECONOMY</span>
      </footer>
    </main>
  );
}
