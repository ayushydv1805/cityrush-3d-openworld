import { formatRupees } from "../game/economy/economyData";
import { getEffectiveVehicleStats, getUpgradeSummary } from "../game/garage/garageData";

function StatBar({ label, value, max, unit = "" }) {
  const width = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="garage-stat">
      <div className="garage-stat-head">
        <span>{label}</span>
        <strong>{Math.round(value)}{unit}</strong>
      </div>
      <div className="garage-stat-track">
        <span style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

export default function GaragePanel({ garage, economy, onClose, onPurchase }) {
  const stats = getEffectiveVehicleStats(garage);
  const upgrades = getUpgradeSummary(garage);
  const tier = stats.garageTier;
  const cash = economy?.cash ?? 0;

  return (
    <div className="modal-backdrop garage-backdrop" onClick={onClose}>
      <section className="garage-panel" onClick={(event) => event.stopPropagation()}>
        <div className="garage-head">
          <div>
            <span className="eyebrow">PHASE 8 • GARAGE</span>
            <h2>BUILD YOUR RIDE</h2>
            <p>Spend mission cash on permanent Civic Cruiser upgrades.</p>
          </div>

          <div className="garage-head-actions">
            <div className="garage-wallet">
              <span>WALLET</span>
              <strong>₹{formatRupees(cash)}</strong>
            </div>
            <button className="modal-close" onClick={onClose} aria-label="Close garage">×</button>
          </div>
        </div>

        <div className="garage-overview">
          <div className="garage-car-card">
            <div className="garage-car-glow" />
            <div className="garage-car-art">
              <span className="garage-wheel garage-wheel-a" />
              <span className="garage-wheel garage-wheel-b" />
              <span className="garage-window garage-window-a" />
              <span className="garage-window garage-window-b" />
              <span className="garage-car-body" />
              <span className="garage-car-light" />
            </div>
            <div className="garage-car-meta">
              <div>
                <span>CURRENT VEHICLE</span>
                <strong>CIVIC CRUISER</strong>
                <small>CITY SEDAN • CHANDIGARH SPEC</small>
              </div>
              <b>TIER {tier}/3</b>
            </div>
          </div>

          <div className="garage-stats">
            <div className="garage-section-label">PERFORMANCE SNAPSHOT</div>
            <StatBar label="TOP SPEED" value={stats.maxSpeed * 3.6} max={150} unit=" KM/H" />
            <StatBar label="ACCELERATION" value={stats.acceleration} max={18} />
            <StatBar label="BRAKING" value={stats.braking} max={28} />
            <StatBar label="STEERING" value={stats.steering} max={3} />
            <StatBar label="GRIP" value={stats.grip} max={12} />
          </div>
        </div>

        <div className="garage-upgrades">
          <div className="garage-section-row">
            <div>
              <span className="garage-section-label">UPGRADE BAY</span>
              <strong>ENGINEER THE CRUISER</strong>
            </div>
            <small>Purchased upgrades save automatically.</small>
          </div>

          <div className="garage-upgrade-grid">
            {upgrades.map((item) => {
              const locked = !item.next;
              const unaffordable = item.next && item.next.cost > cash;

              return (
                <article className="garage-upgrade-card" key={item.key}>
                  <div className="garage-upgrade-top">
                    <div>
                      <span>{item.short}</span>
                      <strong>{item.label}</strong>
                    </div>
                    <b>{item.level}/{item.maxLevel}</b>
                  </div>

                  <p>{item.description}</p>

                  <div className="garage-levels" aria-hidden="true">
                    {Array.from({ length: item.maxLevel }).map((_, index) => (
                      <span key={index} className={index < item.level ? "filled" : ""} />
                    ))}
                  </div>

                  <button
                    className={locked ? "garage-buy garage-max" : "garage-buy"}
                    disabled={locked || unaffordable}
                    onClick={() => onPurchase(item.key)}
                  >
                    {locked
                      ? "MAX LEVEL"
                      : unaffordable
                        ? `NEED ₹${formatRupees(item.next.cost - cash)} MORE`
                        : `UPGRADE • ₹${formatRupees(item.next.cost)}`}
                  </button>
                </article>
              );
            })}
          </div>
        </div>

        <div className="garage-footer">
          <span>MISSION REWARDS FUND YOUR GARAGE • NO REFUNDS • LOCAL SAVE</span>
          <button className="secondary" onClick={onClose}>DONE</button>
        </div>
      </section>
    </div>
  );
}
