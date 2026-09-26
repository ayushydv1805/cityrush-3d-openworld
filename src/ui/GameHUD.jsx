export default function GameHUD({
  city,
  info,
  vehicleInfo,
  driving,
  locked,
  onTakeControl,
  onExit,
  missions = [],
  mission,
  canStartMission = false,
  onStartMission,
  onAbortMission,
}) {
  const active = driving ? vehicleInfo : info;
  const kmh = Math.round((active?.speed ?? 0) * 3.6);
  const input = active?.input ?? { w: false, a: false, s: false, d: false };
  const selectedMission = missions.find((item) => item.id === mission?.id);
  const missionActive = mission?.status === "active";
  const missionFinished = mission?.status === "success" || mission?.status === "failed";
  const nextCheckpoint =
    selectedMission?.checkpoints?.[mission?.checkpoint ?? 0]?.label ?? "FINISH";
  const timeLeft = Math.max(0, Math.ceil(mission?.timeLeft ?? 0));

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
          PHASE 6
          <span>MISSION SYSTEM</span>
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

      <div className="population-badge">
        <span><b>{city.trafficVehicles}</b> TRAFFIC</span>
        <span><b>{city.pedestrianCount}</b> NPCs</span>
      </div>

      <section className="mission-panel" aria-label="Mission board">
        {mission?.status === "idle" && (
          <>
            <div className="mission-panel-head">
              <div>
                <span>PHASE 6 • MISSION BOARD</span>
                <strong>CHOOSE A RUN</strong>
              </div>
              <b>{missions.length.toString().padStart(2, "0")}</b>
            </div>

            <div className="mission-list">
              {missions.map((item, index) => (
                <button
                  key={item.id}
                  className="mission-card"
                  disabled={!canStartMission}
                  onClick={() => onStartMission?.(item.id)}
                >
                  <span className="mission-index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="mission-card-copy">
                    <strong>{item.name}</strong>
                    <small>{item.description}</small>
                    <em>{item.checkpoints.length} CHECKPOINTS • {item.duration}s • ₹{item.reward}</em>
                  </span>
                  <b className="mission-card-cta">START</b>
                </button>
              ))}
            </div>

            {!canStartMission && (
              <div className="mission-note">Get close to the Civic Cruiser to start a driving mission.</div>
            )}
          </>
        )}

        {missionActive && (
          <>
            <div className="mission-panel-head active">
              <div>
                <span>ACTIVE MISSION</span>
                <strong>{mission.title}</strong>
              </div>
              <button className="mission-abort" onClick={onAbortMission}>ABORT</button>
            </div>

            <div className="mission-objective">
              <div className="mission-route-row">
                <span>CHECKPOINT</span>
                <strong>{Math.min((mission.checkpoint ?? 0) + 1, mission.total)} / {mission.total}</strong>
              </div>
              <div className="mission-route-bar">
                <span style={{ width: `${mission.total ? ((mission.checkpoint ?? 0) / mission.total) * 100 : 0}%` }} />
              </div>
              <p>{mission.message}</p>
              <div className="mission-stats">
                <span><small>NEXT</small><b>{nextCheckpoint}</b></span>
                <span><small>TIME</small><b className={timeLeft <= 10 ? "warning" : ""}>{timeLeft}s</b></span>
                <span><small>REWARD</small><b>₹{mission.reward}</b></span>
              </div>
            </div>
          </>
        )}

        {missionFinished && (
          <div className={`mission-result ${mission.status}`}>
            <span>{mission.status === "success" ? "ROUTE CLEARED" : "RUN FAILED"}</span>
            <strong>{mission.status === "success" ? "MISSION COMPLETE" : "TIME EXPIRED"}</strong>
            <p>{mission.message}</p>
            <div className="mission-result-actions">
              {mission.status === "failed" && (
                <button className="primary" onClick={() => onStartMission?.(mission.id)}>RETRY</button>
              )}
              <button className="secondary" onClick={onAbortMission}>MISSION BOARD</button>
            </div>
          </div>
        )}
      </section>

      <div className="game-bottom">
        <div className="telemetry">
          <div className="telemetry-main">
            <strong>{kmh}</strong>
            <span>KM/H</span>
          </div>
          <div className="telemetry-divider" />

          {driving ? (
            <>
              <div><span>GEAR</span><strong>{vehicleInfo?.gear ?? "P"}</strong></div>
              <div><span>MODE</span><strong>{vehicleInfo?.handbrake ? "BRAKE" : "DRIVE"}</strong></div>
            </>
          ) : (
            <>
              <div><span>STATE</span><strong>{info?.sprinting ? "SPRINT" : "RUN"}</strong></div>
              <div><span>GROUND</span><strong>{info?.grounded ? "YES" : "AIR"}</strong></div>
            </>
          )}
        </div>

        <div className="key-panel">
          {["w", "a", "s", "d"].map((key) => (
            <div key={key} className={input[key] ? "key active" : "key"}>{key.toUpperCase()}</div>
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

      {!missionActive && missionFinished === false && locked && mission?.status === "idle" && (
        <div className="mission-hint">
          <b>MISSION BOARD</b>
          <span>Choose a route from the panel at top-right.</span>
        </div>
      )}

      {!locked && (
        <div className="control-overlay">
          <div className="control-card">
            <span className="overlay-kicker">CITY RUSH • {city.name.toUpperCase()}</span>
            <h2>TAKE CONTROL</h2>
            <p>
              The city is alive, and Phase 6 adds the first real mission routes.
              Drive the Civic Cruiser through glowing checkpoints before time runs out.
            </p>
            <button className="primary overlay-button" onClick={onTakeControl}>
              CLICK TO PLAY <b>→</b>
            </button>
            <small>Click once, then use W A S D. Press E near the car to drive.</small>
          </div>
        </div>
      )}

      <div className="crosshair" aria-hidden="true"><span /><span /><span /><span /></div>
    </div>
  );
}
