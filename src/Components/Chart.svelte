<script lang="ts">
	import { ChartModal } from "src/ChartModal";
	import Checkboxes from "./Checkboxes.svelte";
	import ChartOptions from "./ChartOptions.svelte";
	import Scatter from "svelte-chartjs/src/Scatter.svelte";
	import { getPearsonCorrelation } from "src/analyses";
	import { DateTime } from "obsidian-dataview";

	export let modal: ChartModal;

	const { app, plugin } = modal;
	const { index, settings } = plugin;
	const { fieldsToCheck } = settings;

	let allFields = fieldsToCheck;
	let first: string;
	let second: string;

	let colour = "#15a252";
	let startDate = index.minDate;
	let endDate = index.maxDate;
	let dnOnly = false;

	interface Datum2d {
		x: number;
		y: number;
		name: string;
	}

	function isValidSelection(first: string, second: string) {
		return first && second;
	}

	function refreshInnerData(
		first: string,
		second: string,
		dnOnly: boolean,
		startDate: DateTime,
		endDate: DateTime
	): Datum2d[] {
		const fileRange = dnOnly
			? index.data.filter((item) => {
					const { day }: { day: DateTime } = item.file;
					return (
						day && startDate.ts <= day.ts && day.ts <= endDate.ts
					);
			  })
			: index.data;

		const innerData = fileRange
			.map((page) => {
				return {
					x: page[first] as number,
					y: page[second] as number,
					name: page.file.name,
				};
			})
			.filter((point) => {
				return point.x && point.y;
			});
		return innerData;
	}

	function refreshCorrelation(
		first: string,
		second: string,
		innerData: Datum2d[]
	) {
		return isValidSelection(first, second)
			? getPearsonCorrelation(
					innerData.map((p) => p.x),
					innerData.map((p) => p.y)
			  )
			: null;
	}

	function refreshData(colour: string, innerData: Datum2d[]) {
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

	function refreshChartOptions(first: string, second: string) {
		return {
			title: {
				display: true,
				text: "Scatter Chart - Logarithmic X-Axis",
			},
			scales: {
				xAxes: {
					title: {
						display: isValidSelection(first, second),
						text: first ?? "",
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
						display: isValidSelection(first, second),
						text: second ?? "",
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

	$: innerData = refreshInnerData(first, second, dnOnly, startDate, endDate);
	$: correlation = refreshCorrelation(first, second, innerData);
	$: data = refreshData(colour, innerData);
	$: chartOptions = refreshChartOptions(first, second);
</script>

<div class="checkboxes">
	<datalist id="fields">
		{#each allFields as field}
			<option value={field} />
		{/each}
	</datalist>
	<label for="fields">
		Field 1:
		<input bind:value={first} list="fields" />
	</label>
	<label for="seconds">
		Field 2:
		<input bind:value={second} list="fields" />
	</label>
</div>

<ChartOptions bind:colour bind:startDate bind:endDate bind:dnOnly />
<Scatter {data} options={chartOptions} />

<div>Correlation: {correlation?.toFixed(4) ?? "Select 2 fields"}</div>

<style>
	div.checkboxes {
		border-radius: 5px;
		border: 1px solid var(--background-modifier-border);
		padding: 3px;
	}
</style>
