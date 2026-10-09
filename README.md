# AskIn

AskIn is an AI conversation workspace built with SvelteKit. It includes chat history, model presets, prompt templates, documents, and light/dark themes.

**Portfolio case study:** https://farismnrr.com/projects/askin

## Frontend development

Install the locked dependencies with Bun, then start the frontend:

```sh
bun install --frozen-lockfile
npm run dev -- --port 3003
```

The development server listens on `0.0.0.0`, so it is reachable through localhost, LAN, and the host's Tailscale address. Choose a free port with `--port`; the server will fail if that port is occupied.

The Vite development middleware supplies demo users, models, conversations, and streaming responses. No backend process, database, or external model provider is required. For the demo sign-in screen, any valid email format and any nonempty password work; use dummy values.

Python runtime assets are copied from the installed package at startup. Diagram rendering, code highlighting, and Python execution load their libraries when needed.

## Frontend commands

```sh
npm run build
npm run check
npm run audit:frontend
```

`build` creates a static frontend. The demo middleware runs only in the Vite development server; the production build and `preview` do not provide its mock endpoints.

`check` runs the existing Svelte and TypeScript diagnostics. The inherited codebase still has substantial type errors; see [the frontend audit](docs/FRONTEND_AUDIT.md) for measured results and remaining work.

`audit:frontend` walks imports from all frontend routes and reports unreachable source modules, unresolved local imports, and imported packages missing from the manifest. It is read-only and does not delete files. Review its findings before removing code; template-based imports and framework conventions need human judgment.

## Backend

The Python backend, Go backend, and existing deployment configuration are retained. Their code and service configuration were not changed by the frontend cleanup. The development command above starts the frontend only.

## Showcase

The [showcase folder](screenshots/showcase/README.md) contains six screenshots at 1920 × 1080, including the primary AskIn showcase image and a screen map. The folder also includes instructions for repeating the Playwright capture.

## License

See [LICENSE](LICENSE) for the existing license and attribution.
