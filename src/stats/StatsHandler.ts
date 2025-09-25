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
			actualFileWordCount: -1,
			isActualFile: true,
		};
		this.userStats = {
			exp: 0,
			expGoal: 10,
			level: 0,
		};
	}

	async updateUserDataNStats() {
		// Actual file where the user is working
		const filePath = this.workspace.getActiveFile();

		if (!filePath) return;

		const oldWordsCount = this.userData.actualFileWordCount;
		const oldFileCount = this.userData.filesCount;
		const newWordsCount = await this.getFileWordsCount(filePath);

		// Stats Calculation
		const filesDif = this.getFilesCount() - oldFileCount;
		const fileWordsDif = newWordsCount - oldWordsCount;

		const newExp = filesDif * 50 + fileWordsDif + this.userStats.exp;

		if (
			!Object.values(this.userData).includes(-1) &&
			newExp !== this.userStats.exp
		) {
			this.userStats = {
				...this.userStats,
				exp: newExp > 0 ? newExp : 0,
			};
		}
	}

	getFilesCount(): number {
		const filesCount = this.vault.getMarkdownFiles().length;
		this.userData.filesCount = filesCount;

		return filesCount;
	}

	async getFileWordsCount(filePath: TFile): Promise<number> {
		const fileWords = await this.vault
			.cachedRead(filePath)
			.then((text) => countWords(text));
		this.userData.actualFileWordCount = fileWords;

		return fileWords;
	}

	getUserData(): UserData {
		return { ...this.userData };
	}

	getUserStats(): UserStats {
		return { ...this.userStats };
	}

	setUserStats = (newUserStats: UserStats): void => {
		// TODO: Hacer comprobaciones de si el nuevo contenido es válido y luego cambiarlo
		this.userStats = newUserStats;
	};

	async getUserStatsFromJson(): Promise<void> {
		try {
			const data = await this.plugin.loadData();

			// Checks if the user has stats
			if (data.userStats && Object.keys(data).length !== 0) {
				this.setUserStats(data.userStats);
			}
		} catch (error) {
			console.error(error);
		}
	}

	async saveUserStats(): Promise<void> {
		if (this.userStats?.exp) {
			this.plugin.saveData({
				userStats: this.userStats,
			});
		}
	}

	petLevelUp = (): UserStats => {
		this.userStats = {
			exp: 0,
			expGoal: Math.floor(this.userStats.expGoal * 1.2),
			level: this.userStats.level + 1,
		};

		return { ...this.userStats };
	};
}
