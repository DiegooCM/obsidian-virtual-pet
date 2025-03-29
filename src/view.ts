// https://docs.obsidian.md/Plugins/User+interface/Views
import { ItemView, Plugin, WorkspaceLeaf } from "obsidian";
import * as React from "react";
import { Root, createRoot } from "react-dom/client";
import { VIEW_TYPE_VIRTUAL_PET } from "./constants";
import { PetView } from "./view/PetView";
import StatsHandler from "./stats/StatsHandler";

export default class VirualPetView extends ItemView {
	private reactRoot: Root | null = null;
	private petComponent: React.RefObject<PetView>;
	public statsHandler: StatsHandler;
	private plugin: Plugin;

	constructor(leaf: WorkspaceLeaf, plugin: Plugin) {
		super(leaf);

		this.plugin = plugin;

		this.petComponent = React.createRef();
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

		this.statsHandler = new StatsHandler(
			this.app.vault,
			this.app.workspace
		);

		// Pet View
		const reactContainer = container.createEl("div");
		reactContainer.addClass("react-root");

		this.reactRoot = createRoot(reactContainer);
		this.reactRoot.render(
			React.createElement(PetView, {
				view: this,
				ref: this.petComponent,
			})
		);

		this.registerEvent(
			this.app.workspace.on("file-open", () => {
				this.statsHandler
					.getAllUserData()
					.then((userData) =>
						this.petComponent.current?.setInitialUserData(userData)
					);
				// this.saveUserStats();
			})
		);

		this.registerEvent(
			this.app.workspace.on("editor-change", () => {
				this.statsHandler
					.getAllUserData()
					.then((userData) =>
						this.petComponent.current?.setUserData(userData)
					);
			})
		);

		this.registerEvent(
			this.app.vault.on("delete", () => {
				console.log("deleted vault");
			})
		);
	}

	async onClose(): Promise<void> {
		if (this.reactRoot) {
			this.reactRoot.unmount();
			this.reactRoot = null;
		}
	}

	getUserData() {
		return this.statsHandler.userData;
	}

	saveUserStats(): void {}
}
