<script lang="ts">
	import { AnalysisModal } from "src/AnalysisModal";
	import Checkboxes from "./Checkboxes.svelte";
	import ChartOptions from "./ChartOptions.svelte";
	import Scatter from "svelte-chartjs/src/Scatter.svelte";
	import { pearsonCorrelation } from "src/analyses";

	export let modal: AnalysisModal;

	const { app, plugin } = modal;
	const { index, settings } = plugin;
	const { fieldsToCheck } = settings;

	let allFields = fieldsToCheck;
	let selected: string[] = [];

	let colour = "#15a252";

	function isValidSelection(selected: string[]) {
		return selected.length === 2;
	}

	interface Datum2d {
		x: number;
		y: number;
	}

	function refreshInnerData(selected: string[]): Datum2d[] {
		return index
			.map((page) => {
				return {
					x: page[selected[0]]?.[0] as number,
					y: page[selected[1]]?.[0] as number,
				};
			})
			.filter((point) => {
				return point.x && point.y;
			});
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
		};
	}

	$: innerData = refreshInnerData(selected);
	$: correlation = refreshCorrelation(selected, innerData);
	$: data = refreshData(colour, innerData);
	$: chartOptions = refreshChartOptions(selected);
</script>

<Checkboxes options={allFields} {plugin} bind:selected />
<ChartOptions bind:colour />
<Scatter {data} options={chartOptions} />
<div>Correlation: {correlation?.toFixed(4) ?? "Select 2 fields"}</div>
