import { Vault, Workspace } from "obsidian";
import { countWords } from "../utils/statsUtils";
import { UserStats } from "./Stats";

export default class StatsHandler {
	private vault: Vault;
	private workspace: Workspace;
	private userStats: UserStats = { filesCount: 0, actualFileWordCount: 0 };

	constructor(vault: Vault, workspace: Workspace) {
		this.vault = vault;
		this.workspace = workspace;
	}

	async recalcUserStats() {
		// Subdivide the get functions
		const filesCount = this.vault.getMarkdownFiles().length;
		this.userStats.filesCount = filesCount;

		const filePath = this.workspace.getActiveFile();

		if (filePath) {
			const text = await this.vault.cachedRead(filePath);
			const textWords = countWords(text);
			this.userStats.actualFileWordCount = textWords;
		}
	}

	getAllUserStats() {
		this.recalcUserStats();

		return this.userStats;
	}
}
