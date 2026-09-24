import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function ThirdPersonCamera({ playerRef, yawRef, pitchRef }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3());
  const desired = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const player = playerRef.current;
    if (!player) return;

    const yaw = yawRef.current;
    const pitch = pitchRef.current;
    const distance = 7.8;
    const horizontal = Math.cos(pitch) * distance;

    target.current.set(
      player.position.x,
      player.position.y + 1.65,
      player.position.z,
    );

    desired.current.set(
      target.current.x - Math.sin(yaw) * horizontal,
      target.current.y + 0.55 + Math.sin(pitch) * distance,
      target.current.z + Math.cos(yaw) * horizontal,
    );

    const follow = 1 - Math.exp(-9.5 * Math.min(delta, 0.04));
    camera.position.lerp(desired.current, follow);
    camera.lookAt(
      target.current.x,
      target.current.y + 0.2,
      target.current.z,
    );
  });

  return null;
}
