import { TFile, Vault, Workspace } from "obsidian";
import { countWords } from "../utils/statsUtils";
import { UserStats } from "./Stats";

export default class StatsHandler {
	private vault: Vault;
	private workspace: Workspace;
	public userStats: UserStats = { filesCount: 0, actualFileWordCount: 0 };

	constructor(vault: Vault, workspace: Workspace) {
		this.vault = vault;
		this.workspace = workspace;

		this.vault.on("delete", () => {
			console.log("deleted vault");
		});
	}

	async calcUserStats() {
		const filePath = this.workspace.getActiveFile();

		await this.getFilesCount();

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

		return this.userStats;
	}
}
