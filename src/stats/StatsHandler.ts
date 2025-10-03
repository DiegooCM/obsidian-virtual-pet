import { Plugin, TFile, Vault, Workspace } from "obsidian";
import { countWords } from "../utils/statsUtils";
import { UserData, UserStats } from "../types";

export default class StatsHandler {
	private vault: Vault;
	private workspace: Workspace;
	private plugin: Plugin;
	public userData: UserData;
	public userStats: UserStats;

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
		};
	}

	updateUserDataNStats = async (isFileOpen: boolean) => {
		let fileWordsDif = 0;
		// Actual file where the user is working
		const filePath = this.workspace.getActiveFile();

		if (!filePath) return;

		// Data Calculation
		const oldUserData = { ...this.userData };
		const newFileCount = this.getFilesCount();

		// Stats Calculation
		const filesDif = newFileCount - this.userData.filesCount;
		await this.getFileWordsCount(filePath).then((newWordsCount) => {
			fileWordsDif = newWordsCount - oldUserData.fileWordCount;
		});

		if (isFileOpen) return;

		const newExp = filesDif * 50 + fileWordsDif + this.userStats.exp;

		if (
			!Object.values(oldUserData).includes(-1) &&
			newExp !== this.userStats.exp
		) {
			this.userStats = {
				...this.userStats,
				exp: newExp > 0 ? newExp : 0,
			};
		}
	};

	getFilesCount = (): number => {
		const filesCount = this.vault.getMarkdownFiles().length;
		this.userData.filesCount = filesCount;

		return filesCount;
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

	getUserStatsFromJson = async (): Promise<void> => {
		try {
			const data = await this.plugin.loadData();

			// Checks if the user has stats
			if (data.userStats && Object.keys(data).length !== 0) {
				this.userStats = data.userStats;
			}
		} catch (error) {
			console.error(error);
		}
	};

	saveUserStats = (): void => {
		if (this.userStats) {
			this.plugin.saveData({
				userStats: this.userStats,
			});
		}
	};

	petLevelUp = (expRemaining: number): UserStats => {
		this.userStats = {
			exp: expRemaining,
			expGoal: Math.floor(this.userStats.expGoal * 1.2),
			level: this.userStats.level + 1,
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
}
