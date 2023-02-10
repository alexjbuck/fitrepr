<script lang="ts">
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../theme.postcss';
	import '../app.postcss';
	import { supabase } from '$lib/supabaseClient';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { AppShell, Modal, modalStore } from '@skeletonlabs/skeleton';
	import Header from '../components/Header.svelte';
	import Footer from '../components/Footer.svelte';
	import { fade } from 'svelte/transition';

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange(() => {
			invalidate('supabase:auth');
		});

		return () => {
			subscription.unsubscribe();
		};
	});
</script>

<AppShell>
	<svelte:fragment slot="header"><Header /></svelte:fragment>

	<slot />

	<svelte:fragment slot="footer"><Footer /></svelte:fragment>
</AppShell>
<Modal />
