import { DateTime } from "luxon";
import { Notice, Plugin } from "obsidian";
import { DataviewApi } from "obsidian-dataview";
import { ChartModal } from "./ChartModal";
import { DEFAULT_SETTINGS } from "./const";
import { DataType, Settings } from "./interfaces";
import { SettingTab } from "./SettingTab";
import { StatsModal } from "./StatsModal";
import { makeArr, splitAndTrim } from "./utils";

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

		// console.log(this.getAllCorrsForField("weight"));
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

	allUniqueValuesForField(field: string) {
		const values: any[] = [];
		this.index.data.forEach((page) => {
			const value = page[field];
			if (value) values.push(...makeArr(value));
		});

		return [...new Set([...values])];
	}

	inferType(xs: (string | number)[]): "string" | "number" {
		const nums = xs.filter((x) => typeof x === "number");
		if (nums.length >= xs.length / 2) return "number";
		else return "number";
	}

	replaceMissing(xs: (string | number)[]) {
		const type = this.inferType(xs);
		return xs.map((x) => x ?? (type === "number" ? 0 : "N/A"));
	}

	getAllCorrsForField(fieldA: string) {
		const { data } = this.index;
		const { fieldsToCheck } = this.settings;
		const correlations = {};

		const fieldsForA = this.allUniqueValuesForField(fieldA);

		fieldsToCheck.forEach((fieldB) => {
			const fieldsForB = this.allUniqueValuesForField(fieldB);

			const valsInCommon: {
				[fieldA: string]: {
					[fieldB: string]: [
						string | number | string[],
						string | number | string[]
					];
				};
			} = {};

			if (!valsInCommon.hasOwnProperty(fieldA)) {
				valsInCommon[fieldA] = {};
			}
			const valsA = data.map((d) => d[fieldA]);
			const valsB = data.map((d) => d[fieldB]);

			valsA.forEach((valA) => {
				if (typeof valA === "string") {
					// valsInCommon[fieldA + valA] = valA;
				}
			});
			valsInCommon[fieldA][fieldB] = [valsA, valsB];

			// for (const fieldA in valsInCommon) {
			// 	for (const fieldB in valsInCommon) {
			// 		const [valA, valB] = valsInCommon[fieldA][fieldB];
			// 		[valA, valB].forEach((val, i) => {
			// 			const arr = makeArr(val);
			// 			if (typeof arr[0] === "string") {
			// 				valsInCommon[fieldA][fieldB][i] = arr.map((x) => {
			// 					if (i === 0)
			// 						return fieldsForA.includes(x) ? 1 : 0;
			// 					else return fieldsForB.includes(x) ? 1 : 0;
			// 				});
			// 			}
			// 		});
			// 	}
			// }
			console.log(valsInCommon);
		});
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
