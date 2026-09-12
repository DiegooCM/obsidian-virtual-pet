// https://docs.obsidian.md/Plugins/User+interface/Views
import { ItemView, WorkspaceLeaf } from "obsidian";
import { createRef, RefObject } from "react";
import { Root, createRoot } from "react-dom/client";
import { VIEW_TYPE_VIRTUAL_PET } from "./constants";
import StatsHandler from "./utils/statsHandler";
import { PetViewRef } from "./types";
import { PetView } from "./components/pet/PetView";
import { AssetsProvider } from "./contexts/AssetsContext";

export default class VirualPetView extends ItemView {
  private reactRoot: Root | null = null;
  public statsHandler: StatsHandler;
  private petViewRef: RefObject<PetViewRef>;

  constructor(leaf: WorkspaceLeaf, statsHandler: StatsHandler) {
    super(leaf);

    // eslint-disable-next-line @eslint-react/no-create-ref
    this.petViewRef = createRef<PetViewRef>();
    this.statsHandler = statsHandler;
  }

  getViewType() {
    return VIEW_TYPE_VIRTUAL_PET;
  }

  getDisplayText() {
    return "Virtual pet";
  }

  getIcon(): string {
    return "paw-print";
  }

  onOpen(): Promise<void> {
    const container = this.containerEl.children[1];
    container.empty();

    // Pet View
    const reactContainer = container.createDiv("vpet-leaf-container");

    this.reactRoot = createRoot(reactContainer);
    this.reactRoot.render(
      <AssetsProvider>
        <PetView
          statsHandler={this.statsHandler}
          app={this.app}
          ref={this.petViewRef}
        />
      </AssetsProvider>,
    );

    this.registerEvent(
      // When the user types
      this.app.workspace.on("editor-change", () => {
        this.petViewRef.current?.triggerChild(["handle-sleep", "update-stats"]);
      }),
    );

    this.registerEvent(
      this.app.workspace.on("resize", () => {
        this.petViewRef.current?.triggerChild(["check-width"]);
      }),
    );
    return Promise.resolve();
  }

  async onClose() {
    this.statsHandler.saveUserData();
    if (this.reactRoot) {
      this.reactRoot.unmount();
      this.reactRoot = null;
    }
  }
}
