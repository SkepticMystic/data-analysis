import { App, Notice, PluginSettingTab, Setting } from "obsidian";
import { DEFAULT_SETTINGS } from "./const";
import DataAnalysisPlugin from "./main";
import { splitAndTrim, toKebabCase } from "./utils";

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
			.setClass("fields-to-check")
			.setName("Fields to Check")
			.setDesc("A comma-separated list of fields to look for data in.")
			.addTextArea((text) => {
				text.setValue(settings.fieldsToCheck.join(", "));
				text.inputEl.onblur = async () => {
					const splits = splitAndTrim(text.getValue());
					const noDups = [...new Set(splits)];
					if (splits.length !== noDups.length) {
						new Notice("Duplicates found and removed");
						await plugin.saveSettings();
						settings.fieldsToCheck = noDups;
						this.display();
					} else {
						await plugin.saveSettings();
						settings.fieldsToCheck = splits;
					}
					await plugin.refreshIndex();
				};
			});
		new Setting(containerEl)
			.setName("Add All Numeric Fields")
			.setDesc(
				"Add all fields with numeric values to the list of fields to check"
			)
			.addButton((but) => {
				but.setButtonText("Add").onClick(async () => {
					const { data } = plugin.index;
					for (const page of data) {
						for (const field in page) {
							if (
								typeof page[field] === "number" &&
								!settings.fieldsToCheck.includes(field) &&
								!settings.fieldsToCheck
									.map((field) => toKebabCase(field))
									.includes(field)
							) {
								settings.fieldsToCheck.push(field);
								await plugin.saveSettings();
							}
						}
					}

					this.display();
					new Notice("Numeric fields added");
				});
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
					await plugin.refreshIndex();
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

		containerEl.createEl("h2", { text: "Exporting Data" });

		new Setting(containerEl)
			.setName("Default save path")
			.setDesc(
				'The full file path to save the metadataframe to. Don\'t include the file extension. For example, this is a correct file path: SubFolder/metadataframe. Use "/" to save to the root of your vault.'
			)
			.addText((text) =>
				text
					.setValue(settings.defaultSavePath)
					.onChange(async (value) => {
						settings.defaultSavePath = value;
						await plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Null value")
			.setDesc(
				"What should the default value be for missing field values? Default is 'null'. Don't use quotes, just enter the value."
			)
			.addText((text) =>
				text.setValue(settings.nullValue).onChange(async (value) => {
					settings.nullValue = value;
					await plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName("Add inherent file metadata")
			.setDesc(
				"Each file has alot of inherent metadata to it (besides the fields you add). Should metadataframe add these fields too? It can be alot, so there is the option to disable this behaviour."
			)
			.addToggle((toggle) =>
				toggle
					.setValue(settings.addFileData)
					.onChange(async (value) => {
						settings.addFileData = value;
						await plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Add content of each note")
			.setDesc(
				"Add a column for the content of each note. This will add alot of size to the CSV file, so it is off by default."
			)
			.addToggle((toggle) =>
				toggle
					.setValue(settings.addNoteContent)
					.onChange(async (value) => {
						settings.addNoteContent = value;
						await plugin.saveSettings();
					})
			);
	}
}
