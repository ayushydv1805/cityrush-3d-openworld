import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";

import ChandigarhWorld from "./game/world/ChandigarhWorld";
import { CITY } from "./game/city/chandigarh";
import PlayerController from "./game/player/PlayerController";
import ThirdPersonCamera from "./game/camera/ThirdPersonCamera";
import GameHUD from "./ui/GameHUD";
import MainMenu from "./ui/MainMenu";

function Scene({ playerRef, yawRef, pitchRef, locked, onUpdate }) {
  return (
    <>
      <PerspectiveCamera makeDefault fov={58} near={0.1} far={260} />
      <color attach="background" args={["#050810"]} />
      <fog attach="fog" args={["#050810", 52, 190]} />

      <ambientLight intensity={1.05} />
      <hemisphereLight
        intensity={0.62}
        groundColor="#102016"
        color="#818cf8"
      />
      <directionalLight
        castShadow
        position={[35, 48, 18]}
        intensity={2.5}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-70}
        shadow-camera-right={70}
        shadow-camera-top={70}
        shadow-camera-bottom={-70}
      />

      <ChandigarhWorld />

      <PlayerController
        city={CITY}
        playerRef={playerRef}
        yawRef={yawRef}
        pitchRef={pitchRef}
        locked={locked}
        onUpdate={onUpdate}
      />

      <ThirdPersonCamera
        playerRef={playerRef}
        yawRef={yawRef}
        pitchRef={pitchRef}
      />
    </>
  );
}

export default function App() {
  const [started, setStarted] = useState(false);
  const [locked, setLocked] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);
  const [info, setInfo] = useState({
    speed: 0,
    sprinting: false,
    grounded: true,
    position: CITY.spawn,
    input: { w: false, a: false, s: false, d: false },
  });

  const playerRef = useRef(null);
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
    yawRef.current = 0;
    pitchRef.current = -0.16;
  }, []);

  const exitCity = useCallback(() => {
    document.exitPointerLock?.();
    setLocked(false);
    setStarted(false);
  }, []);

  const handleUpdate = useCallback((next) => {
    setInfo(next);
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
            yawRef={yawRef}
            pitchRef={pitchRef}
            locked={locked}
            onUpdate={handleUpdate}
          />
        </Canvas>

        <GameHUD
          city={CITY}
          info={info}
          locked={locked}
          onTakeControl={takeControl}
          onExit={exitCity}
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
                <span className="eyebrow">PHASE 3</span>
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
              <div><b>W A S D</b><span>Move in the city</span></div>
              <div><b>SHIFT</b><span>Sprint</span></div>
              <div><b>SPACE</b><span>Jump</span></div>
              <div><b>MOUSE</b><span>Rotate camera</span></div>
              <div><b>ESC</b><span>Release mouse control</span></div>
              <div><b>CITY</b><span>Chandigarh sector grid</span></div>
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
