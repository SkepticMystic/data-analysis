import { App, Modal } from "obsidian";
import Stats from "./Components/Stats.svelte";
import type DataAnalysisPlugin from "./main";

export class StatsModal extends Modal {
	plugin: DataAnalysisPlugin;
	modal: StatsModal;
	f1: string;

	constructor(app: App, plugin: DataAnalysisPlugin, f1 = "") {
		super(app);
		this.plugin = plugin;
		this.modal = this;
		this.f1 = f1;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();

		new Stats({
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
