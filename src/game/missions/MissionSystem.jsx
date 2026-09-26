import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { getMission } from "./missionData";

function CheckpointBeacon({ point, active }) {
  const ringRef = useRef();
  const beamRef = useRef();

  useFrame((state) => {
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.08;
    if (ringRef.current) {
      ringRef.current.scale.setScalar(active ? pulse : 0.9);
      ringRef.current.rotation.z += 0.012;
    }
    if (beamRef.current) {
      beamRef.current.scale.y = active ? 1 + Math.sin(state.clock.elapsedTime * 3.2) * 0.12 : 0.78;
    }
  });

  return (
    <group position={point.position}>
      <mesh ref={ringRef} rotation-x={Math.PI / 2} position-y={0.08}>
        <torusGeometry args={[active ? 3.2 : 2.25, active ? 0.16 : 0.1, 10, 40]} />
        <meshStandardMaterial
          color={active ? "#a5b4fc" : "#64748b"}
          emissive={active ? "#6366f1" : "#1e293b"}
          emissiveIntensity={active ? 2.5 : 0.55}
          roughness={0.3}
          metalness={0.25}
          transparent
          opacity={active ? 0.98 : 0.48}
        />
      </mesh>

      <mesh ref={beamRef} position-y={1.55}>
        <cylinderGeometry args={[active ? 0.055 : 0.035, active ? 0.11 : 0.06, 3, 12]} />
        <meshStandardMaterial
          color={active ? "#c7d2fe" : "#94a3b8"}
          emissive={active ? "#818cf8" : "#334155"}
          emissiveIntensity={active ? 2.2 : 0.35}
          transparent
          opacity={active ? 0.55 : 0.28}
        />
      </mesh>

      <mesh position-y={3.15} rotation-x={Math.PI}>
        <coneGeometry args={[active ? 0.34 : 0.22, active ? 0.62 : 0.4, 4]} />
        <meshStandardMaterial
          color={active ? "#e0e7ff" : "#64748b"}
          emissive={active ? "#6366f1" : "#334155"}
          emissiveIntensity={active ? 1.8 : 0.25}
          transparent
          opacity={active ? 0.92 : 0.4}
        />
      </mesh>
    </group>
  );
}

export default function MissionSystem({
  missionId,
  active,
  vehicleRef,
  driving,
  onUpdate,
  onFinish,
}) {
  const runtimeRef = useRef({
    checkpoint: 0,
    startedAt: 0,
    lastEmit: 0,
    finished: false,
  });

  const mission = getMission(missionId);

  useEffect(() => {
    if (!active || !mission) {
      runtimeRef.current = {
        checkpoint: 0,
        startedAt: 0,
        lastEmit: 0,
        finished: false,
      };
      return;
    }

    runtimeRef.current = {
      checkpoint: 0,
      startedAt: performance.now(),
      lastEmit: 0,
      finished: false,
    };

    onUpdate?.({
      status: "active",
      checkpoint: 0,
      total: mission.checkpoints.length,
      timeLeft: mission.duration,
      reward: mission.reward,
      message: "Drive to the first checkpoint.",
    });
  }, [active, mission, onUpdate]);

  useFrame(() => {
    if (!active || !mission) return;

    const runtime = runtimeRef.current;
    if (runtime.finished || !runtime.startedAt) return;

    const now = performance.now();
    const elapsed = (now - runtime.startedAt) / 1000;
    const timeLeft = Math.max(0, mission.duration - elapsed);

    if (timeLeft <= 0) {
      runtime.finished = true;
      onFinish?.({
        status: "failed",
        checkpoint: runtime.checkpoint,
        total: mission.checkpoints.length,
        timeLeft: 0,
        reward: mission.reward,
        title: mission.name,
        message: "Time expired. Reset and try the route again.",
      });
      return;
    }

    const vehicle = vehicleRef.current;
    const target = mission.checkpoints[runtime.checkpoint];

    if (driving && vehicle && target) {
      const dx = vehicle.position.x - target.position[0];
      const dz = vehicle.position.z - target.position[2];
      const distance = Math.hypot(dx, dz);

      if (distance <= target.radius) {
        runtime.checkpoint += 1;

        if (runtime.checkpoint >= mission.checkpoints.length) {
          runtime.finished = true;
          onFinish?.({
            status: "success",
            checkpoint: mission.checkpoints.length,
            total: mission.checkpoints.length,
            timeLeft,
            reward: mission.reward,
            title: mission.name,
            message: "Route complete. Mission cleared.",
          });
          return;
        }

        onUpdate?.({
          status: "active",
          checkpoint: runtime.checkpoint,
          total: mission.checkpoints.length,
          timeLeft,
          reward: mission.reward,
          message: `Checkpoint cleared. Head to ${mission.checkpoints[runtime.checkpoint].label}.`,
        });
      }
    }

    if (now - runtime.lastEmit > 120) {
      runtime.lastEmit = now;
      onUpdate?.({
        status: "active",
        checkpoint: runtime.checkpoint,
        total: mission.checkpoints.length,
        timeLeft,
        reward: mission.reward,
        message: driving
          ? `Next: ${target?.label ?? "Finish"}`
          : "Enter the Civic Cruiser to continue the mission.",
      });
    }
  });

  if (!active || !mission) return null;

  return (
    <group>
      {mission.checkpoints.map((point, index) => (
        <CheckpointBeacon
          key={point.label}
          point={point}
          active={index === runtimeRef.current.checkpoint}
        />
      ))}
    </group>
  );
}
