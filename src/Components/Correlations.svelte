<script lang="ts">
	import CorrelationView from "src/CorrelationView";
	import noUiSlider from "nouislider";
	import { onMount } from "svelte";

	export let view: CorrelationView;

	const { plugin, app } = view;
	const { index } = plugin;
	const { corrs } = index;

	let threshold = 0.5;
	// let slider: HTMLElement;

	onMount(() => {
		// noUiSlider.create(slider, {
		// 	start: [20, 80],
		// 	connect: true,
		// 	range: {
		// 		min: 0,
		// 		max: 100,
		// 	},
		// });
	});

	let currFile = app.workspace.getActiveFile();
	plugin.registerEvent(
		app.workspace.on("active-leaf-change", () => {
			currFile = app.workspace.getActiveFile();
			fieldsInFile = Object.keys(
				index.data.find((d) => d.file.name === currFile.basename)
			);
		})
	);

	let fieldsInFile = Object.keys(
		index.data.find((d) => d.file.name === currFile.basename)
	);
	console.log({ fieldsInFile });

	const fields = Object.keys(corrs);
	const corrsToShow = fields
		.map((fA) =>
			fields.map((fB) => {
				return { fA, fB, corr: corrs[fA][fB] };
			})
		)
		.flat()
		.filter((item) => item.corr)
		.sort((a, b) => b.corr - a.corr);

	console.log({ corrsToShow });
</script>

<div class="component">
	<input type="range" min="-1" max="1" step="0.01" bind:value={threshold} />
	<!-- <div class="slider" bind:this={slider} /> -->

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
				{#if fieldsInFile.includes(fA) && corr > threshold}
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
