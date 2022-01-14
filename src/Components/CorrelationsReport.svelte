<script lang="ts">
	import CorrelationsReportView from "../CorrelationsReportView";
	import { menuForChartNStatsModal } from "../utils";
	import Header from "./CorrTableHeader.svelte";
	import Body from "./CorrTableBody.svelte";

	export let view: CorrelationsReportView;

	const { plugin } = view;

	const getButtonText = (show: boolean) => (show ? "↓" : "↑");
	const ariaShowText = (show: boolean) =>
		show ? "Hide section" : "Show section";

	const ariaN = (n: number) => (n ? "n: " + n.toFixed() : "");
</script>

<div class="component">
	<h1>Correlations Report</h1>
	{#key view.fieldOptions}
		<select bind:value={view.selectedField} on:change={view.calculateReport}>
			{#each view.fieldOptions as field}
				<option value={field}>
					{field}
				</option>
			{/each}
		</select>
	{/key}

	{#key view.selectedField}
		<h3>
			Standards:
			<button
				on:click={() => {
					view.showStandards = !view.showStandards;
				}}
				aria-label={ariaShowText(view.showStandards)}
			>
				{getButtonText(view.showStandards)}
			</button>
		</h3>
		{#if view.showStandards}
			<div>
				<strong>Max: </strong>
				<input
					value={view.max}
					on:change={(e) => {
						view.max = parseFloat(e.target.value);
						view.calculateReport();
					}}
				/>
			</div>
			<div>
				<strong>Min: </strong>
				<input
					value={view.min}
					on:change={(e) => {
						view.min = parseFloat(e.target.value);
						view.calculateReport();
					}}
				/>
			</div>
			<div>
				<strong>Strong: </strong>
				<span
					>{"|r| >= "}<input
						value={view.medium}
						on:change={(e) => {
							view.medium = parseFloat(e.target.value);
							view.calculateReport();
						}}
					/></span
				>
			</div>
			<br />
			<div>
				<strong>Medium: </strong>
				<span>{view.lower + " < |r| < " + view.medium}</span>
			</div>
			<br />
			<div>
				<strong>Weak/No: </strong>
				<span
					>{"|r| =< "}<input
						value={view.lower}
						on:change={(e) => {
							view.lower = parseFloat(e.target.value);
							view.calculateReport();
						}}
					/></span
				>
			</div>
		{/if}

		{#key view.max}
			<h3>
				Top 3 Positive Correlations
				<button
					on:click={() => (view.showTopPos = !view.showTopPos)}
					aria-label={ariaShowText(view.showTopPos)}
				>
					{getButtonText(view.showTopPos)}
				</button>
			</h3>
			{#if view.showTopPos}
				<table class="markdown-preview-view">
					<Header />
					{#each view.topPos3 as { fieldA, fieldB, info: { corr, n } }}
						<tr
							aria-label={ariaN(n)}
							on:contextmenu={(e) =>
								menuForChartNStatsModal(e, plugin)}
						>
							<td>{fieldA}</td>
							<td>{fieldB}</td>
							<td>{corr.toFixed(4)}</td>
						</tr>
					{/each}
				</table>
			{/if}

			{#key view.min}
				<h3>
					Top 3 Negative Correlations
					<button
						on:click={() => (view.showTopNeg = !view.showTopNeg)}
						aria-label={ariaShowText(view.showTopNeg)}
					>
						{getButtonText(view.showTopNeg)}
					</button>
				</h3>
				{#if view.showTopNeg}
					<table class="markdown-preview-view">
						<Header />
						{#each view.topNeg3 as { fieldA, fieldB, info: { corr, n } }}
							<tr
								aria-label={ariaN(n)}
								on:contextmenu={(e) =>
									menuForChartNStatsModal(e, plugin)}
							>
								<td>{fieldA}</td>
								<td>{fieldB}</td>
								<td>{corr.toFixed(4)}</td>
							</tr>
						{/each}
					</table>
				{/if}

				{#key [view.lower, view.medium]}
					<h3>
						Strongly Correlated
						<button
							on:click={() =>
								(view.showStrong = !view.showStrong)}
							aria-label={ariaShowText(view.showStrong)}
						>
							{getButtonText(view.showStrong)}
						</button>
					</h3>
					{#if view.showStrong}
						<table class="markdown-preview-view">
							<Header />
							<Body
								{view}
								criteria={(corr) =>
									Math.abs(corr) >= view.medium}
							/>
							<!-- <tbody>
								{#each view.corrsToShow as { fieldA, fieldB, info: { corr, n } }}
									{#if Math.abs(corr) >= view.medium}
										<tr
											aria-label={ariaN(n)}
											on:contextmenu={(e) =>
												menuForChartNStatsModal(
													e,
													plugin
												)}
										>
											<td>{fieldA}</td>
											<td>{fieldB}</td>
											<td>{corr.toFixed(4)}</td>
										</tr>
									{/if}
								{/each}
							</tbody> -->
						</table>
					{/if}

					<h3>
						Somewhat Correlated
						<button
							on:click={() =>
								(view.showMedium = !view.showMedium)}
							aria-label={ariaShowText(view.showMedium)}
						>
							{getButtonText(view.showMedium)}
						</button>
					</h3>
					{#if view.showMedium}
						<table class="markdown-preview-view">
							<Header />
							<Body
								{view}
								criteria={(corr) =>
									Math.abs(corr) < view.medium &&
									Math.abs(corr) > view.lower}
							/>
							<!-- <tbody>
								{#each view.corrsToShow as { fieldA, fieldB, info: { corr, n } }}
									{#if Math.abs(corr) < view.medium && Math.abs(corr) > view.lower}
										<tr
											aria-label={ariaN(n)}
											on:contextmenu={(e) =>
												menuForChartNStatsModal(
													e,
													plugin
												)}
										>
											<td>{fieldA}</td>
											<td>{fieldB}</td>
											<td>{corr.toFixed(4)}</td>
										</tr>
									{/if}
								{/each}
							</tbody> -->
						</table>
					{/if}

					<h3>
						Weakly/Not Correlated
						<button
							on:click={() => (view.showWeak = !view.showWeak)}
							aria-label={ariaShowText(view.showWeak)}
						>
							{getButtonText(view.showWeak)}
						</button>
					</h3>
					{#if view.showWeak}
						<table class="markdown-preview-view">
							<Header />
							<Body
								{view}
								criteria={(corr) => Math.abs(corr) < view.lower}
							/>
							<tbody>
								{#each view.corrsToShow as { fieldA, fieldB, info: { corr, n } }}
									{#if Math.abs(corr) < view.lower}
										<tr
											aria-label={ariaN(n)}
											on:contextmenu={(e) =>
												menuForChartNStatsModal(
													e,
													plugin
												)}
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
