import { VEHICLE } from "../vehicles/vehicleData";

export const GARAGE_STORAGE_KEY = "cityrush-garage-v1";

export const DEFAULT_GARAGE = {
  version: 1,
  vehicleId: VEHICLE.id,
  upgrades: {
    engine: 0,
    brakes: 0,
    steering: 0,
    grip: 0,
  },
};

export const UPGRADE_DEFINITIONS = {
  engine: {
    label: "ENGINE",
    short: "POWER",
    description: "More acceleration and higher top speed.",
    levels: [
      { cost: 700, maxSpeed: 0.08, acceleration: 0.10 },
      { cost: 1100, maxSpeed: 0.08, acceleration: 0.10 },
      { cost: 1600, maxSpeed: 0.09, acceleration: 0.10 },
    ],
  },
  brakes: {
    label: "BRAKES",
    short: "STOPPING",
    description: "Sharper braking response for tighter routes.",
    levels: [
      { cost: 550, braking: 0.15 },
      { cost: 900, braking: 0.15 },
      { cost: 1400, braking: 0.16 },
    ],
  },
  steering: {
    label: "STEERING",
    short: "TURN-IN",
    description: "Quicker steering input at speed.",
    levels: [
      { cost: 600, steering: 0.12 },
      { cost: 1000, steering: 0.12 },
      { cost: 1500, steering: 0.14 },
    ],
  },
  grip: {
    label: "GRIP",
    short: "HANDLING",
    description: "Improves corner stability and turn control.",
    levels: [
      { cost: 650, grip: 0.14 },
      { cost: 1050, grip: 0.14 },
      { cost: 1550, grip: 0.16 },
    ],
  },
};

const UPGRADE_KEYS = Object.keys(UPGRADE_DEFINITIONS);

const clampLevel = (value, max) =>
  Math.min(Math.max(Math.floor(Number(value) || 0), 0), max);

export function normalizeGarage(value) {
  const source = value && typeof value === "object" ? value : DEFAULT_GARAGE;
  const upgrades = source.upgrades && typeof source.upgrades === "object" ? source.upgrades : {};

  return {
    version: 1,
    vehicleId: VEHICLE.id,
    upgrades: Object.fromEntries(
      UPGRADE_KEYS.map((key) => [
        key,
        clampLevel(upgrades[key], UPGRADE_DEFINITIONS[key].levels.length),
      ]),
    ),
  };
}

export function loadGarage() {
  if (typeof window === "undefined") return normalizeGarage(DEFAULT_GARAGE);

  try {
    const raw = window.localStorage.getItem(GARAGE_STORAGE_KEY);
    return raw ? normalizeGarage(JSON.parse(raw)) : normalizeGarage(DEFAULT_GARAGE);
  } catch {
    return normalizeGarage(DEFAULT_GARAGE);
  }
}

export function saveGarage(value) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(GARAGE_STORAGE_KEY, JSON.stringify(normalizeGarage(value)));
  } catch {
    // Storage can be unavailable in private/restricted browser contexts.
  }
}

export function getNextUpgrade(key, garage) {
  const definition = UPGRADE_DEFINITIONS[key];
  if (!definition) return null;

  const level = normalizeGarage(garage).upgrades[key];
  const next = definition.levels[level];
  if (!next) return null;

  return {
    ...next,
    key,
    label: definition.label,
    short: definition.short,
    nextLevel: level + 1,
    maxLevel: definition.levels.length,
  };
}

export function buyUpgrade(key, garage) {
  const normalized = normalizeGarage(garage);
  const definition = UPGRADE_DEFINITIONS[key];

  if (!definition) return normalized;

  const level = normalized.upgrades[key];
  if (level >= definition.levels.length) return normalized;

  return {
    ...normalized,
    upgrades: {
      ...normalized.upgrades,
      [key]: level + 1,
    },
  };
}

export function getEffectiveVehicleStats(garage) {
  const normalized = normalizeGarage(garage);
  const stats = { ...VEHICLE };

  UPGRADE_KEYS.forEach((key) => {
    const definition = UPGRADE_DEFINITIONS[key];
    const level = normalized.upgrades[key];

    definition.levels.slice(0, level).forEach((upgrade) => {
      ["maxSpeed", "reverseSpeed", "acceleration", "braking", "steering", "grip"].forEach((stat) => {
        if (upgrade[stat]) {
          stats[stat] *= 1 + upgrade[stat];
        }
      });
    });
  });

  stats.garageTier = Math.max(...Object.values(normalized.upgrades));
  return stats;
}

export function getGarageTier(garage) {
  return Math.max(...Object.values(normalizeGarage(garage).upgrades));
}

export function getUpgradeSummary(garage) {
  const normalized = normalizeGarage(garage);

  return UPGRADE_KEYS.map((key) => {
    const definition = UPGRADE_DEFINITIONS[key];
    const level = normalized.upgrades[key];
    return {
      key,
      label: definition.label,
      short: definition.short,
      description: definition.description,
      level,
      maxLevel: definition.levels.length,
      next: getNextUpgrade(key, normalized),
    };
  });
}
