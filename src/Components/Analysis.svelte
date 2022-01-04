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


	let data = refreshData(colour, innerData);
	$: data = refreshData(colour, innerData);

	let chartOptions = {
		title: {
			display: true,
			text: "Scatter Chart - Logarithmic X-Axis",
		},
		scales: {
			xAxes: [
				{
					label: "Test",
					type: "linear",
					position: "bottom",
					ticks: {
						userCallback: function (tick) {
							var remain =
								tick /
								Math.pow(
									10,
									Math.floor(Chart.helpers.log10(tick))
								);
							if (remain === 1 || remain === 2 || remain === 5) {
								return tick.toString() + "Hz";
							}
							return "";
						},
					},
					scaleLabel: {
						labelString: "Frequency",
						display: true,
					},
				},
			],
			yAxes: [
				{
					type: "linear",
					ticks: {
						userCallback: function (tick) {
							return tick.toString() + "dB";
						},
					},
					scaleLabel: {
						labelString: "Voltage",
						display: true,
					},
				},
			],
		},
	};
</script>

<Checkboxes options={allFields} {plugin} bind:selected />
<ChartOptions bind:colour />
<Scatter {data} options={chartOptions} />
<div>Correlation: {correlation?.toFixed(4) ?? "Select 2 fields"}</div>
