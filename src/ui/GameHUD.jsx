export default function GameHUD({
  city,
  info,
  vehicleInfo,
  driving,
  locked,
  onTakeControl,
  onExit,
}) {
  const active = driving ? vehicleInfo : info;
  const kmh = Math.round((active?.speed ?? 0) * 3.6);
  const input = active?.input ?? { w: false, a: false, s: false, d: false };

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
          PHASE 4
          <span>VEHICLES</span>
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

      {driving && (
        <div className="vehicle-badge">
          <span className="city-kicker">ACTIVE VEHICLE</span>
          <strong>CIVIC CRUISER</strong>
          <small>CITY SEDAN • FRONT WHEEL STEER</small>
        </div>
      )}

      <div className="game-bottom">
        <div className="telemetry">
          <div className="telemetry-main">
            <strong>{kmh}</strong>
            <span>KM/H</span>
          </div>
          <div className="telemetry-divider" />

          {driving ? (
            <>
              <div>
                <span>GEAR</span>
                <strong>{vehicleInfo?.gear ?? "P"}</strong>
              </div>
              <div>
                <span>MODE</span>
                <strong>{vehicleInfo?.handbrake ? "BRAKE" : "DRIVE"}</strong>
              </div>
            </>
          ) : (
            <>
              <div>
                <span>STATE</span>
                <strong>{info?.sprinting ? "SPRINT" : "RUN"}</strong>
              </div>
              <div>
                <span>GROUND</span>
                <strong>{info?.grounded ? "YES" : "AIR"}</strong>
              </div>
            </>
          )}
        </div>

        <div className="key-panel">
          {["w", "a", "s", "d"].map((key) => (
            <div key={key} className={input[key] ? "key active" : "key"}>
              {key.toUpperCase()}
            </div>
          ))}
          <span className="key-caption">{driving ? "DRIVE" : "MOVE"}</span>
        </div>

        <div className="controls-card">
          {driving ? (
            <>
              <span><b>W</b> ACCELERATE</span>
              <span><b>S</b> BRAKE / REVERSE</span>
              <span><b>A / D</b> STEER</span>
              <span><b>SPACE</b> HANDBRAKE</span>
              <span><b>E</b> EXIT</span>
            </>
          ) : (
            <>
              <span><b>W A S D</b> MOVE</span>
              <span><b>SHIFT</b> SPRINT</span>
              <span><b>SPACE</b> JUMP</span>
              <span><b>E</b> ENTER CAR</span>
            </>
          )}
        </div>
      </div>

      {!driving && vehicleInfo?.nearVehicle && locked && (
        <div className="vehicle-prompt">
          <span className="prompt-key">E</span>
          <div>
            <strong>ENTER CIVIC CRUISER</strong>
            <small>Parked on the boulevard • {city.name}</small>
          </div>
        </div>
      )}

      {driving && !locked && (
        <div className="vehicle-prompt">
          <span className="prompt-key">MOUSE</span>
          <div>
            <strong>TAKE CAMERA CONTROL</strong>
            <small>Click once to look around the vehicle.</small>
          </div>
        </div>
      )}

      {!locked && (
        <div className="control-overlay">
          <div className="control-card">
            <span className="overlay-kicker">CITY RUSH • {city.name.toUpperCase()}</span>
            <h2>{driving ? "TAKE CONTROL" : "TAKE CONTROL"}</h2>
            <p>
              Explore Chandigarh on foot, then enter the Civic Cruiser and drive
              the boulevard network with arcade-style handling.
            </p>
            <button className="primary overlay-button" onClick={onTakeControl}>
              CLICK TO PLAY <b>→</b>
            </button>
            <small>Click the game once, then use W A S D. Press E near the car to drive.</small>
          </div>
        </div>
      )}

      <div className="crosshair" aria-hidden="true">
        <span /><span /><span /><span />
      </div>
    </div>
  );
}
