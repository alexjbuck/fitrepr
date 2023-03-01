<script lang="ts">
	import { onMount } from 'svelte';
	import type { AuthSession } from '@supabase/supabase-js';
	import { supabase } from '$lib/supabaseClient';
	import { page } from '$app/stores';
	import { menu, ProgressBar, ProgressRadial } from '@skeletonlabs/skeleton';
	import { user_name } from '../store';

	// export let session: AuthSession;
	let session: AuthSession | null = $page.data.session;

	let loading = false;
	let username: string | null = null;
	let website: string | null = null;
	let avatarUrl: string | null = null;
	let open = false;

	onMount(() => {
		if (session) {
			getProfile();
		}
	});

	const getProfile = async () => {
		try {
			loading = true;
			const { user } = <AuthSession>session;

			const { data, error, status } = await supabase
				.from('profiles')
				.select(`username, website, avatar_url`)
				.eq('id', user.id)
				.single();

			if (data) {
				username = data.username;
				website = data.website;
				avatarUrl = data.avatar_url;
				$user_name = username === null ? '' : username
			}

			if (error && status !== 406) throw error;
		} catch (error) {
			if (error instanceof Error) {
				console.log(error);
			}
		} finally {
			loading = false;
		}
	};

	async function updateProfile() {
		try {
			loading = true;
			const { user } =  <AuthSession>session;;

			const updates = {
				id: user.id,
				username,
				website,
				avatar_url: avatarUrl,
				updated_at: new Date().toISOString()
			};

			let { error } = await supabase.from('profiles').upsert(updates);

			if (error) throw error;
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			loading = false;
		}
	}

	async function signOut() {
		try {
			loading = true;
			let { error } = await supabase.auth.signOut();
			if (error) throw error;
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			loading = false;
		}
	}
</script>

<div class="relative">
	<button
		class="ml-auto hover:text-primary-500 transition-all"
		use:menu={{ interactive: true, menu: 'account' }}>Profile</button
	>
	<div data-menu="account" class="card p-4 min-w-max">
		{#if session}
			<form class="form-widget" on:submit|preventDefault={updateProfile}>
				<label class="input-label mb-4" for="email">
					<span>Email</span>
					<input id="email" type="email" value={session.user.email} disabled />
				</label>
				<label class="input-label my-4" for="username">
					<span>Name & Rank</span>
					<input id="username" type="text" bind:value={username} />
				</label>
				<label class="input-label my-4" for="website">
					<span>Website</span>
					<input id="website" type="url" bind:value={website} />
				</label>

				<div class='flex flex-row justify-between mt-4'>
					{#if loading}
					<button class="btn btn-base variant-filled-primary w-32" type="submit">
						<ProgressBar meter='bg-secondary-200-700-token'	 />
					</button>
					{:else}
						<button class="btn btn-base variant-filled-primary w-32" type="submit">
							Update
						</button>
					{/if}
					<button class="btn btn-base variant-filled-warning w-32" on:click={signOut} disabled={loading}>
						Sign Out
					</button>
				</div>
			</form>
		{:else}
			<p>You are not logged in.</p>
			<p>Please log in to continue.</p>
		{/if}
	</div>
</div>
