<script lang="ts">
	import CorrelationsReportView from "../CorrelationsReportView";
	import { menuForChartNStatsModal } from "../utils";

	export let view: CorrelationsReportView;

	const { plugin } = view;

	const getButtonText = (show: boolean): string => {
		if (show) {
			return "↓";
		}
		return "↑";
	}

	const ariaShowText = (show: boolean): string => {
		if (show) {
			"Hide section";
		}
		return "Show/hide section";
	}

</script>

<div class="component">
	<h1>Correlations Report</h1>
	<select bind:value={view.selectedField} on:change={() => view.calculateReport()}>
		{#each view.fieldOptions as field}
		<option value={field}>
			{field}
		</option>
		{/each}
	</select>

	{#key view.selectedField}
	{#key view.showStandards}
	<h3>Standards:
		<button on:click={() => {view.showStandards = !view.showStandards}} aria-label={ariaShowText(view.showStandards)}>
			{getButtonText(view.showStandards)}
		</button>
	</h3>
	{#if view.showStandards}
	<div>
		<u>Max Correlation: </u>
		<input value="{view.max}" on:change={(e) => {view.max = parseFloat(e.target.value); view.calculateReport();}}>
	</div>
	<div>
		<u>Min Correlation: </u>
		<input value="{view.min}" on:change={(e) => {view.min = parseFloat(e.target.value); view.calculateReport();}}>
	</div>
	<div>
		<u>Strong Correlation: </u>
		<span>{"|r| >= "}<input value="{view.medium}" on:change={(e) => {view.medium = parseFloat(e.target.value); view.calculateReport();}}></span>
	</div>
	<br/>
	<div>
		<u>Medium Correlation: </u>
		<span>{view.lower + " < |r| < " + view.medium}</span>
	</div>
	<br/>
	<div>
		<u>Weak/No Correlation: </u>
		<span>{"|r| =< "}<input value="{view.lower}" on:change={(e) => {view.lower = parseFloat(e.target.value); view.calculateReport();}}></span>
	</div>
	{/if}
	{/key}

	{#key view.max}
		{#key view.showTopPos}
		<h3>Top 3 Positive Correlations
			<button on:click={() => {view.showTopPos = !view.showTopPos}} aria-label={ariaShowText(view.showTopPos)}>
				{getButtonText(view.showTopPos)}
			</button>
		</h3>
		{#if view.showTopPos}
		<table class="markdown-preview-view">
			<thead>
				<tr>
					<th></th>
					<th>Field 1</th>
					<th>Field 2</th>
					<th>Correlation</th>
				</tr>
			</thead>
			{#each view.topPos3 as { fieldA, fieldB, info: { corr, n }}, index}
				<tr
					aria-label={n ? "n: " + n.toFixed() : ""}
					on:contextmenu={(e) =>
						menuForChartNStatsModal(e, plugin)}
				>
					<td>{index}</td>
					<td>{fieldA}</td>
					<td>{fieldB}</td>
					<td>{corr.toFixed(4)}</td>
				</tr>
			{/each}
		</table>
		{/if}
		{/key}

	{#key view.min}
		{#key view.showTopNeg}
		<h3>Top 3 Negative Correlations
			<button on:click={() => {view.showTopNeg = !view.showTopNeg}} aria-label={ariaShowText(view.showTopNeg)}>
				{getButtonText(view.showTopNeg)}
			</button>
		</h3>
		{#if view.showTopNeg}
		<table class="markdown-preview-view">
			<thead>
				<tr>
					<th></th>
					<th>Field 1</th>
					<th>Field 2</th>
					<th>Correlation</th>
				</tr>
			</thead>
			{#each view.topNeg3 as { fieldA, fieldB, info: { corr, n }}, index}
				<tr
					aria-label={n ? "n: " + n.toFixed() : ""}
					on:contextmenu={(e) =>
						menuForChartNStatsModal(e, plugin)}
				>
					<td>{index}</td>
					<td>{fieldA}</td>
					<td>{fieldB}</td>
					<td>{corr.toFixed(4)}</td>
				</tr>
			{/each}
		</table>
		{/if}
		{/key}

	{#key view.lower}
	{#key view.medium}
		{#key view.showStrong}
		<h3>Strongly Correlated
			<button on:click={() => {view.showStrong = !view.showStrong}} aria-label={ariaShowText(view.showStrong)}>
				{getButtonText(view.showStrong)}
			</button>
		</h3>
		{#if view.showStrong}
		<table class="markdown-preview-view">
			<thead>
				<tr>
					<th>Field 1</th>
					<th>Field 2</th>
					<th>Correlation</th>
				</tr>
			</thead>

			<tbody>
				{#each view.corrsToShow as { fieldA, fieldB, info: { corr, n } }}
					{#if (Math.abs(corr) >= view.medium)}
						<tr
							aria-label={n ? "n: " + n.toFixed() : ""}
							on:contextmenu={(e) =>
								menuForChartNStatsModal(e, plugin)}
						>
							<td>{fieldA}</td>
							<td>{fieldB}</td>
							<td>{corr.toFixed(4)}</td>
						</tr>
					{/if}
				{/each}
			</tbody>
		</table>
		{/if}
		{/key}

		{#key view.showMedium}
		<h3>Somewhat Correlated
			<button on:click={() => {view.showMedium = !view.showMedium}} aria-label={ariaShowText(view.showMedium)}>
				{getButtonText(view.showMedium)}
			</button>
		</h3>
		{#if view.showMedium}
		<table class="markdown-preview-view">
			<thead>
				<tr>
					<th>Field 1</th>
					<th>Field 2</th>
					<th>Correlation</th>
				</tr>
			</thead>

			<tbody>
				{#each view.corrsToShow as { fieldA, fieldB, info: { corr, n } }}
					{#if (Math.abs(corr) < view.medium && Math.abs(corr) > view.lower)}
						<tr
							aria-label={n ? "n: " + n.toFixed() : ""}
							on:contextmenu={(e) =>
								menuForChartNStatsModal(e, plugin)}
						>
							<td>{fieldA}</td>
							<td>{fieldB}</td>
							<td>{corr.toFixed(4)}</td>
						</tr>
					{/if}
				{/each}
			</tbody>
		</table>
		{/if}
		{/key}

		{#key view.showWeak}
		<h3>Weakly/Not Correlated
			<button on:click={() => {view.showWeak = !view.showWeak}} aria-label={ariaShowText(view.showWeak)}>
				{getButtonText(view.showWeak)}
			</button>
		</h3>
		{#if view.showWeak}
		<table class="markdown-preview-view">
			<thead>
				<tr>
					<th>Field 1</th>
					<th>Field 2</th>
					<th>Correlation</th>
				</tr>
			</thead>

			<tbody>
				{#each view.corrsToShow as { fieldA, fieldB, info: { corr, n } }}
					{#if (Math.abs(corr) < view.lower)}
						<tr
							aria-label={n ? "n: " + n.toFixed() : ""}
							on:contextmenu={(e) =>
								menuForChartNStatsModal(e, plugin)}
						>
							<td>{fieldA}</td>
							<td>{fieldB}</td>
							<td>{corr.toFixed(4)}</td>
						</tr>
					{/if}
				{/each}
			</tbody>
		</table>
		{/if}
		{/key}
	{/key}
	{/key}
	{/key}
	{/key}
	{/key}
</div>

<style>
	div.component {
		padding: 5px;
	}

	table {
		border-collapse: collapse;
		overflow: auto;
	}
	table,
	table tr,
	table td {
		border: 1px solid var(--background-modifier-border);
	}
</style>
