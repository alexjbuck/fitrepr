<script lang="ts">
	import { page } from '$app/stores';
	import { supabase } from '$lib/supabaseClient';
    import { accomplishments, type Accomplishment } from '../store'

	let description = '';
	let date = new Date().toISOString().slice(0, 10);
    
    let adding = false;

	const handleSubmit = async () => {
        adding = true;
		const entry: Accomplishment = { description, date, user_id: $page.data.session.user.id };
		try {
			const {data,error} = await supabase.from('accomplishments').insert(entry).select();
            if (error){
                new Error(error.message)
            }
			accomplishments.update((list) => [...list, ...data]);
            description = '';
            date = new Date().toISOString().slice(0, 10);
		} catch (err) {
			console.log(err);
		}
        adding = false
	};
</script>

<style>
    form button:hover {
        background-color: #2a2a2a;
    }
</style>

<div>
	<form on:submit|preventDefault={handleSubmit} class="flex">
		<input
			class="col-9"
			type="text"
			name="description"
			id="descriptioninput"
			bind:value={description}
		/>
		<input type="date" name="date" id="dateinput" bind:value={date} />
		<button type="submit" class="primary button">{adding ? 'adding...' : 'Add'}</button>
	</form>
</div>
