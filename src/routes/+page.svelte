<script lang="ts">
	import { page } from '$app/stores';
	import Auth from '../components/Auth.svelte';
	import AccomplishmentList from '../components/AccomplishmentList.svelte';
	import AccomplishmentForm from '../components/AccomplishmentForm.svelte';
</script>

<svelte:head>
	<title>Fitrepr</title>
	<meta name="description" content="Fitrepr. Automate your fitrep!" />
</svelte:head>

<div class="lg:flex lg:flex-row">
	{#if !$page.data.session}
		<Auth />
	{:else}
		<div class="lg:w-2xl">
			<AccomplishmentForm />
		</div>
		<div class="lg:flex-grow">
			<AccomplishmentList session={$page.data.session} />
		</div>
		<a href="/reports" class="btn btn-base variant-filled-primary">New Report</a>
	{/if}
</div>
