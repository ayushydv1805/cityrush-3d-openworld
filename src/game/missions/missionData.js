const checkpoint = (x, z, label, radius = 5.2) => ({
  position: [x, 0.04, z],
  label,
  radius,
});

export const MISSION_LIST = [
  {
    id: "first-run",
    name: "FIRST RUN",
    description: "Take the Civic Cruiser through Chandigarh's central boulevard loop.",
    duration: 90,
    reward: 500,
    checkpoints: [
      checkpoint(-24, 0, "WEST ROUNDABOUT"),
      checkpoint(0, 0, "CENTRAL ROUNDABOUT"),
      checkpoint(24, 0, "EAST BOULEVARD"),
      checkpoint(24, 24, "SECTOR 22"),
    ],
  },
  {
    id: "sector-courier",
    name: "SECTOR COURIER",
    description: "Carry the package across the sector grid before the clock runs out.",
    duration: 85,
    reward: 800,
    checkpoints: [
      checkpoint(-24, -24, "SECTOR 27"),
      checkpoint(-48, -24, "WEST GATE"),
      checkpoint(-48, 24, "SECTOR 17"),
      checkpoint(0, 24, "NORTH ROUNDABOUT"),
    ],
  },
  {
    id: "roundabout-run",
    name: "ROUNDABOUT RUN",
    description: "Chain the major junctions in a fast precision driving route.",
    duration: 110,
    reward: 1200,
    checkpoints: [
      checkpoint(-24, 0, "WEST ROUNDABOUT"),
      checkpoint(0, 0, "CENTRAL ROUNDABOUT"),
      checkpoint(24, 0, "EAST ROUNDABOUT"),
      checkpoint(24, 24, "NORTH-EAST SECTOR"),
      checkpoint(0, 24, "NORTH ROUNDABOUT"),
      checkpoint(-24, 24, "NORTH-WEST SECTOR"),
    ],
  },
];

export const getMission = (id) =>
  MISSION_LIST.find((mission) => mission.id === id) ?? null;
