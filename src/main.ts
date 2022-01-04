import { DateTime } from "luxon";
import { Notice, Plugin } from "obsidian";
import { DataviewApi } from "obsidian-dataview";
import { ChartModal } from "./ChartModal";
import { DEFAULT_SETTINGS } from "./const";
import { DataType, Settings } from "./interfaces";
import { SettingTab } from "./SettingTab";
import { StatsModal } from "./StatsModal";
import { splitAndTrim } from "./utils";

export default class DataAnalysisPlugin extends Plugin {
	settings: Settings;
	index: {
		data: { [field: string]: DataType }[];
		minDate: DateTime;
		maxDate: DateTime;
	} = {
		data: undefined,
		minDate: undefined,
		maxDate: undefined,
	};

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
			id: "chart-view",
			name: "Open Chart Modal",
			callback: async () => new ChartModal(this.app, this).open(),
		});
		this.addCommand({
			id: "stats-view",
			name: "Open Stats Modal",
			callback: async () => new StatsModal(this.app, this).open(),
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

	getInnerValue(value: any) {
		const unproxied = this.unproxy(value);
		if (unproxied.length === 1) {
			if (typeof unproxied[0] === "string") {
				let list = unproxied[0];
				if (list.startsWith("[") && list.endsWith("]")) {
					list = list.slice(1, -1);
				}
				const splits = splitAndTrim(list).map((item) => {
					if (item.startsWith(`"`) && item.endsWith(`"`)) {
						return item.slice(1, -1);
					} else return item;
				});
				if (splits.length === 1) return splits[0];
				else return splits;
			} else {
				return unproxied[0];
			}
		} else return unproxied;
	}

	async refreshIndex(dvApi: DataviewApi) {
		const notice = new Notice("Index refreshing...");
		if (!dvApi) {
			notice.setMessage("Dataview must be enabled");
			return;
		}
		const { fieldsToCheck, fieldLists } = this.settings;
		for (const path of fieldLists) {
			const file = this.app.metadataCache.getFirstLinkpathDest(path, "");
			if (!file) continue;

			const content = await this.app.vault.cachedRead(file);
			const lines = content.split("\n");
			lines.forEach((line) => {
				const field = line.startsWith("[[") ? line.slice(2, -2) : line;
				if (!fieldsToCheck.includes(field)) fieldsToCheck.push(field);
			});
			this.settings.fieldsToCheck = fieldsToCheck;
			await this.saveSettings();
		}

		const pages: { [field: string]: any }[] = dvApi.pages().values;
		const dates: DateTime[] = [];
		pages.forEach((page) => {
			const potentialDate = DateTime.fromISO(page.file.name);
			if (potentialDate.isValid) dates.push(potentialDate);

			fieldsToCheck.forEach((field) => {
				const value = page[field];
				if (value) page[field] = this.getInnerValue(value);
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

	allValuesForField(field: string) {
		const { api } = this.app.plugins.plugins.dataview;
		if (!api) {
			new Notice("Dataview must be enabled");
			return;
		}

		const values: any[] = [];
		api.pages().values.forEach((page) => {
			const value = page[field];
			if (value) values.push(value);
		});

		return [...new Set(...values)];
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
