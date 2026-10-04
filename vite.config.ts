import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type Plugin } from 'vite';

const askinApiPlugin = (): Plugin => ({
	name: 'askin-api-middleware',
	configureServer(server) {
		const now = Math.floor(Date.now() / 1000);

		const demoUser = {
			id: 'portfolio-demo-user',
			email: 'farismunir2@gmail.com',
			name: 'Faris',
			role: 'admin',
			profile_image_url: '/favicon.png',
			token: 'mock-demo-token',
			permissions: {
				workspace: {
					models: true,
					knowledge: true,
					prompts: true,
					tools: true
				},
				chat: {
					file_upload: true,
					delete: true,
					edit: true
				}
			},
			last_active_at: now,
			created_at: now - 86400 * 7
		};

		const userSettings = {
			ui: {
				theme: 'light',
				notifications: true,
				chat_direction: 'LTR'
			}
		};

		const config = {
			status: true,
			name: 'AskIn',
			version: '0.3.7',
			default_locale: 'en-US',
			default_models: 'askin-assistant',
			default_prompt_suggestions: [
				{
					title: ['Jelaskan konsep', 'secara sederhana'],
					content: 'Jelaskan bagaimana model bahasa besar (LLM) memproses token dan konteks perhatian.'
				},
				{
					title: ['Review Kode', 'arsitektur bersih'],
					content: 'Review fungsi TypeScript berikut dan berikan saran optimasi performa.'
				},
				{
					title: ['Brainstorming ide', 'fitur inovatif AI'],
					content: 'Berikan 5 ide fitur cerdas untuk meningkatkan produktivitas workspace AI.'
				},
				{
					title: ['Ringkas konten', 'poin-poin utama'],
					content: 'Ringkas teks ini menjadi poin aksi konkret dan implikasi strategis.'
				}
			],
			features: {
				auth: true,
				auth_trusted_header: false,
				enable_signup: true,
				enable_web_search: true,
				enable_image_generation: true,
				enable_community_sharing: false,
				enable_message_rating: true,
				enable_admin_export: true
			},
			oauth: { providers: {} }
		};

		const demoModelsList = [
			{
				id: 'askin-assistant',
				name: 'AskIn Assistant (Default)',
				object: 'model',
				created: now - 86400,
				owned_by: 'AskIn',
				info: {
					meta: {
						position: 0,
						description: 'Asisten percakapan cerdas utama dengan pengetahuan luas.'
					}
				}
			},
			{
				id: 'llama3.1:8b',
				name: 'Llama 3.1 8B (Mock)',
				object: 'model',
				created: now - 86400,
				owned_by: 'Meta',
				info: {
					meta: {
						position: 1,
						description: 'Model serbaguna yang cepat untuk penalaran dan pemrograman.'
					}
				}
			},
			{
				id: 'mistral:7b',
				name: 'Mistral 7B (Mock)',
				object: 'model',
				created: now - 86400,
				owned_by: 'Mistral AI',
				info: {
					meta: {
						position: 2,
						description: 'Model percakapan ringkas dan ekspresif.'
					}
				}
			},
			{
				id: 'gpt-4o-mini',
				name: 'GPT-4o Mini (Mock)',
				object: 'model',
				created: now - 86400,
				owned_by: 'OpenAI',
				info: {
					meta: {
						position: 3,
						description: 'Model penalaran efisien dengan respons lugas.'
					}
				}
			}
		];

		const initialChats = [
			{
				id: 'chat-welcome',
				title: 'Selamat Datang di AskIn AI',
				models: ['askin-assistant'],
				chat: {
					id: 'chat-welcome',
					title: 'Selamat Datang di AskIn AI',
					models: ['askin-assistant'],
					system: '',
					options: {},
					messages: [
						{
							id: 'msg-w1',
							parentId: null,
							childrenIds: ['msg-w2'],
							role: 'user',
							content: 'Halo! Apa saja fitur yang tersedia di AskIn ini?',
							timestamp: now - 7200,
							models: ['askin-assistant']
						},
						{
							id: 'msg-w2',
							parentId: 'msg-w1',
							childrenIds: [],
							role: 'assistant',
							content:
								'Halo Faris! Selamat datang di **AskIn**.\n\nAplikasi ini sekarang berjalan dalam mode **FE Only** dengan **Full Mock Dummy Data** tanpa memerlukan backend atau kredensial database eksternal.\n\nBerikut beberapa fitur yang siap kamu coba:\n- 💬 **Interactive Chat & Streaming**: Kirim prompt apa pun dan dapatkan respons streaming instan.\n- 🤖 **Pilihan Model Dummy**: AskIn Assistant, Llama 3.1 8B, Mistral 7B, dan GPT-4o Mini.\n- 💡 **Template Prompt & Saran**: Rekomendasi prompt siap pakai di layar utama.\n- 📁 **Workspace**: Kelola koleksi prompt, dokumen tiruan, dan tools.\n- 🎨 **Kustomisasi Tema**: Beralih antara mode Terang (Light) dan Gelap (Dark OLED).\n\nSemua state berjalan cepat, aman, dan langsung di browser kamu!',
							timestamp: now - 7180,
							model: 'askin-assistant'
						}
					],
					history: {
						currentId: 'msg-w2',
						messages: {
							'msg-w1': {
								id: 'msg-w1',
								parentId: null,
								childrenIds: ['msg-w2'],
								role: 'user',
								content: 'Halo! Apa saja fitur yang tersedia di AskIn ini?',
								timestamp: now - 7200,
								models: ['askin-assistant']
							},
							'msg-w2': {
								id: 'msg-w2',
								parentId: 'msg-w1',
								childrenIds: [],
								role: 'assistant',
								content:
									'Halo Faris! Selamat datang di **AskIn**.\n\nAplikasi ini sekarang berjalan dalam mode **FE Only** dengan **Full Mock Dummy Data** tanpa memerlukan backend atau kredensial database eksternal.\n\nBerikut beberapa fitur yang siap kamu coba:\n- 💬 **Interactive Chat & Streaming**: Kirim prompt apa pun dan dapatkan respons streaming instan.\n- 🤖 **Pilihan Model Dummy**: AskIn Assistant, Llama 3.1 8B, Mistral 7B, dan GPT-4o Mini.\n- 💡 **Template Prompt & Saran**: Rekomendasi prompt siap pakai di layar utama.\n- 📁 **Workspace**: Kelola koleksi prompt, dokumen tiruan, dan tools.\n- 🎨 **Kustomisasi Tema**: Beralih antara mode Terang (Light) dan Gelap (Dark OLED).\n\nSemua data berjalan cepat, aman, dan langsung di browser kamu!',
								timestamp: now - 7180,
								model: 'askin-assistant'
							}
						}
					}
				},
				updated_at: now - 7180,
				created_at: now - 7200
			},
			{
				id: 'chat-code-review',
				title: 'Review Arsitektur Frontend',
				models: ['askin-assistant'],
				chat: {
					id: 'chat-code-review',
					title: 'Review Arsitektur Frontend',
					models: ['askin-assistant'],
					system: '',
					options: {},
					messages: [
						{
							id: 'msg-c1',
							parentId: null,
							childrenIds: ['msg-c2'],
							role: 'user',
							content: 'Bagaimana cara menstrukturkan frontend SvelteKit dengan mock data yang rapi?',
							timestamp: now - 3600,
							models: ['askin-assistant']
						},
						{
							id: 'msg-c2',
							parentId: 'msg-c1',
							childrenIds: [],
							role: 'assistant',
							content:
								'Untuk menjalankan aplikasi frontend-only yang modular tanpa dependensi backend:\n\n1. **Gunakan Vite Middleware Mock**:\n```typescript\n// vite.config.ts meng-intercept rute /api/* dan menyajikan dummy data\nserver.middlewares.use((req, res, next) => {\n  if (req.url === "/api/config") return sendJson(res, mockConfig);\n  next();\n});\n```\n\n2. **Manfaat Utama**:\n- **Nol Latensi**: Respon simulasi seketika tanpa downtime.\n- **Bebas Kredensial**: Tidak memerlukan database server, redis, atau token LLM berbayar.\n- **Pengalaman Penuh**: User interface, tombol interaksi, dan alur percakapan tetap berjalan 100% normal.',
							timestamp: now - 3550,
							model: 'askin-assistant'
						}
					],
					history: {
						currentId: 'msg-c2',
						messages: {
							'msg-c1': {
								id: 'msg-c1',
								parentId: null,
								childrenIds: ['msg-c2'],
								role: 'user',
								content:
									'Bagaimana cara menstrukturkan frontend SvelteKit dengan mock data yang rapi?',
								timestamp: now - 3600,
								models: ['askin-assistant']
							},
							'msg-c2': {
								id: 'msg-c2',
								parentId: 'msg-c1',
								childrenIds: [],
								role: 'assistant',
								content:
									'Untuk menjalankan aplikasi frontend-only yang modular tanpa dependensi backend:\n\n1. **Gunakan Vite Middleware Mock**:\n```typescript\n// vite.config.ts meng-intercept rute /api/* dan menyajikan dummy data\nserver.middlewares.use((req, res, next) => {\n  if (req.url === "/api/config") return sendJson(res, mockConfig);\n  next();\n});\n```\n\n2. **Manfaat Utama**:\n- **Nol Latensi**: Respon simulasi seketika tanpa downtime.\n- **Bebas Kredensial**: Tidak memerlukan database server, redis, atau token LLM berbayar.\n- **Pengalaman Penuh**: User interface, tombol interaksi, dan alur percakapan tetap berjalan 100% normal.',
								timestamp: now - 3550,
								model: 'askin-assistant'
							}
						}
					}
				},
				updated_at: now - 3550,
				created_at: now - 3600
			}
		];

		const chats = new Map<string, any>();
		for (const c of initialChats) {
			chats.set(c.id, c);
		}

		const mockPrompts = [
			{
				command: '/audit',
				title: 'Pemeriksaan Kode (Code Audit)',
				content:
					'Lakukan review mendalam terhadap kode berikut, fokus pada bug tersembunyi, kompleksitas waktu/ruang, dan keamanan input.',
				timestamp: now - 10000
			},
			{
				command: '/ringkas',
				title: 'Ringkasan Eksekutif',
				content:
					'Buatkan ringkasan eksekutif dari materi berikut: latar belakang, poin kunci, dan rekomendasi langkah selanjutnya.',
				timestamp: now - 9000
			},
			{
				command: '/terjemah',
				title: 'Penerjemah Bahasa Alami',
				content:
					'Terjemahkan teks berikut ke bahasa Indonesia formal dengan tetap mempertahankan istilah teknis yang lazim.',
				timestamp: now - 8000
			}
		];

		const mockDocs = [
			{
				id: 'doc-1',
				name: 'panduan-arsitektur-askin.pdf',
				title: 'Panduan Arsitektur AskIn Frontend-Only',
				content: 'Dokumentasi arsitektur frontend AskIn dengan mock layer mandiri.',
				created_at: now - 12000,
				updated_at: now - 12000
			},
			{
				id: 'doc-2',
				name: 'spesifikasi-fitur-mock.md',
				title: 'Spesifikasi Fitur Dummy Data',
				content: 'Daftar endpoint mock dan struktur data tiruan untuk mode tanpa backend.',
				created_at: now - 11000,
				updated_at: now - 11000
			}
		];

		const mockTools = [
			{
				id: 'tool-search',
				name: 'Mock Web Search',
				meta: { description: 'Simulasi pencarian web untuk konteks terkini.' }
			},
			{
				id: 'tool-calc',
				name: 'Kalkulator Cerdas',
				meta: { description: 'Evaluasi perhitungan matematika dan statistik.' }
			}
		];

		const mockFunctions = [
			{
				id: 'fn-json',
				name: 'JSON Formatter',
				meta: { description: 'Format dan validasi struktur JSON secara otomatis.' }
			}
		];

		const readBody = (req: any): Promise<any> =>
			new Promise((resolve) => {
				let body = '';
				req.on('data', (chunk: Buffer) => {
					body += chunk.toString();
				});
				req.on('end', () => {
					try {
						resolve(body ? JSON.parse(body) : {});
					} catch {
						resolve({});
					}
				});
			});

		const sendJson = (res: any, data: any, status = 200) => {
			res.writeHead(status, {
				'Content-Type': 'application/json; charset=utf-8',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
				'Access-Control-Allow-Headers': '*'
			});
			res.end(JSON.stringify(data));
		};

		server.middlewares.use(async (req, res, next) => {
			const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
			const path = url.pathname;

			if (req.method === 'OPTIONS') {
				res.writeHead(204, {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
					'Access-Control-Allow-Headers': '*'
				});
				return res.end();
			}

			if (path === '/health') {
				return sendJson(res, { status: true });
			}

			if (path === '/api/config') {
				return sendJson(res, config);
			}

			if (path === '/api/chat/completed') {
				const body = await readBody(req);
				return sendJson(res, { messages: body.messages || [] });
			}

			if (path === '/api/version') {
				return sendJson(res, { version: '0.3.7' });
			}

			if (path === '/api/changelog') {
				return sendJson(res, {
					'0.3.7': { date: '2026-10-04', changed: [{ title: 'AskIn workspace', content: 'AskIn branding, working logos, and local help.' }] }
				});
			}

			if (path === '/api/models' || path === '/openai/models') {
				return sendJson(res, { data: demoModelsList });
			}

			if (
				path === '/api/v1/auths' ||
				path === '/api/v1/auths/' ||
				path === '/api/v1/auths/admin/details' ||
				path === '/api/v1/auths/admin/config'
			) {
				return sendJson(res, demoUser);
			}

			if (path === '/api/v1/auths/signin' || path === '/api/v1/auths/signup') {
				return sendJson(res, { ...demoUser, token: 'mock-demo-token' });
			}

			if (path.includes('/users/user/settings')) {
				if (req.method === 'POST') {
					const body = await readBody(req);
					Object.assign(userSettings, body);
					return sendJson(res, { status: true });
				}
				return sendJson(res, userSettings);
			}

			if (path === '/api/v1/prompts' || path === '/api/v1/prompts/') {
				if (req.method === 'GET') {
					return sendJson(res, mockPrompts);
				}
				if (req.method === 'POST') {
					const body = await readBody(req);
					mockPrompts.push(body);
					return sendJson(res, body);
				}
			}

			if (path === '/api/v1/documents' || path === '/api/v1/documents/') {
				if (req.method === 'GET') {
					return sendJson(res, mockDocs);
				}
			}

			if (path === '/api/v1/tools' || path === '/api/v1/tools/') {
				if (req.method === 'GET') {
					return sendJson(res, mockTools);
				}
			}

			if (path === '/api/v1/functions' || path === '/api/v1/functions/') {
				if (req.method === 'GET') {
					return sendJson(res, mockFunctions);
				}
			}

			if (path === '/api/v1/chats' || path === '/api/v1/chats/') {
				if (req.method === 'GET') {
					return sendJson(
						res,
						Array.from(chats.values()).map((c) => ({
							id: c.id,
							title: c.title,
							models: c.models,
							updated_at: c.updated_at,
							created_at: c.created_at
						}))
					);
				}
			}

			if (path === '/api/v1/chats/new') {
				const body = await readBody(req);
				const id = 'chat-' + Date.now();
				const chatObj = {
					id,
					title: body.chat?.title || 'Percakapan Baru',
					models: body.chat?.models || ['askin-assistant'],
					chat: body.chat || { messages: [] },
					updated_at: Math.floor(Date.now() / 1000),
					created_at: Math.floor(Date.now() / 1000)
				};
				chats.set(id, chatObj);
				return sendJson(res, chatObj);
			}

			if (path.startsWith('/api/v1/chats/')) {
				const id = path.replace('/api/v1/chats/', '').replace('/pinned', '');
				if (req.method === 'GET') {
					return sendJson(
						res,
						chats.get(id) || {
							id,
							title: 'Percakapan',
							models: ['askin-assistant'],
							chat: { messages: [] },
							updated_at: Math.floor(Date.now() / 1000),
							created_at: Math.floor(Date.now() / 1000)
						}
					);
				}
				if (req.method === 'POST') {
					const body = await readBody(req);
					const existing = chats.get(id) || { id, title: 'Percakapan', chat: { messages: [] } };
					const chat = { ...existing.chat, ...body.chat };
					const updated = {
						...existing,
						...body,
						chat,
						title: chat.title || existing.title,
						models: chat.models || existing.models,
						updated_at: Math.floor(Date.now() / 1000)
					};
					chats.set(id, updated);
					return sendJson(res, updated);
				}
				if (req.method === 'DELETE') {
					chats.delete(id);
					return sendJson(res, { status: true });
				}
			}

			if (path === '/ollama/api/tags') {
				return sendJson(res, {
					models: demoModelsList.map((m) => ({
						name: m.id,
						model: m.id,
						modified_at: new Date().toISOString(),
						size: 4000000000,
						details: {
							format: 'gguf',
							family: 'llama',
							parameter_size: '7B',
							quantization_level: 'Q4_0'
						}
					}))
				});
			}

			if (path.startsWith('/ollama/api/version')) {
				return sendJson(res, { version: '0.1.32' });
			}

			if (path === '/ollama/api/generate') {
				const body = await readBody(req);
				if (body.stream === false) {
					return sendJson(res, {
						model: body.model || "askin-assistant",
						response: "Diskusi AskIn AI",
						done: true
					});
				}
				res.writeHead(200, {
					'Content-Type': 'application/x-ndjson; charset=utf-8',
					'Access-Control-Allow-Origin': '*'
				});
				res.write(
					JSON.stringify({
						model: body.model || "askin-assistant",
						response: "Diskusi AskIn AI",
						done: true
					}) + '\n'
				);
				return res.end();
			}

			if (path.startsWith('/api/task/title/completions')) {
				return sendJson(res, {
					choices: [{ message: { content: "Percakapan AskIn AI" } }]
				});
			}

			if (path.startsWith('/api/task/emoji/completions')) {
				return sendJson(res, {
					choices: [{ message: { content: "💬" } }]
				});
			}

			if (path.startsWith('/api/task/config')) {
				return sendJson(res, {
					TASK_MODEL: "askin-assistant",
					TASK_MODEL_EXTERNAL: ""
				});
			}

			if (path === '/ollama/api/chat') {
				const body = await readBody(req);
				res.writeHead(200, {
					'Content-Type': 'application/x-ndjson; charset=utf-8',
					'Cache-Control': 'no-cache',
					'Connection': 'keep-alive',
					'Access-Control-Allow-Origin': '*'
				});

				const msgs = body.messages || [];
				const lastUserMsg = msgs[msgs.length - 1]?.content || 'Halo';
				const modelName = body.model || 'askin-assistant';

				// Intelligent contextual dummy response
				let responseText = '';
				const lower = lastUserMsg.toLowerCase();
				if (lower.includes('halo') || lower.includes('hai') || lower.includes('hi') || lower.includes('hello')) {
					responseText = `Halo Faris! Saya **${modelName}**. Ada yang bisa saya bantu diskusikan hari ini seputar coding, ide proyek, atau analisis data?`;
				} else if (lower.includes('fitur') || lower.includes('feature')) {
					responseText = `AskIn saat ini berjalan dalam mode **Frontend-Only** penuh dengan fitur mock:\n\n1. **Percakapan Interaktif**: Respons streaming real-time.\n2. **Multi-Model**: Pilihan model (AskIn, Llama 3.1, Mistral, GPT-4o Mini).\n3. **Workspace**: Pengelolaan dokumen, prompt template, dan tools.\n4. **Manajemen Chat**: Simpan, edit, dan hapus riwayat percakapan.`;
				} else if (lower.includes('code') || lower.includes('kode') || lower.includes('typescript')) {
					responseText = `Tentu! Berikut contoh implementasi fungsi TypeScript yang bersih dan efisien:\n\n\`\`\`typescript\ninterface TaskItem {\n  id: string;\n  title: string;\n  completed: boolean;\n}\n\nexport function filterPendingTasks(tasks: TaskItem[]): TaskItem[] {\n  return tasks.filter((task) => !task.completed);\n}\n\`\`\`\n\nFungsi di atas murni (pure function), mudah diuji, dan memiliki kompleksitas $O(N)$.`;
				} else {
					responseText = `Terima kasih atas pertanyaannya: *"${lastUserMsg}"*.\n\nAskIn sedang memproses ini dalam mode **Frontend Mock**: seluruh interaksi UI, pemilihan model **${modelName}**, dan rendering streaming berjalan mulus tanpa membutuhkan backend server eksternal.`;
				}

				const chunks = responseText.split(' ');
				let i = 0;
				const interval = setInterval(() => {
					if (i < chunks.length) {
						res.write(
							JSON.stringify({
								model: modelName,
								created_at: new Date().toISOString(),
								message: {
									role: 'assistant',
									content: (i > 0 ? ' ' : '') + chunks[i]
								},
								done: false
							}) + '\n'
						);
						i++;
					} else {
						res.write(
							JSON.stringify({
								model: modelName,
								created_at: new Date().toISOString(),
								message: { role: 'assistant', content: '' },
								done: true
							}) + '\n'
						);
						clearInterval(interval);
						res.end();
					}
				}, 35);

				res.on('close', () => {
					clearInterval(interval);
				});
				return;
			}

			if (path === '/openai/chat/completions') {
				const body = await readBody(req);
				const msgs = body.messages || [];
				const lastUserMsg = msgs[msgs.length - 1]?.content || 'Halo';
				const reply = `[GPT-4o Mini Mock] Menanggapi: "${lastUserMsg}". Sistem berjalan optimal di frontend mode!`;

				if (body.stream) {
					res.writeHead(200, {
						'Content-Type': 'text/event-stream; charset=utf-8',
						'Cache-Control': 'no-cache',
						'Connection': 'keep-alive',
						'Access-Control-Allow-Origin': '*'
					});
					const words = reply.split(' ');
					let idx = 0;
					const timer = setInterval(() => {
						if (idx < words.length) {
							res.write(
								`data: ${JSON.stringify({
									choices: [{ delta: { content: (idx > 0 ? ' ' : '') + words[idx] } }]
								})}\n\n`
							);
							idx++;
						} else {
							res.write('data: [DONE]\n\n');
							clearInterval(timer);
							res.end();
						}
					}, 35);
					res.on('close', () => clearInterval(timer));
					return;
				} else {
					return sendJson(res, {
						id: 'chatcmpl-' + Date.now(),
						object: 'chat.completion',
						created: now,
						model: body.model || 'gpt-4o-mini',
						choices: [{ message: { role: 'assistant', content: reply }, finish_reason: 'stop' }]
					});
				}
			}

			if (
				path.startsWith('/api/') ||
				path.startsWith('/ollama/') ||
				path.startsWith('/openai/') ||
				path.startsWith('/audio/') ||
				path.startsWith('/images/') ||
				path.startsWith('/rag/')
			) {
				if (req.method === 'GET') {
					return sendJson(res, path.endsWith('s') || path.endsWith('s/') ? [] : {});
				}
				return sendJson(res, { status: true });
			}

			next();
		});
	}
});

export default defineConfig({
	plugins: [askinApiPlugin(), sveltekit()],
	define: {
		APP_VERSION: JSON.stringify(process.env.npm_package_version || '0.3.7'),
		APP_BUILD_HASH: JSON.stringify(process.env.APP_BUILD_HASH || 'dev-build')
	},
	server: {
		host: '0.0.0.0',
		port: 3000,
		strictPort: true
	},
	build: {
		sourcemap: true
	},
	worker: {
		format: 'es'
	}
});
