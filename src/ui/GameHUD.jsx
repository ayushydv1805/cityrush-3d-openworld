export default function GameHUD({ city, info, locked, onTakeControl, onExit }) {
  const kmh = Math.round((info?.speed ?? 0) * 3.6);
  const input = info?.input ?? { w: false, a: false, s: false, d: false };

  return (
    <div className="game-ui">
      <div className="game-topbar">
        <div className="game-brand">
          <span className="game-brand-mark">CR</span>
          <div>
            <strong>CITY RUSH</strong>
            <span>{city.name.toUpperCase()} • {city.subtitle.toUpperCase()}</span>
          </div>
        </div>

        <div className="game-phase">
          PHASE 3
          <span>FIRST CITY</span>
        </div>

        <button className="game-exit" onClick={onExit}>
          EXIT CITY <span>Esc</span>
        </button>
      </div>

      <div className="city-badge">
        <span className="city-kicker">CURRENT DISTRICT</span>
        <strong>{city.name.toUpperCase()}</strong>
        <small>SECTOR GRID • {city.sectorIds.length} ACTIVE • 36 PLANNED</small>
      </div>

      <div className="game-bottom">
        <div className="telemetry">
          <div className="telemetry-main">
            <strong>{kmh}</strong>
            <span>KM/H</span>
          </div>
          <div className="telemetry-divider" />
          <div>
            <span>STATE</span>
            <strong>{info?.sprinting ? "SPRINT" : "RUN"}</strong>
          </div>
          <div>
            <span>GROUND</span>
            <strong>{info?.grounded ? "YES" : "AIR"}</strong>
          </div>
        </div>

        <div className="key-panel">
          {["w", "a", "s", "d"].map((key) => (
            <div key={key} className={input[key] ? "key active" : "key"}>
              {key.toUpperCase()}
            </div>
          ))}
          <span className="key-caption">MOVE</span>
        </div>

        <div className="controls-card">
          <span><b>W A S D</b> MOVE</span>
          <span><b>SHIFT</b> SPRINT</span>
          <span><b>SPACE</b> JUMP</span>
          <span><b>MOUSE</b> CAMERA</span>
        </div>
      </div>

      {!locked && (
        <div className="control-overlay">
          <div className="control-card">
            <span className="overlay-kicker">CITY RUSH • {city.name.toUpperCase()}</span>
            <h2>TAKE CONTROL</h2>
            <p>
              Phase 3 opens the first real city foundation: sectors, boulevards,
              parks, roundabouts and landmarks.
            </p>
            <button className="primary overlay-button" onClick={onTakeControl}>
              CLICK TO PLAY <b>→</b>
            </button>
            <small>Click the game once, then use W A S D. Press ESC to release the mouse.</small>
          </div>
        </div>
      )}

      <div className="crosshair" aria-hidden="true">
        <span /><span /><span /><span />
      </div>
    </div>
  );
}
