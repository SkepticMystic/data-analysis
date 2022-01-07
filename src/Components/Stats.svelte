<script lang="ts">
	import { getMean, getMedian, getMode, getStdDev } from "../analyses";
	import { roundNumber } from "../utils";
	import { StatsModal } from "../StatsModal";

	export let modal: StatsModal;

	const { app, plugin } = modal;
	const { index, settings } = plugin;
	const { fieldsToCheck } = settings;

	let { f1 } = modal;

	const updateData = (field: string) =>
		index.data.map((d) => d[field]).filter((d) => d);

	$: data = updateData(f1);
	$: n = data.length;
	$: mean = getMean(data);
	$: median = getMedian(data);
	$: mode = getMode(data);
	$: std = getStdDev(data);

	$: stats = [
		n ? ["n", n] : null,
		mean ? ["Mean", roundNumber(mean)] : null,
		median ? ["Median", roundNumber(median)] : null,
		["Mode", mode],
		std ? ["Std Dev.", roundNumber(std)] : null,
	];
</script>

<datalist id="fields">
	{#each fieldsToCheck as field}
		<option value={field} />
	{/each}
</datalist>
<label for="fields">
	Field:
	<input bind:value={f1} list="fields" />
</label>

<table>
	<thead>
		<tr>
			<th>Stat</th>
			<th>Value</th>
		</tr>
	</thead>
	{#each stats as stat}
		{#if stat}
			<tr>
				<td>{stat[0]}</td>
				<td>{stat[1]}</td>
			</tr>
		{/if}
	{/each}
</table>

<style>
	table {
		margin-top: 5px;
		border-collapse: collapse;
	}
	th,
	td {
		border: 1px solid var(--background-modifier-border);
	}
	td {
		padding: 0.2rem 0.5rem;
	}
	td:first-child {
		text-align: right;
	}
</style>
