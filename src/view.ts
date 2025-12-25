// https://docs.obsidian.md/Plugins/User+interface/Views
import { ItemView, Plugin, WorkspaceLeaf } from "obsidian";
import { createElement, createRef, RefObject } from "react";
import { Root, createRoot } from "react-dom/client";
import { VIEW_TYPE_VIRTUAL_PET } from "./constants";
import StatsHandler from "./utils/statsHandler";
import { PetViewRef } from "./types";
import { PetWrapper } from "./components/pet/PetWrapper";
import { calcAndAddPastedText } from "./utils/statsUtils";

export default class VirualPetView extends ItemView {
	private reactRoot: Root | null = null;
	public statsHandler: StatsHandler;
	private plugin: Plugin;
	private petViewRef: RefObject<PetViewRef | null>;
  private isPasted: boolean = false;

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
			createElement(PetWrapper, {
				statsHandler: this.statsHandler,
				app: this.app,
				ref: this.petViewRef,
			}));

		// Save the state userStats in the data.json when the app is about to quit
		this.registerEvent(
			this.app.workspace.on("quit", () => {
				this.statsHandler.saveUserStats();
			})
		);

		this.registerEvent(
			// When a file is open
			this.app.workspace.on("file-open", (tFile) => {
				// Save the state userStats in the data.json
				this.statsHandler.saveUserStats();
        
				// Update info
        this.statsHandler.onFileOpen(tFile) 
        
				// Sets data and stats in petview
				this.petViewRef.current?.triggerChild("file-open");
			})
		);

		this.registerEvent(
      // When the user types
			this.app.workspace.on("editor-change", (editor) => {
        const fileText = editor.getValue()
				this.isPasted ? 
          this.isPasted = false :
          this.statsHandler.updateUserDataNStats(fileText);

				this.petViewRef.current?.triggerChild("editor-change");
			})
    );

		this.registerEvent(
      // Leaf changes (leaf = filetree, plugins, current-file,...)
			this.app.workspace.on("active-leaf-change", () => {
				this.petViewRef.current?.triggerChild("active-leaf-change");
			})
    );

    this.registerEvent(
      // Leaf changes (leaf = filetree, plugins, current-file,...)
			this.app.workspace.on("editor-paste", (clipboardEvent) => {
        // Count the words pasted and adding them to the userData
        calcAndAddPastedText(clipboardEvent, this.statsHandler.addWordsToFileCount)
        this.isPasted = true
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
