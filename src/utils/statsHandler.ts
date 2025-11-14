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
	}

  onFileOpen = async() => {
    if (this.workspace.getActiveFile()?.extension !== "md") return;

		const oldUserData = { ...this.userData };

    const newFileCount = this.vault.getMarkdownFiles().length
    this.userData.filesCount = newFileCount
		const filesDif = newFileCount - oldUserData.filesCount;

    if (oldUserData.filesCount === -1) return;

    const newCoins = this.userStats.coins + (filesDif * 10)

    this.userStats = {
      ...this.userStats,
      coins: newCoins
    };
  } 

  updateUserDataNStats = async () => {
    // Actual file where the user is working
    const filePath = this.workspace.getActiveFile();

    if (!filePath) return;

    // Data Calculation
    const oldUserData = { ...this.userData };

    await this.getFileWordsCount(filePath).then((newWordsCount) => {
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

	getFileWordsCount = async (filePath: TFile): Promise<number> => {
		const fileWords = await this.vault
			.cachedRead(filePath)
			.then((text) => countWords(text));
		this.userData.fileWordCount = fileWords;

		return fileWords;
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
