<script lang="ts">
	import FitrepForm from '../../components/FitrepForm.svelte';

    import type { ActionData } from './$types';

    export let form: ActionData;
</script>

<div class="p-4 max-w-xl mx-auto">
	<h2>Generate new Fitrep</h2>

	<p>
		Fitrepr can now make a Fitrep for you now that you have stored some accomplishments to work
		with.
	</p>
	{#if form?.success}
		<p>Here is your new fitrep!</p>
	{:else}
		<FitrepForm />
	{/if}
</div>
