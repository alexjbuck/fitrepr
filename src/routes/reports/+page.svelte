<script lang="ts">
	import { page } from '$app/stores';
	import { supabase } from '$lib/supabaseClient';
	import type { CreateCompletionResponse } from 'openai';
	import { SSE } from 'sse.js';
	import { user_name } from '../../store';

	let loading = false;
	let error_flag = false;
	let start = '';
	let report = ''
	let end = new Date().toISOString().slice(0, 10);
	console.log(start);

	const handleSubmit = async () => {
		loading = true;
		error_flag = false;
		console.log(start, end);

		const { data } = await supabase
			.from('accomplishments')
			.select(`*`)
			.lte('date', end)
			.gte('date', start);
		data?.sort((a, b) => {
			return new Date(a.date).getTime() - new Date(b.date).getTime();
		});
		console.log(data);

		console.log($user_name)

		let details = `Name: ${$user_name}\n`;
		
		data?.forEach((entry, index) => {
			details += `Detail ${index + 1}: ${entry.description}\n`;
		});
		
		console.log(details);
		const eventSource = new SSE('/api/v1/request-report.json', {
			headers: {
				'Content-Type': 'application/json'
			},
			payload: JSON.stringify({ details })
		});
		details = ''
		eventSource.addEventListener('error',(e)=>{
			error_flag = true
			loading = false
			console.error(e)
			alert('Something went wrong')
		})
		eventSource.addEventListener('message', (e)=> {
			try {
				loading=false
				if (e.data ==='[DONE]') {
					return
				}

				const completionResponse: CreateCompletionResponse = JSON.parse(e.data)

				const [{text}] = completionResponse.choices

				report = (report ?? '') + text
			} catch (err) {
				error_flag = true
				loading = false
				console.error(err)
				alert('Something else went wrong!')
			}
		})
		eventSource.stream()
	};
</script>

<div class="p-4 max-w-xl mx-auto">
	<h2>Generate new Fitrep</h2>

	<p>
		Fitrepr can now make a Fitrep for you now that you have stored some accomplishments to work
		with.
	</p>
	<form on:submit|preventDefault={() => handleSubmit()}>
		<input required type="date" name="start" bind:value={start} />
		<input required type="date" name="end" bind:value={end} />
		<button type="submit" class="btn btn-base variant-filled-secondary">Submit</button>
	</form>
	<textarea bind:value={report}></textarea>
</div>
