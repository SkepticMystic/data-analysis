<script lang="ts">
	import { ChartModal } from "src/ChartModal";
	import Checkboxes from "./Checkboxes.svelte";
	import ChartOptions from "./ChartOptions.svelte";
	import Scatter from "svelte-chartjs/src/Scatter.svelte";
	import { pearsonCorrelation } from "src/analyses";
	import { DateTime } from "obsidian-dataview";

	export let modal: ChartModal;

	const { app, plugin } = modal;
	const { index, settings } = plugin;
	const { fieldsToCheck } = settings;

	let allFields = fieldsToCheck;
	let selected: string[] = [];

	let colour = "#15a252";
	let startDate = index.minDate;
	let endDate = index.maxDate;
	let dnOnly = false;

	function isValidSelection(selected: string[]) {
		return selected.length === 2;
	}

	interface Datum2d {
		x: number;
		y: number;
		name: string;
	}

	function refreshInnerData(
		selected: string[],
		dnOnly: boolean,
		startDate: DateTime,
		endDate: DateTime
	): Datum2d[] {
		const fileRange = dnOnly
			? index.data.filter((item) => {
					console.log(item);
					const { day }: { day: DateTime } = item.file;
					console.log({ day });
					return (
						day && startDate.ts <= day.ts && day.ts <= endDate.ts
					);
			  })
			: index.data;
		console.log({ fileRange });
		const innerData = fileRange
			.map((page) => {
				return {
					x: page[selected[0]]?.[0] as number,
					y: page[selected[1]]?.[0] as number,
					name: page.file.name,
				};
			})
			.filter((point) => {
				return point.x && point.y;
			});
		return innerData;
	}

	function refreshCorrelation(selected: string[], innerData: Datum2d[]) {
		return isValidSelection(selected)
			? pearsonCorrelation(
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
					label: "V(node2)",
					data: innerData,
				},
			],
		};
	}

	function refreshChartOptions(selected: string[]) {
		return {
			title: {
				display: true,
				text: "Scatter Chart - Logarithmic X-Axis",
			},
			scales: {
				xAxes: {
					title: {
						display: isValidSelection(selected),
						text: selected[0] ?? "",
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
						display: isValidSelection(selected),
						text: selected[1] ?? "",
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

	$: innerData = refreshInnerData(selected, dnOnly, startDate, endDate);
	$: correlation = refreshCorrelation(selected, innerData);
	$: data = refreshData(colour, innerData);
	$: chartOptions = refreshChartOptions(selected);
</script>

<div class="checkboxes">
	<Checkboxes options={allFields} {plugin} bind:selected />
</div>

<ChartOptions bind:colour bind:startDate bind:endDate bind:dnOnly />
<Scatter {data} options={chartOptions} />

<div>Correlation: {correlation?.toFixed(4) ?? "Select 2 fields"}</div>

<style>
	div.checkboxes {
		border-radius: 5px;
		border: 1px solid var(--background-modifier-border);
	}
</style>
