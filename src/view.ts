// https://docs.obsidian.md/Plugins/User+interface/Views
import { ItemView, WorkspaceLeaf } from "obsidian";
import { VIEW_TYPE_VIRTUAL_PET } from "./constants";

export default class VirualPetView extends ItemView {
	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return VIEW_TYPE_VIRTUAL_PET;
	}

	getDisplayText() {
		return "Example view";
	}

	async onOpen() {
		const container = this.containerEl.children[1];
		container.empty();
		container.createEl("h4", { text: "Example view" });
	}

	async onClose() {
		// Nothing to clean up.
	}
}
