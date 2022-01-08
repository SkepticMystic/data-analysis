<script lang="ts">
	import { DateTime } from "obsidian-dataview";
	import { getPearsonCorrelation } from "src/analyses";
	import { ChartModal } from "src/ChartModal";
	import Scatter from "svelte-chartjs/src/Scatter.svelte";
	import ChartOptions from "./ChartOptions.svelte";

	export let modal: ChartModal;
	let { f1, f2 } = modal;

	const { app, plugin } = modal;
	const { index, settings } = plugin;
	const { fieldsToCheck } = settings;

	let allFields = fieldsToCheck;
	let [n1, n2] = [0, 0];

	let colour = "#15a252";
	let startDate = index.minDate;
	let endDate = index.maxDate;
	let dnOnly = false;

	interface Datum2d {
		x: number;
		y: number;
		name: string;
	}

	function isValidSelection(f1: string, f2: string) {
		return f1 && f2;
	}

	function refreshInnerData(
		f1: string,
		f2: string,
		dnOnly: boolean,
		startDate: DateTime,
		endDate: DateTime
	): Datum2d[] {
		const fileRange = dnOnly
			? index.data.filter((item) => {
					// Dataview already parses the note title for a date🥳
					const { day }: { day: DateTime } = item.file;
					return (
						day && startDate.ts <= day.ts && day.ts <= endDate.ts
					);
			  })
			: index.data;

		const innerData = fileRange
			.map((page) => {
				return {
					x: page[f1] as number,
					y: page[f2] as number,
					name: page.file.name,
				};
			})
			.filter((point) => {
				return point.x !== undefined && point.y !== undefined;
			});
		return innerData;
	}

	function refreshCorrelation(f1: string, f2: string, innerData: Datum2d[]) {
		const xs = innerData.map((p) => p.x);
		const ys = innerData.map((p) => p.y);

		return isValidSelection(f1, f2) ? getPearsonCorrelation(xs, ys) : null;
	}

	function refreshChartData(colour: string, innerData: Datum2d[]) {
		return {
			labels: ["Scatter"],
			datasets: [
				{
					borderColor: colour,
					backgroundColor: colour,
					label: "Data",
					data: innerData,
				},
			],
		};
	}

	function refreshChartOptions(f1: string, f2: string) {
		return {
			title: {
				display: true,
				text: "Scatter Chart - Logarithmic X-Axis",
			},
			scales: {
				xAxes: {
					title: {
						display: isValidSelection(f1, f2),
						text: f1 ?? "",
					},
					type: "linear",
					position: "bottom",
					scaleLabel: {
						labelString: "Frequency",
						display: true,
					},
				},

				yAxes: {
					type: "linear",
					scaleLabel: {
						labelString: "Voltage",
						display: true,
					},
					title: {
						display: isValidSelection(f1, f2),
						text: f2 ?? "",
					},
				},
			},
			plugins: {
				tooltip: {
					callbacks: {
						label: function (tooltipItem: Datum2d) {
							const { raw } = tooltipItem;
							return `${raw.name}:\n(${raw.x}, ${raw.y})`;
						},
					},
				},
			},
		};
	}

	$: innerData = refreshInnerData(f1, f2, dnOnly, startDate, endDate);
	$: correlation = refreshCorrelation(f1, f2, innerData);
	$: data = refreshChartData(colour, innerData);
	$: chartOptions = refreshChartOptions(f1, f2);
</script>

<div class="checkboxes">
	<datalist id="fields">
		{#each allFields as field}
			<option value={field} />
		{/each}
	</datalist>
	<label>
		Field 1:
		<input bind:value={f1} list="fields" />
	</label>
	<label>
		Field 2:
		<input bind:value={f2} list="fields" />
	</label>
</div>

<ChartOptions bind:colour bind:startDate bind:endDate bind:dnOnly />
<Scatter {data} options={chartOptions} />

<div class="measures">
	{#if isValidSelection(f1, f2)}
		<span>
			<span class="measure-name">n:</span>
			<span class="measure-value">{innerData.length}</span>
		</span>
		<span>
			<span class="measure-name">Correlation:</span>
			<span class="measure-value">{correlation?.toFixed(4)}</span>
		</span>
	{:else}
		<span>Select 2 fields</span>
	{/if}
</div>

<style>
	div.checkboxes {
		border-radius: 5px;
		border: 1px solid var(--background-modifier-border);
		padding: 3px;
	}

	div.measures {
		display: flex;
		justify-content: space-between;
	}

	span.measure-name {
		background-color: var(--background-secondary-alt);
		padding: 2px 4px;
		border-radius: 3px;
		font-size: 12px;
		line-height: 12px;
	}
	span.measure-name:hover {
		background-color: var(--interactive-accent);
	}
</style>
