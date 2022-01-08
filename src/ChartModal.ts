import { App, Modal } from "obsidian";
import Chart from "./Components/Chart.svelte";
import type DataAnalysisPlugin from "./main";

export class ChartModal extends Modal {
	plugin: DataAnalysisPlugin;
	modal: ChartModal;
	f1: string;
	f2: string;

	constructor(app: App, plugin: DataAnalysisPlugin, f1 = "", f2 = "") {
		super(app);
		this.plugin = plugin;
		this.modal = this;
		this.f1 = f1;
		this.f2 = f2;
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
