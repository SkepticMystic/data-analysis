import { ItemView, WorkspaceLeaf } from "obsidian";
import { addFeatherIcon } from "obsidian-community-lib";
import Correlations from "./Components/Correlations.svelte";
import { CORRELATION_VIEW } from "./const";
import type DataAnalysisPlugin from "./main";

export default class CorrelationView extends ItemView {
	plugin: DataAnalysisPlugin;
	view: Correlations;
	matrixQ: boolean;

	constructor(leaf: WorkspaceLeaf, plugin: DataAnalysisPlugin) {
		super(leaf);
		this.plugin = plugin;
	}

	async onload(): Promise<void> {
		super.onload();
	}

	getViewType() {
		return CORRELATION_VIEW;
	}
	getDisplayText() {
		return "Correlations View";
	}

	icon = addFeatherIcon("trending-up") as string;

	async onOpen(): Promise<void> {
		await this.draw();
	}

	onClose(): Promise<void> {
		this.view?.$destroy();
		return Promise.resolve();
	}

	async draw(): Promise<void> {
		const { containerEl } = this;
		containerEl.empty();

		new Correlations({ target: containerEl, props: { view: this } });
	}
}