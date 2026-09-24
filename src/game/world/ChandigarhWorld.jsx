import { Text } from "@react-three/drei";
import { CITY } from "../city/chandigarh";

function RoadDash({ position, scale = [0.12, 0.02, 2.4] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={scale} />
      <meshStandardMaterial color="#f3f4f6" roughness={0.72} />
    </mesh>
  );
}

function Building({ building }) {
  const windowRows = Math.max(2, Math.floor(building.h / 2.5));
  const windowCount = Math.max(2, Math.floor(building.w / 2.1));

  return (
    <group position={[building.x, building.h / 2, building.z]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[building.w, building.h, building.d]} />
        <meshStandardMaterial color={building.color} roughness={0.84} metalness={0.08} />
      </mesh>

      {Array.from({ length: windowRows }).flatMap((_, row) =>
        Array.from({ length: windowCount }).map((__, col) => (
          <mesh
            key={`${building.id}-w-${row}-${col}`}
            position={[
              -building.w / 2 + 1 + col * 2.1,
              -building.h / 2 + 1.35 + row * 2.1,
              -building.d / 2 - 0.012,
            ]}
          >
            <boxGeometry args={[0.55, 0.55, 0.03]} />
            <meshStandardMaterial
              color="#101827"
              emissive="#7c83ff"
              emissiveIntensity={0.15}
            />
          </mesh>
        )),
      )}

      <mesh position={[0, -building.h / 2 + 0.18, building.d / 2 + 0.02]}>
        <boxGeometry args={[Math.min(building.w * 0.7, 5.5), 0.12, 0.04]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
    </group>
  );
}

function Tree({ item }) {
  return (
    <group position={[item.x, 0, item.z]} scale={item.scale}>
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.2, 2.4, 8]} />
        <meshStandardMaterial color="#4a3327" roughness={1} />
      </mesh>
      <mesh position={[0, 2.8, 0]} castShadow>
        <icosahedronGeometry args={[1.05, 1]} />
        <meshStandardMaterial color="#27503d" roughness={0.96} />
      </mesh>
    </group>
  );
}

function Park({ park }) {
  return (
    <group position={[park.x, 0, park.z]}>
      <mesh receiveShadow>
        <boxGeometry args={[park.size, 0.16, park.size]} />
        <meshStandardMaterial color="#183c2e" roughness={1} />
      </mesh>
      <mesh position={[0, 0.09, 0]}>
        <boxGeometry args={[1.3, 0.03, park.size - 3]} />
        <meshStandardMaterial color="#7c6852" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[park.size - 3, 0.03, 1.3]} />
        <meshStandardMaterial color="#7c6852" roughness={0.95} />
      </mesh>
    </group>
  );
}

function StreetLight({ x, z, rotation = 0 }) {
  return (
    <group position={[x, 0, z]} rotation-y={rotation}>
      <mesh position={[0, 2.1, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.075, 4.2, 8]} />
        <meshStandardMaterial color="#49566f" metalness={0.68} roughness={0.38} />
      </mesh>
      <mesh position={[0.55, 4.12, 0]}>
        <boxGeometry args={[1.1, 0.08, 0.08]} />
        <meshStandardMaterial color="#6b7280" metalness={0.55} roughness={0.32} />
      </mesh>
      <mesh position={[1.05, 4.03, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial
          color="#e0e7ff"
          emissive="#a5b4fc"
          emissiveIntensity={3}
        />
      </mesh>
    </group>
  );
}

function Roundabout({ item }) {
  return (
    <group position={[item.x, 0.05, item.z]}>
      <mesh rotation-x={-Math.PI / 2}>
        <ringGeometry args={[5.2, 8, 48]} />
        <meshStandardMaterial color="#151f33" roughness={0.9} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.02, 0]}>
        <circleGeometry args={[3.7, 48]} />
        <meshStandardMaterial color="#1c4636" roughness={1} />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[1.25, 1.55, 1.0, 24]} />
        <meshStandardMaterial color="#2f3e5d" roughness={0.7} />
      </mesh>
      <Text
        position={[0, 1.2, 0]}
        rotation-x={-Math.PI / 2}
        fontSize={0.42}
        color="#c7d2fe"
        anchorX="center"
        anchorY="middle"
      >
        ROUNDABOUT
      </Text>
    </group>
  );
}

function Landmark() {
  const c = CITY.civicComplex;
  return (
    <group position={[c.x, 0, c.z]}>
      {c.buildings.map((b, index) => (
        <mesh
          key={index}
          position={[b.x, b.h / 2, b.z]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[b.w, b.h, b.d]} />
          <meshStandardMaterial color="#334155" roughness={0.72} metalness={0.18} />
        </mesh>
      ))}
      <Text
        position={[0, 9.4, 0]}
        fontSize={1.35}
        color="#c7d2fe"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#0b1020"
      >
        CIVIC COMPLEX
      </Text>
    </group>
  );
}

function SukhnaLake() {
  const l = CITY.lake;
  return (
    <group position={[l.x, 0, l.z]}>
      <mesh rotation-x={-Math.PI / 2} scale={[l.rx, l.rz, 1]}>
        <circleGeometry args={[1, 64]} />
        <meshStandardMaterial
          color="#163d5c"
          metalness={0.28}
          roughness={0.28}
          emissive="#0b2a43"
          emissiveIntensity={0.45}
        />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.03, 0]} scale={[l.rx + 0.9, l.rz + 0.9, 1]}>
        <ringGeometry args={[0.93, 1, 64]} />
        <meshStandardMaterial color="#55745f" roughness={1} />
      </mesh>
      <Text
        position={[0, 0.35, 0]}
        rotation-x={-Math.PI / 2}
        fontSize={1.3}
        color="#dbeafe"
        anchorX="center"
        anchorY="middle"
      >
        SUKHNA LAKE
      </Text>
    </group>
  );
}

export default function ChandigarhWorld() {
  const dashes = [];
  CITY.roadCenters.forEach((x) => {
    for (let z = -56; z <= 56; z += 5.5) {
      dashes.push(<RoadDash key={`v-${x}-${z}`} position={[x, 0.055, z]} />);
    }
  });
  const horizontalDashes = [];
  CITY.roadCenters.forEach((z) => {
    for (let x = -56; x <= 56; x += 5.5) {
      horizontalDashes.push(
        <RoadDash
          key={`h-${z}-${x}`}
          position={[x, 0.058, z]}
          scale={[2.4, 0.02, 0.12]}
        />,
      );
    }
  });

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[CITY.worldBounds * 2, CITY.worldBounds * 2]} />
        <meshStandardMaterial color="#0a1220" roughness={1} />
      </mesh>

      {CITY.roadCenters.map((x) => (
        <mesh key={`road-v-${x}`} position={[x, 0.015, 0]} receiveShadow>
          <boxGeometry args={[CITY.roadWidth, 0.03, 116]} />
          <meshStandardMaterial color="#161f32" roughness={0.94} />
        </mesh>
      ))}
      {CITY.roadCenters.map((z) => (
        <mesh key={`road-h-${z}`} position={[0, 0.016, z]} receiveShadow>
          <boxGeometry args={[116, 0.032, CITY.roadWidth]} />
          <meshStandardMaterial color="#161f32" roughness={0.94} />
        </mesh>
      ))}

      {dashes}
      {horizontalDashes}

      {CITY.parks.map((park) => <Park key={park.id} park={park} />)}
      {CITY.buildings.map((building) => (
        <Building key={building.id} building={building} />
      ))}
      {CITY.trees.map((item, index) => <Tree key={index} item={item} />)}
      {CITY.roundabouts.map((item) => <Roundabout key={`${item.x}-${item.z}`} item={item} />)}
      <Landmark />
      <SukhnaLake />

      <mesh position={[0, 0.2, 12]}>
        <boxGeometry args={[10, 0.25, 0.25]} />
        <meshStandardMaterial color="#0d1727" />
      </mesh>
      <Text
        position={[0, 1.25, 11.9]}
        rotation-x={-0.12}
        fontSize={1.1}
        color="#818cf8"
        anchorX="center"
        anchorY="middle"
      >
        CHANDIGARH
      </Text>
      <Text
        position={[0, 0.78, 11.9]}
        rotation-x={-0.12}
        fontSize={0.42}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
      >
        THE CITY BEAUTIFUL
      </Text>

      {[[-16, -52], [8, -52], [32, -52], [-16, 52], [8, 52], [32, 52]].map(
        ([x, z], index) => (
          <StreetLight key={index} x={x} z={z} rotation={index % 2 ? Math.PI : 0} />
        ),
      )}
    </group>
  );
}
