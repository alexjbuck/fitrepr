<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { accomplishments, type Accomplishment } from '../store';

	export let entry: Accomplishment;

	let readonly = true;
	let deleting = false;

	const handleDelete = async () => {
		deleting = true;
		let confirmed = confirm('Are you sure you want to delete?');
		if (confirmed == false) {
			return;
		}
		try {
			let { data, error } = await supabase.from('accomplishments').delete().eq('id', entry.id);
			accomplishments.update((list) => list.filter((e) => e.id != entry.id));
		} catch (err) {
			console.log(err);
		}
		deleting = false;
	};
	const handleUpdate = async () => {
		readonly = true;
		try {
			let { data, error } = await supabase
				.from('accomplishments')
				.update({ description: entry.description, date: entry.date })
				.eq('id', entry.id);

			$accomplishments[$accomplishments.findIndex((e) => e.id == entry.id)] = entry;
			$accomplishments.sort((a,b)=> a.date.localeCompare(b.date));
		} catch (err) {
			console.log(err);
		}
	};
</script>

<form class="input-group input-group-divider flex flex-row">
	<input
		class:editable={readonly === false}
		class="flex-grow"
		type="text"
		bind:value={entry.description}
		{readonly}
	/>
	<input
		type="date"
		class="max-w-fit"
		name="date"
		id="dateinput"
		bind:value={entry.date}
		{readonly}
	/>
	{#if readonly}
		<button
			class="btn btn-base variant-ghost-primary min-w-[6em]"
			on:click={() => {
				readonly = false;
			}}>Edit</button
		>
	{:else}
		<button class="btn btn-base variant-ghost-primary min-w-[6em]" on:click={handleUpdate}
			>Update</button
		>
	{/if}
	<button class="btn btn-base variant-ghost-primary min-w-[6em]" on:click={handleDelete}
		>{deleting ? '...' : 'Delete'}</button
	>
</form>
