import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { CITY } from "../city/chandigarh";

const ROAD_LIMIT = 58;
const LANE_OFFSET = 2.15;

const TRAFFIC = [
  { id: "sedan-1", kind: "sedan", road: "h", line: -24, direction: 1, offset: 8, speed: 7.6, color: "#f1eee7" },
  { id: "sedan-2", kind: "sedan", road: "h", line: 0, direction: -1, offset: 28, speed: 8.4, color: "#65717a" },
  { id: "hatch-1", kind: "hatch", road: "h", line: 24, direction: 1, offset: 52, speed: 8.1, color: "#c7cbd0" },
  { id: "hatch-2", kind: "hatch", road: "h", line: -48, direction: -1, offset: 70, speed: 7.4, color: "#c28f3a" },
  { id: "sedan-3", kind: "sedan", road: "h", line: 48, direction: 1, offset: 92, speed: 8.8, color: "#7a3b37" },
  { id: "sedan-4", kind: "sedan", road: "h", line: 0, direction: 1, offset: 116, speed: 6.9, color: "#e7e2d9" },
  { id: "hatch-3", kind: "hatch", road: "v", line: -48, direction: 1, offset: 15, speed: 7.8, color: "#4b6074" },
  { id: "sedan-5", kind: "sedan", road: "v", line: -24, direction: -1, offset: 42, speed: 8.6, color: "#d9d8d1" },
  { id: "hatch-4", kind: "hatch", road: "v", line: 0, direction: 1, offset: 66, speed: 7.2, color: "#6e7b4f" },
  { id: "sedan-6", kind: "sedan", road: "v", line: 24, direction: -1, offset: 90, speed: 8.0, color: "#34495c" },
  { id: "hatch-5", kind: "hatch", road: "v", line: 48, direction: 1, offset: 118, speed: 7.7, color: "#b8a38f" },
  { id: "auto-1", kind: "auto", road: "v", line: 0, direction: -1, offset: 142, speed: 5.8, color: "#c6a23a" },
  { id: "auto-2", kind: "auto", road: "h", line: 24, direction: -1, offset: 164, speed: 5.6, color: "#2d4d3b" },
  { id: "sedan-7", kind: "sedan", road: "h", line: -24, direction: -1, offset: 188, speed: 8.2, color: "#aa3e43" },
];

const PEDESTRIANS = [
  { id: "p1", path: [[-18, -7], [-7, -7], [-7, 7], [-18, 7]], speed: 0.95, shirt: "#5d6ea4", pants: "#303942", skin: "#8f644e" },
  { id: "p2", path: [[30, -8], [42, -8], [42, 8], [30, 8]], speed: 0.82, shirt: "#9c5f3e", pants: "#25303a", skin: "#a87558" },
  { id: "p3", path: [[-44, 29], [-31, 29], [-31, 40], [-44, 40]], speed: 0.7, shirt: "#73884f", pants: "#394047", skin: "#865b47" },
  { id: "p4", path: [[-5, 31], [7, 31], [7, 42], [-5, 42]], speed: 0.74, shirt: "#ece7d8", pants: "#4c5562", skin: "#9c6c50" },
  { id: "p5", path: [[27, 30], [42, 30], [42, 42], [27, 42]], speed: 0.86, shirt: "#8c526c", pants: "#252d35", skin: "#9e7059" },
  { id: "p6", path: [[-43, -41], [-30, -41], [-30, -29], [-43, -29]], speed: 0.78, shirt: "#4d7180", pants: "#343b42", skin: "#9f755d" },
  { id: "p7", path: [[7, -41], [19, -41], [19, -30], [7, -30]], speed: 0.9, shirt: "#c38e50", pants: "#424a55", skin: "#885d49" },
  { id: "p8", path: [[-8, 7], [8, 7], [8, 9.5], [-8, 9.5]], speed: 0.72, shirt: "#6c5f91", pants: "#27303a", skin: "#a6765b" },
  { id: "p9", path: [[-8, -9.5], [8, -9.5], [8, -7], [-8, -7]], speed: 0.68, shirt: "#3e755e", pants: "#303943", skin: "#8e654f" },
  { id: "p10", path: [[30, -20], [42, -20], [42, -15], [30, -15]], speed: 0.66, shirt: "#c45f4e", pants: "#2e3740", skin: "#a27359" },
  { id: "p11", path: [[-42, 9], [-30, 9], [-30, 14], [-42, 14]], speed: 0.79, shirt: "#52749e", pants: "#1e2831", skin: "#93674f" },
  { id: "p12", path: [[26, 9], [42, 9], [42, 14], [26, 14]], speed: 0.75, shirt: "#a86e49", pants: "#35404a", skin: "#9d7159" },
];

function Headlights({ rear = false }) {
  return (
    <>
      <mesh position={[-0.48, 0.67, rear ? 1.48 : -1.48]}>
        <boxGeometry args={[0.25, 0.12, 0.05]} />
        <meshStandardMaterial
          color={rear ? "#7c2327" : "#edf5f4"}
          emissive={rear ? "#52151a" : "#eaf7ff"}
          emissiveIntensity={rear ? 0.28 : 1.15}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0.48, 0.67, rear ? 1.48 : -1.48]}>
        <boxGeometry args={[0.25, 0.12, 0.05]} />
        <meshStandardMaterial
          color={rear ? "#7c2327" : "#edf5f4"}
          emissive={rear ? "#52151a" : "#eaf7ff"}
          emissiveIntensity={rear ? 0.28 : 1.15}
          roughness={0.3}
        />
      </mesh>
    </>
  );
}

function TrafficVehicle({ item }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const progress = ((item.offset + state.clock.elapsedTime * item.speed * item.direction) % 116 + 116) % 116;
    const distance = -58 + progress;

    if (item.road === "h") {
      const z = item.line + (item.direction > 0 ? LANE_OFFSET : -LANE_OFFSET);
      group.position.set(distance, item.kind === "auto" ? 0.48 : 0.55, z);
      group.rotation.y = item.direction > 0 ? Math.PI / 2 : -Math.PI / 2;
    } else {
      const x = item.line + (item.direction > 0 ? LANE_OFFSET : -LANE_OFFSET);
      group.position.set(x, item.kind === "auto" ? 0.48 : 0.55, distance);
      group.rotation.y = item.direction > 0 ? 0 : Math.PI;
    }

    const bob = Math.sin(state.clock.elapsedTime * item.speed * 0.7) * 0.008;
    group.position.y += bob * Math.min(delta * 60, 1);
  });

  const auto = item.kind === "auto";
  const hatch = item.kind === "hatch";

  return (
    <group ref={groupRef}>
      <group scale={auto ? [0.78, 0.72, 0.82] : hatch ? [0.92, 0.95, 0.91] : [1, 1, 1]}>
        <mesh position={[0, 0.18, 0]} castShadow>
          <boxGeometry args={[1.48, 0.42, auto ? 2.0 : 2.85]} />
          <meshStandardMaterial color={item.color} roughness={0.5} metalness={0.28} />
        </mesh>

        {auto ? (
          <>
            <mesh position={[0, 0.53, 0]} castShadow>
              <boxGeometry args={[1.2, 0.66, 1.58]} />
              <meshStandardMaterial color="#38483c" roughness={0.7} metalness={0.12} />
            </mesh>
            <mesh position={[0, 0.83, -0.06]}>
              <boxGeometry args={[1.02, 0.42, 1.18]} />
              <meshStandardMaterial color="#bfc9c7" roughness={0.34} metalness={0.08} />
            </mesh>
          </>
        ) : (
          <>
            <mesh position={[0, 0.53, -0.18]} castShadow>
              <boxGeometry args={[1.27, hatch ? 0.62 : 0.56, hatch ? 1.42 : 1.55]} />
              <meshStandardMaterial color="#25374b" roughness={0.3} metalness={0.18} />
            </mesh>
            <mesh position={[0, 0.83, hatch ? 0.04 : -0.03]}>
              <boxGeometry args={[1.1, hatch ? 0.34 : 0.31, hatch ? 1.0 : 1.08]} />
              <meshStandardMaterial color="#2a3a4b" roughness={0.2} metalness={0.18} />
            </mesh>
          </>
        )}

        <Headlights />
        <Headlights rear />

        {[[-0.78, 0, -0.92], [0.78, 0, -0.92], [-0.78, 0, 0.92], [0.78, 0, 0.92]].map(([x, y, z], index) => (
          <mesh key={index} position={[x, y, z]} rotation-z={Math.PI / 2}>
            <cylinderGeometry args={[auto ? 0.22 : 0.27, auto ? 0.22 : 0.27, 0.17, 18]} />
            <meshStandardMaterial color="#191b1e" roughness={0.78} />
          </mesh>
        ))}

        {!auto && (
          <mesh position={[0, 0.39, 0]}>
            <boxGeometry args={[1.45, 0.055, 0.13]} />
            <meshStandardMaterial color="#aeb5b8" roughness={0.44} metalness={0.36} />
          </mesh>
        )}
      </group>
    </group>
  );
}

function loopPoint(path, t) {
  const count = path.length;
  const scaled = t * count;
  const index = Math.floor(scaled) % count;
  const next = (index + 1) % count;
  const local = scaled - Math.floor(scaled);
  const [x1, z1] = path[index];
  const [x2, z2] = path[next];
  return {
    x: THREE.MathUtils.lerp(x1, x2, local),
    z: THREE.MathUtils.lerp(z1, z2, local),
    angle: Math.atan2(x2 - x1, -(z2 - z1)),
  };
}

function Pedestrian({ item, index }) {
  const groupRef = useRef();
  const refs = {
    leftArm: useRef(),
    rightArm: useRef(),
    leftLeg: useRef(),
    rightLeg: useRef(),
  };

  useFrame((state) => {
    const person = groupRef.current;
    if (!person) return;

    const t = ((state.clock.elapsedTime * item.speed * 0.035 + index * 0.071) % 1 + 1) % 1;
    const point = loopPoint(item.path, t);

    person.position.set(point.x, 0.01, point.z);
    person.rotation.y = point.angle;

    const swing = Math.sin(state.clock.elapsedTime * (7 + item.speed * 2)) * 0.38;
    if (refs.leftArm.current) refs.leftArm.current.rotation.x = swing;
    if (refs.rightArm.current) refs.rightArm.current.rotation.x = -swing;
    if (refs.leftLeg.current) refs.leftLeg.current.rotation.x = -swing * 0.8;
    if (refs.rightLeg.current) refs.rightLeg.current.rotation.x = swing * 0.8;
  });

  return (
    <group ref={groupRef}>
      <group scale={[0.72, 0.72, 0.72]}>
        <mesh position={[0, 1.05, 0]} castShadow>
          <capsuleGeometry args={[0.2, 0.5, 6, 10]} />
          <meshStandardMaterial color={item.shirt} roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.58, 0]} castShadow>
          <sphereGeometry args={[0.23, 16, 12]} />
          <meshStandardMaterial color={item.skin} roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.7, -0.01]}>
          <sphereGeometry args={[0.24, 16, 10]} />
          <meshStandardMaterial color={index % 2 ? "#2a2524" : "#1d2329"} roughness={0.94} />
        </mesh>
        <mesh ref={refs.leftArm} position={[-0.29, 1.06, 0]} castShadow>
          <capsuleGeometry args={[0.055, 0.36, 6, 8]} />
          <meshStandardMaterial color={item.shirt} roughness={0.9} />
        </mesh>
        <mesh ref={refs.rightArm} position={[0.29, 1.06, 0]} castShadow>
          <capsuleGeometry args={[0.055, 0.36, 6, 8]} />
          <meshStandardMaterial color={item.shirt} roughness={0.9} />
        </mesh>
        <mesh ref={refs.leftLeg} position={[-0.11, 0.49, 0]} castShadow>
          <capsuleGeometry args={[0.07, 0.4, 6, 8]} />
          <meshStandardMaterial color={item.pants} roughness={0.92} />
        </mesh>
        <mesh ref={refs.rightLeg} position={[0.11, 0.49, 0]} castShadow>
          <capsuleGeometry args={[0.07, 0.4, 6, 8]} />
          <meshStandardMaterial color={item.pants} roughness={0.92} />
        </mesh>
      </group>
    </group>
  );
}

function Crosswalk({ position, horizontal = true }) {
  const bars = [];
  for (let i = -3; i <= 3; i += 1) {
    bars.push(
      <mesh
        key={i}
        position={[
          position[0] + (horizontal ? i * 0.75 : 0),
          0.06,
          position[1] + (horizontal ? 0 : i * 0.75),
        ]}
      >
        <boxGeometry args={horizontal ? [0.42, 0.02, 3.8] : [3.8, 0.02, 0.42]} />
        <meshStandardMaterial color="#ece9de" roughness={0.88} />
      </mesh>,
    );
  }
  return <>{bars}</>;
}

export default function TrafficWorld() {
  return (
    <group>
      {TRAFFIC.map((item) => (
        <TrafficVehicle key={item.id} item={item} />
      ))}
      {PEDESTRIANS.map((item, index) => (
        <Pedestrian key={item.id} item={item} index={index} />
      ))}

      <Crosswalk position={[-4.5, 0]} horizontal />
      <Crosswalk position={[4.5, 24]} horizontal />
      <Crosswalk position={[-24, -4.5]} horizontal={false} />
      <Crosswalk position={[24, 4.5]} horizontal={false} />
    </group>
  );
}

export const TRAFFIC_COUNT = TRAFFIC.length;
export const PEDESTRIAN_COUNT = PEDESTRIANS.length;
