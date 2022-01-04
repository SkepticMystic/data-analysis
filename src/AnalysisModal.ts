import { App, Modal } from "obsidian";
import Analysis from "./Components/Analysis.svelte";
import type DataAnalysisPlugin from "./main";

export class AnalysisModal extends Modal {
	plugin: DataAnalysisPlugin;
	modal: AnalysisModal;

	constructor(app: App, plugin: DataAnalysisPlugin) {
		super(app);
		this.plugin = plugin;
		this.modal = this;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();

		new Analysis({
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
