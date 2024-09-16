import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";
import { createApp, App as VueApp } from "vue";
import SetMetadata from "./SetMetadata.vue";

// Remember to rename these classes and interfaces!

type MyPluginSettings = typeof DEFAULT_SETTINGS;

const DEFAULT_SETTINGS = {
	keyHistory: "",
	valueHistory: "",
};

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();
		this.addCommand({
			id: "Batch set metadata",
			name: "Batch set metadata",
			callback: () => this.batchSetMetadata(),
		});
	}
	batchSetMetadata() {
		let modal = new BatchSetMetadata(this.app, this);
		modal.open();
	}

	onunload() {}

	async loadSettings() {
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
class BatchSetMetadata extends Modal {
	vueApp: VueApp;
	constructor(app: App, protected plugin: Plugin) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		this.vueApp = createApp(SetMetadata);
		this.vueApp.provide("plugin", this.plugin);
		this.vueApp.mount(contentEl);
	}

	onClose() {
		const { contentEl } = this;
		this.vueApp?.unmount();
		contentEl.empty();
	}
}
