<script lang="ts">
	import type BCPlugin from "../main";

	export let plugin: BCPlugin;
	export let options: string[];
	export let selected: string[];

	let toNone = selected.length === 0 ? false : true;
	$: toNone = selected.length === 0 ? false : true;
</script>

<div>
	<button
		on:click={async () => {
			if (toNone) selected = [];
			else selected = options;
		}}
	>
		{toNone ? "None" : "All"}
	</button>
</div>

<div class="grid">
	{#each options as option}
		<div>
			<label>
				<input type="checkbox" value={option} bind:group={selected} />
				{option}
			</label>
		</div>
	{/each}
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
		/* grid-gap: 10px; */
	}
</style>
