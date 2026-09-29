import { formatRupees } from "../game/economy/economyData";
import { getGarageTier, getUpgradeSummary } from "../game/garage/garageData";

export default function MainMenu({ onEnter, onControls, onGarage, economy, garage }) {
  const cash = economy?.cash ?? 1500;
  const earned = economy?.totalEarned ?? 0;
  const paidRuns = economy?.missionsCompleted ?? 0;
  const bestPayout = economy?.bestPayout ?? 0;
  const tier = getGarageTier(garage);
  const upgrades = getUpgradeSummary(garage);
  const installed = upgrades.reduce((total, item) => total + item.level, 0);

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
          <p className="eyebrow">PHASE 8 • GARAGE + UPGRADES</p>
          <h1>YOUR CITY.<br /><em>YOUR RIDE.</em><br />YOUR RUN.</h1>
          <p className="lead">
            Earn mission cash, bring it back to the garage, and tune the Civic Cruiser.
            Every upgrade is permanent and stays with your browser save.
          </p>

          <div className="actions">
            <button className="primary" onClick={onEnter}>
              ENTER CHANDIGARH <b>→</b>
            </button>
            <button className="secondary" onClick={onGarage}>
              GARAGE <b>⚙</b>
            </button>
            <button className="secondary" onClick={onControls}>CONTROLS</button>
          </div>

          <div className="stats">
            <div><strong>₹{formatRupees(cash)}</strong><span>WALLET</span></div>
            <div><strong>{tier}/3</strong><span>GARAGE TIER</span></div>
            <div><strong>{installed}/12</strong><span>UPGRADES</span></div>
            <div><strong>P8</strong><span>GARAGE LIVE</span></div>
          </div>
        </div>

        <aside className="mission-preview">
          <div className="preview-top">
            <span>CHANDIGARH // 01</span>
            <span className="live-dot"><i /> GARAGE LIVE</span>
          </div>

          <div className="preview-map">
            <span className="road r1" /><span className="road r2" /><span className="road r3" />
            <span className="road r4" /><span className="road r5" />
            <span className="node n1" /><span className="node n2" /><span className="node n3" />
            <span className="node n4" /><span className="node n5" />
            <span className="route-line" />
            <div className="route-car">CR</div>
          </div>

          <div className="preview-title">
            <span>GARAGE // CIVIC CRUISER</span>
            <strong>TUNE. TEST. DRIVE.</strong>
            <small>Mission payouts now turn into real performance upgrades.</small>
          </div>

          <div className="preview-metrics">
            <div><b>₹{formatRupees(cash)}</b><span>CASH</span></div>
            <div><b>{tier}/3</b><span>TIER</span></div>
            <div><b>{bestPayout ? "₹" + formatRupees(bestPayout) : "—"}</b><span>BEST PAYOUT</span></div>
          </div>
        </aside>
      </section>

      <footer>
        <span>CHANDIGARH • REWARI • GURUGRAM • DELHI</span>
        <span>v0.8.0 • GARAGE + UPGRADES</span>
      </footer>
    </main>
  );
}
