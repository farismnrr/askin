# AskIn showcase

Semua screenshot: **1920 × 1080 px, 16:9**. Diambil dengan Playwright dari frontend dev yang sedang berjalan, menggunakan data demo dan tema terang. Screenshot mencakup viewport UI utuh tanpa browser chrome; bukan screenshot halaman panjang.

Untuk thumbnail produk satu halaman, gunakan **[thumbnail.png](thumbnail.png)**: komposisi 16:9 dengan branding AskIn dan **empat screen**: New Chat, percakapan kode, workspace prompt, dan pilihan model. Sumbernya ada di **[thumbnail.html](thumbnail.html)**, menggunakan HTML/CSS sederhana dengan aset lokal.

## Arah desain dan referensi

- Palet dari tema terang aplikasi di `tailwind.config.js`: `#f9f9f9`, `#ececec`, `#e3e3e3`, `#676767`, dan `#171717`. Font Mona Sans dan logo memakai aset aplikasi.
- New Chat menjadi fokus utama; dua panel pendukung memperlihatkan kode dan prompt. Pilihan model menjadi detail yang diperbesar di atas area chat.
- Semua gambar berasal dari UI dev yang nyata dengan data demo. Capture khusus di [thumbnail-ui](thumbnail-ui) memakai viewport lebih kecil dan resolusi 2× agar detail tetap terbaca. Crop menonjolkan fitur; tidak mengubah isi UI.
- Radius konsisten, alignment mengikuti grid, ruang antar panel teratur, dan border/shadow halus.

Referensi yang dipakai untuk keputusan komposisi:

- [Linear — A calmer interface for a product in motion](https://linear.app/now/behind-the-latest-design-refresh): hierarki perhatian, navigasi yang tidak mendominasi, dan pemisah halus.
- [Linear — Brand guidelines](https://linear.app/brand): ruang di sekitar identitas dan penggunaan wordmark yang konsisten.
- [Mobbin](https://mobbin.com/): penyajian screen produk dan detail fitur dalam panel yang jelas.

Warna, logo, dan aset produk tetap milik AskIn; referensi digunakan sebagai inspirasi komposisi.

[askin-showcase.png](askin-showcase.png) adalah screenshot UI New Chat utuh. Lima gambar lain tersedia sebagai pilihan pendukung.

## Render thumbnail

Setelah Playwright tersedia dengan langkah di bawah, jalankan dari root repository:

```sh
env PLAYWRIGHT_MODULE=/tmp/askin-showcase-tools/node_modules/playwright/index.mjs node scripts/render-thumbnail.mjs
```

Output: `screenshots/showcase/thumbnail.png`, **1920 × 1080 px**. Render memakai file HTML dan aset lokal, sehingga tidak memerlukan frontend atau backend yang berjalan.

Untuk memperbarui keempat capture UI, jalankan frontend dev terlebih dahulu, lalu:

```sh
env PLAYWRIGHT_MODULE=/tmp/askin-showcase-tools/node_modules/playwright/index.mjs node scripts/capture-thumbnail.mjs
env PLAYWRIGHT_MODULE=/tmp/askin-showcase-tools/node_modules/playwright/index.mjs node scripts/render-thumbnail.mjs
```

`FRONTEND_URL` dapat mengganti alamat dev pada langkah capture. Backend tidak diperlukan.

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
