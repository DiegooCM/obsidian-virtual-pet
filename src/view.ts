// https://docs.obsidian.md/Plugins/User+interface/Views
import { ItemView, WorkspaceLeaf } from "obsidian";
import * as React from "react";
import { Root, createRoot } from "react-dom/client";
import { VIEW_TYPE_VIRTUAL_PET } from "./constants";
import { PetView } from "./PetView";

export default class VirualPetView extends ItemView {
	private reactRoot: Root | null = null;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return VIEW_TYPE_VIRTUAL_PET;
	}

	getDisplayText() {
		return "Example view";
	}

	getIcon(): string {
		return "layout";
	}

	async onOpen(): Promise<void> {
		const container = this.containerEl.children[1];
		container.empty();
		container.addClass("pet-view-container");

		const reactContainer = container.createEl("div");
		reactContainer.addClass("react-root");

		this.reactRoot = createRoot(reactContainer);
		this.reactRoot.render(
			React.createElement(PetView, {
				app: this.app,
				view: this,
			})
		);
	}

	async onClose(): Promise<void> {
		if (this.reactRoot) {
			this.reactRoot.unmount();
			this.reactRoot = null;
		}
	}
}
