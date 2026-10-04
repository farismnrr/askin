<script>
	import { goto } from '$app/navigation';
	import { WEBUI_NAME, config } from '$lib/stores';
	import { onMount, getContext } from 'svelte';

	const i18n = getContext('i18n');
	let loaded = false;

	onMount(async () => {
		if ($config) await goto('/');
		loaded = true;
	});
</script>

{#if loaded}
	<div class="min-h-screen flex items-center justify-center px-6 dark:text-gray-100">
		<div class="max-w-md text-center space-y-5">
			<img src="/favicon.png" alt="AskIn" class="size-14 mx-auto rounded-full" />
			<h1 class="text-2xl font-semibold">{$WEBUI_NAME} couldn't start</h1>
			<p class="text-sm text-gray-500 dark:text-gray-400">
				The application configuration could not be loaded. Check that the AskIn server is running, then try again.
			</p>
			<button class="px-5 py-2 rounded-full bg-gray-100 dark:bg-gray-800 font-medium text-sm" on:click={() => location.href = '/'}>
				{$i18n.t('Check Again')}
			</button>
		</div>
	</div>
{/if}
