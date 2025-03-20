import { Plugin, WorkspaceLeaf } from "obsidian";
import VirualPetView from "src/view";
import { VIEW_TYPE_VIRTUAL_PET } from "./constants";

export default class VirtualPet extends Plugin {
	async onload() {
		this.registerView(
			VIEW_TYPE_VIRTUAL_PET,
			(leaf: WorkspaceLeaf) => new VirualPetView(leaf)
		);

		if (this.app.workspace.layoutReady) {
			this.activateView();
		} else {
			// this.registerEvent(
			//   this.app.workspace.on("layout-ready", this.activateView.bind(this))
			// );
		}

		// For when a user makes a change recalcs the stats, is in process:
		// this.registerEvent(
		// 	// editor-change (for when the user writes something)
		// 	this.app.workspace.on("active-leaf-change", () => {
		// 		// console.log("Change");
		// 	})
		// );
	}

	onunload() {}

	async activateView(): Promise<void> {
		const { workspace } = this.app;

		// Check if view is already open
		const existingLeaves = workspace.getLeavesOfType(VIEW_TYPE_VIRTUAL_PET);
		if (existingLeaves.length > 0) {
			workspace.revealLeaf(existingLeaves[0]);
			return;
		}

		// Open the view in a new leaf
		const leaf = workspace.getRightLeaf(false);
		if (leaf) {
			await leaf.setViewState({
				type: VIEW_TYPE_VIRTUAL_PET,
				active: true,
			});
			workspace.revealLeaf(leaf);
		}
	}
}
