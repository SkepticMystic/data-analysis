<script lang="ts">
	import { DateTime } from "obsidian-dataview";
	import {
		getPearsonCorrelation,
		getPointBiserialCorrelation,
		isBinary,
		isQuant,
	} from "src/analyses";
	import { ChartModal } from "src/ChartModal";
	import { isNested } from "src/utils";
	import Bar from "svelte-chartjs/src/Bar.svelte";
	import Scatter from "svelte-chartjs/src/Scatter.svelte";
	import ChartOptions from "./ChartOptions.svelte";

	export let modal: ChartModal;
	let { f1, f2 } = modal;

	const { app, plugin } = modal;
	const { index, settings, unwrappedFields } = plugin;
	const { fieldsToCheck } = settings;

	let allFields = fieldsToCheck;
	let [n1, n2] = [0, 0];

	let colour = "#15a252";
	let startDate = index.minDate;
	let endDate = index.maxDate;
	let dnOnly = false;
	let errorMessage = "";

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

		const f1Nested = isNested(unwrappedFields, f1);
		const f2Nested = isNested(unwrappedFields, f2);
		console.log({ f1Nested, f2Nested });

		const innerData = fileRange
			.map((page) => {
				const x = f1Nested
					? page[f1Nested]
							?.map((v: string | { path: string }) => v.path ?? v)
							.includes(f1)
					: page[f1];
				const y = f2Nested
					? page[f2Nested]
							?.map((v: string | { path: string }) => v.path ?? v)
							.includes(f2)
					: page[f2];

				return {
					x,
					y,
					name: page.file.name,
				};
			})
			.filter((point) => {
				return point.x !== undefined && point.y !== undefined;
			});
		return innerData;
	}

	function refreshCorrelation(
		f1: string,
		f2: string,
		innerData: Datum2d[]
	): { value: number; type: "Pearson" | "Point Biserial" } {
		const xs = innerData.map((p) => p.x);
		const ys = innerData.map((p) => p.y);
		console.log({ innerData });

		if (isValidSelection(f1, f2)) {
			const [xQuant, yQuant] = [isQuant(xs), isQuant(ys)];
			const [xBinary, yBinary] = [isBinary(xs), isBinary(ys)];

			console.log({ xQuant, yQuant, xBinary, yBinary });

			if (xQuant && yQuant) {
				errorMessage = "";
				return {
					value: getPearsonCorrelation(xs, ys, true),
					type: "Pearson",
				};
			} else if (xQuant && yBinary) {
				errorMessage = "";
				return {
					value: getPointBiserialCorrelation(ys, xs),
					type: "Point Biserial",
				};
			} else if (xBinary && yQuant) {
				errorMessage = "";
				return {
					value: getPointBiserialCorrelation(xs, ys),
					type: "Point Biserial",
				};
			} else {
				errorMessage =
					"Either both fields must be numeric, or one must be numeric and the other binary.";
				return null;
			}
		}
		return null;
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
				},

				yAxes: {
					type: "linear",
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

{#if !correlation || correlation.type === "Pearson"}
	<Scatter {data} options={chartOptions} />
{:else}
	<Bar {data} options={chartOptions} />
{/if}
<div class="measures">
	{#if errorMessage != ""}
		<span>Error: {errorMessage}</span>
	{:else if isValidSelection(f1, f2)}
		<span>
			<span class="measure-name">n:</span>
			<span class="measure-value">{innerData.length}</span>
		</span>
		<span>
			<span class="measure-name">Correlation:</span>
			<span class="measure-value">{correlation?.value.toFixed(4)}</span>
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
