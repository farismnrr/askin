# AskIn showcase

Semua screenshot: **1920 × 1080 px, 16:9**. Diambil dengan Playwright dari frontend dev yang sedang berjalan, menggunakan data demo dan tema terang. Screenshot mencakup viewport UI utuh tanpa browser chrome; bukan screenshot halaman panjang.

Untuk thumbnail produk satu halaman, gunakan **[thumbnail.png](thumbnail.png)**: komposisi 16:9 dengan branding AskIn, copy singkat, dan layar New Chat. Sumbernya ada di **[thumbnail.html](thumbnail.html)**, menggunakan HTML/CSS sederhana dengan aset lokal.

[askin-showcase.png](askin-showcase.png) adalah screenshot UI New Chat utuh. Lima gambar lain tersedia sebagai pilihan pendukung.

## Render thumbnail

Setelah Playwright tersedia dengan langkah di bawah, jalankan dari root repository:

```sh
env PLAYWRIGHT_MODULE=/tmp/askin-showcase-tools/node_modules/playwright/index.mjs node scripts/render-thumbnail.mjs
```

Output: `screenshots/showcase/thumbnail.png`, **1920 × 1080 px**. Render memakai file HTML dan aset lokal, sehingga tidak memerlukan frontend atau backend yang berjalan.

## Peta screen

| File | Screen | Yang ditampilkan |
| --- | --- | --- |
| [askin-showcase.png](askin-showcase.png) | New Chat — utama | Sidebar, model aktif, saran prompt, dan composer |
| [02-code-review.png](02-code-review.png) | Percakapan / review kode | History, pesan assistant, syntax highlighting, dan aksi pesan |
| [03-model-selector.png](03-model-selector.png) | Pilihan model | Dropdown model di dalam layar percakapan |
| [04-workspace-prompts.png](04-workspace-prompts.png) | Workspace prompts | Template prompt, pencarian, impor, dan ekspor |
| [05-workspace-models.png](05-workspace-models.png) | Workspace models | Daftar model dan preset |
| [06-settings.png](06-settings.png) | Settings | Tema, bahasa, notifikasi, dan preferensi chat |

Login, halaman bantuan, dan panel admin tidak masuk pilihan utama karena kurang mewakili fitur percakapan. Dokumen, tools, functions, dan playground belum dipilih untuk showcase ini karena kontrak mock sebagian fiturnya belum lengkap.

## Ambil ulang

Frontend harus sudah berjalan pada port 3003. Playwright dapat dipasang di direktori sementara agar tidak menambah dependency aplikasi:

```sh
npm install --prefix /tmp/askin-showcase-tools --no-audit --no-fund --ignore-scripts playwright@1.55.0
/tmp/askin-showcase-tools/node_modules/.bin/playwright install chromium --only-shell
env PLAYWRIGHT_MODULE=/tmp/askin-showcase-tools/node_modules/playwright/index.mjs node scripts/capture-showcase.mjs
```

Gunakan `FRONTEND_URL` untuk host/port lain dan `SCREENSHOT_DIR` untuk mengganti folder output. Detail route serta dimensi gambar ada di [screens.json](screens.json).
