import { App, Modal } from "obsidian";
import Chart from "./Components/Chart.svelte";
import type DataAnalysisPlugin from "./main";

export class ChartModal extends Modal {
	plugin: DataAnalysisPlugin;
	modal: ChartModal;

	constructor(app: App, plugin: DataAnalysisPlugin) {
		super(app);
		this.plugin = plugin;
		this.modal = this;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();

		new Chart({
			target: contentEl,
			props: {
				modal: this,
			},
		});
	}

	onClose() {
		this.contentEl.empty();
	}
}
