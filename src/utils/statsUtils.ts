import { DEFAULT_USER_ITEMS, DEFAULT_USER_STATS } from "src/constants";
import { inItemsJson } from "./itemsUtils";
import { UserItems, UserStats } from "src/types";

export const countWords = (text: string): number => {
  const regex =
    /([^\x20-\x40\x5B-\x60\x7B-\xBF\u02B0-\u036F\u00D7\u00F7\u2000-\u2BFF])+/gu;

  return (text.match(regex) || []).length;
};

export const calcAndAddPastedText = (
  clipboardEvent: ClipboardEvent,
  addWordsToFileCount: (words: number) => void,
) => {
  const pastedText = clipboardEvent.clipboardData?.getData("text");

  if (pastedText) {
    let wordsCount = countWords(pastedText);

    // Checking whether the pasting was done on a new line or not, is useful for not adding more words that should be to the userData
    const target = (clipboardEvent.target as HTMLElement).innerHTML;
    if (target) wordsCount--;

    addWordsToFileCount(wordsCount);
  }
};

export function sanitizeUserLevel(rawData: unknown): number {
  if (
    !rawData ||
    typeof rawData !== "object" ||
    !("userStats" in rawData) ||
    typeof rawData.userStats !== "object" ||
    !rawData.userStats
  )
    return 0;

  const rawUserStats: object = rawData.userStats;

  if ("level" in rawUserStats && typeof rawUserStats.level === "number")
    return rawUserStats.level;
  return 0;
}
/**
 * Checks that userStats of the data.json are correct and if not the default values are given
 */
export function sanitizeUserStats(rawData: unknown): UserStats {
  if (
    !rawData ||
    typeof rawData !== "object" ||
    !("userStats" in rawData) ||
    typeof rawData.userStats !== "object" ||
    !rawData.userStats
  )
    return DEFAULT_USER_STATS;

  const rawUserStats: object = rawData.userStats;
  const sanitizedUserStats: UserStats = DEFAULT_USER_STATS;

  if ("exp" in rawUserStats && typeof rawUserStats.exp === "number")
    sanitizedUserStats.exp = rawUserStats.exp;
  if ("expGoal" in rawUserStats && typeof rawUserStats.expGoal === "number")
    sanitizedUserStats.expGoal = rawUserStats.expGoal;
  if ("coins" in rawUserStats && typeof rawUserStats.coins === "number")
    sanitizedUserStats.coins = rawUserStats.coins;

  return sanitizedUserStats;
}

/**
 * Checks that userItats of the data.json are correct and if not the default values are given
 */
export function sanitizeUserItems(rawData: unknown): UserItems {
  if (
    !rawData ||
    typeof rawData !== "object" ||
    !("userItems" in rawData) ||
    !rawData.userItems ||
    typeof rawData.userItems !== "object"
  )
    return DEFAULT_USER_ITEMS;

  const rawUserItems = rawData.userItems;
  const sanitizedUserItems: UserItems = DEFAULT_USER_ITEMS;

  if (
    "equiped" in rawUserItems &&
    typeof rawUserItems.equiped === "object" &&
    rawUserItems.equiped
  ) {
    if (
      "Backgrounds" in rawUserItems.equiped &&
      typeof rawUserItems.equiped.Backgrounds === "string" &&
      inItemsJson("Backgrounds", rawUserItems.equiped.Backgrounds)
    ) {
      sanitizedUserItems.equiped.Backgrounds = rawUserItems.equiped.Backgrounds;
    }
    if (
      "Accessories" in rawUserItems.equiped &&
      typeof rawUserItems.equiped.Accessories === "string" &&
      inItemsJson("Accessories", rawUserItems.equiped.Accessories)
    ) {
      sanitizedUserItems.equiped.Accessories = rawUserItems.equiped.Accessories;
    }
  }

  if (
    "obtained" in rawUserItems &&
    typeof rawUserItems.obtained === "object" &&
    rawUserItems.obtained
  ) {
    if (
      "Backgrounds" in rawUserItems.obtained &&
      Array.isArray(rawUserItems.obtained.Backgrounds)
    ) {
      for (const item of rawUserItems.obtained.Backgrounds) {
        if (
          typeof item === "string" &&
          !sanitizedUserItems.obtained.Backgrounds.includes(item) &&
          inItemsJson("Backgrounds", item)
        ) {
          sanitizedUserItems.obtained.Backgrounds.push(item);
        }
      }
    }
    if (
      "Accessories" in rawUserItems.obtained &&
      Array.isArray(rawUserItems.obtained.Accessories)
    ) {
      for (const item of rawUserItems.obtained.Accessories) {
        if (
          typeof item === "string" &&
          !sanitizedUserItems.obtained.Accessories.includes(item) &&
          inItemsJson("Accessories", item)
        ) {
          sanitizedUserItems.obtained.Accessories.push(item);
        }
      }
    }
  }

  return sanitizedUserItems;
}
