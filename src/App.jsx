import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { useCallback, useEffect, useRef, useState } from "react";

import ChandigarhWorld from "./game/world/ChandigarhWorld";
import TrafficWorld from "./game/world/TrafficWorld";
import { CITY } from "./game/city/chandigarh";
import { MISSION_LIST, getMission } from "./game/missions/missionData";
import PlayerController from "./game/player/PlayerController";
import VehicleController from "./game/vehicles/VehicleController";
import ThirdPersonCamera from "./game/camera/ThirdPersonCamera";
import GameHUD from "./ui/GameHUD";
import MainMenu from "./ui/MainMenu";
import MissionSystem from "./game/missions/MissionSystem";

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
        onEnter={onEnterVehicle}
        onExit={onExitVehicle}
        onUpdate={onVehicleUpdate}
      />

      <ThirdPersonCamera
        playerRef={playerRef}
        vehicleRef={vehicleRef}
        driving={driving}
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

  const [mission, setMission] = useState({
    id: null,
    status: "idle",
    checkpoint: 0,
    total: 0,
    timeLeft: 0,
    reward: 0,
    title: "",
    message: "Choose a mission from the Mission Board.",
  });

  const playerRef = useRef(null);
  const vehicleRef = useRef(null);
  const yawRef = useRef(0);
  const pitchRef = useRef(-0.16);

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
    if (!selected) return;
    if (!driving && !vehicleInfo.nearVehicle) return;

    setControlsOpen(false);
    setMission({
      id: selected.id,
      status: "active",
      checkpoint: 0,
      total: selected.checkpoints.length,
      timeLeft: selected.duration,
      reward: selected.reward,
      title: selected.name,
      message: "Drive to the first checkpoint.",
    });

    const vehicle = vehicleRef.current;
    if (vehicle && !driving) {
      yawRef.current = vehicle.rotation.y;
      pitchRef.current = -0.14;
      setDriving(true);
    }
  }, [driving, vehicleInfo.nearVehicle]);

  const abortMission = useCallback(() => {
    setMission({
      id: null,
      status: "idle",
      checkpoint: 0,
      total: 0,
      timeLeft: 0,
      reward: 0,
      title: "",
      message: "Choose a mission from the Mission Board.",
    });
  }, []);

  const onMissionUpdate = useCallback((next) => {
    setMission((previous) => ({ ...previous, ...next }));
  }, []);

  const onMissionFinish = useCallback((result) => {
    setMission((previous) => ({ ...previous, ...result }));
  }, []);

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
          info={info}
          vehicleInfo={vehicleInfo}
          driving={driving}
          locked={locked}
          onTakeControl={takeControl}
          onExit={exitCity}
          missions={MISSION_LIST}
          mission={mission}
          canStartMission={driving || vehicleInfo.nearVehicle}
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
                <span className="eyebrow">PHASE 6</span>
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

            <button className="primary settings-play" onClick={enterCity}>
              ENTER CHANDIGARH <b>→</b>
            </button>
          </section>
        </div>
      )}
    </>
  );
}
