import { App, PluginSettingTab, Setting } from "obsidian";
import DataAnalysisPlugin from "./main";
import { splitAndTrim } from "./utils";

export class SettingTab extends PluginSettingTab {
	plugin: DataAnalysisPlugin;

	constructor(app: App, plugin: DataAnalysisPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let { containerEl, plugin } = this;
		const { settings } = plugin;
		containerEl.empty();

		new Setting(containerEl)
			.setName("Fields to Check")
			.setDesc("A comma-separated list of fields to look for data in.")
			.addTextArea((text) => {
				text.setValue(settings.fieldsToCheck.join(", "));
				text.inputEl.onblur = async () => {
					const splits = splitAndTrim(text.getValue());
					settings.fieldsToCheck = splits;
					await plugin.saveSettings();
					await plugin.refreshIndex(
						plugin.app.plugins.plugins.dataview?.api
					);
				};
			});
	}
}
