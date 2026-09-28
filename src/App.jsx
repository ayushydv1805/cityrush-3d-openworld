import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { useCallback, useEffect, useRef, useState } from "react";

import ChandigarhWorld from "./game/world/ChandigarhWorld";
import TrafficWorld from "./game/world/TrafficWorld";
import { CITY } from "./game/city/chandigarh";
import { MISSION_LIST, getMission } from "./game/missions/missionData";
import { addMissionReward, formatRupees } from "./game/economy/economyData";
import useEconomy from "./game/economy/useEconomy";
import PlayerController from "./game/player/PlayerController";
import VehicleController from "./game/vehicles/VehicleController";
import ThirdPersonCamera from "./game/camera/ThirdPersonCamera";
import GameHUD from "./ui/GameHUD";
import MainMenu from "./ui/MainMenu";
import MissionSystem from "./game/missions/MissionSystem";

const idleMission = () => ({ id: null, runId: 0, status: "idle", checkpoint: 0, total: 0, timeLeft: 0, reward: 0, payoutCredited: 0, title: "", message: "Choose a mission from the Mission Board." });

function Scene({
  playerRef,
  vehicleRef,
  yawRef,
  pitchRef,
  locked,
  driving,
  onPlayerUpdate,
  onVehicleUpdate,
  onEnterVehicle,
  onExitVehicle,
  mission,
  onMissionUpdate,
  onMissionFinish,
}) {
  return (
    <>
      <PerspectiveCamera makeDefault fov={56} near={0.1} far={300} />

      <color attach="background" args={["#b7c7cf"]} />
      <fog attach="fog" args={["#b7c7cf", 72, 230]} />

      <ambientLight intensity={1.35} />
      <hemisphereLight
        intensity={1.0}
        groundColor="#64715d"
        color="#cfe2ff"
      />
      <directionalLight
        castShadow
        position={[45, 65, 28]}
        intensity={3.2}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-78}
        shadow-camera-right={78}
        shadow-camera-top={78}
        shadow-camera-bottom={-78}
        shadow-bias={-0.00025}
      />

      <ChandigarhWorld />
      <TrafficWorld />

      <MissionSystem
        missionId={mission.id}
        runId={mission.runId}
        active={mission.status === "active"}
        vehicleRef={vehicleRef}
        driving={driving}
        onUpdate={onMissionUpdate}
        onFinish={onMissionFinish}
      />

      <PlayerController
        city={CITY}
        playerRef={playerRef}
        yawRef={yawRef}
        pitchRef={pitchRef}
        locked={locked}
        enabled={!driving}
        onUpdate={onPlayerUpdate}
      />

      <VehicleController
        city={CITY}
        playerRef={playerRef}
        vehicleRef={vehicleRef}
        yawRef={yawRef}
        pitchRef={pitchRef}
        driving={driving}
        locked={locked}
        onEnter={onEnterVehicle}
        onExit={onExitVehicle}
        onUpdate={onVehicleUpdate}
      />

      <ThirdPersonCamera
        playerRef={playerRef}
        vehicleRef={vehicleRef}
        driving={driving}
        locked={locked}
        yawRef={yawRef}
        pitchRef={pitchRef}
      />
    </>
  );
}

export default function App() {
  const [started, setStarted] = useState(false);
  const [locked, setLocked] = useState(false);
  const [driving, setDriving] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);
  const [economy, setEconomy] = useEconomy();
  const [economyNotice, setEconomyNotice] = useState(null);

  const [info, setInfo] = useState({
    speed: 0,
    sprinting: false,
    grounded: true,
    position: CITY.spawn,
    input: { w: false, a: false, s: false, d: false },
  });

  const [vehicleInfo, setVehicleInfo] = useState({
    speed: 0,
    gear: "P",
    nearVehicle: true,
    handbrake: false,
    input: { w: false, a: false, s: false, d: false },
  });

  const [mission, setMission] = useState(idleMission);
  const missionRunRef = useRef(0);
  const rewardedRunsRef = useRef(new Set());

  const playerRef = useRef(null);
  const vehicleRef = useRef(null);
  const yawRef = useRef(0);
  const pitchRef = useRef(-0.16);

  useEffect(() => {
    if (!economyNotice) return undefined;
    const id = window.setTimeout(() => setEconomyNotice(null), 4200);
    return () => window.clearTimeout(id);
  }, [economyNotice]);

  useEffect(() => {
    const onPointerLock = () => {
      setLocked(document.pointerLockElement === document.body);
    };

    const onKeyDown = (event) => {
      if (event.code === "Escape") {
        document.exitPointerLock?.();
      }
    };

    document.addEventListener("pointerlockchange", onPointerLock);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerlockchange", onPointerLock);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const takeControl = useCallback(() => {
    document.body.requestPointerLock?.();
  }, []);

  const enterCity = useCallback(() => {
    setControlsOpen(false);
    setStarted(true);
    setDriving(false);
    setMission(idleMission());
    missionRunRef.current += 1;
    yawRef.current = 0;
    pitchRef.current = -0.16;
  }, []);

  const enterVehicle = useCallback(() => {
    setDriving(true);
    yawRef.current = vehicleRef.current?.rotation.y ?? 0;
    pitchRef.current = -0.14;
  }, []);

  const exitVehicle = useCallback(() => {
    setDriving(false);
    pitchRef.current = -0.16;
  }, []);

  const exitCity = useCallback(() => {
    document.exitPointerLock?.();
    setLocked(false);
    setDriving(false);
    setMission(idleMission());
    setStarted(false);
  }, []);

  const handlePlayerUpdate = useCallback((next) => {
    setInfo(next);
  }, []);

  const handleVehicleUpdate = useCallback((next) => {
    setVehicleInfo(next);
  }, []);


  const startMission = useCallback((id) => {
    const selected = getMission(id);
    if (!selected || !locked) return;
    if (!driving && !vehicleInfo.nearVehicle) return;

    const vehicle = vehicleRef.current;
    const runId = missionRunRef.current + 1;
    missionRunRef.current = runId;

    setControlsOpen(false);
    setMission({
      id: selected.id,
      runId,
      status: "active",
      checkpoint: 0,
      total: selected.checkpoints.length,
      timeLeft: selected.duration,
      reward: selected.reward,
      payoutCredited: 0,
      title: selected.name,
      message: "Drive to the first checkpoint.",
    });

    if (vehicle && !driving) {
      yawRef.current = vehicle.rotation.y;
      pitchRef.current = -0.14;
      setDriving(true);
    }
  }, [driving, locked, vehicleInfo.nearVehicle]);

  const abortMission = useCallback(() => setMission(idleMission()), []);

  const onMissionUpdate = useCallback((next) => {
    setMission((previous) => ({ ...previous, ...next }));
  }, []);

  const onMissionFinish = useCallback((result) => {
    const shouldReward =
      result.status === "success" &&
      mission.status === "active" &&
      result.runId === mission.runId &&
      !rewardedRunsRef.current.has(result.runId);

    if (shouldReward) {
      rewardedRunsRef.current.add(result.runId);
      setEconomy((previous) => addMissionReward(previous, result.reward));
      setEconomyNotice({
        amount: result.reward,
        title: result.title,
        message: "Mission payout credited to your wallet.",
      });
    }

    setMission((previous) => ({
      ...previous,
      ...result,
      payoutCredited: shouldReward ? result.reward : previous.payoutCredited,
    }));
  }, [mission.runId, mission.status, setEconomy]);

  if (started) {
    return (
      <div
        className="game"
        onPointerDown={() => {
          if (!locked) takeControl();
        }}
      >
        <Canvas
          shadows
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            powerPreference: "high-performance",
          }}
        >
          <Scene
            playerRef={playerRef}
            vehicleRef={vehicleRef}
            yawRef={yawRef}
            pitchRef={pitchRef}
            locked={locked}
            driving={driving}
            onPlayerUpdate={handlePlayerUpdate}
            onVehicleUpdate={handleVehicleUpdate}
            onEnterVehicle={enterVehicle}
            onExitVehicle={exitVehicle}
            mission={mission}
            onMissionUpdate={onMissionUpdate}
            onMissionFinish={onMissionFinish}
          />
        </Canvas>

        <GameHUD
          city={CITY}
          economy={economy}
          economyNotice={economyNotice}
          info={info}
          vehicleInfo={vehicleInfo}
          driving={driving}
          locked={locked}
          onTakeControl={takeControl}
          onExit={exitCity}
          missions={MISSION_LIST}
          mission={mission}
          canStartMission={locked && (driving || vehicleInfo.nearVehicle)}
          onStartMission={startMission}
          onAbortMission={abortMission}
        />
      </div>
    );
  }

  return (
    <>
      <MainMenu
        onEnter={enterCity}
        economy={economy}
        onControls={() => setControlsOpen(true)}
      />

      {controlsOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setControlsOpen(false)}
        >
          <section
            className="settings-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="settings-head">
              <div>
                <span className="eyebrow">PHASE 7</span>
                <h2>CONTROLS</h2>
              </div>
              <button
                className="modal-close"
                onClick={() => setControlsOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="settings-grid">
              <div><b>W A S D</b><span>Move / drive</span></div>
              <div><b>SHIFT</b><span>Sprint on foot</span></div>
              <div><b>SPACE</b><span>Jump / handbrake</span></div>
              <div><b>E</b><span>Enter / exit vehicle</span></div>
              <div><b>MOUSE</b><span>Rotate camera</span></div>
              <div><b>ESC</b><span>Release mouse control</span></div>
            </div>

            <div className="settings-economy">
              <div><span>WALLET</span><strong>₹{formatRupees(economy.cash)}</strong></div>
              <div><span>TOTAL EARNED</span><strong>₹{formatRupees(economy.totalEarned)}</strong></div>
              <div><span>MISSIONS PAID</span><strong>{economy.missionsCompleted}</strong></div>
            </div>

            <button className="primary settings-play" onClick={enterCity}>
              ENTER CHANDIGARH <b>→</b>
            </button>
          </section>
        </div>
      )}
    </>
  );
}
