<script lang="ts">
	import { supabase } from '$lib/supabaseClient';

	let loading = false;
	let email: string;

	const handleLogin = async () => {
		try {
			loading = true;
			const { error } = await supabase.auth.signInWithOtp({ email });
			if (error) throw error;
			alert('Check your email for the login link!');
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			loading = false;
		}
	};
</script>

<div class="card max-w-md ml-auto mr-auto mt-8 p-8">
	<form class="row" on:submit|preventDefault={handleLogin}>
		<h2 class="header">Login</h2>
		<p class="description">
			Join in the magic of automated fitreps, sign in via magic link with your email below!
		</p>
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
			<input type="email" placeholder="Your email" bind:value={email} />
			<input
				type="submit"
				class="variant-filled-primary"
				value={loading ? 'Loading' : 'Login'}
				disabled={loading}
			/>
		</div>
	</form>
</div>
