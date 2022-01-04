import { App, PluginSettingTab, Setting } from "obsidian";
import { DEFAULT_SETTINGS } from "./const";
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


		new Setting(containerEl)
			.setName("Field Lists")
			.setDesc(
				"A comma-separated list of files that you keep fields in. Each field must be on a new line. It can be a wikilink, or not."
			)
			.addText((text) => {
				text.setValue(settings.fieldLists.join(", "));
				text.inputEl.onblur = async () => {
					const splits = splitAndTrim(text.getValue());
					settings.fieldLists = splits;
					await plugin.saveSettings();
					await plugin.refreshIndex(
						this.app.plugins.plugins.dataview?.api
					);
				};
			});
		new Setting(containerEl)
			.setName("Date Format")
			.setDesc("The date format you use in your vault.")
			.addMomentFormat((format) => {
				format
					.setDefaultFormat(DEFAULT_SETTINGS.dateFormat)
					.setValue(settings.dateFormat)
					.onChange(async (value) => {
						settings.dateFormat = value;
						await plugin.saveSettings();
					});
			});
	}
}
