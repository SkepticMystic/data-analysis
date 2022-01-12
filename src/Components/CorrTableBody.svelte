<script lang="ts">
	import { menuForChartNStatsModal, roundNumber } from "../utils";
	import CorrelationsReportView from "../CorrelationsReportView";

	export let view: CorrelationsReportView;
	export let criteria: (corr: number) => boolean;

	const { plugin } = view;

	const ariaN = (n: number) => (n ? "n: " + n.toFixed() : "");
</script>

<tbody>
	{#each view.corrsToShow as { fieldA, fieldB, info: { corr, n } }}
		{#if criteria(corr)}
			<tr
				aria-label={ariaN(n)}
				on:contextmenu={(e) => menuForChartNStatsModal(e, plugin)}
			>
				<td>{fieldA}</td>
				<td>{fieldB}</td>
				<td>{roundNumber(corr)}</td>
			</tr>
		{/if}
	{/each}
</tbody>
