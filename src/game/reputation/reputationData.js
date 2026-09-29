export const REPUTATION_STORAGE_KEY = "cityrush-reputation-v1";

export const DEFAULT_REPUTATION = {
  score: 0,
  totalGained: 0,
  missionsCompleted: 0,
  successfulStreak: 0,
  bestStreak: 0,
  lastMissionId: null,
};

export const REPUTATION_RANKS = [
  { id: "rookie", name: "STREET ROOKIE", threshold: 0, payoutBonus: 0 },
  { id: "driver", name: "LICENSED DRIVER", threshold: 100, payoutBonus: 0.05 },
  { id: "courier", name: "TRUSTED COURIER", threshold: 250, payoutBonus: 0.1 },
  { id: "ace", name: "SECTOR ACE", threshold: 500, payoutBonus: 0.15 },
  { id: "legend", name: "CITY LEGEND", threshold: 900, payoutBonus: 0.2 },
];

const toSafeNumber = (value, fallback = 0) =>
  Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : fallback;

export function normalizeReputation(value) {
  const source = value && typeof value === "object" ? value : DEFAULT_REPUTATION;

  return {
    score: Math.floor(toSafeNumber(source.score)),
    totalGained: Math.floor(toSafeNumber(source.totalGained)),
    missionsCompleted: Math.floor(toSafeNumber(source.missionsCompleted)),
    successfulStreak: Math.floor(toSafeNumber(source.successfulStreak)),
    bestStreak: Math.floor(toSafeNumber(source.bestStreak)),
    lastMissionId: typeof source.lastMissionId === "string" ? source.lastMissionId : null,
  };
}

export function loadReputation() {
  if (typeof window === "undefined") return normalizeReputation(DEFAULT_REPUTATION);

  try {
    const raw = window.localStorage.getItem(REPUTATION_STORAGE_KEY);
    return raw
      ? normalizeReputation(JSON.parse(raw))
      : normalizeReputation(DEFAULT_REPUTATION);
  } catch {
    return normalizeReputation(DEFAULT_REPUTATION);
  }
}

export function saveReputation(value) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(
      REPUTATION_STORAGE_KEY,
      JSON.stringify(normalizeReputation(value)),
    );
  } catch {
    // Storage can be unavailable in private/restricted browser contexts.
  }
}

export function getCurrentRank(score = 0) {
  const normalizedScore = Math.max(0, Math.floor(Number(score) || 0));
  return [...REPUTATION_RANKS]
    .reverse()
    .find((rank) => normalizedScore >= rank.threshold) ?? REPUTATION_RANKS[0];
}

export function getNextRank(score = 0) {
  const current = getCurrentRank(score);
  return REPUTATION_RANKS.find((rank) => rank.threshold > current.threshold) ?? null;
}

export function getRankProgress(score = 0) {
  const normalizedScore = Math.max(0, Math.floor(Number(score) || 0));
  const current = getCurrentRank(normalizedScore);
  const next = getNextRank(normalizedScore);

  if (!next) {
    return { current, next: null, progress: 100, pointsToNext: 0 };
  }

  const span = next.threshold - current.threshold;
  const progress = Math.min(
    100,
    Math.max(0, ((normalizedScore - current.threshold) / span) * 100),
  );

  return {
    current,
    next,
    progress,
    pointsToNext: Math.max(0, next.threshold - normalizedScore),
  };
}

export function getPayoutMultiplier(score = 0) {
  return 1 + getCurrentRank(score).payoutBonus;
}

export function getPayoutBonusPercent(score = 0) {
  return Math.round(getCurrentRank(score).payoutBonus * 100);
}

export function calculateMissionReputation({
  basePoints = 25,
  timeLeft = 0,
  duration = 1,
  streak = 0,
}) {
  const base = Math.max(0, Math.floor(Number(basePoints) || 0));
  const speedBonus =
    Number(duration) > 0 && Number(timeLeft) >= Number(duration) * 0.35 ? 10 : 0;
  const streakBonus = streak >= 2 ? 5 : 0;

  return {
    base,
    speedBonus,
    streakBonus,
    total: base + speedBonus + streakBonus,
  };
}

export function addMissionReputation(reputation, mission) {
  const current = normalizeReputation(reputation);
  const nextStreak = current.successfulStreak + 1;
  const gain = calculateMissionReputation({
    basePoints: mission?.reputation ?? 25,
    timeLeft: mission?.timeLeft ?? 0,
    duration: mission?.duration ?? 1,
    streak: nextStreak,
  });

  const nextScore = current.score + gain.total;

  return {
    reputation: normalizeReputation({
      ...current,
      score: nextScore,
      totalGained: current.totalGained + gain.total,
      missionsCompleted: current.missionsCompleted + 1,
      successfulStreak: nextStreak,
      bestStreak: Math.max(current.bestStreak, nextStreak),
      lastMissionId: mission?.id ?? current.lastMissionId,
    }),
    gained: gain,
    rankedUp: getCurrentRank(nextScore).id !== getCurrentRank(current.score).id,
    previousRank: getCurrentRank(current.score),
    currentRank: getCurrentRank(nextScore),
  };
}

export function resetMissionStreak(reputation) {
  return normalizeReputation({
    ...reputation,
    successfulStreak: 0,
  });
}
