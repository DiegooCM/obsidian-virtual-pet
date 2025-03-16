import {
	App,
	Plugin,
	PluginSettingTab,
	Setting,
	WorkspaceLeaf,
} from "obsidian";
import VirualPetView from "src/view";
import { VIEW_TYPE_VIRTUAL_PET } from "./constants";

// Remember to rename these classes and interfaces!
interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: "default",
};

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		this.registerView(
			VIEW_TYPE_VIRTUAL_PET,
			(leaf: WorkspaceLeaf) => new VirualPetView(leaf)
		);

		if (this.app.workspace.layoutReady) {
			this.activateView();
		} else {
			// this.registerEvent(
			//   this.app.workspace.on("layout-ready", this.activateView.bind(this))
			// );
		}

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));
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

	async loadSettings() {
		// Create a file for the settings
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Setting #1")
			.setDesc("It's a secret")
			.addText((text) =>
				text
					.setPlaceholder("Enter your secret")
					.setValue(this.plugin.settings.mySetting)
					.onChange(async (value) => {
						this.plugin.settings.mySetting = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
