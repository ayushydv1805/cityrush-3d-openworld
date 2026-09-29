export const ECONOMY_STORAGE_KEY = "cityrush-economy-v1";

export const DEFAULT_ECONOMY = {
  cash: 1500,
  totalEarned: 0,
  missionsCompleted: 0,
  bestPayout: 0,
};

const toSafeNumber = (value, fallback) =>
  Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : fallback;

export function normalizeEconomy(value) {
  if (!value || typeof value !== "object") {
    return { ...DEFAULT_ECONOMY };
  }

  return {
    cash: Math.floor(toSafeNumber(value.cash, DEFAULT_ECONOMY.cash)),
    totalEarned: Math.floor(toSafeNumber(value.totalEarned, DEFAULT_ECONOMY.totalEarned)),
    missionsCompleted: Math.floor(
      toSafeNumber(value.missionsCompleted, DEFAULT_ECONOMY.missionsCompleted),
    ),
    bestPayout: Math.floor(toSafeNumber(value.bestPayout, DEFAULT_ECONOMY.bestPayout)),
  };
}

export function loadEconomy() {
  if (typeof window === "undefined") {
    return { ...DEFAULT_ECONOMY };
  }

  try {
    const raw = window.localStorage.getItem(ECONOMY_STORAGE_KEY);
    return raw ? normalizeEconomy(JSON.parse(raw)) : { ...DEFAULT_ECONOMY };
  } catch {
    return { ...DEFAULT_ECONOMY };
  }
}

export function saveEconomy(value) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(
      ECONOMY_STORAGE_KEY,
      JSON.stringify(normalizeEconomy(value)),
    );
  } catch {
    // Storage can be unavailable in private/restricted browser contexts.
  }
}

export function addMissionReward(economy, amount) {
  const reward = Math.max(0, Math.floor(Number(amount) || 0));

  return normalizeEconomy({
    ...economy,
    cash: economy.cash + reward,
    totalEarned: economy.totalEarned + reward,
    missionsCompleted: economy.missionsCompleted + 1,
    bestPayout: Math.max(economy.bestPayout, reward),
  });
}

export function spendCash(economy, amount) {
  const cost = Math.max(0, Math.floor(Number(amount) || 0));
  const normalized = normalizeEconomy(economy);

  if (cost > normalized.cash) return normalized;

  return {
    ...normalized,
    cash: normalized.cash - cost,
  };
}

export function formatRupees(amount) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.floor(Number(amount) || 0)));
}
