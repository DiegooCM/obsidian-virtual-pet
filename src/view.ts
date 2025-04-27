// https://docs.obsidian.md/Plugins/User+interface/Views
import { ItemView, Plugin, WorkspaceLeaf } from "obsidian";
import * as React from "react";
import { Root, createRoot } from "react-dom/client";
import { VIEW_TYPE_VIRTUAL_PET } from "./constants";
import { PetView } from "./view/PetView";
import StatsHandler from "./stats/StatsHandler";
import { getUserStats, saveUserStats } from "./hooks/useData";

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

		// Gets the userStats from the data.json and save them in the state
		getUserStats(this.plugin).then((loadedUserStats) => {
			if (loadedUserStats) {
				this.petComponent.current?.setState({
					userStats: loadedUserStats,
				});
			}
		});

		this.registerEvent(
			this.app.workspace.on("quit", async () => {
				// Save the state userStats in the data.json
				await saveUserStats(
					this.plugin,
					this.petComponent.current?.state.userStats
				);
			})
		);

		this.registerEvent(
			// When a file is open
			this.app.workspace.on("file-open", () => {
				// Save the state userStats in the data.json
				saveUserStats(
					this.plugin,
					this.petComponent.current?.state.userStats
				);
				// Get the data of the new file
				this.statsHandler.getAllUserData().then((userData) =>
					this.petComponent.current?.setUserData({
						...userData,
						isActualFile: false,
					})
				);
			})
		);

		this.registerEvent(
			// When the user types
			this.app.workspace.on("editor-change", () => {
				this.statsHandler.getAllUserData().then((userData) =>
					this.petComponent.current?.setUserData({
						...userData,
						isActualFile: true,
					})
				);
			})
		);
	}

	async onClose(): Promise<void> {
		saveUserStats(this.plugin, this.petComponent.current?.state.userStats);
		if (this.reactRoot) {
			this.reactRoot.unmount();
			this.reactRoot = null;
		}
	}
}
