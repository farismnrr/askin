// Load the diagram renderer only when a conversation contains a diagram.
let renderer: Promise<typeof import('mermaid')['default']> | undefined;
let pendingRender: Promise<void> = Promise.resolve();

export const renderMermaid = (): Promise<void> => {
	if (typeof document === 'undefined') return Promise.resolve();

	const render = pendingRender.then(async () => {
		const nodes = Array.from(document.querySelectorAll<HTMLElement>('.mermaid:not([data-processed="true"])'));
		if (nodes.length === 0) return;

		renderer ??= import('mermaid').then(({ default: mermaid }) => mermaid).catch((error) => {
			renderer = undefined;
			throw error;
		});
		const mermaid = await renderer;
		const connectedNodes = nodes.filter((node) => node.isConnected && node.dataset.processed !== 'true');
		if (connectedNodes.length > 0) await mermaid.run({ nodes: connectedNodes });
	});

	// Serialize renders so reactive updates cannot process the same node twice.
	pendingRender = render.catch(() => {});
	return render;
};
