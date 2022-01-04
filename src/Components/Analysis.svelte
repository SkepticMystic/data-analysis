<script lang="ts">
	import { AnalysisModal } from "src/AnalysisModal";

	export let modal: AnalysisModal;

	const { app, plugin } = modal;
</script>

<Checkboxes {options} {plugin} bind:selected />
