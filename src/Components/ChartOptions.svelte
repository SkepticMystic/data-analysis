<script lang="ts">
	import { DateTime } from "luxon";

	export let colour: string;
	export let startDate: DateTime;
	export let endDate: DateTime;
	export let dnOnly: boolean;

	const minDateStr: string = startDate.toISODate();
	const maxDateStr: string = endDate.toISODate();
</script>

<input type="color" bind:value={colour} />
<label
	>Date Range<input
		type="checkbox"
		checked={dnOnly}
		on:change={() => (dnOnly = !dnOnly)}
	/></label
>
{#if dnOnly}
	<label>
		Start
		<input
			type="date"
			value={minDateStr}
			min={minDateStr}
			max={maxDateStr}
			on:change={(e) => (startDate = DateTime.fromISO(e.target.value))}
		/>
	</label>
	<label>
		End
		<input
			type="date"
			value={maxDateStr}
			min={minDateStr}
			max={maxDateStr}
			on:change={(e) => (endDate = DateTime.fromISO(e.target.value))}
		/>
	</label>
{/if}
