import { TFile, Vault, Workspace } from "obsidian";
import { countWords } from "../utils/statsUtils";
import { UserStats } from "../types";

export default class StatsHandler {
	private vault: Vault;
	private workspace: Workspace;
	public userStats: UserStats = { filesCount: 0, actualFileWordCount: 0 };

	constructor(vault: Vault, workspace: Workspace) {
		this.vault = vault;
		this.workspace = workspace;
	}

	async calcUserStats() {
		const filePath = this.workspace.getActiveFile();

		this.getFilesCount();

		if (filePath) {
			this.getActualFileWordsCount(filePath);
		}
	}

	getFilesCount() {
		const filesCount = this.vault.getMarkdownFiles().length;
		this.userStats.filesCount = filesCount;
	}

	async getActualFileWordsCount(filePath: TFile) {
		const textWords = await this.vault
			.cachedRead(filePath)
			.then((text) => countWords(text));
		this.userStats.actualFileWordCount = textWords;
	}

	getAllUserStats() {
		this.calcUserStats();
		const userStats = JSON.parse(JSON.stringify(this.userStats)); // TODO: change this method for copying this.userStats?

		return userStats;
	}
}
