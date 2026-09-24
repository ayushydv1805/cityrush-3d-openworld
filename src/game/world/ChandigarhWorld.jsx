import { Text, Sky } from "@react-three/drei";
import { CITY } from "../city/chandigarh";

const facadePalette = ["#c7c3b8", "#aeb4b8", "#c9bba6", "#9faab5"];

function RoadDash({ position, scale = [0.12, 0.025, 2.4], color = "#f2f2e8" }) {
  return (
    <mesh position={position}>
      <boxGeometry args={scale} />
      <meshStandardMaterial color={color} roughness={0.8} />
    </mesh>
  );
}

function Sidewalk({ x, z, w, d }) {
  return (
    <mesh position={[x, 0.14, z]} receiveShadow>
      <boxGeometry args={[w, 0.18, d]} />
      <meshStandardMaterial color="#a9aaa4" roughness={0.96} />
    </mesh>
  );
}

function Window({ position, rotation = [0, 0, 0], lit = false, scale = [0.72, 0.82, 0.05] }) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={scale} />
      <meshStandardMaterial
        color={lit ? "#f4d58a" : "#27384a"}
        emissive={lit ? "#d29a34" : "#17283a"}
        emissiveIntensity={lit ? 0.35 : 0.06}
        roughness={0.42}
        metalness={0.05}
      />
    </mesh>
  );
}

function Building({ building, index }) {
  const windowRows = Math.max(2, Math.floor(building.h / 2.45));
  const windowCols = Math.max(2, Math.floor(building.w / 2.05));
  const color = facadePalette[index % facadePalette.length];
  const balconyCount = Math.max(1, Math.floor(building.h / 4.2));

  return (
    <group position={[building.x, building.h / 2, building.z]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[building.w, building.h, building.d]} />
        <meshStandardMaterial color={color} roughness={0.86} metalness={0.05} />
      </mesh>

      <mesh position={[0, building.h / 2 - 0.14, 0]} castShadow>
        <boxGeometry args={[building.w + 0.16, 0.24, building.d + 0.16]} />
        <meshStandardMaterial color="#858b8e" roughness={0.9} />
      </mesh>

      {Array.from({ length: windowRows }).flatMap((_, row) =>
        Array.from({ length: windowCols }).flatMap((__, col) => {
          const y = -building.h / 2 + 1.25 + row * 2.35;
          const x = -building.w / 2 + 1.05 + col * 2.05;
          const lit = (row * 3 + col + index) % 7 < 2;
          return [
            <Window key={`front-${row}-${col}`} position={[x, y, -building.d / 2 - 0.035]} lit={lit} />,
            <Window key={`back-${row}-${col}`} position={[x, y, building.d / 2 + 0.035]} rotation={[0, Math.PI, 0]} lit={lit} />,
          ];
        }),
      )}

      {Array.from({ length: Math.max(1, Math.floor(building.d / 2.4)) }).flatMap((_, col) =>
        Array.from({ length: windowRows }).map((__, row) => {
          const y = -building.h / 2 + 1.25 + row * 2.35;
          const z = -building.d / 2 + 1.0 + col * 2.35;
          const lit = (row + col * 2 + index) % 8 < 2;
          return [
            <Window key={`left-${row}-${col}`} position={[-building.w / 2 - 0.035, y, z]} rotation={[0, Math.PI / 2, 0]} lit={lit} />,
            <Window key={`right-${row}-${col}`} position={[building.w / 2 + 0.035, y, z]} rotation={[0, -Math.PI / 2, 0]} lit={lit} />,
          ];
        }).flat(),
      )}

      {Array.from({ length: balconyCount }).map((_, level) => (
        <group key={`balcony-${level}`} position={[0, -building.h / 2 + 2.0 + level * 4.0, building.d / 2 + 0.42]}>
          <mesh position={[0, 0, 0.16]} castShadow>
            <boxGeometry args={[Math.min(building.w * 0.72, 4.8), 0.14, 0.9]} />
            <meshStandardMaterial color="#6f777b" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.48, 0.55]}>
            <boxGeometry args={[Math.min(building.w * 0.72, 4.8), 0.72, 0.06]} />
            <meshStandardMaterial color="#6a7072" roughness={0.78} metalness={0.2} />
          </mesh>
        </group>
      ))}

      <mesh position={[0, -building.h / 2 + 0.35, -building.d / 2 - 0.055]}>
        <boxGeometry args={[Math.min(building.w * 0.38, 2.8), 1.2, 0.16]} />
        <meshStandardMaterial color="#5b4639" roughness={0.9} />
      </mesh>
    </group>
  );
}

function Tree({ item }) {
  return (
    <group position={[item.x, 0, item.z]} scale={item.scale}>
      <mesh position={[0, 1.25, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.2, 2.5, 10]} />
        <meshStandardMaterial color="#65483a" roughness={1} />
      </mesh>
      <mesh position={[0, 2.65, 0]} castShadow>
        <icosahedronGeometry args={[1.2, 2]} />
        <meshStandardMaterial color="#3d6745" roughness={0.98} />
      </mesh>
      <mesh position={[0.26, 3.18, -0.1]} scale={[0.72, 0.72, 0.72]} castShadow>
        <icosahedronGeometry args={[0.72, 1]} />
        <meshStandardMaterial color="#537f52" roughness={0.98} />
      </mesh>
    </group>
  );
}

function Park({ park }) {
  return (
    <group position={[park.x, 0, park.z]}>
      <mesh receiveShadow>
        <boxGeometry args={[park.size, 0.18, park.size]} />
        <meshStandardMaterial color="#4d744e" roughness={1} />
      </mesh>
      <mesh position={[0, 0.105, 0]}>
        <boxGeometry args={[1.25, 0.035, park.size - 3]} />
        <meshStandardMaterial color="#c0b39d" roughness={0.98} />
      </mesh>
      <mesh position={[0, 0.108, 0]}>
        <boxGeometry args={[park.size - 3, 0.035, 1.25]} />
        <meshStandardMaterial color="#c0b39d" roughness={0.98} />
      </mesh>
      <mesh position={[0, 0.22, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[2.8, 3.05, 40]} />
        <meshStandardMaterial color="#708f63" roughness={1} />
      </mesh>
      <mesh position={[0, 0.12, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[2.7, 40]} />
        <meshStandardMaterial color="#5a7d53" roughness={1} />
      </mesh>
    </group>
  );
}

function Bench({ x, z, rotation = 0 }) {
  return (
    <group position={[x, 0, z]} rotation-y={rotation}>
      <mesh position={[0, 0.48, 0]} castShadow>
        <boxGeometry args={[1.8, 0.14, 0.42]} />
        <meshStandardMaterial color="#704f37" roughness={0.96} />
      </mesh>
      <mesh position={[0, 0.92, 0.15]}>
        <boxGeometry args={[1.8, 0.75, 0.12]} />
        <meshStandardMaterial color="#704f37" roughness={0.96} />
      </mesh>
      {[-0.65, 0.65].map((px) => (
        <mesh key={px} position={[px, 0.24, 0]}>
          <boxGeometry args={[0.12, 0.48, 0.25]} />
          <meshStandardMaterial color="#343a3d" metalness={0.55} roughness={0.54} />
        </mesh>
      ))}
    </group>
  );
}

function StreetLight({ x, z, rotation = 0 }) {
  return (
    <group position={[x, 0, z]} rotation-y={rotation}>
      <mesh position={[0, 2.25, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.07, 4.5, 10]} />
        <meshStandardMaterial color="#4d555b" metalness={0.72} roughness={0.4} />
      </mesh>
      <mesh position={[0.46, 4.35, 0]}>
        <boxGeometry args={[0.92, 0.08, 0.08]} />
        <meshStandardMaterial color="#596166" metalness={0.72} roughness={0.36} />
      </mesh>
      <mesh position={[0.88, 4.22, 0]}>
        <boxGeometry args={[0.18, 0.32, 0.2]} />
        <meshStandardMaterial color="#d8dfd8" emissive="#ffe8a3" emissiveIntensity={1.5} />
      </mesh>
    </group>
  );
}

function RoadsideCurb({ x, z, horizontal = false }) {
  return (
    <mesh position={[x, 0.075, z]} rotation-y={horizontal ? 0 : 0} receiveShadow>
      <boxGeometry args={horizontal ? [116, 0.14, 0.26] : [0.26, 0.14, 116]} />
      <meshStandardMaterial color="#8f9799" roughness={0.95} />
    </mesh>
  );
}

function Roundabout({ item }) {
  return (
    <group position={[item.x, 0.06, item.z]}>
      <mesh rotation-x={-Math.PI / 2}>
        <ringGeometry args={[5.25, 8, 64]} />
        <meshStandardMaterial color="#262c31" roughness={0.94} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.02, 0]}>
        <circleGeometry args={[3.65, 64]} />
        <meshStandardMaterial color="#588059" roughness={1} />
      </mesh>
      <mesh position={[0, 0.62, 0]} castShadow>
        <cylinderGeometry args={[1.15, 1.38, 1.1, 32]} />
        <meshStandardMaterial color="#c1c5c0" roughness={0.62} metalness={0.14} />
      </mesh>
      <mesh position={[0, 1.24, 0]}>
        <torusGeometry args={[0.58, 0.09, 10, 32]} />
        <meshStandardMaterial color="#8f9492" metalness={0.5} roughness={0.38} />
      </mesh>
    </group>
  );
}

function Landmark() {
  const c = CITY.civicComplex;
  return (
    <group position={[c.x, 0, c.z]}>
      {c.buildings.map((b, index) => (
        <group key={index} position={[b.x, 0, b.z]}>
          <mesh position={[0, b.h / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshStandardMaterial color={index === 0 ? "#d2d3ce" : "#9ca6aa"} roughness={0.72} metalness={0.14} />
          </mesh>
          <mesh position={[0, b.h + 0.18, 0]}>
            <boxGeometry args={[b.w * 0.76, 0.22, b.d * 0.7]} />
            <meshStandardMaterial color="#6f787c" roughness={0.72} metalness={0.2} />
          </mesh>
        </group>
      ))}
      <Text
        position={[0, 10.1, 0]}
        fontSize={1.25}
        color="#e4e8df"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#1c252a"
      >
        CAPITOL DISTRICT
      </Text>
    </group>
  );
}

function SukhnaLake() {
  const l = CITY.lake;
  return (
    <group position={[l.x, 0, l.z]}>
      <mesh rotation-x={-Math.PI / 2} scale={[l.rx, l.rz, 1]} receiveShadow>
        <circleGeometry args={[1, 64]} />
        <meshStandardMaterial color="#2f6274" metalness={0.18} roughness={0.2} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.03, 0]} scale={[l.rx + 1, l.rz + 1, 1]}>
        <ringGeometry args={[0.93, 1, 64]} />
        <meshStandardMaterial color="#87927f" roughness={1} />
      </mesh>
      <mesh position={[-2, 0.2, -1.2]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[2.1, 40]} />
        <meshStandardMaterial color="#5e8666" roughness={1} />
      </mesh>
      <Text
        position={[0, 0.35, 0]}
        rotation-x={-Math.PI / 2}
        fontSize={1.05}
        color="#e2f0f2"
        anchorX="center"
        anchorY="middle"
      >
        SUKHNA LAKE
      </Text>
    </group>
  );
}

function ChandigarhSign() {
  return (
    <group position={[0, 0, 12]}>
      <mesh position={[0, 2.25, 0]} castShadow>
        <boxGeometry args={[11.5, 0.24, 0.35]} />
        <meshStandardMaterial color="#59636a" metalness={0.45} roughness={0.5} />
      </mesh>
      {[-4.7, 4.7].map((x) => (
        <mesh key={x} position={[x, 1.2, 0]} castShadow>
          <boxGeometry args={[0.18, 2.15, 0.18]} />
          <meshStandardMaterial color="#59636a" metalness={0.45} roughness={0.5} />
        </mesh>
      ))}
      <Text
        position={[0, 1.82, -0.2]}
        rotation-x={-0.08}
        fontSize={1.0}
        color="#eef3e8"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.035}
        outlineColor="#263038"
      >
        CHANDIGARH
      </Text>
      <Text
        position={[0, 1.25, -0.2]}
        rotation-x={-0.08}
        fontSize={0.34}
        color="#c8d1c8"
        anchorX="center"
        anchorY="middle"
      >
        THE CITY BEAUTIFUL
      </Text>
    </group>
  );
}

export default function ChandigarhWorld() {
  const dashes = [];
  CITY.roadCenters.forEach((x) => {
    for (let z = -56; z <= 56; z += 6) {
      dashes.push(<RoadDash key={`v-${x}-${z}`} position={[x, 0.056, z]} />);
    }
  });

  const horizontalDashes = [];
  CITY.roadCenters.forEach((z) => {
    for (let x = -56; x <= 56; x += 6) {
      horizontalDashes.push(
        <RoadDash
          key={`h-${z}-${x}`}
          position={[x, 0.06, z]}
          scale={[2.4, 0.025, 0.12]}
        />,
      );
    }
  });

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[CITY.worldBounds * 2, CITY.worldBounds * 2]} />
        <meshStandardMaterial color="#66705d" roughness={1} />
      </mesh>

      {CITY.roadCenters.map((x) => (
        <group key={`road-v-${x}`}>
          <mesh position={[x, 0.018, 0]} receiveShadow>
            <boxGeometry args={[CITY.roadWidth, 0.035, 116]} />
            <meshStandardMaterial color="#34393d" roughness={0.94} />
          </mesh>
          <Sidewalk x={x - CITY.roadWidth / 2 - 1.1} z={0} w={2.1} d={116} />
          <Sidewalk x={x + CITY.roadWidth / 2 + 1.1} z={0} w={2.1} d={116} />
        </group>
      ))}

      {CITY.roadCenters.map((z) => (
        <group key={`road-h-${z}`}>
          <mesh position={[0, 0.019, z]} receiveShadow>
            <boxGeometry args={[116, 0.038, CITY.roadWidth]} />
            <meshStandardMaterial color="#34393d" roughness={0.94} />
          </mesh>
          <Sidewalk x={0} z={z - CITY.roadWidth / 2 - 1.1} w={116} d={2.1} />
          <Sidewalk x={0} z={z + CITY.roadWidth / 2 + 1.1} w={116} d={2.1} />
        </group>
      ))}

      <RoadsideCurb x={-52} z={0} />
      <RoadsideCurb x={52} z={0} />
      <RoadsideCurb x={0} z={-52} horizontal />
      <RoadsideCurb x={0} z={52} horizontal />

      {dashes}
      {horizontalDashes}

      {CITY.parks.map((park) => <Park key={park.id} park={park} />)}
      {CITY.buildings.map((building, index) => (
        <Building key={building.id} building={building} index={index} />
      ))}
      {CITY.trees.map((item, index) => <Tree key={index} item={item} />)}
      {[[-5, -5], [5, -5], [-5, 5], [5, 5]].map(([x, z], index) => (
        <Bench key={index} x={x} z={z} rotation={index % 2 ? Math.PI / 2 : 0} />
      ))}
      {CITY.roundabouts.map((item) => (
        <Roundabout key={`${item.x}-${item.z}`} item={item} />
      ))}
      <Landmark />
      <SukhnaLake />
      <ChandigarhSign />

      {[[-16, -52], [8, -52], [32, -52], [-16, 52], [8, 52], [32, 52]].map(
        ([x, z], index) => (
          <StreetLight key={index} x={x} z={z} rotation={index % 2 ? Math.PI : 0} />
        ),
      )}

      <Sky
        distance={450000}
        sunPosition={[80, 70, 20]}
        inclination={0.48}
        azimuth={0.24}
        rayleigh={1.5}
        turbidity={8}
      />
    </group>
  );
}
