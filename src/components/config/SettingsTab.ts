import { App, PluginSettingTab } from "obsidian";
import VirtualPet from "src/main";

export class SettingsTab extends PluginSettingTab {
  constructor(app: App, plugin: VirtualPet) {
    super(app, plugin);
  }

  display(): void {
    const { containerEl } = this;

    // Assets
    const coinUrl = this.app.vault.adapter.getResourcePath(
      "./.obsidian/plugins/obsidian-virtual-pet/assets/Others/coin.png",
    );
    const woodUrl = this.app.vault.adapter.getResourcePath(
      "./.obsidian/plugins/obsidian-virtual-pet/assets/Others/wood.png",
    );

    // Html
    containerEl.empty();

    const banner = containerEl.createEl("div", { cls: "vpet-info-banner" });

    const ironSeparations0 = banner.createEl("div", {
      cls: "iron-separations",
      attr: { style: "height: 70px; top: -60px" },
    });
    ironSeparations0.createEl("span", { cls: "iron-separator" });
    ironSeparations0.createEl("span", { cls: "iron-separator" });

    const woodPlank1 = banner.createEl("div", {
      cls: "wood-plank",
      attr: { style: `background-image: url(${woodUrl})` },
    });
    woodPlank1.createEl("span", { cls: "tap-img", text: "Tap " });
    const coinImg = woodPlank1.createEl("img", {
      attr: {
        src: coinUrl,
        alt: "coin",
      },
    });
    woodPlank1.createEl("span", { text: " to access the shop." });

    const ironSeparations1 = woodPlank1.createEl("div", {
      cls: "iron-separations",
    });
    ironSeparations1.createEl("span", { cls: "iron-separator" });
    ironSeparations1.createEl("span", { cls: "iron-separator" });

    const woodPlank2 = banner.createEl("div", {
      cls: "wood-plank",
      attr: { style: `background-image: url(${woodUrl})` },
    });
    const ul2 = woodPlank2.createEl("ul");
    ul2.createEl("span", { text: "Experience:" });
    ul2.createEl("li", { text: "Write a word: +1 Exp" });
    ul2.createEl("li", { text: "Delete a word: -1 Exp" });

    const ironSeparations2 = woodPlank2.createEl("div", {
      cls: "iron-separations",
    });
    ironSeparations2.createEl("span", { cls: "iron-separator" });
    ironSeparations2.createEl("span", { cls: "iron-separator" });

    const woodPlank3 = banner.createEl("div", {
      cls: "wood-plank",
      attr: { style: `background-image: url(${woodUrl})` },
    });
    const ul3 = woodPlank3.createEl("ul");
    ul3.createEl("span", { text: "Coins:" });
    ul3.createEl("li", { text: "Level up: +50 Coins" });
    ul3.createEl("li", { text: "Create a file: +10 Coins" });
    ul3.createEl("li", { text: "Delete a file: -10 Coins" });
  }
}
