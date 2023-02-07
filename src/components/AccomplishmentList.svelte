<script lang="ts">
	import { onMount } from 'svelte';
	import type { AuthSession } from '@supabase/supabase-js';
	import { supabase } from '$lib/supabaseClient';
	import AccomplishmentEntry from './AccomplishmentEntry.svelte';
	import { accomplishments } from '../store';

	export let session: AuthSession;

	let loading = false;
	let website: string | null = null;
	let avatarUrl: string | null = null;

	onMount(() => {
		getAccomplishments();
	});

	const getAccomplishments = async () => {
		try {
			loading = true;
			const { user } = session;

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