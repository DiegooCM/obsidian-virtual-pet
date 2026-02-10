import { Plugin, WorkspaceLeaf } from "obsidian";
import VirualPetView from "src/view";
import { VIEW_TYPE_VIRTUAL_PET } from "./constants";
import { UserInfo } from "./types";
import { SettingsTab } from "./components/config/SettingsTab";

export default class VirtualPet extends Plugin {
  async onload() {
    this.registerView(
      VIEW_TYPE_VIRTUAL_PET,
      (leaf: WorkspaceLeaf) => new VirualPetView(leaf, this),
    );

    if (this.app.workspace.layoutReady) {
      this.activateView();
    }

    // Meter en el nombre "VirtualPet"
    this.addSettingTab(new SettingsTab(this.app, this));
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

  async saveUserInfo(data: UserInfo) {
    await this.saveData(data);
  }
}
