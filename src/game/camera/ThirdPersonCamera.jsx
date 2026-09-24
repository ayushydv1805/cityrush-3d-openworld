import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function ThirdPersonCamera({
  playerRef,
  vehicleRef,
  driving,
  yawRef,
  pitchRef,
}) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3());
  const desired = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const focus = driving ? vehicleRef.current : playerRef.current;
    if (!focus) return;

    const yaw = yawRef.current;
    const pitch = pitchRef.current;
    const distance = driving ? 9.7 : 7.8;
    const horizontal = Math.cos(pitch) * distance;
    const targetHeight = driving ? 1.05 : 1.65;

    target.current.set(
      focus.position.x,
      focus.position.y + targetHeight,
      focus.position.z,
    );

    desired.current.set(
      target.current.x - Math.sin(yaw) * horizontal,
      target.current.y + (driving ? 0.62 : 0.55) + Math.sin(pitch) * distance,
      target.current.z + Math.cos(yaw) * horizontal,
    );

    const follow = 1 - Math.exp(-9.5 * Math.min(delta, 0.04));
    camera.position.lerp(desired.current, follow);

    const targetFov = driving ? 62 : 56;
    if (Math.abs(camera.fov - targetFov) > 0.05) {
      camera.fov = THREE.MathUtils.damp(camera.fov, targetFov, 7, Math.min(delta, 0.04));
      camera.updateProjectionMatrix();
    }

    camera.lookAt(
      target.current.x,
      target.current.y + (driving ? 0.1 : 0.2),
      target.current.z,
    );
  });

  return null;
}
