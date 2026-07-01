import Items from "src/jsons/items.json";
import { Plugin, TFile, Vault, Workspace } from "obsidian";
import { countWords } from "../utils/statsUtils";
import {
  ItemCategory,
  ItemsJson,
  UserData,
  UserItems,
  UserStats,
} from "../types";
import { DEFAULT_USER_ITEMS, DEFAULT_USER_STATS } from "src/constants";

export default class StatsHandler {
  private vault: Vault;
  private workspace: Workspace;
  private plugin: Plugin;
  private userData: UserData;
  private userStats: UserStats;
  private userItems: UserItems;
  private actualTFile: TFile | undefined;
  private isValid: boolean = false;
  private isDataLoaded: boolean = false;
  private prohibitedTagsList = ["excalidraw-plugin"];

  constructor(
    vault: Vault,
    workspace: Workspace,
    plugin: Plugin,
    rawData: unknown,
  ) {
    this.vault = vault;
    this.workspace = workspace;
    this.plugin = plugin;

    this.userData = {
      filesCount: -1,
      fileWordCount: -1,
    };

    this.userStats = this.sanitizeUserStats(rawData);
    this.userItems = this.sanitizeUserItems(rawData);
    this.isDataLoaded = true;
  }

  /**
   * Checks if the given item exists in item.json
   */
  isValidItem(category: ItemCategory, item: string): boolean {
    const itemsJson = JSON.parse(JSON.stringify(Items)) as ItemsJson;

    const itemsOfCategory = itemsJson.find(
      (i) => i.category === category,
    )?.items;

    if (!itemsOfCategory) return false;

    const itemsNames = itemsOfCategory.map((i) => i.name);

    return itemsNames.contains(item);
  }

  /**
   * Checks that userStats of the data.json are correct and if not the default values are given
   */
  sanitizeUserStats(rawData: unknown): UserStats {
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
    if ("level" in rawUserStats && typeof rawUserStats.level === "number")
      sanitizedUserStats.level = rawUserStats.level;
    if ("coins" in rawUserStats && typeof rawUserStats.coins === "number")
      sanitizedUserStats.coins = rawUserStats.coins;

    return sanitizedUserStats;
  }

  /**
   * Checks that userItats of the data.json are correct and if not the default values are given
   */
  sanitizeUserItems(rawData: unknown): UserItems {
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
        this.isValidItem("Backgrounds", rawUserItems.equiped.Backgrounds)
      ) {
        sanitizedUserItems.equiped.Backgrounds =
          rawUserItems.equiped.Backgrounds;
      }
      if (
        "Accessories" in rawUserItems.equiped &&
        typeof rawUserItems.equiped.Accessories === "string" &&
        this.isValidItem("Accessories", rawUserItems.equiped.Accessories)
      ) {
        sanitizedUserItems.equiped.Accessories =
          rawUserItems.equiped.Accessories;
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
            this.isValidItem("Backgrounds", item)
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
            this.isValidItem("Accessories", item)
          ) {
            sanitizedUserItems.obtained.Accessories.push(item);
          }
        }
      }
    }

    return sanitizedUserItems;
  }

  onFileOpen = (tFile: TFile | null) => {
    // Gets the tFile from the props or the workspace.getActiveFile
    const openedFile = tFile || this.workspace.getActiveFile();

    // Counts the words of the new file and checks if the file is Valid
    if (openedFile) {
      this.isValid = this.checkIsFileValid(openedFile);
      if (this.isValid) void this.getFileWordsCount(openedFile);
    } else {
      this.isValid = false;
    }

    const oldFilesCount = this.userData.filesCount;

    // Calc of the files diff
    const newFileCount = this.vault.getMarkdownFiles().length;
    this.userData.filesCount = newFileCount;
    const filesDif = newFileCount - oldFilesCount;

    // Is very strange that there is not actualTFile so I decided to not do the count if there is not
    if (!filesDif || oldFilesCount === -1 || !this.actualTFile) return;

    // Update the coins with the filesDif
    const newCoins = this.userStats.coins + filesDif * 5;

    this.userStats = {
      ...this.userStats,
      coins: newCoins,
    };
  };

  /*
   * Checks the validity of the file, returns true (is valid) or false (is not valid)
   * */
  checkIsFileValid = (tFile: TFile) => {
    // Check if the file is markdown
    if (tFile.extension !== "md") return false;

    // Get the tags from the file
    const frontmatter =
      this.plugin.app.metadataCache.getFileCache(tFile)?.frontmatter;

    if (!frontmatter) return true; // This means that there are no tags in the file

    const fileTagsList = Object.keys(frontmatter);

    // Check if there is some "prohibited" tag in the file
    if (
      this.prohibitedTagsList.some((prohibitedTag) =>
        fileTagsList.includes(prohibitedTag),
      )
    )
      return false;

    return true;
  };

  /*
   * Gets the difference of the word count of the current file and updates de exp
   */
  updateUserDataNStats = (text: string) => {
    // Prevents strange bugs
    if (this.workspace.getActiveFile() !== this.actualTFile) return;

    if (!this.isValid) return;

    const oldUserData = { ...this.userData };

    const newWordsCount = countWords(text);
    this.userData.fileWordCount = newWordsCount;
    const fileWordsDif = newWordsCount - oldUserData.fileWordCount;

    // Stats Calculation
    const newExp = fileWordsDif + this.userStats.exp;

    if (oldUserData.fileWordCount !== -1 && newExp !== this.userStats.exp) {
      this.userStats = {
        ...this.userStats,
        exp: newExp > 0 ? newExp : 0,
      };
    }
  };

  /*
   * Gets the words of the tFile given and updates it in the userData
   */
  getFileWordsCount = async (tFile: TFile): Promise<number> => {
    return await this.vault.cachedRead(tFile).then((text) => {
      const words = (this.userData.fileWordCount = countWords(text));
      this.actualTFile = tFile;
      return words;
    });
  };

  addWordsToFileCount = (wordsCount: number) => {
    this.userData.fileWordCount += wordsCount;
  };

  getUserData = (): UserData => {
    return { ...this.userData };
  };

  getUserStats = (): UserStats => {
    return { ...this.userStats };
  };

  getUserItems = (): UserItems => {
    return { ...this.userItems };
  };

  saveUserData = async (): Promise<void> => {
    if (this.isDataLoaded) {
      await this.plugin.saveData({
        userStats: this.userStats,
        userItems: this.userItems,
      });
    }
  };

  petLevelUp = (expRemaining: number): UserStats => {
    this.userStats = {
      exp: expRemaining,
      expGoal: Math.round(
        this.userStats.expGoal + 30000 / this.userStats.expGoal,
      ),
      level: this.userStats.level + 1,
      coins: this.userStats.coins + 50,
    };

    return { ...this.userStats };
  };

  petChangeExp = (newAddExp: number) => {
    this.userStats = {
      ...this.userStats,
      exp: newAddExp,
    };

    return { ...this.userStats };
  };

  addNewItem = (
    itemName: string,
    itemCategory: ItemCategory,
    itemPrice: number,
  ): [UserStats, UserItems] => {
    this.userStats.coins = this.userStats.coins - itemPrice;
    this.userItems.obtained[itemCategory].push(itemName);

    return [{ ...this.userStats }, { ...this.userItems }];
  };

  equipItem = (itemName: string, itemCategory: ItemCategory): UserItems => {
    this.userItems.equiped[itemCategory] = itemName;
    return { ...this.userItems };
  };

  unequipItem = (itemCategory: ItemCategory): UserItems => {
    this.userItems.equiped[itemCategory] = "";
    return { ...this.userItems };
  };
}
