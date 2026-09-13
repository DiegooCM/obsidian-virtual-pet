import { Plugin, TFile, Vault, Workspace } from "obsidian";
import {
  calcAndAddPastedText,
  countWords,
  sanitizeUserItems,
  sanitizeUserLevel,
  sanitizeUserStats,
} from "../utils/statsUtils";
import { ItemCategory, UserData, UserItems, UserStats } from "../types";

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
  private statsListeners = new Set<() => void>();
  private levelListeners = new Set<() => void>();
  private isPasted = false;
  userLevel: number;

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

    this.userStats = sanitizeUserStats(rawData);
    this.userLevel = sanitizeUserLevel(rawData);
    this.userItems = sanitizeUserItems(rawData);
    this.isDataLoaded = true;

    this.registerEvents();
  }

  registerEvents() {
    this.plugin.registerEvent(
      // When the user types
      this.plugin.app.workspace.on("editor-change", (editor) => {
        // Update info
        const fileText = editor.getValue();

        if (this.isPasted) this.isPasted = false;
        else this.updateUserDataNStats(fileText);

        this.updateUserDataNStats(fileText);
      }),
    );

    this.plugin.registerEvent(
      this.plugin.app.workspace.on("quit", async () => {
        await this.saveUserData();
      }),
    );

    this.plugin.registerEvent(
      // When a file is open
      this.plugin.app.workspace.on("file-open", async (tFile) => {
        if (!tFile) return;
        // Update info
        this.onFileOpen(tFile);

        const fileText = await this.vault.cachedRead(tFile);
        // Sets data and stats in petview
        this.updateUserDataNStats(fileText);
      }),
    );

    this.plugin.registerEvent(
      this.plugin.app.workspace.on("editor-paste", (evt) => {
        // eslint-disable-next-line obsidianmd/editor-drop-paste -- Only observing the paste event to count words; intentionally not intercepting Obsidian's default paste behavior.
        if (evt.defaultPrevented) return;

        // Count the pasted words and add them to the userData
        calcAndAddPastedText(evt, this.addWordsToFileCount);
        this.isPasted = true;
        return true;
      }),
    );

    this.plugin.registerEvent(
      this.plugin.app.workspace.on("active-leaf-change", async () => {
        await this.saveUserData();
      }),
    );
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

  addUserExp(expToAdd: number) {
    // Stats Calculation
    const newExp = expToAdd + this.userStats.exp;

    // Level up
    if (newExp >= this.userStats.expGoal) {
      const expRemaining = newExp - this.userStats.expGoal;
      this.levelUp(expRemaining);
    }
    // Non level up
    else {
      // Prevention of negative exp and updates the exp
      if (newExp !== this.userStats.exp) {
        this.userStats = {
          ...this.userStats,
          exp: newExp > 0 ? newExp : 0,
        };
      }
    }
    this.statsListeners.forEach((l) => l());
  }

  /*
   * Gets the difference of the word count of the current file and updates the exp
   */
  updateUserDataNStats = (text: string) => {
    // Check if the new word count is from the actual file
    if (this.workspace.getActiveFile() !== this.actualTFile) return;

    if (!this.isValid) return;

    const oldUserData = { ...this.userData };
    const newWordsCount = countWords(text);
    this.userData.fileWordCount = newWordsCount;
    const fileWordsDif = newWordsCount - oldUserData.fileWordCount;

    // The word count of the file was not counted
    if (oldUserData.fileWordCount === -1) return;

    this.addUserExp(fileWordsDif);
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

  subscribeUserStats = (listener: () => void) => {
    this.statsListeners.add(listener);
    return () => this.statsListeners.delete(listener);
  };

  getUserStats = () => this.userStats;

  subscribeUserLevel = (listener: () => void) => {
    this.levelListeners.add(listener);
    return () => this.levelListeners.delete(listener);
  };

  getUserLevel = () => this.userLevel;

  getUserItems = (): UserItems => {
    return { ...this.userItems };
  };

  saveUserData = async (): Promise<void> => {
    if (this.isDataLoaded) {
      await this.plugin.saveData({
        userStats: {
          ...this.userStats,
          level: this.userLevel,
        },
        userItems: this.userItems,
      });
    }
  };

  levelUp = (expRemaining: number): UserStats => {
    this.userStats = {
      exp: expRemaining,
      expGoal: Math.round(
        this.userStats.expGoal + 30000 / this.userStats.expGoal,
      ),
      coins: this.userStats.coins + 50,
    };
    this.userLevel += 1;
    this.levelListeners.forEach((l) => l());

    return this.userStats;
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
