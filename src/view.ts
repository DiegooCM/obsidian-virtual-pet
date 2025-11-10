// https://docs.obsidian.md/Plugins/User+interface/Views
import { ItemView, Plugin, WorkspaceLeaf } from "obsidian";
import { createElement, createRef, RefObject } from "react";
import { Root, createRoot } from "react-dom/client";
import { VIEW_TYPE_VIRTUAL_PET } from "./constants";
import PetView from "src/components/pet/PetView";
import StatsHandler from "./utils/statsHandler";
import { PetViewRef } from "./types";

export default class VirualPetView extends ItemView {
	private reactRoot: Root | null = null;
	// private petComponent: React.RefObject<typeof PetView>;
	public statsHandler: StatsHandler;
	private plugin: Plugin;
	private petViewRef: RefObject<PetViewRef | null>;

	constructor(leaf: WorkspaceLeaf, plugin: Plugin) {
		super(leaf);

		this.plugin = plugin;
		this.petViewRef = createRef();
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
		// Gets the userStats from the data.json and save them in the state
		this.statsHandler.getUserStatsFromJson();

		// Pet View
		const reactContainer = container.createDiv("react-root");

		this.reactRoot = createRoot(reactContainer);
		this.reactRoot.render(
			createElement(PetView, {
				statsHandler: this.statsHandler,
				app: this.app,
				ref: this.petViewRef,
			}));

		// Save the state userStats in the data.json when the app is about to quit
		this.registerEvent(
			this.app.workspace.on("quit", () => {
				// Que lo coja de statsHandler y no de aquí
				this.statsHandler.saveUserStats();
			})
		);

		this.registerEvent(
			// When a file is open
			this.app.workspace.on("file-open", async () => {
				// Save the state userStats in the data.json
				this.statsHandler.saveUserStats();
				// Update info
				await this.statsHandler.onFileOpen();
				// Sets data and stats in petview
				this.petViewRef.current?.triggerChild("file-open");
			})
		);

		this.registerEvent(
      // When the user types
			this.app.workspace.on("editor-change", () => {
				this.statsHandler.updateUserDataNStats();
				this.petViewRef.current?.triggerChild("editor-change");
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
