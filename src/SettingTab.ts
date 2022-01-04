import { App, PluginSettingTab } from "obsidian";
import DataAnalysisPlugin from "./main";

export class SettingTab extends PluginSettingTab {
	plugin: DataAnalysisPlugin;

	constructor(app: App, plugin: DataAnalysisPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let { containerEl } = this;
		containerEl.empty();
	}
}
