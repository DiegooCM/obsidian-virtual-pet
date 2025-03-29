import { TFile, Vault, Workspace } from "obsidian";
import { countWords } from "../utils/statsUtils";
import { UserStats } from "../types";

export default class StatsHandler {
	private vault: Vault;
	private workspace: Workspace;
	public userStats: UserStats = {
		filesCount: -1,
		actualFileWordCount: -1,
	};

	constructor(vault: Vault, workspace: Workspace) {
		this.vault = vault;
		this.workspace = workspace;
	}

	async calcUserStats() {
		const filePath = this.workspace.getActiveFile();

		this.getFilesCount();

		if (filePath) {
			await this.getActualFileWordsCount(filePath);
		}
	}

	getFilesCount() {
		const filesCount = this.vault.getMarkdownFiles().length;
		this.userStats.filesCount = filesCount;
	}

	async getActualFileWordsCount(filePath: TFile) {
		const fileWords = await this.vault
			.cachedRead(filePath)
			.then((text) => countWords(text));
		this.userStats.actualFileWordCount = fileWords;
	}

	async getAllUserStats(): Promise<UserStats> {
		await this.calcUserStats();

		return { ...this.userStats };
	}
}
