import { ItemView, WorkspaceLeaf } from "obsidian";
import { addFeatherIcon } from "obsidian-community-lib";
import CorrelationsReport from "./Components/CorrelationsReport.svelte";
import { CORRELATION_REPORT_VIEW } from "./const";
import { buildAllCorrelations } from "./correlationUtils";
import { PrintableCorrelation } from "./interfaces";
import type DataAnalysisPlugin from "./main";
import {
	ALL_FIELDS,
	buildReportCorrs,
	top3NegativeCorrs,
	top3PositiveCorrs,
} from "./reportViewUtils";

export default class CorrelationView extends ItemView {
	plugin: DataAnalysisPlugin;
	view: CorrelationsReport;

	matrixQ: boolean;
	lower: number;
	medium: number;
	max: number;
	min: number;
	showStandards: boolean;
	showTopPos: boolean;
	showTopNeg: boolean;
	showStrong: boolean;
	showMedium: boolean;
	showWeak: boolean;
	minN: number;
	corrsToShow: PrintableCorrelation[];
	topPos3: PrintableCorrelation[];
	topNeg3: PrintableCorrelation[];
	selectedField: string;
	fieldOptions: string[];

	constructor(leaf: WorkspaceLeaf, plugin: DataAnalysisPlugin) {
		super(leaf);
		this.plugin = plugin;
		this.lower = 0.5;
		this.medium = 0.75;
		this.max = 9999;
		this.min = -9999;
		this.showStandards = true;
		this.showTopPos = true;
		this.showTopNeg = true;
		this.showStrong = true;
		this.showMedium = true;
		this.showWeak = false;
		this.minN = 1;
		this.corrsToShow = [];
		this.topPos3 = [];
		this.topNeg3 = [];
		this.selectedField = ALL_FIELDS;
		this.fieldOptions = [ALL_FIELDS, ...plugin.settings.fieldsToCheck];
		this.calculateReport();
	}

	async onload(): Promise<void> {
		super.onload();
	}

	getViewType() {
		return CORRELATION_REPORT_VIEW;
	}
	getDisplayText() {
		return "Correlations View";
	}

	icon = addFeatherIcon("trending-up") as string;

	calculateReport = () => {
		this.corrsToShow = buildReportCorrs(
			this.plugin.index.corrs,
			this.selectedField,
			this.max,
			this.min
		);
		this.topPos3 = top3PositiveCorrs(this.corrsToShow);
		this.topNeg3 = top3NegativeCorrs(this.corrsToShow);
	};

	async onOpen(): Promise<void> {
		await this.draw();
	}

	onClose(): Promise<void> {
		this.view?.$destroy();
		return Promise.resolve();
	}

	async draw(): Promise<void> {
		const { contentEl, plugin } = this;

		contentEl.empty();
		contentEl.addClass("DA-corr-view");

		contentEl.createEl(
			"button",
			{ text: "↻", attr: { "aria-label": "Refresh Index & Redraw" } },
			(but) => {
				but.onclick = async () => {
					await plugin.refreshIndex();
					plugin.index.corrs = buildAllCorrelations(
						plugin.index.data,
						plugin.settings.fieldsToCheck
					);
					await this.draw();
				};
			}
		);

		new CorrelationsReport({ target: contentEl, props: { view: this } });
	}
}
