import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import ChandigarhWorld from "./game/world/ChandigarhWorld";
import TrafficWorld from "./game/world/TrafficWorld";
import { CITY } from "./game/city/chandigarh";
import { MISSION_LIST, getMission } from "./game/missions/missionData";
import { addMissionReward, formatRupees, spendCash } from "./game/economy/economyData";
import { buyUpgrade, getEffectiveVehicleStats, getNextUpgrade } from "./game/garage/garageData";
import {
  addMissionReputation,
  getCurrentRank,
  getPayoutMultiplier,
  resetMissionStreak,
} from "./game/reputation/reputationData";
import useEconomy from "./game/economy/useEconomy";
import useGarage from "./game/garage/useGarage";
import useReputation from "./game/reputation/useReputation";
import PlayerController from "./game/player/PlayerController";
import VehicleController from "./game/vehicles/VehicleController";
import ThirdPersonCamera from "./game/camera/ThirdPersonCamera";
import GameHUD from "./ui/GameHUD";
import MainMenu from "./ui/MainMenu";
import GaragePanel from "./ui/GaragePanel";
import ReputationPanel from "./ui/ReputationPanel";
import MissionSystem from "./game/missions/MissionSystem";

const idleMission = () => ({
  id: null,
  runId: 0,
  status: "idle",
  checkpoint: 0,
  total: 0,
  timeLeft: 0,
  reward: 0,
  baseReward: 0,
  payoutMultiplier: 1,
  payoutCredited: 0,
  reputationCredited: 0,
  title: "",
  message: "Choose a mission from the Mission Board.",
});

function Scene({
  playerRef,
  vehicleRef,
  yawRef,
  pitchRef,
  locked,
  driving,
  vehicleStats,
  garageTier,
  missionReward,
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
      <hemisphereLight intensity={1.0} groundColor="#64715d" color="#cfe2ff" />
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
        missionReward={missionReward}
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
        vehicleStats={vehicleStats}
        garageTier={garageTier}
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
  const [garageOpen, setGarageOpen] = useState(false);
  const [reputationOpen, setReputationOpen] = useState(false);
  const [garageNotice, setGarageNotice] = useState(null);
  const [reputationNotice, setReputationNotice] = useState(null);
  const [economy, setEconomy] = useEconomy();
  const [garage, setGarage] = useGarage();
  const [reputation, setReputation] = useReputation();
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
  const purchaseLockRef = useRef(false);

  const playerRef = useRef(null);
  const vehicleRef = useRef(null);
  const yawRef = useRef(0);
  const pitchRef = useRef(-0.16);

  const vehicleStats = useMemo(() => getEffectiveVehicleStats(garage), [garage]);

  useEffect(() => {
    if (!economyNotice) return undefined;
    const id = window.setTimeout(() => setEconomyNotice(null), 4200);
    return () => window.clearTimeout(id);
  }, [economyNotice]);

  useEffect(() => {
    if (!garageNotice) return undefined;
    const id = window.setTimeout(() => setGarageNotice(null), 3000);
    return () => window.clearTimeout(id);
  }, [garageNotice]);

  useEffect(() => {
    if (!reputationNotice) return undefined;
    const id = window.setTimeout(() => setReputationNotice(null), 4600);
    return () => window.clearTimeout(id);
  }, [reputationNotice]);

  useEffect(() => {
    const onPointerLock = () => setLocked(document.pointerLockElement === document.body);

    const onKeyDown = (event) => {
      if (event.code === "Escape") document.exitPointerLock?.();
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
    setGarageOpen(false);
    setReputationOpen(false);
    setGarageNotice(null);
    setReputationNotice(null);
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

  const handlePlayerUpdate = useCallback((next) => setInfo(next), []);
  const handleVehicleUpdate = useCallback((next) => setVehicleInfo(next), []);

  const startMission = useCallback((id) => {
    const selected = getMission(id);
    if (!selected || !locked) return;
    if (!driving && !vehicleInfo.nearVehicle) return;

    const vehicle = vehicleRef.current;
    const runId = missionRunRef.current + 1;
    missionRunRef.current = runId;

    const payoutMultiplier = getPayoutMultiplier(reputation.score);
    const missionReward = Math.round(selected.reward * payoutMultiplier);

    setControlsOpen(false);
    setMission({
      id: selected.id,
      runId,
      status: "active",
      checkpoint: 0,
      total: selected.checkpoints.length,
      timeLeft: selected.duration,
      reward: missionReward,
      baseReward: selected.reward,
      payoutMultiplier,
      payoutCredited: 0,
      reputationCredited: 0,
      title: selected.name,
      message: "Drive to the first checkpoint.",
    });

    if (vehicle && !driving) {
      yawRef.current = vehicle.rotation.y;
      pitchRef.current = -0.14;
      setDriving(true);
    }
  }, [driving, locked, reputation.score, vehicleInfo.nearVehicle]);

  const abortMission = useCallback(() => setMission(idleMission()), []);

  const onMissionUpdate = useCallback((next) => {
    setMission((previous) => ({ ...previous, ...next }));
  }, []);

  const onMissionFinish = useCallback((result) => {
    const shouldCredit =
      result.runId === mission.runId &&
      mission.status === "active" &&
      (result.status === "success" || result.status === "failed");

    if (!shouldCredit) return;

    const selected = getMission(mission.id);

    if (result.status === "success") {
      if (rewardedRunsRef.current.has(result.runId)) return;

      rewardedRunsRef.current.add(result.runId);

      const reputationResult = addMissionReputation(reputation, {
        id: mission.id,
        reputation: selected?.reputation ?? 25,
        timeLeft: result.timeLeft,
        duration: selected?.duration ?? mission.total,
      });

      setEconomy((previous) => addMissionReward(previous, result.reward));
      setReputation(reputationResult.reputation);

      setEconomyNotice({
        amount: result.reward,
        title: result.title,
        message: "Mission payout credited to your wallet.",
      });

      if (reputationResult.rankedUp) {
        setReputationNotice({
          score: reputationResult.reputation.score,
          gained: reputationResult.gained.total,
          title: reputationResult.currentRank.name,
          message: `New reputation rank unlocked • +${Math.round(reputationResult.currentRank.payoutBonus * 100)}% future mission payout.`,
        });
      }

      setMission((previous) => ({
        ...previous,
        ...result,
        payoutCredited: result.reward,
        reputationCredited: reputationResult.gained.total,
      }));
      return;
    }

    setReputation((previous) => resetMissionStreak(previous));
    setMission((previous) => ({
      ...previous,
      ...result,
      reputationCredited: 0,
    }));
  }, [mission, reputation, setEconomy, setReputation]);

  const purchaseUpgrade = useCallback((key) => {
    if (purchaseLockRef.current) return;

    const next = getNextUpgrade(key, garage);
    if (!next) return;

    if (next.cost > economy.cash) {
      setGarageNotice({
        type: "error",
        title: "INSUFFICIENT CASH",
        message: `You need ₹${formatRupees(next.cost - economy.cash)} more for the next ${next.label} level.`,
      });
      return;
    }

    purchaseLockRef.current = true;
    setEconomy((previous) => spendCash(previous, next.cost));
    setGarage((previous) => buyUpgrade(key, previous));
    setGarageNotice({
      type: "success",
      title: `${next.label} UPGRADED`,
      message: `Level ${next.nextLevel} installed for ₹${formatRupees(next.cost)}.`,
    });

    window.setTimeout(() => {
      purchaseLockRef.current = false;
    }, 180);
  }, [economy.cash, garage, setEconomy, setGarage]);

  if (started) {
    return (
      <div
        className="game"
        onPointerDown={() => {
          if (!locked) takeControl();
        }}
      >
        <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: true, powerPreference: "high-performance" }}>
          <Scene
            playerRef={playerRef}
            vehicleRef={vehicleRef}
            yawRef={yawRef}
            pitchRef={pitchRef}
            locked={locked}
            driving={driving}
            vehicleStats={vehicleStats}
            garageTier={vehicleStats.garageTier}
            missionReward={mission.reward}
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
          reputation={reputation}
          garage={garage}
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
        garage={garage}
        reputation={reputation}
        onGarage={() => {
          setControlsOpen(false);
          setReputationOpen(false);
          setGarageOpen(true);
        }}
        onReputation={() => {
          setGarageOpen(false);
          setControlsOpen(false);
          setReputationOpen(true);
        }}
        onControls={() => {
          setGarageOpen(false);
          setReputationOpen(false);
          setControlsOpen(true);
        }}
      />

      {controlsOpen && (
        <div className="modal-backdrop" onClick={() => setControlsOpen(false)}>
          <section className="settings-panel" onClick={(event) => event.stopPropagation()}>
            <div className="settings-head">
              <div>
                <span className="eyebrow">PHASE 9</span>
                <h2>CONTROLS</h2>
              </div>
              <button className="modal-close" onClick={() => setControlsOpen(false)}>×</button>
            </div>

            <div className="settings-grid">
              <div><b>W A S D</b><span>Move / drive</span></div>
              <div><b>SHIFT</b><span>Sprint on foot</span></div>
              <div><b>SPACE</b><span>Jump / handbrake</span></div>
              <div><b>E</b><span>Enter / exit vehicle</span></div>
              <div><b>MOUSE</b><span>Rotate camera</span></div>
              <div><b>ESC</b><span>Release mouse control</span></div>
              <div><b>GARAGE</b><span>Buy permanent vehicle upgrades with mission cash</span></div>
              <div><b>REPUTATION</b><span>Complete routes to climb city ranks and unlock payout bonuses</span></div>
              <div><b>SAVE</b><span>Wallet + garage + reputation persist in browser storage</span></div>
            </div>

            <div className="settings-economy">
              <div><span>WALLET</span><strong>₹{formatRupees(economy.cash)}</strong></div>
              <div><span>REP RANK</span><strong>{getCurrentRank(reputation.score).name}</strong></div>
              <div><span>REP SCORE</span><strong>{reputation.score}</strong></div>
            </div>

            <button className="primary settings-play" onClick={enterCity}>
              ENTER CHANDIGARH <b>→</b>
            </button>
          </section>
        </div>
      )}

      {garageOpen && (
        <GaragePanel
          garage={garage}
          economy={economy}
          onClose={() => setGarageOpen(false)}
          onPurchase={purchaseUpgrade}
        />
      )}

      {reputationOpen && (
        <ReputationPanel
          reputation={reputation}
          onClose={() => setReputationOpen(false)}
        />
      )}
    </>
  );
}
