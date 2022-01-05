<script lang="ts">
	import CorrelationView from "src/CorrelationView";
	import noUiSlider from "nouislider";
	import { onMount } from "svelte";
	import { TFile } from "obsidian";

	export let view: CorrelationView;

	const { plugin, app } = view;
	const { index } = plugin;
	const { corrs } = index;

	let threshold = 0.5;
	// let slider: HTMLElement;

	// function createSlider(node) {
	// 	noUiSlider.create(node, {
	// 		start: [-threshold, +threshold],
	// 		connect: true,
	// 		range: {
	// 			min: 0,
	// 			max: 1,
	// 		},
	// 	});
	// }

	function updateFieldsInFile(currFile: TFile) {
		const currPage = index.data.find(
			(d) => d.file.name === currFile.basename
		);
		const fieldsInFile = Object.keys(currPage);

		const { unwrappedFields } = plugin;
		Object.keys(unwrappedFields).forEach((field) => {
			if (fieldsInFile.includes(field)) {
				unwrappedFields[field].forEach((subF) => {
					if (
						currPage[field].includes &&
						currPage[field]?.includes(subF)
					) {
						fieldsInFile.push(field + "." + subF);
					}
				});
			}
		});
		console.log({ fieldsInFile });
		return fieldsInFile;
	}

	let currFile = app.workspace.getActiveFile();
	let fieldsInFile = updateFieldsInFile(currFile);

	plugin.registerEvent(
		app.workspace.on("active-leaf-change", () => {
			currFile = app.workspace.getActiveFile();
			fieldsInFile = updateFieldsInFile(currFile);
		})
	);

	const fields = Object.keys(corrs);
	const corrsToShow = fields
		.map((fA) =>
			fieldsInFile.map((fB) => {
				return { fA, fB, corr: corrs[fA][fB] };
			})
		)
		.flat()
		.filter(
			(item) =>
				item.corr !== null &&
				item.corr !== undefined &&
				item.corr !== NaN
		)
		.sort((a, b) => b.corr - a.corr);

	console.log({ corrsToShow });
</script>

<div class="component">
	<div>
		<label>
			<input
				type="range"
				min="-1"
				max="1"
				step="0.01"
				bind:value={threshold}
			/>
			Threashold: {threshold}
		</label>
	</div>
	<!-- <div class="slider" use:createSlider /> -->

	<table class="markdown-preview-view">
		<thead>
			<tr>
				<th>Field 1</th>
				<th>Field 2</th>
				<th>Correlation</th>
			</tr>
		</thead>

		<tbody>
			{#each corrsToShow as { fA, fB, corr }}
				{#if (fieldsInFile.includes(fA) || (fB.includes(".") && fieldsInFile.includes(fB))) && corr >= threshold}
					<tr>
						<td>{fA}</td>
						<td>{fB}</td>
						<td>{corr.toFixed(4)}</td>
					</tr>
				{/if}
			{/each}
		</tbody>
	</table>
</div>

<style>
	div.component {
		padding: 5px;
	}

	div.slider {
		width: 100px;
		height: 20px;
	}
	table {
		border-collapse: collapse;
		overflow: auto;
	}
	table,
	table tr,
	table td {
		border: 1px solid var(--background-modifier-border);
	}
</style>
