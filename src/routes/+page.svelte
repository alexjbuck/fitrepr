<script lang="ts">
	import { page } from '$app/stores';
	import Auth from '$components/Auth.svelte';
	import Main from '$components/Main.svelte';
</script>

<svelte:head>
	<title>Fitrepr</title>
	<meta name="description" content="Fitrepr. Automate your fitrep!" />
</svelte:head>

{#if !$page.data.session}
	<Auth />
{:else}
	<Main />
{/if}
