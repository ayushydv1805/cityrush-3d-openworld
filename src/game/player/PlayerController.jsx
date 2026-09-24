import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const PLAYER = {
  radius: 0.48,
  walkSpeed: 5.2,
  sprintSpeed: 9.2,
  jumpSpeed: 8,
  gravity: -22,
  acceleration: 30,
  deceleration: 24,
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function canOccupy(x, z, city) {
  const px = clamp(x, -city.worldBounds + PLAYER.radius, city.worldBounds - PLAYER.radius);
  const pz = clamp(z, -city.worldBounds + PLAYER.radius, city.worldBounds - PLAYER.radius);

  for (const obstacle of city.obstacles) {
    if (obstacle.type === "circle") {
      const dx = px - obstacle.x;
      const dz = pz - obstacle.z;
      if (dx * dx + dz * dz < obstacle.radius * obstacle.radius) return false;
      continue;
    }

    const minX = obstacle.x - obstacle.w / 2 - PLAYER.radius;
    const maxX = obstacle.x + obstacle.w / 2 + PLAYER.radius;
    const minZ = obstacle.z - obstacle.d / 2 - PLAYER.radius;
    const maxZ = obstacle.z + obstacle.d / 2 + PLAYER.radius;

    if (px > minX && px < maxX && pz > minZ && pz < maxZ) return false;
  }

  return true;
}

function normalizeKey(event) {
  const code = (event.code || "").toLowerCase();
  const key = (event.key || "").toLowerCase();

  if (code === "keyw" || key === "w" || code === "arrowup") return "w";
  if (code === "keya" || key === "a" || code === "arrowleft") return "a";
  if (code === "keys" || key === "s" || code === "arrowdown") return "s";
  if (code === "keyd" || key === "d" || code === "arrowright") return "d";
  if (code === "shiftleft" || code === "shiftright" || key === "shift") return "shift";
  if (code === "space" || key === " ") return "space";
  return null;
}

function PlayerModel({ refs, animationRef }) {
  useFrame((state) => {
    const { moving, sprinting } = animationRef.current;
    const swing = moving
      ? Math.sin(state.clock.elapsedTime * (sprinting ? 18 : 12)) * 0.42
      : 0;

    if (refs.leftArm.current) refs.leftArm.current.rotation.x = swing;
    if (refs.rightArm.current) refs.rightArm.current.rotation.x = -swing;
    if (refs.leftLeg.current) refs.leftLeg.current.rotation.x = -swing * 0.72;
    if (refs.rightLeg.current) refs.rightLeg.current.rotation.x = swing * 0.72;
  });

  return (
    <group>
      <mesh position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[0.74, 1.15, 0.44]} />
        <meshStandardMaterial color="#24365b" roughness={0.82} metalness={0.08} />
      </mesh>
      <mesh position={[0, 1.34, -0.25]}>
        <boxGeometry args={[0.46, 0.16, 0.035]} />
        <meshStandardMaterial color="#7b8ef0" emissive="#4f5db0" emissiveIntensity={0.18} />
      </mesh>

      <mesh position={[0, 2.18, 0]} castShadow>
        <sphereGeometry args={[0.37, 24, 18]} />
        <meshStandardMaterial color="#9b6b4f" roughness={0.88} />
      </mesh>
      <mesh position={[0, 2.37, 0]} castShadow>
        <sphereGeometry args={[0.405, 24, 14]} />
        <meshStandardMaterial color="#202329" roughness={0.94} />
      </mesh>
      <mesh position={[0, 2.2, -0.33]}>
        <sphereGeometry args={[0.12, 16, 10]} />
        <meshStandardMaterial color="#202329" roughness={0.9} />
      </mesh>

      {[-0.31, 0.31].map((x) => (
        <mesh key={x} position={[x, 2.19, -0.34]} scale={[0.045, 0.08, 0.03]}>
          <sphereGeometry args={[1, 12, 8]} />
          <meshStandardMaterial color="#1a2230" roughness={0.7} />
        </mesh>
      ))}

      <mesh ref={refs.leftArm} position={[-0.52, 1.16, 0]} castShadow>
        <capsuleGeometry args={[0.13, 0.66, 8, 12]} />
        <meshStandardMaterial color="#304978" roughness={0.78} />
      </mesh>
      <mesh ref={refs.rightArm} position={[0.52, 1.16, 0]} castShadow>
        <capsuleGeometry args={[0.13, 0.66, 8, 12]} />
        <meshStandardMaterial color="#304978" roughness={0.78} />
      </mesh>

      <mesh position={[-0.52, 0.78, 0.02]} castShadow>
        <sphereGeometry args={[0.14, 14, 10]} />
        <meshStandardMaterial color="#9b6b4f" roughness={0.9} />
      </mesh>
      <mesh position={[0.52, 0.78, 0.02]} castShadow>
        <sphereGeometry args={[0.14, 14, 10]} />
        <meshStandardMaterial color="#9b6b4f" roughness={0.9} />
      </mesh>

      <mesh ref={refs.leftLeg} position={[-0.2, 0.44, 0]} castShadow>
        <capsuleGeometry args={[0.15, 0.58, 8, 12]} />
        <meshStandardMaterial color="#101722" roughness={0.88} />
      </mesh>
      <mesh ref={refs.rightLeg} position={[0.2, 0.44, 0]} castShadow>
        <capsuleGeometry args={[0.15, 0.58, 8, 12]} />
        <meshStandardMaterial color="#101722" roughness={0.88} />
      </mesh>

      <mesh position={[-0.21, 0.08, -0.09]} castShadow>
        <boxGeometry args={[0.34, 0.15, 0.72]} />
        <meshStandardMaterial color="#272c31" roughness={0.58} metalness={0.14} />
      </mesh>
      <mesh position={[0.21, 0.08, -0.09]} castShadow>
        <boxGeometry args={[0.34, 0.15, 0.72]} />
        <meshStandardMaterial color="#272c31" roughness={0.58} metalness={0.14} />
      </mesh>

      <mesh position={[0, 1.83, 0]}>
        <cylinderGeometry args={[0.15, 0.16, 0.2, 12]} />
        <meshStandardMaterial color="#9b6b4f" roughness={0.9} />
      </mesh>
    </group>
  );
}

export default function PlayerController({
  city,
  playerRef,
  yawRef,
  pitchRef,
  locked,
  onUpdate,
}) {
  const keysRef = useRef(new Set());
  const jumpQueuedRef = useRef(false);
  const velocityRef = useRef(new THREE.Vector3());
  const groundedRef = useRef(true);
  const groupRef = useRef();
  const visualRef = useRef();
  const animationRef = useRef({ moving: false, sprinting: false });
  const refs = {
    leftArm: useRef(),
    rightArm: useRef(),
    leftLeg: useRef(),
    rightLeg: useRef(),
  };

  useEffect(() => {
    const down = (event) => {
      const key = normalizeKey(event);
      if (!key) return;
      keysRef.current.add(key);
      if (key === "space") jumpQueuedRef.current = true;
      if (["w", "a", "s", "d", "shift", "space"].includes(key)) {
        event.preventDefault();
      }
    };

    const up = (event) => {
      const key = normalizeKey(event);
      if (key) keysRef.current.delete(key);
    };

    const clear = () => {
      keysRef.current.clear();
      jumpQueuedRef.current = false;
    };

    window.addEventListener("keydown", down, { capture: true, passive: false });
    window.addEventListener("keyup", up, { capture: true });
    window.addEventListener("blur", clear);

    return () => {
      window.removeEventListener("keydown", down, true);
      window.removeEventListener("keyup", up, true);
      window.removeEventListener("blur", clear);
    };
  }, []);

  useEffect(() => {
    const move = (event) => {
      if (!locked) return;
      yawRef.current -= event.movementX * 0.0027;
      pitchRef.current = THREE.MathUtils.clamp(
        pitchRef.current - event.movementY * 0.002,
        -0.68,
        0.36,
      );
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [locked, pitchRef, yawRef]);

  useEffect(() => {
    playerRef.current = groupRef.current;
    if (groupRef.current) {
      groupRef.current.position.set(city.spawn[0], city.spawn[1], city.spawn[2]);
    }
    return () => {
      if (playerRef.current === groupRef.current) playerRef.current = null;
    };
  }, [city.spawn, playerRef]);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const dt = Math.min(delta, 0.04);
    const keys = keysRef.current;
    const velocity = velocityRef.current;

    const xInput = (keys.has("d") ? 1 : 0) - (keys.has("a") ? 1 : 0);
    const zInput = (keys.has("w") ? 1 : 0) - (keys.has("s") ? 1 : 0);
    const input = new THREE.Vector2(xInput, zInput);

    if (input.lengthSq() > 1) input.normalize();

    const yaw = yawRef.current;
    const forwardX = Math.sin(yaw);
    const forwardZ = -Math.cos(yaw);
    const rightX = Math.cos(yaw);
    const rightZ = Math.sin(yaw);

    const moveX = rightX * input.x + forwardX * input.y;
    const moveZ = rightZ * input.x + forwardZ * input.y;
    const moving = input.lengthSq() > 0.001;
    animationRef.current.moving = moving;
    animationRef.current.sprinting = keys.has("shift") && moving;

    const targetSpeed = keys.has("shift") ? PLAYER.sprintSpeed : PLAYER.walkSpeed;
    const targetVX = moveX * targetSpeed;
    const targetVZ = moveZ * targetSpeed;
    const response = moving ? PLAYER.acceleration : PLAYER.deceleration;
    const blend = 1 - Math.exp(-response * dt);

    velocity.x = THREE.MathUtils.lerp(velocity.x, targetVX, blend);
    velocity.z = THREE.MathUtils.lerp(velocity.z, targetVZ, blend);

    if (jumpQueuedRef.current && groundedRef.current) {
      velocity.y = PLAYER.jumpSpeed;
      groundedRef.current = false;
    }
    jumpQueuedRef.current = false;

    velocity.y += PLAYER.gravity * dt;
    group.position.y += velocity.y * dt;

    if (group.position.y <= 0) {
      group.position.y = 0;
      velocity.y = 0;
      groundedRef.current = true;
    }

    const proposedX = clamp(
      group.position.x + velocity.x * dt,
      -city.worldBounds + PLAYER.radius,
      city.worldBounds - PLAYER.radius,
    );
    const proposedZ = clamp(
      group.position.z + velocity.z * dt,
      -city.worldBounds + PLAYER.radius,
      city.worldBounds - PLAYER.radius,
    );

    if (canOccupy(proposedX, group.position.z, city)) {
      group.position.x = proposedX;
    } else {
      velocity.x = 0;
    }

    if (canOccupy(group.position.x, proposedZ, city)) {
      group.position.z = proposedZ;
    } else {
      velocity.z = 0;
    }

    if (visualRef.current) {
      const targetYaw = moving ? Math.atan2(moveX, -moveZ) : visualRef.current.rotation.y;
      visualRef.current.rotation.y = THREE.MathUtils.lerp(
        visualRef.current.rotation.y,
        targetYaw,
        1 - Math.exp(-14 * dt),
      );
      visualRef.current.position.y = moving
        ? Math.sin(state.clock.elapsedTime * (keys.has("shift") ? 13 : 9)) * 0.045
        : 0;
    }

    if (state.clock.elapsedTime % 0.08 < dt) {
      onUpdate?.({
        speed: Math.hypot(velocity.x, velocity.z),
        sprinting: keys.has("shift") && moving,
        grounded: groundedRef.current,
        position: [group.position.x, group.position.y, group.position.z],
        input: {
          w: keys.has("w"),
          a: keys.has("a"),
          s: keys.has("s"),
          d: keys.has("d"),
        },
      });
    }
  });

  return (
    <group ref={groupRef} position={city.spawn}>
      <group ref={visualRef}>
        <PlayerModel refs={refs} animationRef={animationRef} />
      </group>
      <pointLight position={[0, 1.6, 0]} intensity={0.32} distance={3.2} color="#7480d9" />
    </group>
  );
}
