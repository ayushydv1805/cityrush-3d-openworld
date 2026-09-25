const ROAD_CENTERS = [-48, -24, 0, 24, 48];
const SECTOR_CENTERS = [-36, -12, 12, 36];
const SECTOR_IDS = [
  ["17", "18", "19", "20"],
  ["21", "22", "27", "28"],
  ["29", "30", "31", "32"],
  ["33", "34", "35", "36"],
];

const PARK_SECTORS = new Set(["17", "22", "35"]);
const ROAD_WIDTH = 8;
const WORLD_BOUNDS = 60;

const buildings = [];
const parks = [];
const trees = [];
const roundabouts = [
  { x: 0, z: 0, radius: 5.4 },
  { x: -24, z: 0, radius: 4.7 },
  { x: 24, z: 0, radius: 4.7 },
  { x: 0, z: -24, radius: 4.7 },
  { x: 0, z: 24, radius: 4.7 },
];

const heights = [5, 7, 9, 6.5, 11];
const tones = ["#202b4b", "#263553", "#1b2946", "#2d3a59"];

for (let row = 0; row < SECTOR_CENTERS.length; row += 1) {
  for (let col = 0; col < SECTOR_CENTERS.length; col += 1) {
    const id = SECTOR_IDS[row][col];
    const x = SECTOR_CENTERS[col];
    const z = SECTOR_CENTERS[row];

    if (PARK_SECTORS.has(id)) {
      parks.push({ id, x, z, size: 18 });
      const parkTrees = [
        [-6, -6, 0.9], [0, -7, 1.1], [6, -5, 0.85],
        [-7, 1, 1.0], [6, 2, 1.15], [-4, 6, 0.9], [4, 6, 1.0],
      ];
      parkTrees.forEach(([dx, dz, scale]) => {
        trees.push({ x: x + dx, z: z + dz, scale, park: id });
      });
      continue;
    }

    const patterns = [
      [-6.4, -6.2, 6.8, 6.2],
      [6.4, -5.8, 6.6, 7],
      [-6.2, 6.4, 7.4, 6.4],
      [6.1, 6.3, 6.2, 7.2],
    ];

    patterns.forEach(([dx, dz, w, d], index) => {
      buildings.push({
        id: `s${id}-b${index + 1}`,
        sector: id,
        x: x + dx,
        z: z + dz,
        w,
        d,
        h: heights[(row + col + index) % heights.length],
        color: tones[(row * 2 + col + index) % tones.length],
      });
    });
  }
}

roundabouts.forEach(({ x, z }) => {
  trees.push(
    { x: x - 7.5, z: z - 6.5, scale: 0.72, park: "roundabout" },
    { x: x + 7.5, z: z + 6.5, scale: 0.72, park: "roundabout" },
  );
});

const lake = {
  x: 27,
  z: -52,
  rx: 14,
  rz: 8,
};

const civicComplex = {
  x: 4,
  z: 38,
  buildings: [
    { x: 0, z: 0, w: 11, d: 5, h: 8 },
    { x: -7, z: -5, w: 4, d: 8, h: 5 },
    { x: 7, z: -5, w: 4, d: 8, h: 6 },
  ],
};

export const CITY = {
  name: "Chandigarh",
  subtitle: "Sector Grid",
  version: "0.5.0",
  worldBounds: WORLD_BOUNDS,
  roadWidth: ROAD_WIDTH,
  roadCenters: ROAD_CENTERS,
  sectorCenters: SECTOR_CENTERS,
  sectorIds: SECTOR_IDS.flat(),
  buildings,
  parks,
  trees,
  roundabouts,
  lake,
  civicComplex,
  spawn: [-20, 0, 12],
  trafficVehicles: 14,
  pedestrianCount: 12,
  vehicleSpawn: [-24, 0.42, 12],
  obstacles: [
    ...buildings.map((b) => ({
      type: "box",
      x: b.x,
      z: b.z,
      w: b.w,
      d: b.d,
    })),
    ...roundabouts.map((r) => ({
      type: "circle",
      x: r.x,
      z: r.z,
      radius: 3.1,
    })),
    ...civicComplex.buildings.map((b) => ({
      type: "box",
      x: civicComplex.x + b.x,
      z: civicComplex.z + b.z,
      w: b.w,
      d: b.d,
    })),
  ],
};
