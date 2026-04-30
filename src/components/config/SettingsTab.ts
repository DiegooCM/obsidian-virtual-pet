import { App, PluginSettingTab } from "obsidian";
import VirtualPet from "src/main";
import Assets from "src/jsons/assets.json";

export class SettingsTab extends PluginSettingTab {
  constructor(app: App, plugin: VirtualPet) {
    super(app, plugin);
  }

  display(): void {
    const { containerEl } = this;

    // Assets
    const coinUrl = "data:image/png;base64," + Assets.Others.coin;
    const woodUrl = "data:image/png;base64," + Assets.Others.wood;

    // Html
    containerEl.empty();

    const banner = containerEl.createEl("div", { cls: "vpet-info-banner" });

    const ironSeparations0 = banner.createEl("div", {
      cls: "vpet-iron-separations",
      attr: { style: "height: 70px; top: -60px" },
    });
    ironSeparations0.createEl("span", {
      cls: "vpet-iron-separations__separator",
    });
    ironSeparations0.createEl("span", {
      cls: "vpet-iron-separations__separator",
    });

    const woodPlank1 = banner.createEl("div", {
      cls: "vpet-info-banner__wood-plank",
      attr: { style: `background-image: url(${woodUrl})` },
    });
    woodPlank1.createEl("span", { text: "Tap " });
    woodPlank1.createEl("img", {
      attr: {
        src: coinUrl,
        alt: "coin",
      },
    });
    woodPlank1.createEl("span", { text: "To access the shop." });

    const ironSeparations1 = woodPlank1.createEl("div", {
      cls: "vpet-iron-separations",
    });
    ironSeparations1.createEl("span", {
      cls: "vpet-iron-separations__separator",
    });
    ironSeparations1.createEl("span", {
      cls: "vpet-iron-separations__separator",
    });

    const woodPlank2 = banner.createEl("div", {
      cls: "vpet-info-banner__wood-plank",
      attr: { style: `background-image: url(${woodUrl})` },
    });
    const dl2 = woodPlank2.createEl("dl");
    dl2.createEl("dt", { text: "Experience:" });
    dl2.createEl("dd", { text: "Write a word: +1 exp" });
    dl2.createEl("dd", { text: "Delete a word: -1 exp" });

    const ironSeparations2 = woodPlank2.createEl("div", {
      cls: "vpet-iron-separations",
    });
    ironSeparations2.createEl("span", {
      cls: "vpet-iron-separations__separator",
    });
    ironSeparations2.createEl("span", {
      cls: "vpet-iron-separations__separator",
    });

    const woodPlank3 = banner.createEl("div", {
      cls: "vpet-info-banner__wood-plank",
      attr: { style: `background-image: url(${woodUrl})` },
    });
    const dl3 = woodPlank3.createEl("dl");
    dl3.createEl("dt", { text: "Coins:" });
    dl3.createEl("dd", { text: "Level up: +50 coins" });
    dl3.createEl("dd", { text: "Create a file: +5 coins" });
    dl3.createEl("dd", { text: "Delete a file: -5 coins" });
  }
}
