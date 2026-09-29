import {
  getCurrentRank,
  getPayoutBonusPercent,
  getRankProgress,
  REPUTATION_RANKS,
} from "../game/reputation/reputationData";

export default function ReputationPanel({ reputation, onClose }) {
  const score = reputation?.score ?? 0;
  const rank = getCurrentRank(score);
  const progress = getRankProgress(score);
  const bonus = getPayoutBonusPercent(score);

  return (
    <div className="modal-backdrop reputation-backdrop" onClick={onClose}>
      <section className="reputation-panel" onClick={(event) => event.stopPropagation()}>
        <div className="reputation-head">
          <div>
            <span className="eyebrow">PHASE 9 • REPUTATION</span>
            <h2>BUILD YOUR NAME</h2>
            <p>Successful routes grow your reputation. Faster clean runs build it quicker.</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close reputation">×</button>
        </div>

        <div className="reputation-hero">
          <div className="reputation-rank-card">
            <span>CURRENT RANK</span>
            <strong>{rank.name}</strong>
            <b>{score} REP</b>
            <div className="reputation-progress">
              <span style={{ width: `${progress.progress}%` }} />
            </div>
            <small>
              {progress.next
                ? `${progress.pointsToNext} REP TO ${progress.next.name}`
                : "MAX CITY RANK REACHED"}
            </small>
          </div>

          <div className="reputation-stats">
            <div><span>MISSIONS</span><strong>{reputation?.missionsCompleted ?? 0}</strong></div>
            <div><span>CURRENT STREAK</span><strong>{reputation?.successfulStreak ?? 0}</strong></div>
            <div><span>BEST STREAK</span><strong>{reputation?.bestStreak ?? 0}</strong></div>
            <div><span>PAYOUT BONUS</span><strong>+{bonus}%</strong></div>
          </div>
        </div>

        <div className="reputation-ladder">
          <div className="reputation-section-label">CITY RANK LADDER</div>

          {REPUTATION_RANKS.map((item) => {
            const unlocked = score >= item.threshold;
            const active = item.id === rank.id;

            return (
              <div
                className={`reputation-rank-row ${active ? "active" : ""} ${unlocked ? "unlocked" : ""}`}
                key={item.id}
              >
                <div>
                  <span>{String(item.threshold).padStart(3, "0")} REP</span>
                  <strong>{item.name}</strong>
                </div>
                <b>{unlocked ? (active ? "CURRENT" : "CLEARED") : "LOCKED"}</b>
              </div>
            );
          })}
        </div>

        <div className="reputation-rules">
          <div>
            <span>HOW REP WORKS</span>
            <p>Every successful mission gives base reputation. Keep enough time on the clock for a speed bonus, and longer success streaks add a small bonus.</p>
          </div>
          <div>
            <span>RANK PERK</span>
            <p>Higher reputation ranks increase the cash payout multiplier for future successful missions.</p>
          </div>
        </div>

        <div className="reputation-footer">
          <span>REP + WALLET + GARAGE SAVED LOCALLY</span>
          <button className="secondary" onClick={onClose}>DONE</button>
        </div>
      </section>
    </div>
  );
}
