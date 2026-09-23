import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";

const WORLD_BOUNDS = 28;
const PLAYER = {
  radius: 0.45,
  walkSpeed: 5,
  sprintSpeed: 8.5,
  jumpSpeed: 8,
  gravity: -22,
  acceleration: 28,
  deceleration: 20,
};

const OBSTACLES = [
  { x: -11, z: -9, w: 8, d: 7, h: 4.4, color: "#1a2440", label: "block-a" },
  { x: 10, z: -10, w: 10, d: 6, h: 5.2, color: "#202b4b", label: "block-b" },
  { x: -12, z: 10, w: 7, d: 8, h: 3.8, color: "#202941", label: "block-c" },
  { x: 11, z: 10, w: 8, d: 7, h: 4.8, color: "#1b2744", label: "block-d" },
  { x: 0, z: -19, w: 18, d: 2.5, h: 2.2, color: "#17223a", label: "wall-north" },
  { x: 0, z: 19, w: 18, d: 2.5, h: 2.2, color: "#17223a", label: "wall-south" },
];

const START_POSITION = [0, 0, 15];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function resolvePlayerPosition(x, z) {
  let px = clamp(x, -WORLD_BOUNDS + PLAYER.radius, WORLD_BOUNDS - PLAYER.radius);
  let pz = clamp(z, -WORLD_BOUNDS + PLAYER.radius, WORLD_BOUNDS - PLAYER.radius);

  for (let pass = 0; pass < 3; pass += 1) {
    for (const box of OBSTACLES) {
      const minX = box.x - box.w / 2;
      const maxX = box.x + box.w / 2;
      const minZ = box.z - box.d / 2;
      const maxZ = box.z + box.d / 2;
      const nearestX = clamp(px, minX, maxX);
      const nearestZ = clamp(pz, minZ, maxZ);
      const dx = px - nearestX;
      const dz = pz - nearestZ;
      const distanceSq = dx * dx + dz * dz;

      if (distanceSq >= PLAYER.radius * PLAYER.radius) continue;

      if (distanceSq > 0.000001) {
        const distance = Math.sqrt(distanceSq);
        const push = PLAYER.radius - distance;
        px += (dx / distance) * push;
        pz += (dz / distance) * push;
      } else {
        const pushLeft = Math.abs(px - minX);
        const pushRight = Math.abs(maxX - px);
        const pushTop = Math.abs(pz - minZ);
        const pushBottom = Math.abs(maxZ - pz);
        const smallest = Math.min(pushLeft, pushRight, pushTop, pushBottom);
        if (smallest === pushLeft) px = minX - PLAYER.radius;
        else if (smallest === pushRight) px = maxX + PLAYER.radius;
        else if (smallest === pushTop) pz = minZ - PLAYER.radius;
        else pz = maxZ + PLAYER.radius;
      }

      px = clamp(px, -WORLD_BOUNDS + PLAYER.radius, WORLD_BOUNDS - PLAYER.radius);
      pz = clamp(pz, -WORLD_BOUNDS + PLAYER.radius, WORLD_BOUNDS - PLAYER.radius);
    }
  }

  return { x: px, z: pz };
}

function Building({ box }) {
  return (
    <group position={[box.x, box.h / 2, box.z]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[box.w, box.h, box.d]} />
        <meshStandardMaterial color={box.color} roughness={0.82} metalness={0.12} />
      </mesh>
      <mesh position={[0, 0.2, box.d / 2 + 0.02]} receiveShadow>
        <boxGeometry args={[Math.min(box.w * 0.78, 6), Math.min(1.1, box.h * 0.23), 0.04]} />
        <meshStandardMaterial color="#111827" emissive="#111827" emissiveIntensity={0.15} />
      </mesh>
    </group>
  );
}

function Tree({ x, z, scale = 1 }) {
  return (
    <group position={[x, 0, z]} scale={scale}>
      <mesh position={[0, 1.35, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.19, 2.7, 8]} />
        <meshStandardMaterial color="#4b3428" roughness={1} />
      </mesh>
      <mesh position={[0, 3, 0]} castShadow>
        <icosahedronGeometry args={[1.05, 1]} />
        <meshStandardMaterial color="#244e3a" roughness={0.94} />
      </mesh>
    </group>
  );
}

function StreetLight({ x, z, flip = false }) {
  return (
    <group position={[x, 0, z]} rotation-y={flip ? Math.PI : 0}>
      <mesh position={[0, 1.9, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.07, 3.8, 8]} />
        <meshStandardMaterial color="#46516a" metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh position={[0.42, 3.68, 0]}>
        <boxGeometry args={[0.85, 0.07, 0.07]} />
        <meshStandardMaterial color="#64748b" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0.82, 3.61, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color="#e0e7ff" emissive="#a5b4fc" emissiveIntensity={2.5} />
      </mesh>
    </group>
  );
}

function World() {
  const trees = [
    [-23, -22, 1.2], [-19, -4, 0.9], [-22, 18, 1.15], [-3, 23, 1.1],
    [22, 22, 1.15], [22, -2, 0.95], [20, -22, 1.2], [3, -23, 1.05],
    [-25, 6, 0.8], [25, 8, 0.85],
  ];

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[WORLD_BOUNDS * 2, WORLD_BOUNDS * 2]} />
        <meshStandardMaterial color="#0b1220" roughness={1} />
      </mesh>
      <mesh position={[0, 0.012, 0]} receiveShadow>
        <boxGeometry args={[WORLD_BOUNDS * 2, 0.025, 4.8]} />
        <meshStandardMaterial color="#151e31" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.013, 0]} receiveShadow>
        <boxGeometry args={[4.8, 0.026, WORLD_BOUNDS * 2]} />
        <meshStandardMaterial color="#151e31" roughness={0.95} />
      </mesh>

      {[-2.25, 2.25].map((x) => (
        <mesh key={`x-${x}`} position={[x, 0.028, 0]} receiveShadow>
          <boxGeometry args={[0.07, 0.02, WORLD_BOUNDS * 2]} />
          <meshStandardMaterial color="#cbd5e1" emissive="#94a3b8" emissiveIntensity={0.08} />
        </mesh>
      ))}
      {[-2.25, 2.25].map((z) => (
        <mesh key={`z-${z}`} position={[0, 0.028, z]} receiveShadow>
          <boxGeometry args={[WORLD_BOUNDS * 2, 0.02, 0.07]} />
          <meshStandardMaterial color="#cbd5e1" emissive="#94a3b8" emissiveIntensity={0.08} />
        </mesh>
      ))}

      <gridHelper args={[WORLD_BOUNDS * 2, 56, "#334155", "#182235"] />
      {OBSTACLES.map((box) => <Building key={box.label} box={box} />)}
      {trees.map(([x, z, scale], index) => <Tree key={index} x={x} z={z} scale={scale} />)}

      <StreetLight x={-6} z={-3} />
      <StreetLight x={6} z={3} flip />
      <StreetLight x={-6} z={3} />
      <StreetLight x={6} z={-3} flip />

      <mesh position={[0, 0.08, 15]} receiveShadow>
        <cylinderGeometry args={[2.25, 2.25, 0.14, 48]} />
        <meshStandardMaterial color="#182541" metalness={0.25} roughness={0.65} />
      </mesh>
      <mesh position={[0, 0.15, 15]} receiveShadow>
        <torusGeometry args={[2.15, 0.05, 10, 48]} />
        <meshStandardMaterial color="#6366f1" emissive="#4f46e5" emissiveIntensity={0.7} metalness={0.55} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Player({ playerRef, yawRef, pitchRef, locked, onUpdate }) {
  const keysRef = useRef(new Set());
  const jumpQueuedRef = useRef(false);
  const velocityRef = useRef(new THREE.Vector3());
  const groundedRef = useRef(true);
  const groupRef = useRef();
  const visualRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const leftLegRef = useRef();
  const rightLegRef = useRef();
  const lastHudUpdateRef = useRef(0);

  useEffect(() => {
    const down = (event) => {
      keysRef.current.add(event.code);
      if (event.code === "Space") jumpQueuedRef.current = true;
      if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)) {
        event.preventDefault();
      }
    };
    const up = (event) => keysRef.current.delete(event.code);

    window.addEventListener("keydown", down, { passive: false });
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useEffect(() => {
    const onMouseMove = (event) => {
      if (!locked) return;
      yawRef.current -= event.movementX * 0.0026;
      pitchRef.current = THREE.MathUtils.clamp(
        pitchRef.current - event.movementY * 0.002,
        -0.72,
        0.34,
      );
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [locked, pitchRef, yawRef]);

  useEffect(() => {
    playerRef.current = groupRef.current;
    if (groupRef.current) groupRef.current.position.set(...START_POSITION);
    return () => {
      if (playerRef.current === groupRef.current) playerRef.current = null;
    };
  }, [playerRef]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.04);
    const keys = keysRef.current;
    const velocity = velocityRef.current;
    const group = groupRef.current;
    if (!group) return;

    const inputX = (keys.has("KeyD") ? 1 : 0) - (keys.has("KeyA") ? 1 : 0);
    const inputZ = (keys.has("KeyS") ? 1 : 0) - (keys.has("KeyW") ? 1 : 0);
    const input = new THREE.Vector2(inputX, inputZ);
    if (input.lengthSq() > 1) input.normalize();

    const yaw = yawRef.current;
    const forward = new THREE.Vector3(Math.sin(yaw), 0, -Math.cos(yaw));
    const right = new THREE.Vector3(Math.cos(yaw), 0, Math.sin(yaw));
    const move = new THREE.Vector3()
      .addScaledVector(right, input.x)
      .addScaledVector(forward, -input.y);

    if (move.lengthSq() > 0) move.normalize();

    const sprinting = keys.has("ShiftLeft") || keys.has("ShiftRight");
    const targetSpeed = sprinting ? PLAYER.sprintSpeed : PLAYER.walkSpeed;
    const targetX = move.x * targetSpeed;
    const targetZ = move.z * targetSpeed;
    const horizontal = new THREE.Vector2(velocity.x, velocity.z);
    const response = move.lengthSq() > 0 ? PLAYER.acceleration : PLAYER.deceleration;
    const blend = 1 - Math.exp(-response * dt);

    horizontal.x = THREE.MathUtils.lerp(horizontal.x, targetX, blend);
    horizontal.y = THREE.MathUtils.lerp(horizontal.y, targetZ, blend);
    velocity.x = horizontal.x;
    velocity.z = horizontal.y;

    if (jumpQueuedRef.current) {
      if (groundedRef.current) {
        velocity.y = PLAYER.jumpSpeed;
        groundedRef.current = false;
      }
      jumpQueuedRef.current = false;
    }

    velocity.y += PLAYER.gravity * dt;
    group.position.y += velocity.y * dt;
    if (group.position.y <= 0) {
      group.position.y = 0;
      velocity.y = 0;
      groundedRef.current = true;
    }

    const next = resolvePlayerPosition(
      group.position.x + velocity.x * dt,
      group.position.z + velocity.z * dt,
    );
    group.position.x = next.x;
    group.position.z = next.z;

    const moving = horizontal.lengthSq() > 0.18;
    const speed = horizontal.length();
    const bob = moving ? Math.sin(state.clock.elapsedTime * (sprinting ? 13 : 9)) * 0.055 : 0;
    if (visualRef.current) {
      visualRef.current.position.y = bob;
      if (move.lengthSq() > 0) {
        const facing = Math.atan2(move.x, -move.z);
        visualRef.current.rotation.y = THREE.MathUtils.lerp(
          visualRef.current.rotation.y,
          facing,
          1 - Math.exp(-14 * dt),
        );
      }
    }

    const armSwing = moving ? Math.sin(state.clock.elapsedTime * (sprinting ? 14 : 10)) * 0.5 : 0;
    if (leftArmRef.current) leftArmRef.current.rotation.x = armSwing;
    if (rightArmRef.current) rightArmRef.current.rotation.x = -armSwing;
    if (leftLegRef.current) leftLegRef.current.rotation.x = -armSwing * 0.75;
    if (rightLegRef.current) rightLegRef.current.rotation.x = armSwing * 0.75;

    if (state.clock.elapsedTime - lastHudUpdateRef.current > 0.08) {
      lastHudUpdateRef.current = state.clock.elapsedTime;
      onUpdate?.({
        speed,
        sprinting,
        grounded: groundedRef.current,
        position: [group.position.x, group.position.y, group.position.z],
      });
    }
  });

  return (
    <group ref={groupRef} position={START_POSITION}>
      <group ref={visualRef}>
        <mesh position={[0, 1.15, 0]} castShadow>
          <capsuleGeometry args={[0.42, 0.9, 8, 16]} />
          <meshStandardMaterial color="#6366f1" metalness={0.25} roughness={0.42} />
        </mesh>
        <mesh position={[0, 2.18, 0]} castShadow>
          <sphereGeometry args={[0.38, 16, 16]} />
          <meshStandardMaterial color="#d8b08b" roughness={0.85} />
        </mesh>
        <mesh position={[0, 2.31, -0.02]} castShadow>
          <sphereGeometry args={[0.39, 16, 12]} />
          <meshStandardMaterial color="#182033" roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.43, -0.43]} castShadow>
          <boxGeometry args={[0.48, 0.15, 0.025]} />
          <meshStandardMaterial color="#0b1020" emissive="#6366f1" emissiveIntensity={1.2} />
        </mesh>
        <mesh ref={leftArmRef} position={[-0.55, 1.15, 0]} castShadow>
          <capsuleGeometry args={[0.12, 0.65, 6, 10]} />
          <meshStandardMaterial color="#4f46e5" roughness={0.5} />
        </mesh>
        <mesh ref={rightArmRef} position={[0.55, 1.15, 0]} castShadow>
          <capsuleGeometry args={[0.12, 0.65, 6, 10]} />
          <meshStandardMaterial color="#4f46e5" roughness={0.5} />
        </mesh>
        <mesh ref={leftLegRef} position={[-0.2, 0.43, 0]} castShadow>
          <capsuleGeometry args={[0.14, 0.55, 6, 10]} />
          <meshStandardMaterial color="#111827" roughness={0.78} />
        </mesh>
        <mesh ref={rightLegRef} position={[0.2, 0.43, 0]} castShadow>
          <capsuleGeometry args={[0.14, 0.55, 6, 10]} />
          <meshStandardMaterial color="#111827" roughness={0.78} />
        </mesh>
      </group>
      <pointLight position={[0, 1.65, 0]} color="#6366f1" intensity={0.6} distance={4} decay={2} />
    </group>
  );
}

function ThirdPersonCamera({ playerRef, yawRef, pitchRef }) {
  const { camera } = useThree();
  const desired = useRef(new THREE.Vector3());
  const target = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const player = playerRef.current;
    if (!player) return;

    const yaw = yawRef.current;
    const pitch = pitchRef.current;
    const distance = 7.4;
    const horizontal = Math.cos(pitch) * distance;

    target.current.set(player.position.x, player.position.y + 1.65, player.position.z);
    desired.current.set(
      target.current.x - Math.sin(yaw) * horizontal,
      target.current.y + 0.6 + Math.sin(pitch) * distance,
      target.current.z + Math.cos(yaw) * horizontal,
    );

    const follow = 1 - Math.exp(-10 * Math.min(delta, 0.04));
    camera.position.lerp(desired.current, follow);
    camera.lookAt(target.current.x, target.current.y + 0.15, target.current.z);
  });

  return null;
}

function GameScene({ playerRef, yawRef, pitchRef, locked, onUpdate }) {
  return (
    <>
      <PerspectiveCamera makeDefault fov={58} near={0.1} far={180} />
      <color attach="background" args={["#050810"]} />
      <fog attach="fog" args={["#050810", 35, 115]} />
      <ambientLight intensity={1.15} />
      <hemisphereLight intensity={0.55} groundColor="#0f172a" color="#818cf8" />
      <directionalLight
        castShadow
        position={[18, 30, 8]}
        intensity={2.2}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-35}
        shadow-camera-right={35}
        shadow-camera-top={35}
        shadow-camera-bottom={-35}
      />
      <World />
      <Player
        playerRef={playerRef}
        yawRef={yawRef}
        pitchRef={pitchRef}
        locked={locked}
        onUpdate={onUpdate}
      />
      <ThirdPersonCamera playerRef={playerRef} yawRef={yawRef} pitchRef={pitchRef} />
    </>
  );
}

function GameHUD({ info, locked, onTakeControl, onExit }) {
  const kmh = Math.round((info?.speed ?? 0) * 3.6);

  return (
    <div className="game-ui">
      <div className="game-topbar">
        <div className="game-brand">
          <span className="game-brand-mark">CR</span>
          <div>
            <strong>CITY RUSH</strong>
            <span>TRAINING DISTRICT</span>
          </div>
        </div>
        <div className="game-phase">PHASE 2 <span>PLAYER / CAMERA</span></div>
        <button className="game-exit" onClick={onExit}>EXIT CITY <span>Esc</span></button>
      </div>

      <div className="game-bottom">
        <div className="telemetry">
          <div className="telemetry-main"><strong>{kmh}</strong><span>KM/H</span></div>
          <div className="telemetry-divider" />
          <div><span>STATE</span><strong>{info?.sprinting ? "SPRINT" : "RUN"}</strong></div>
          <div><span>GROUND</span><strong>{info?.grounded ? "YES" : "AIR"}</strong></div>
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
            <span className="overlay-kicker">CITY RUSH • PHASE 2</span>
            <h2>TAKE CONTROL</h2>
            <p>Third-person movement, camera rotation, sprint and jump are ready.</p>
            <button className="primary overlay-button" onClick={onTakeControl}>
              CLICK TO PLAY <b>→</b>
            </button>
            <small>Press ESC anytime to release the mouse.</small>
          </div>
        </div>
      )}

      <div className="crosshair" aria-hidden="true">
        <span /><span /><span /><span />
      </div>
    </div>
  );
}

export default function App() {
  const [started, setStarted] = useState(false);
  const [locked, setLocked] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [info, setInfo] = useState({
    speed: 0,
    sprinting: false,
    grounded: true,
    position: START_POSITION,
  });

  const playerRef = useRef(null);
  const yawRef = useRef(0);
  const pitchRef = useRef(-0.18);

  useEffect(() => {
    const handleLock = () => setLocked(document.pointerLockElement === document.body);
    document.addEventListener("pointerlockchange", handleLock);
    return () => document.removeEventListener("pointerlockchange", handleLock);
  }, []);

  const enterCity = useCallback(() => {
    setSettingsOpen(false);
    setStarted(true);
    yawRef.current = 0;
    pitchRef.current = -0.18;
  }, []);

  const exitCity = useCallback(() => {
    document.exitPointerLock?.();
    setLocked(false);
    setStarted(false);
  }, []);

  const takeControl = useCallback(() => {
    document.body.requestPointerLock?.();
  }, []);

  const handleUpdate = useCallback((next) => setInfo(next), []);

  if (started) {
    return (
      <div className="game">
        <Canvas
          shadows
          dpr={[1, 1.5]}
          gl={{ antialias: true, powerPreference: "high-performance" }}
          onPointerDown={() => {
            if (!locked) takeControl();
          }}
        >
          <GameScene
            playerRef={playerRef}
            yawRef={yawRef}
            pitchRef={pitchRef}
            locked={locked}
            onUpdate={handleUpdate}
          />
        </Canvas>
        <GameHUD info={info} locked={locked} onTakeControl={takeControl} onExit={exitCity} />
      </div>
    );
  }

  return (
    <main className="menu">
      <div className="glow glowA" />
      <div className="glow glowB" />
      <nav>
        <div className="brand"><span className="brandMark">CR</span><span>CITY RUSH</span></div>
        <span className="status"><i /> ONLINE FOUNDATION</span>
      </nav>

      <section className="hero">
        <p className="eyebrow">3D OPEN-WORLD DRIVING</p>
        <h1>YOUR CITY.<br /><em>YOUR RIDE.</em><br />YOUR RUN.</h1>
        <p className="lead">
          A living road is waiting. Build your reputation, master the streets and become the name everyone knows.
          Phase 2 adds the first true player-controlled third-person experience.
        </p>
        <div className="actions">
          <button className="primary" onClick={enterCity}>ENTER CITY <b>→</b></button>
          <button className="secondary" onClick={() => setSettingsOpen(true)}>CONTROLS</button>
        </div>
        <div className="stats">
          <div><strong>04</strong><span>CITIES PLANNED</span></div>
          <div><strong>3D</strong><span>REAL-TIME WORLD</span></div>
          <div><strong>P2</strong><span>PLAYER SYSTEM ONLINE</span></div>
        </div>
      </section>

      <footer>
        <span>CHANDIGARH • REWARI • GURUGRAM • DELHI</span>
        <span>v0.2 PHASE 2</span>
      </footer>

      {settingsOpen && (
        <div className="modal-backdrop" onClick={() => setSettingsOpen(false)}>
          <section className="settings-panel" onClick={(event) => event.stopPropagation()}>
            <div className="settings-head">
              <div>
                <span className="eyebrow">PLAYER SYSTEM</span>
                <h2>CONTROLS</h2>
              </div>
              <button className="modal-close" onClick={() => setSettingsOpen(false)}>×</button>
            </div>
            <div className="settings-grid">
              <div><b>W A S D</b><span>Move around the district</span></div>
              <div><b>SHIFT</b><span>Sprint faster</span></div>
              <div><b>SPACE</b><span>Jump</span></div>
              <div><b>MOUSE</b><span>Rotate the third-person camera</span></div>
              <div><b>ESC</b><span>Release mouse control</span></div>
              <div><b>COLLISION</b><span>Buildings and boundaries block the player</span></div>
            </div>
            <button className="primary settings-play" onClick={enterCity}>
              ENTER TRAINING DISTRICT <b>→</b>
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
