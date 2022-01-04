<script lang="ts">
	import { getMean, getMedian, getMode, getStdDev } from "src/analyses";
	import { StatsModal } from "../StatsModal";

	export let modal: StatsModal;

	const { app, plugin } = modal;
	const { index, settings } = plugin;
	const { fieldsToCheck } = settings;

	let field = fieldsToCheck[0];

	const updateData = (field: string) =>
		index.data.map((d) => d[field]).filter((d) => d);

	$: data = updateData(field);
	$: mean = getMean(data);
	$: median = getMedian(data);
	$: mode = getMode(data);
	$: std = getStdDev(data);

	$: stats = [
		mean ? ["Mean", mean] : null,
		median ? ["Median", median] : null,
		["Mode", mode],
		std ? ["Std Dev.", std?.toFixed(4)] : null,
	];
	$: console.log({ stats });
</script>

<label>
	Field:
	<select class="dropdown" bind:value={field}>
		{#each fieldsToCheck as field}
			<option value={field}>{field}</option>
		{/each}
	</select>
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
