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
		} catch (err) {
            console.log(err);
        }
	};
</script>

<style>
    .editable {
        background-color: #ff3e00;
		color: white;
    }
    input[type=text] {
        border: 1px solid #222;
    }
</style>

<form class="flex">
	<input class="col-8" class:editable="{readonly===false}" type="text" bind:value={entry.description} {readonly}/>
	<input type="date" name="date" id="dateinput" bind:value={entry.date} {readonly}/>
	{#if readonly}
		<button
			on:click={() => {
				readonly = false;
			}}>Edit</button
		>
	{:else}
		<button class="primary button" on:click={handleUpdate}>Update</button>
	{/if}
	<button on:click={handleDelete}>{deleting ? "Deleting...":"Delete"}</button>
</form>
