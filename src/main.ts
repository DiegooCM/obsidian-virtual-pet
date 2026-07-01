import { Plugin, WorkspaceLeaf } from "obsidian";
import VirualPetView from "src/view";
import { VIEW_TYPE_VIRTUAL_PET } from "./constants";
import { SettingsTab } from "./components/config/SettingsTab";
import StatsHandler from "./utils/statsHandler";

export default class VirtualPet extends Plugin {
  async onload() {
    const rawData: unknown = await this.loadData();

    const statsHandler: StatsHandler = new StatsHandler(
      this.app.vault,
      this.app.workspace,
      this,
      rawData,
    );

    this.registerView(
      VIEW_TYPE_VIRTUAL_PET,
      (leaf: WorkspaceLeaf) => new VirualPetView(leaf, statsHandler),
    );

    if (this.app.workspace.layoutReady) {
      await this.activateView();
    }

    this.addSettingTab(new SettingsTab(this.app, this));
  }

  onunload() {
    this.app.workspace
      .getLeavesOfType(VIEW_TYPE_VIRTUAL_PET)
      .forEach((leaf) => leaf.detach());
  }

  async activateView(): Promise<void> {
    const { workspace } = this.app;

    // Check if view is already open
    const existingLeaves = workspace.getLeavesOfType(VIEW_TYPE_VIRTUAL_PET);
    if (existingLeaves.length > 0) {
      await workspace.revealLeaf(existingLeaves[0]);
      return;
    }

    // Open the view in a new leaf
    const leaf = workspace.getRightLeaf(false);
    if (leaf) {
      await leaf.setViewState({
        type: VIEW_TYPE_VIRTUAL_PET,
      });
      await workspace.revealLeaf(leaf); // Opens my plugin on the leaf when activated
    }
  }
}
