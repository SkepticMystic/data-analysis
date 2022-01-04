import { DateTime } from "luxon";
import { Notice, Plugin } from "obsidian";
import { DataviewApi } from "obsidian-dataview";
import { AnalysisModal } from "./AnalysisModal";
import { DEFAULT_SETTINGS } from "./const";
import { DataType, Settings } from "./interfaces";
import { SettingTab } from "./SettingTab";
import { splitAndTrim } from "./utils";

export default class DataAnalysisPlugin extends Plugin {
	settings: Settings;
	index: {
		data: { [field: string]: DataType }[];
		minDate: DateTime;
		maxDate: DateTime;
	} = { data: undefined, minDate: undefined, maxDate: undefined };

	async onload() {
		console.log("Loading data-analysis plugin");
		await this.loadSettings();

		this.addSettingTab(new SettingTab(this.app, this));

		if (this.app.plugins.enabledPlugins.has("dataview")) {
			console.log("DataView plugin is enabled");
			const api = this.app.plugins.plugins.dataview?.api;
			if (api) this.refreshIndex(api);
			else {
				this.registerEvent(
					this.app.metadataCache.on("dataview:api-ready", (api) => {
						this.refreshIndex(api);
					})
				);
			}
		} else {
			new Notice(
				"Dataview must be enabled for the Data Analysis plugin to work"
			);
		}

		this.addCommand({
			id: "refresh-index",
			name: "Refresh Index",
			callback: async () =>
				await this.refreshIndex(this.app.plugins.plugins.dataview?.api),
		});
		this.addCommand({
			id: "analysis-view",
			name: "Open Analysis Modal",
			callback: async () => new AnalysisModal(this.app, this).open(),
		});
	}

	onunload() {}

	unproxy(item: any): DataType[] {
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

	refreshIndex(dvApi: DataviewApi) {
		const notice = new Notice("Index refreshing...");
		if (!dvApi) {
			notice.setMessage("Dataview must be enabled");
			return;
		}
		const { fieldsToCheck } = this.settings;

		const pages: { [field: string]: any }[] = dvApi.pages().values;
		const dates: DateTime[] = [];
		pages.forEach((page) => {
			const potentialDate = DateTime.fromISO(page.file.name);
			if (potentialDate.isValid) dates.push(potentialDate);

			fieldsToCheck.forEach((field) => {
				if (page[field]) {
					page[field] = this.unproxy(page[field]);
				}
			});
		});
		this.index = {
			data: pages,
			minDate: DateTime.min(...dates),
			maxDate: DateTime.max(...dates),
		};
		console.log(this.index);
		notice.setMessage("Index refreshed ✅");
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
