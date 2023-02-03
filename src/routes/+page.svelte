<script lang="ts">
	import { page } from '$app/stores';
	import Auth from './Auth.svelte';
	import Account from './Account.svelte';
</script>

<svelte:head>
	<title>Fitrepr</title>
	<meta name="description" content="SvelteKit using supabase-js v2" />
</svelte:head>

{#if !$page.data.session}
	<Auth />
{:else}
	<Account session={$page.data.session} />
{/if}

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
