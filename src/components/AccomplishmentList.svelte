<script lang="ts">
	import AccomplishmentEntry from '$components/AccomplishmentEntry.svelte';
	import { supabase } from '$lib/supabaseClient';
	import { accomplishments } from '../store';
	import { onMount } from 'svelte';

	let loading = false;

	onMount(() => {
		getAccomplishments();
	});

	const getAccomplishments = async () => {
		try {
			loading = true;

			const { data, error, status } = await supabase.from('accomplishments').select(`*`);

			if (data) {
				accomplishments.set(data);
				$accomplishments.sort((a,b)=> a.date.localeCompare(b.date));
			}
			if (error && status !== 406) throw error;
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			loading = false;
		}
	};
</script>


<ul class="list">
{#each $accomplishments as accomplishment}
	<li>
		<AccomplishmentEntry entry={accomplishment} />
	</li>
{/each}
</ul>