<script lang="ts">
	import noUiSlider, { API } from "nouislider";
	import { TFile } from "obsidian";
	import CorrelationView from "src/CorrelationView";

	export let view: CorrelationView;

	const { plugin, app } = view;
	const { index } = plugin;
	const { corrs } = index;

	let upper = 0.5;
	let lower = -1;
	let absQ = false;
	let slider: API;

	function createSlider(node) {
		slider = noUiSlider.create(node, {
			start: [lower, upper],
			connect: true,
			range: {
				min: -1,
				max: 1,
			},
		});
		slider.on("update", (e) => {
			lower = Number.parseFloat(e[0]);
			upper = Number.parseFloat(e[1]);
		});
	}

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
				return { fA, fB, info: corrs[fA][fB] };
			})
		)
		.flat()
		.filter((item) => {
			const { info } = item;
			return info && info.corr !== NaN;
		})
		.sort((a, b) => b.info.corr - a.info.corr);

	console.log({ corrsToShow });
</script>

<div class="component">
	<div>
		<!-- svelte-ignore a11y-label-has-associated-control -->
		<label>
			<div class="slider" use:createSlider />
			({lower}) ↔ ({upper})
		</label>
		<label>
			<input type="checkbox" bind:checked={absQ} />
			|Abs|
		</label>
	</div>

	<table class="markdown-preview-view">
		<thead>
			<tr>
				<th>Field 1</th>
				<th>Field 2</th>
				<th>Correlation</th>
			</tr>
		</thead>

		<tbody>
			{#key absQ}
				{#each corrsToShow as { fA, fB, info: { corr, n } }}
					{#if (fieldsInFile.includes(fA) || (fB.includes(".") && fieldsInFile.includes(fB))) && lower <= corr && corr <= upper}
						<tr
							aria-label={n ? "n: " + n.toFixed() : ""}
							aria-label-position="left"
						>
							<td>{fA}</td>
							<td>{fB}</td>
							<td>{corr.toFixed(4)}</td>
						</tr>
					{/if}
				{/each}
			{/key}
		</tbody>
	</table>
</div>

<style>
	div.component {
		padding: 5px;
	}

	div.slider {
		width: 150px;
		height: 10px;
		display: inline-block;
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
