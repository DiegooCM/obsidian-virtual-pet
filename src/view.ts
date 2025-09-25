// https://docs.obsidian.md/Plugins/User+interface/Views
import { ItemView, Plugin, WorkspaceLeaf } from "obsidian";
import * as React from "react";
import { Root, createRoot } from "react-dom/client";
import { VIEW_TYPE_VIRTUAL_PET } from "./constants";
import PetView from "./view/PetView";
// import {PetView} from './view/PetView copy'
import StatsHandler from "./stats/StatsHandler";

export default class VirualPetView extends ItemView {
	private reactRoot: Root | null = null;
	// private petComponent: React.RefObject<typeof PetView>;
	public statsHandler: StatsHandler;
	private plugin: Plugin;

	constructor(leaf: WorkspaceLeaf, plugin: Plugin) {
		super(leaf);

		this.plugin = plugin;
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
			this.app.workspace,
			this.plugin
		);

		// Pet View
		const reactContainer = container.createEl("div");
		reactContainer.addClass("react-root");

		this.reactRoot = createRoot(reactContainer);
		this.reactRoot.render(
			React.createElement(PetView, {
				statsHandler: this.statsHandler,
				app: this.app,
			})
		);

		// Gets the userStats from the data.json and save them in the state
		this.statsHandler.getUserStatsFromJson();

		// Save the state userStats in the data.json when the app is about to quit
		this.registerEvent(
			this.app.workspace.on("quit", async () => {
				// Que lo coja de statsHandler y no de aquí
				await this.statsHandler.saveUserStats();
			})
		);

		this.registerEvent(
			// When a file is open
			this.app.workspace.on("file-open", () => {
				// Save the state userStats in the data.json
				this.statsHandler.saveUserStats();
				// Hacía lo mismo q en el de abajo pero actualFile: false
				this.statsHandler.updateUserDataNStats();
			})
		);

		this.registerEvent(
			// When the user types
			this.app.workspace.on("editor-change", () => {
				// Antes cogía los datos del .getAllUserData() y se los pasaba al dataUtil y ahí ponía q actualFile: true
				this.statsHandler.updateUserDataNStats();
			})
		);
	}

	async onClose(): Promise<void> {
		this.statsHandler.saveUserStats();
		if (this.reactRoot) {
			this.reactRoot.unmount();
			this.reactRoot = null;
		}
	}
}
