// https://docs.obsidian.md/Plugins/User+interface/Views
import { ItemView, WorkspaceLeaf } from "obsidian";
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
  private petViewRef: RefObject<PetViewRef | null>;
  private isPasted = false;

  constructor(leaf: WorkspaceLeaf, statsHandler: StatsHandler) {
    super(leaf);

    this.petViewRef = createRef();
    this.statsHandler = statsHandler;
  }

  getViewType() {
    return VIEW_TYPE_VIRTUAL_PET;
  }

  getDisplayText() {
    return "Virtual Pet";
  }

  getIcon(): string {
    return "paw-print";
  }

  async onOpen(): Promise<void> {
    const container = this.containerEl.children[1];
    container.empty();

    this.statsHandler.getUserStatsFromJson();

    // Pet View
    const reactContainer = container.createDiv("vpet-leaf-container");

    this.reactRoot = createRoot(reactContainer);
    this.reactRoot.render(
      createElement(PetWrapper, {
        statsHandler: this.statsHandler,
        app: this.app,
        ref: this.petViewRef,
      }),
    );

    this.registerEvent(
      this.app.workspace.on("quit", () => {
        this.statsHandler.saveUserData();
      }),
    );

    this.registerEvent(
      // When a file is open
      this.app.workspace.on("file-open", (tFile) => {
        // Update info
        this.statsHandler.onFileOpen(tFile);
        //this.isPasted = true;

        // Sets data and stats in petview
        this.petViewRef.current?.triggerChild(["update-info"]);
      }),
    );

    this.registerEvent(
      // When the user types
      this.app.workspace.on("editor-change", (editor) => {
        const fileText = editor.getValue();
        this.isPasted
          ? (this.isPasted = false)
          : this.statsHandler.updateUserDataNStats(fileText);

        this.petViewRef.current?.triggerChild(["handle-sleep", "update-info"]);
      }),
    );

    this.registerEvent(
      this.app.workspace.on("editor-paste", (clipboardEvent) => {
        // Count the pasted words and add them to the userData
        calcAndAddPastedText(
          clipboardEvent,
          this.statsHandler.addWordsToFileCount,
        );
        this.isPasted = true;
      }),
    );

    this.registerEvent(
      this.app.workspace.on("resize", () => {
        this.petViewRef.current?.triggerChild(["check-width"]);
      }),
    );

    this.registerEvent(
      this.app.workspace.on("active-leaf-change", () => {
        this.statsHandler.saveUserData();
      }),
    );
  }

  async onClose(): Promise<void> {
    if (this.reactRoot) {
      this.reactRoot.unmount();
      this.reactRoot = null;
    }
  }
}
