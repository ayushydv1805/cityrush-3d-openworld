import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { VEHICLE } from "./vehicleData";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function canVehicleOccupy(x, z, city) {
  const halfW = VEHICLE.width * 0.5;
  const halfL = VEHICLE.length * 0.5;
  const px = clamp(x, -city.worldBounds + halfW, city.worldBounds - halfW);
  const pz = clamp(z, -city.worldBounds + halfL, city.worldBounds - halfL);

  for (const obstacle of city.obstacles) {
    if (obstacle.type === "circle") {
      const dx = px - obstacle.x;
      const dz = pz - obstacle.z;
      const safeRadius = obstacle.radius + Math.max(halfW, halfL) * 0.72;
      if (dx * dx + dz * dz < safeRadius * safeRadius) return false;
      continue;
    }

    const minX = obstacle.x - obstacle.w / 2 - halfW;
    const maxX = obstacle.x + obstacle.w / 2 + halfW;
    const minZ = obstacle.z - obstacle.d / 2 - halfL;
    const maxZ = obstacle.z + obstacle.d / 2 + halfL;

    if (px > minX && px < maxX && pz > minZ && pz < maxZ) return false;
  }

  return true;
}

function Lamp({ position, rear = false }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[0.34, 0.16, 0.04]} />
      <meshStandardMaterial
        color={rear ? "#8f1f27" : "#dbe7ec"}
        emissive={rear ? "#6f1119" : "#dcefff"}
        emissiveIntensity={rear ? 0.55 : 1.5}
        roughness={0.28}
        metalness={0.12}
      />
    </mesh>
  );
}

function Wheel({ position }) {
  return (
    <group position={position}>
      <mesh ref={(node) => node?.userData} rotation-z={Math.PI / 2} castShadow>
        <cylinderGeometry args={[VEHICLE.wheelRadius, VEHICLE.wheelRadius, 0.28, 24]} />
        <meshStandardMaterial color="#17191d" roughness={0.72} metalness={0.08} />
      </mesh>
      <mesh position={[0, 0, 0]} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[0.19, 0.19, 0.3, 20]} />
        <meshStandardMaterial color="#69717a" roughness={0.48} metalness={0.62} />
      </mesh>
    </group>
  );
}

function WheelAssembly({ refValue, position }) {
  return (
    <group ref={refValue} position={position}>
      <mesh castShadow rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[VEHICLE.wheelRadius, VEHICLE.wheelRadius, 0.28, 24]} />
        <meshStandardMaterial color="#17191d" roughness={0.72} metalness={0.08} />
      </mesh>
      <mesh rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[0.19, 0.19, 0.3, 20]} />
        <meshStandardMaterial color="#69717a" roughness={0.48} metalness={0.62} />
      </mesh>
    </group>
  );
}

function VehicleModel({ refs }) {
  return (
    <group>
      <group ref={refs.body}>
        <mesh position={[0, 0.58, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.92, 0.56, 4.02]} />
          <meshStandardMaterial color={VEHICLE.color} roughness={0.44} metalness={0.42} />
        </mesh>

        <mesh position={[0, 0.91, -0.2]} castShadow>
          <boxGeometry args={[1.7, 0.54, 2.05]} />
          <meshStandardMaterial color="#1e304e" roughness={0.32} metalness={0.28} />
        </mesh>

        <mesh position={[0, 1.0, -0.66]} rotation-x={-0.03}>
          <boxGeometry args={[1.48, 0.42, 0.05]} />
          <meshStandardMaterial color="#273a4e" roughness={0.12} metalness={0.25} />
        </mesh>

        <mesh position={[0, 0.99, 0.42]} rotation-x={0.03}>
          <boxGeometry args={[1.5, 0.4, 0.05]} />
          <meshStandardMaterial color="#26384a" roughness={0.12} metalness={0.25} />
        </mesh>

        <mesh position={[0, 0.33, -2.04]} castShadow>
          <boxGeometry args={[1.98, 0.19, 0.12]} />
          <meshStandardMaterial color="#545d64" roughness={0.48} metalness={0.62} />
        </mesh>
        <mesh position={[0, 0.33, 2.04]} castShadow>
          <boxGeometry args={[1.98, 0.19, 0.12]} />
          <meshStandardMaterial color="#2d3337" roughness={0.58} metalness={0.6} />
        </mesh>

        <mesh position={[0, 0.51, -2.06]}>
          <boxGeometry args={[0.82, 0.19, 0.025]} />
          <meshStandardMaterial color="#151a1e" roughness={0.58} />
        </mesh>

        <Lamp position={[-0.56, 0.72, -2.015]} />
        <Lamp position={[0.56, 0.72, -2.015]} />
        <Lamp position={[-0.57, 0.67, 2.018]} rear />
        <Lamp position={[0.57, 0.67, 2.018]} rear />

        {[-0.96, 0.96].map((x) => (
          <mesh key={x} position={[x, 0.89, -0.8]} castShadow>
            <boxGeometry args={[0.07, 0.12, 0.28]} />
            <meshStandardMaterial color="#20262c" roughness={0.55} metalness={0.5} />
          </mesh>
        ))}

        {[-1, 1].map((x) => (
          <mesh key={x} position={[x * 0.98, 0.74, -0.72]} rotation-z={x * 0.08} castShadow>
            <boxGeometry args={[0.16, 0.1, 0.32]} />
            <meshStandardMaterial color="#151b22" roughness={0.68} metalness={0.32} />
          </mesh>
        ))}

        <mesh position={[0, 0.52, -2.16]}>
          <boxGeometry args={[0.48, 0.11, 0.045]} />
          <meshStandardMaterial color="#ecf0ea" roughness={0.48} />
        </mesh>

        <mesh position={[0, 0.34, 1.9]}>
          <boxGeometry args={[0.52, 0.08, 0.06]} />
          <meshStandardMaterial color="#262b2f" roughness={0.64} />
        </mesh>
      </group>

      <WheelAssembly refValue={refs.frontLeft} position={[-0.99, 0.38, -1.25]} />
      <WheelAssembly refValue={refs.frontRight} position={[0.99, 0.38, -1.25]} />
      <WheelAssembly refValue={refs.rearLeft} position={[-0.99, 0.38, 1.25]} />
      <WheelAssembly refValue={refs.rearRight} position={[0.99, 0.38, 1.25]} />

      <mesh position={[0, 0.76, -1.94]} castShadow>
        <boxGeometry args={[0.22, 0.05, 0.18]} />
        <meshStandardMaterial color="#101419" roughness={0.48} metalness={0.6} />
      </mesh>
    </group>
  );
}

export default function VehicleController({
  city,
  playerRef,
  vehicleRef,
  yawRef,
  pitchRef,
  driving,
  onEnter,
  onExit,
  onUpdate,
}) {
  const groupRef = useRef();
  const bodyRef = useRef();
  const frontLeftRef = useRef();
  const frontRightRef = useRef();
  const rearLeftRef = useRef();
  const rearRightRef = useRef();

  const keysRef = useRef(new Set());
  const speedRef = useRef(0);
  const nearbyRef = useRef(false);
  const eventLockRef = useRef(false);

  const refs = {
    body: bodyRef,
    frontLeft: frontLeftRef,
    frontRight: frontRightRef,
    rearLeft: rearLeftRef,
    rearRight: rearRightRef,
  };

  useEffect(() => {
    vehicleRef.current = groupRef.current;
    return () => {
      if (vehicleRef.current === groupRef.current) vehicleRef.current = null;
    };
  }, [vehicleRef]);

  useEffect(() => {
    const normalize = (event) => {
      const code = (event.code || "").toLowerCase();
      const key = (event.key || "").toLowerCase();
      if (code === "keyw" || key === "w") return "w";
      if (code === "keys" || key === "s") return "s";
      if (code === "keya" || key === "a") return "a";
      if (code === "keyd" || key === "d") return "d";
      if (code === "space" || key === " ") return "space";
      if (code === "keye" || key === "e") return "e";
      return null;
    };

    const down = (event) => {
      const key = normalize(event);
      if (!key) return;

      if (key === "e") {
        if (event.repeat || eventLockRef.current) return;
        eventLockRef.current = true;

        const group = groupRef.current;
        if (!group) return;

        if (driving) {
          const yaw = group.rotation.y;
          const rightX = Math.cos(yaw);
          const rightZ = Math.sin(yaw);
          const rightSpot = [group.position.x + rightX * 2.35, 0, group.position.z + rightZ * 2.35];
          const leftSpot = [group.position.x - rightX * 2.35, 0, group.position.z - rightZ * 2.35];
          const player = playerRef.current;

          if (player) {
            const rightFree = canVehicleOccupy(rightSpot[0], rightSpot[2], city);
            const spot = rightFree ? rightSpot : leftSpot;
            player.position.set(spot[0], spot[1], spot[2]);
          }

          speedRef.current = 0;
          onExit?.();
        } else if (nearbyRef.current) {
          yawRef.current = group.rotation.y;
          pitchRef.current = -0.14;
          onEnter?.();
        }

        event.preventDefault();
        return;
      }

      keysRef.current.add(key);
      if (["w", "a", "s", "d", "space"].includes(key)) {
        event.preventDefault();
      }
    };

    const up = (event) => {
      const key = normalize(event);
      if (key) {
        keysRef.current.delete(key);
        if (key === "e") eventLockRef.current = false;
      }
    };

    const clear = () => {
      keysRef.current.clear();
      eventLockRef.current = false;
    };

    window.addEventListener("keydown", down, { capture: true, passive: false });
    window.addEventListener("keyup", up, { capture: true });
    window.addEventListener("blur", clear);

    return () => {
      window.removeEventListener("keydown", down, true);
      window.removeEventListener("keyup", up, true);
      window.removeEventListener("blur", clear);
    };
  }, [city, driving, onEnter, onExit, pitchRef, playerRef, yawRef]);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const dt = Math.min(delta, 0.04);
    const player = playerRef.current;
    const distanceToPlayer = player
      ? Math.hypot(player.position.x - group.position.x, player.position.z - group.position.z)
      : Infinity;

    nearbyRef.current = distanceToPlayer <= 4.2;

    let speed = speedRef.current;

    if (driving) {
      const keys = keysRef.current;
      const throttle = (keys.has("w") ? 1 : 0) - (keys.has("s") ? 1 : 0);
      const steering = (keys.has("d") ? 1 : 0) - (keys.has("a") ? 1 : 0);

      const target = throttle > 0 ? VEHICLE.maxSpeed : throttle < 0 ? -VEHICLE.reverseSpeed : 0;
      if (throttle !== 0) {
        const rate = Math.abs(target) > Math.abs(speed) ? VEHICLE.acceleration : VEHICLE.braking;
        if (speed < target) speed = Math.min(speed + rate * dt, target);
        if (speed > target) speed = Math.max(speed - rate * dt, target);
      } else {
        speed = THREE.MathUtils.damp(
          speed,
          0,
          keys.has("space") ? VEHICLE.handbrakeDrag : VEHICLE.coastDrag,
          dt,
        );
      }

      const speedRatio = THREE.MathUtils.clamp(Math.abs(speed) / VEHICLE.maxSpeed, 0, 1);
      const turnScale = (0.28 + speedRatio * 0.95) * (speed < 0 ? -0.76 : 1);
      group.rotation.y += steering * VEHICLE.steering * turnScale * dt;

      const forwardX = Math.sin(group.rotation.y);
      const forwardZ = -Math.cos(group.rotation.y);

      const nextX = clamp(
        group.position.x + forwardX * speed * dt,
        -city.worldBounds + VEHICLE.width / 2,
        city.worldBounds - VEHICLE.width / 2,
      );
      const nextZ = clamp(
        group.position.z + forwardZ * speed * dt,
        -city.worldBounds + VEHICLE.length / 2,
        city.worldBounds - VEHICLE.length / 2,
      );

      let collision = false;
      if (canVehicleOccupy(nextX, group.position.z, city)) {
        group.position.x = nextX;
      } else {
        collision = true;
      }

      if (canVehicleOccupy(group.position.x, nextZ, city)) {
        group.position.z = nextZ;
      } else {
        collision = true;
      }

      if (collision) speed *= 0.16;

      if (bodyRef.current) {
        const lean = -steering * speedRatio * 0.055;
        bodyRef.current.rotation.z = THREE.MathUtils.damp(bodyRef.current.rotation.z, lean, 8, dt);
      }

      const wheelSpin = speed * dt / VEHICLE.wheelRadius;
      [frontLeftRef, frontRightRef, rearLeftRef, rearRightRef].forEach((ref) => {
        if (ref.current) {
          ref.current.children[0].rotation.x -= wheelSpin;
        }
      });

      const steerAngle = steering * 0.3;
      if (frontLeftRef.current) frontLeftRef.current.rotation.y = steerAngle;
      if (frontRightRef.current) frontRightRef.current.rotation.y = steerAngle;

      yawRef.current = group.rotation.y;
      speedRef.current = speed;
    } else {
      speedRef.current = 0;
      if (bodyRef.current) {
        bodyRef.current.rotation.z = THREE.MathUtils.damp(bodyRef.current.rotation.z, 0, 6, dt);
      }
    }

    if (state.clock.elapsedTime % 0.08 < dt) {
      onUpdate?.({
        speed: Math.abs(speedRef.current),
        gear: driving
          ? Math.abs(speedRef.current) < 0.12
            ? "P"
            : speedRef.current < 0
              ? "R"
              : "D"
          : "P",
        nearVehicle: nearbyRef.current,
        handbrake: driving && keysRef.current.has("space"),
        input: {
          w: keysRef.current.has("w"),
          a: keysRef.current.has("a"),
          s: keysRef.current.has("s"),
          d: keysRef.current.has("d"),
        },
      });
    }
  });

  return (
    <group ref={groupRef} position={VEHICLE.spawn}>
      <VehicleModel refs={refs} />
    </group>
  );
}
