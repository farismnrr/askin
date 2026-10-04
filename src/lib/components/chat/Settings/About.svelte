<script lang="ts">
	import { getContext } from 'svelte';
	import { APP_NAME, WEBUI_BUILD_HASH, WEBUI_VERSION } from '$lib/constants';
	import { showChangelog, showSettings } from '$lib/stores';
	import Tooltip from '$lib/components/common/Tooltip.svelte';

	const i18n = getContext('i18n');
</script>

<div class="space-y-5 text-sm mb-6">
	<div class="flex items-center gap-3">
		<img src="/favicon.png" alt="AskIn" class="size-12 rounded-full" />
		<div>
			<div class="text-lg font-semibold">{APP_NAME}</div>
			<Tooltip content={WEBUI_BUILD_HASH}>
				<span class="text-xs text-gray-500 dark:text-gray-400">{$i18n.t('Version')} {WEBUI_VERSION}</span>
			</Tooltip>
		</div>
	</div>
	<p class="text-gray-600 dark:text-gray-300">
		AskIn brings conversations, model presets, documents, and prompts into one workspace.
	</p>
	<div class="flex flex-wrap gap-3 text-xs">
		<button class="underline" on:click={() => showChangelog.set(true)}>
			{$i18n.t("See what's new")}
		</button>
		<a class="underline" href="/help" on:click={() => showSettings.set(false)}>
			{$i18n.t('Documentation')}
		</a>
	</div>
</div>
