import { DataviewApi, Link } from "obsidian-dataview";
import { DEFAULT_SETTINGS } from "./const";
import { Settings } from "./interfaces";
import { SettingTab } from "./SettingTab";

export default class DataAnalysisPlugin extends Plugin {
	settings: Settings;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new SettingTab(this.app, this));

		if (this.app.plugins.enabledPlugins.has("dataview")) {
			console.log("DataView plugin is enabled");
			const api = this.app.plugins.plugins.dataview?.api;
			if (api) {
				console.log(this.refreshIndex(api));
			} else {
				this.registerEvent(
					this.app.metadataCache.on("dataview:api-ready", (api) => {
						console.log(this.refreshIndex(api));
					})
				);
			}
		} else {
			new Notice(
				"Dataview must be enabled for the Data Analysis plugin to work"
			);
		}
	}

	onunload() {}

	unproxy(item: any): (number | string | Date | Link)[] {
		const unproxied = [];

		const queue = [item];
		while (queue.length) {
			const currItem = queue.shift();
			// "Proxy" for checking if `currItem` is a proxy
			if (typeof currItem.defaultComparator === "function") {
				const possibleUnproxied = Object.assign({}, currItem);
				const { values } = possibleUnproxied;
				if (values) queue.push(...values);
				else unproxied.push(possibleUnproxied);
			} else unproxied.push(currItem);
		}
		return unproxied;
	}
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
