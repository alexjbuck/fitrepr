<script>
	import { page } from '$app/stores';
	import AccomplishmentForm from './AccomplishmentForm.svelte';
	import AccomplishmentList from './AccomplishmentList.svelte';
</script>

<div class="new px-2 pt-2">
	<a href="/reports" class="btn btn-base variant-filled-primary">New Report</a>
</div>
<div class="lg:flex lg:flex-row">
	<div class="lg:w-2xl form">
		<AccomplishmentForm />
	</div>
	<div class="lg:flex-grow list">
		<AccomplishmentList />
	</div>
</div>

<style>
	.new {
		display: block;
	}
</style>
