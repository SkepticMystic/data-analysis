<script lang="ts">
	import { PrintableCorrelation } from "src/interfaces";
	import { menuForChartNStatsModal } from "src/utils";
	import CorrelationsReportView from "../CorrelationsReportView";
	import { ariaN } from "../reportViewUtils";

	export let view: CorrelationsReportView;
	export let top3: PrintableCorrelation[];
    
	const { plugin } = view;
</script>

{#each top3 as { fieldA, fieldB, info: { corr, n } }}
	<tr
		aria-label={ariaN(n)}
		on:contextmenu={(e) => menuForChartNStatsModal(e, plugin)}
	>
		<td>{fieldA}</td>
		<td>{fieldB}</td>
		<td>{corr.toFixed(4)}</td>
	</tr>
{/each}
