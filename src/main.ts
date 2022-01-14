import { Parser, transforms } from "json2csv";
import { DateTime } from "luxon";
import { normalizePath, Notice, Plugin } from "obsidian";
import { openView } from "obsidian-community-lib";
import { ChartModal } from "./ChartModal";
import {
	CORRELATION_REPORT_VIEW,
	CORRELATION_VIEW,
	DEFAULT_SETTINGS,
	dropHeaderOrAlias,
	splitLinksRegex,
} from "./const";
import CorrelationsReportView from "./CorrelationsReportView";
import { buildAllCorrelations, processPages } from "./correlationUtils";
import CorrelationView from "./CorrelationView";
import { Correlations, DataType, Row, Settings } from "./interfaces";
import { SettingTab } from "./SettingTab";
import { StatsModal } from "./StatsModal";
import {
	makeArr,
	makeSub,
	splitAndTrim,
	stringToNullOrUndefined,
} from "./utils";

export default class DataAnalysisPlugin extends Plugin {
	settings: Settings;
	index: {
		data: { [field: string]: DataType }[];
		dataMap: { [field: string]: DataType[] };
		corrs: Correlations;
		minDate: DateTime;
		maxDate: DateTime;
	} = {
		data: undefined,
		dataMap: undefined,
		corrs: undefined,
		minDate: undefined,
		maxDate: undefined,
	};

	unwrappedFields: { [field: string]: string[] } = {};

	async onload() {
		console.log("Loading data-analysis plugin");
		await this.loadSettings();

		this.addSettingTab(new SettingTab(this.app, this));

		const onAPIReady = async () => {
			this.app.workspace.onLayoutReady(async () => {
				await this.refreshIndex();
				this.index.corrs = buildAllCorrelations(
					this.index.data,
					this.settings.fieldsToCheck,
					this.settings.fieldsToIgnoreForCorrs,
					true
				);
			});
		};

		if (this.app.plugins.enabledPlugins.has("dataview")) {
			const api = this.app.plugins.plugins.dataview?.api;
			if (api) await onAPIReady();
			else {
				this.registerEvent(
					this.app.metadataCache.on(
						"dataview:api-ready",
						async (api) => {
							await onAPIReady();
						}
					)
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
			callback: async () => await this.refreshIndex(),
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
			callback: async () => {
				const corrs = buildAllCorrelations(
					this.index.data,
					this.settings.fieldsToCheck,
					this.settings.fieldsToIgnoreForCorrs,
					true
				);
				// TODO: don't we want to set the index.corrs to the value here?
				console.log(corrs);
			},
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

		this.addCommand({
			id: "open-correlation-view",
			name: "Open File Correlations View",
			callback: async () =>
				await openView(this.app, CORRELATION_VIEW, CorrelationView),
		});

		this.addCommand({
			id: "open-correlation-report",
			name: "Open Correlations Summary Report",
			callback: async () =>
				await openView(
					this.app,
					CORRELATION_REPORT_VIEW,
					CorrelationsReportView
				),
		});

		this.registerView(
			CORRELATION_VIEW,
			(leaf) => new CorrelationView(leaf, this)
		);

		this.registerView(
			CORRELATION_REPORT_VIEW,
			(leaf) => new CorrelationsReportView(leaf, this)
		);
	}

	onunload() {
		this.app.workspace
			.getLeavesOfType(CORRELATION_VIEW)
			.forEach((leaf) => leaf.detach());
	}

	getDVAPI = () => this.app.plugins.plugins.dataview?.api;

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
		this.app.workspace
			.getLeavesOfType(CORRELATION_REPORT_VIEW)
			.forEach((leaf) => leaf.detach());
	}

	unwrapStrLists(data: { [field: string]: any }[]) {
		const { unwrappedFields } = this;
		const { fieldsToCheck } = this.settings;

		for (const field of fieldsToCheck) {
			unwrappedFields[field] = [];
			data.forEach((d) => {
				const val = d[field];
				if (val) {
					// BUG: Don't do this for _every_ string
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
	async refreshIndex() {
		const notice = new Notice("Index refreshing...");
		const dvApi = this.getDVAPI();
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

		let pages: { [field: string]: any }[] = dvApi.pages().values;
		const result = processPages(pages, fieldsToCheck);

		this.unwrapStrLists(result.pages);

		this.index.data = result.pages;
		this.index.minDate = DateTime.min(...result.dates);
		this.index.maxDate = DateTime.max(...result.dates);

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

	inferType(
		xs: (string | number)[]
	): "string" | "number" | "object" | "undefined" {
		const defineds = xs.filter((x) => x);
		const types = defineds.map((x) => typeof x);
		if (!defineds.length) return "undefined";
		const thresh = defineds.length / 2;

		if (types.filter((x) => x === "number").length >= thresh)
			return "number";
		else if (types.filter((x) => x === "string").length >= thresh)
			return "string";
		else return "object";
	}

	replaceMissing(xs: (string | number)[]) {
		const type = this.inferType(xs);
		return xs.map((x) => x ?? (type === "number" ? 0 : "N/A"));
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

		let table: Row[] = [];
		let uniqueKeys: string[] = [];

		let actualNullValue = stringToNullOrUndefined(nullValue);

		for (const page of this.index.data) {
			const { file } = page;

			const currRow = { file: { path: file.path }, content: "" };

			if (addNoteContent) {
				const content = await this.app.vault.cachedRead(file);
				currRow["content"] = content;
			}

			function updateCell(col: string, currRow: { [col: string]: any }) {
				if (col !== "position" && (col !== "file" || addFileData)) {
					const value = page[col];
					const arrValues = [value].flat(4);

					// Collect unique keys for later
					if (!uniqueKeys.includes(col)) uniqueKeys.push(col);

					if (value === null || value == undefined) {
						// Null values
						currRow[col] = actualNullValue;
					} else if (typeof value === "string") {
						// String values

						const splits = value.match(splitLinksRegex);
						if (splits !== null) {
							// Wikilink-strings
							const links = splits
								.map((link) => {
									const dropped =
										link.match(dropHeaderOrAlias)?.[1];

									return dropped ? `[[${dropped}]]` : link;
								})
								.join(", ");
							currRow[col] = links;
						} else {
							// Non-link String
							currRow[col] = value;
						}
					} else if (arrValues?.[0]?.ts) {
						// Dates
						currRow[col] = arrValues
							.map((val) => val?.ts)
							.join(", ");
					} else if (arrValues?.[0]?.path) {
						// Link objects
						currRow[col] = arrValues
							.map((val) => `[[${val?.path}]]`)
							.join(", ");
					} else if (
						Object.prototype.toString.call(value) ===
						"[object Object]"
					) {
						currRow[col] = value;
					} else {
						// Miscellaneous arrays are joined into strings
						currRow[col] = arrValues.join(", ");
					}
				}
			}

			for (const key of fieldsToCheck) updateCell(key, currRow);

			const { unwrappedFields } = this;
			for (const field in unwrappedFields) {
				const val = page[field];
				const subs = unwrappedFields[field];
				if (val !== null && val !== undefined) {
					subs.forEach((sub) => {
						if (val.includes && val.includes(sub))
							currRow[makeSub(field, sub)] = 1;
					});
				} else {
					subs.forEach((sub) => {
						currRow[makeSub(field, sub)] = 0;
					});
				}
			}

			table.push(currRow);
		}

		for (let i = 0; i < Object.keys(table).length; i++) {
			uniqueKeys.forEach((key) => {
				if (table[i][key] === undefined) {
					table[i][key] = stringToNullOrUndefined(undefinedValue);
				}
			});
		}
		return table;
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
