<script lang="ts">
	import { APP_NAME } from '$lib/constants';
</script>

<svelte:head>
	<title>Help | {APP_NAME}</title>
</svelte:head>

<div class="max-w-3xl mx-auto px-6 py-10 space-y-8 text-gray-800 dark:text-gray-100">
	<a href="/" class="text-sm underline">Back to AskIn</a>
	<header class="flex items-center gap-4">
		<img src="/favicon.png" alt="AskIn" class="size-12 rounded-full" />
		<h1 class="text-3xl font-semibold">AskIn Help</h1>
	</header>
	<section class="space-y-2">
		<h2 class="text-xl font-semibold">Conversations</h2>
		<p>Choose a model at the top of the page, enter a message, and press Enter to send. Use New Chat to start another conversation. Saved conversations appear in the sidebar.</p>
	</section>
	<section class="space-y-2">
		<h2 class="text-xl font-semibold">Workspace</h2>
		<p>Organize model presets, documents, and prompt templates in your workspace. Use each item's menu to clone, export, or delete it. Import exported JSON files to reuse your presets.</p>
		<a href="/workspace" class="text-sm underline">Open Workspace</a>
	</section>
	<section class="space-y-2">
		<h2 class="text-xl font-semibold">Settings and shortcuts</h2>
		<p>Open your profile menu to change your theme, language, and chat preferences. The help menu in the bottom corner lists keyboard shortcuts.</p>
	</section>
	<section id="connections" class="space-y-2">
		<h2 class="text-xl font-semibold">Model connections</h2>
		<p>For a connected AskIn installation, administrators manage model providers in Admin Settings → Connections. Check the provider URL and availability if models fail to load.</p>
	</section>
</div>
