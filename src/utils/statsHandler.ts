import { Plugin, TFile, Vault, Workspace } from "obsidian";
import { countWords } from "../utils/statsUtils";
import { ItemCategory, UserData, UserItems, UserStats } from "../types";

export default class StatsHandler {
  private vault: Vault;
  private workspace: Workspace;
  private plugin: Plugin;
  private userData: UserData;
  private userStats: UserStats;
  private userItems: UserItems;
  private actualTFile: TFile;
  private prohibitedTagsList = ["excalidraw-plugin"] 
  private isCounting: boolean;

  constructor(vault: Vault, workspace: Workspace, plugin: Plugin) {
    this.vault = vault;
    this.workspace = workspace;
    this.plugin = plugin;

    this.userData = {
      filesCount: -1,
      fileWordCount: -1,
    };
    this.userStats = {
      exp: 0,
      expGoal: 10,
      level: 0,
      coins: 1000,
    };
    this.userItems = {
      equiped: {
        Backgrounds: "01",
        Accessories: "",
      },
      obtained: {
        Backgrounds: ["01"],
        Accessories: ["glasses"],
      },
    };

    this.changeActualTFile()
  }

  onFileOpen = () => {
    this.changeActualTFile()

    const oldUserData = { ...this.userData };

    // Calc of the files diff
    const newFileCount = this.vault.getMarkdownFiles().length
    this.userData.filesCount = newFileCount
    const filesDif = newFileCount - oldUserData.filesCount;

    if (oldUserData.filesCount === -1) return;

    // Update the coins with the filesDif
    const newCoins = this.userStats.coins + (filesDif * 10)

    this.userStats = {
      ...this.userStats,
      coins: newCoins
    };
  } 

  /* 
   * Checks if the files has changed, and if it was, is updated and return true 
   * */
  changeActualTFile = () => {
    const tFile = this.workspace.getActiveFile();
    if (tFile &&  tFile !== this.actualTFile) {
      this.actualTFile = tFile
      this.getFileWordsCount(tFile) 
      return true
    }
  }

  /*
   * Checks the validity of the file, returns true (is valid) or false (is not valid)
   * */
  checkIsFileValid = (tFile: TFile) => {
    // Check if the file is markdown 
    if (tFile.extension !== 'md') return false
     
    // Get the tags from the file
    const frontmatter = this.plugin.app.metadataCache.getFileCache(tFile)?.frontmatter

    if (!frontmatter) return true // This means that there are no tags in the file

    const fileTagsList = Object.keys(frontmatter)

    // Check if there is some "prohibited" tag in the file
    if(this.prohibitedTagsList.some((prohibitedTag) => fileTagsList.includes(prohibitedTag))) return false

    return true
  }

  /*
   * Gets the difference of the word count of the current file and updates de exp
  */
  updateUserDataNStats = () => {
    const oldUserData = { ...this.userData }; 

    // Checks if the file has been changed
    if (this.changeActualTFile()) return;

    // Checks there is a tFile
    if (!this.actualTFile) return;

    // Check if the file is valid
    if(!this.checkIsFileValid(this.actualTFile)) return;

    // Prevents bugs when creating and opening files while getFileWordsCount has not finish
    if (this.isCounting) return;

    this.getFileWordsCount(this.actualTFile).then((newWordsCount) => {
      const fileWordsDif = newWordsCount - oldUserData.fileWordCount;

      // Stats Calculation
      const newExp = fileWordsDif + this.userStats.exp;

      if (
        oldUserData.fileWordCount !== -1 &&
          newExp !== this.userStats.exp
      ) {
        this.userStats = {
          ...this.userStats,
          exp: newExp > 0 ? newExp : 0,
        };
      }
    });

  };

  /*
  * Gets the words of the tFile given and updates it in the userData
  */
  getFileWordsCount = async (tFile: TFile): Promise<number> => {
    this.isCounting = true
    return await this.vault.cachedRead(tFile).then((text) => {
      const words = this.userData.fileWordCount = countWords(text);
      this.isCounting = false
      return words
    })
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

  getUserStatsFromJson = async (): Promise<void> => {
    try {
      const data = await this.plugin.loadData();
      if (Object.keys(data).length === 0) return;

      // Checks if the user has stats
      if (data.userStats) {
        this.userStats = { ...data.userStats };
      }
      if (data.userItems) {
        this.userItems = { ...data.userItems };
      }
    } catch (error) {
      console.error(error);
    }
  };

  saveUserStats = (): void => {
    if (this.userStats) {
      this.plugin.saveData({
        userStats: this.userStats,
        userItems: this.userItems,
      });
    }
  };

  petLevelUp = (expRemaining: number): UserStats => {
    this.userStats = {
      exp: expRemaining,
      expGoal: Math.floor(this.userStats.expGoal * 1.2),
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
    itemPrice: number
  ):[UserStats,UserItems] => {
    this.userStats.coins = this.userStats.coins - itemPrice;
    this.userItems.obtained[itemCategory].push(itemName);

    return [{...this.userStats}, {...this.userItems}]
  };

  equipItem = (itemName: string, itemCategory: ItemCategory):UserItems => {
    this.userItems.equiped[itemCategory] = itemName;
    return {...this.userItems};
  };

  unequipItem = (itemCategory: ItemCategory):UserItems => {
    this.userItems.equiped[itemCategory] = "";
    return {...this.userItems}
  };
}
