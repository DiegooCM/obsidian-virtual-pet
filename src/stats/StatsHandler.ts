import { TFile, Vault, Workspace } from "obsidian";
import { countWords } from "../utils/StatsUtils";
import { UserData } from "../types";

export default class StatsHandler {
	private vault: Vault;
	private workspace: Workspace;
	public userData: UserData = {
		filesCount: -1,
		actualFileWordCount: -1,
	};

	constructor(vault: Vault, workspace: Workspace) {
		this.vault = vault;
		this.workspace = workspace;
	}

	async calcUserData() {
		const filePath = this.workspace.getActiveFile();

		this.getFilesCount();

		if (filePath) {
			await this.getActualFileWordsCount(filePath);
		}
	}

	getFilesCount() {
		const filesCount = this.vault.getMarkdownFiles().length;
		this.userData.filesCount = filesCount;
	}

	async getActualFileWordsCount(filePath: TFile) {
		const fileWords = await this.vault
			.cachedRead(filePath)
			.then((text) => countWords(text));
		this.userData.actualFileWordCount = fileWords;
	}

	async getAllUserData(): Promise<UserData> {
		await this.calcUserData();

		return { ...this.userData };
	}
}
