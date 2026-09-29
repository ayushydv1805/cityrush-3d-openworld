import { formatRupees } from "../game/economy/economyData";
import { getGarageTier, getUpgradeSummary } from "../game/garage/garageData";
import {
  getCurrentRank,
  getPayoutBonusPercent,
  getRankProgress,
} from "../game/reputation/reputationData";

export default function MainMenu({
  onEnter,
  onControls,
  onGarage,
  onReputation,
  economy,
  garage,
  reputation,
}) {
  const cash = economy?.cash ?? 1500;
  const tier = getGarageTier(garage);
  const upgrades = getUpgradeSummary(garage);
  const installed = upgrades.reduce((total, item) => total + item.level, 0);
  const repScore = reputation?.score ?? 0;
  const rank = getCurrentRank(repScore);
  const progress = getRankProgress(repScore);
  const payoutBonus = getPayoutBonusPercent(repScore);

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
          <p className="eyebrow">PHASE 9 • REPUTATION + RANKS</p>
          <h1>YOUR CITY.<br /><em>YOUR RIDE.</em><br />YOUR NAME.</h1>
          <p className="lead">
            Clear routes cleanly, build your street reputation, climb city ranks, and unlock a
            larger payout bonus for future missions.
          </p>

          <div className="actions">
            <button className="primary" onClick={onEnter}>
              ENTER CHANDIGARH <b>→</b>
            </button>
            <button className="secondary" onClick={onGarage}>
              GARAGE <b>⚙</b>
            </button>
            <button className="secondary" onClick={onReputation}>
              REPUTATION <b>↗</b>
            </button>
            <button className="secondary" onClick={onControls}>CONTROLS</button>
          </div>

          <div className="stats">
            <div><strong>₹{formatRupees(cash)}</strong><span>WALLET</span></div>
            <div><strong>{rank.name}</strong><span>REP RANK</span></div>
            <div><strong>{repScore}</strong><span>REP SCORE</span></div>
            <div><strong>+{payoutBonus}%</strong><span>PAYOUT BONUS</span></div>
          </div>
        </div>

        <aside className="mission-preview">
          <div className="preview-top">
            <span>CHANDIGARH // 01</span>
            <span className="live-dot"><i /> REPUTATION LIVE</span>
          </div>

          <div className="preview-map">
            <span className="road r1" /><span className="road r2" /><span className="road r3" />
            <span className="road r4" /><span className="road r5" />
            <span className="node n1" /><span className="node n2" /><span className="node n3" />
            <span className="node n4" /><span className="node n5" />
            <span className="route-line" />
            <div className="route-car">REP</div>
          </div>

          <div className="preview-title">
            <span>REPUTATION // {rank.name}</span>
            <strong>BUILD YOUR NAME</strong>
            <small>
              {progress.next
                ? `${progress.pointsToNext} REP to ${progress.next.name}.`
                : "You have reached the highest city rank."}
            </small>
          </div>

          <div className="preview-metrics">
            <div><b>{repScore}</b><span>REP</span></div>
            <div><b>{reputation?.successfulStreak ?? 0}</b><span>STREAK</span></div>
            <div><b>{tier}/3</b><span>CAR TIER</span></div>
          </div>
        </aside>
      </section>

      <footer>
        <span>CHANDIGARH • REWARI • GURUGRAM • DELHI</span>
        <span>v0.9.0 • REPUTATION + RANKS</span>
      </footer>
    </main>
  );
}
