<script lang="ts">
	import { page } from '$app/stores';
	import Auth from '../components/Auth.svelte';
	import Account from '../components/Account.svelte';
	import AccomplishmentList from '../components/AccomplishmentList.svelte';
	import AccomplishmentForm from '../components/AccomplishmentForm.svelte';
</script>

<svelte:head>
	<title>Fitrepr</title>
	<meta name="description" content="SvelteKit using supabase-js v2" />
</svelte:head>

<h1>Fitrepr</h1>
{#if !$page.data.session}
	<Auth />
{:else}
	<Account session={$page.data.session} />
	<AccomplishmentForm />
	<AccomplishmentList session={$page.data.session} />
{/if}