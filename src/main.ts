import { DateTime } from "luxon";
import { Parser, transforms } from "json2csv";
import { normalizePath, Notice, Plugin } from "obsidian";
import { DataviewApi } from "obsidian-dataview";
import { ChartModal } from "./ChartModal";
import { DEFAULT_SETTINGS, dropHeaderOrAlias, splitLinksRegex } from "./const";
import { DataType, Settings } from "./interfaces";
import { SettingTab } from "./SettingTab";
import { StatsModal } from "./StatsModal";
import { makeArr, splitAndTrim, stringToNullOrUndefined } from "./utils";

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
	/* { foods: ["banana"] } */
	unwrappedFields: { [field: string]: string[] } = {};

	async onload() {
		console.log("Loading data-analysis plugin");
		await this.loadSettings();

		this.addSettingTab(new SettingTab(this.app, this));

		if (this.app.plugins.enabledPlugins.has("dataview")) {
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
		this.addCommand({
			id: "builds-corrs",
			name: "Build Correlations",
			callback: async () => console.log(this.buildAllCorrelations()),
		});

		this.addCommand({
			id: "write-metadataframe",
			name: "Write Metadataframe",
			callback: async () => {
				try {
					const jsDF = await this.createJSDF();
					console.log(jsDF);
					await this.writeMetadataframe(jsDF);
				} catch (error) {
					new Notice("An error occured. Please check the console.");
					console.log(error);
				}
			},
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
				if (unproxied[0].type === "file") {
					return unproxied[0].path;
				} else return unproxied[0];
			}
		} else {
			if (unproxied[0].type === "file") {
				return unproxied.map((link) => link.path);
			} else return unproxied;
		}
	}

	unwrapStrLists(data: { [field: string]: any }[]) {
		const { unwrappedFields } = this;
		const { fieldsToCheck } = this.settings;

		for (const field of fieldsToCheck) {
			unwrappedFields[field] = [];
			data.forEach((d) => {
				const val = d[field];
				if (val) {
					if (typeof val === "string") {
						d[val] = true;
						if (!unwrappedFields[field].includes(val))
							unwrappedFields[field].push(val);
					} else if (
						val?.every &&
						val.every((x: any) => typeof x === "string")
					) {
						val.forEach((str: string) => {
							d[str] = true;
							if (!unwrappedFields[field].includes(str))
								unwrappedFields[field].push(str);
						});
					}
				}
			});
		}
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

		this.unwrapStrLists(pages);

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

	buildAllCorrelations() {
		const { data } = this.index;
		const { fieldsToCheck } = this.settings;

		const allFieldsToCheck = [...fieldsToCheck, this.unwrappedFields];

		console.log({ data });
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

	async createJSDF() {
		const { settings } = this;
		const {
			addNoteContent,
			addFileData,
			nullValue,
			undefinedValue,
			fieldsToCheck,
		} = settings;

		let yamldf: { [key: string]: any }[] = [];
		let uniqueKeys: string[] = [];

		let actualNullValue = stringToNullOrUndefined(nullValue);

		for (const page of this.index.data) {
			const { file } = page;

			const currRow = { file: { path: file.path }, content: "" };

			if (addNoteContent) {
				const content = await this.app.vault.cachedRead(file);
				currRow["content"] = content;
			}

			for (const key of fieldsToCheck) {
				// Process values
				if (key !== "position") {
					if (key !== "file" || addFileData) {
						const value = page[key];
						const arrValues = [value].flat(4);

						// Collect unique keys for later
						if (!uniqueKeys.includes(key)) uniqueKeys.push(key);

						if (!value) {
							// Null values
							currRow[key] = actualNullValue;
						} else if (typeof value === "string") {
							// String values

							const splits = value.match(splitLinksRegex);
							if (splits !== null) {
								const strs = splits
									.map((link) => {
										const dropped =
											link.match(dropHeaderOrAlias)?.[1];
										if (dropped) {
											return `[[${dropped}]]`;
										} else {
											return link;
										}
									})
									.join(", ");
								currRow[key] = strs;
							} else {
								currRow[key] = value;
							}
						} else if (arrValues?.[0]?.ts) {
							// Dates
							currRow[key] = arrValues
								.map((val) => val?.ts)
								.join(", ");
						} else if (arrValues?.[0]?.path) {
							// Link objects
							currRow[key] = arrValues
								.map((val) => `[[${val?.path}]]`)
								.join(", ");
						} else if (
							Object.prototype.toString.call(value) ===
							"[object Object]"
						) {
							currRow[key] = value;
						} else {
							// Miscellaneous arrays are joined into strings
							currRow[key] = arrValues.join(", ");
						}
					}
				}
			}

			yamldf.push(currRow);
		}

		let actualUndefinedValue = stringToNullOrUndefined(undefinedValue);

		for (let i = 0; i < Object.keys(yamldf).length; i++) {
			uniqueKeys.forEach((key) => {
				if (yamldf[i][key] === undefined) {
					yamldf[i][key] = actualUndefinedValue;
				}
			});
		}
		return yamldf;
	}

	async writeMetadataframe(jsDF: { [key: string]: string | number }[]) {
		const { nullValue, defaultSavePath } = this.settings;
		const defaultValue = nullValue;

		const opts = { defaultValue, transforms: [transforms.flatten()] };

		let csv = "";
		try {
			const parser = new Parser(opts);
			csv = parser.parse(jsDF);

			if (defaultSavePath === "" && csv !== "") {
				new Notice("Please choose a path to save to in settings");
			} else {
				try {
					console.log("here");
					const savePath = normalizePath(defaultSavePath);
					const now = window.moment().format("YYYY-MM-DD HHmmss");

					await this.app.vault.create(`${savePath} ${now}.csv`, csv);
					new Notice("Write Metadataframe complete");
				} catch (error) {
					new Notice("File already exists");
				}
			}
		} catch (err) {
			console.error(err);
		}
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
