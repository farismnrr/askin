# Audit frontend AskIn

Tanggal: 4 Oktober 2026. Checkout awal: `a744f5a` (`main`). Scope: frontend dev dan rebrand AskIn; backend Python/Go dan konfigurasi deployment dipertahankan.

## Yang sudah dikerjakan

- Logo login, sidebar, avatar assistant, dan favicon diperbaiki: aset publik Vite tersedia di `/favicon.png`, bukan `/static/favicon.png`. Favicon HTML memakai path absolut agar tidak rusak pada route bertingkat.
- Branding, badge eksternal, tautan dokumentasi, promosi komunitas, dan alur postMessage komunitas lama dihapus dari frontend. About menggunakan AskIn; dokumentasi lokal tersedia di `/help`. Paket frontend bernama `askin`. Lisensi dan atribusi yang sudah ada dipertahankan.
- 16 modul frontend tidak terjangkau dihapus: pengaturan model lama, modal pengaturan dokumen yang sudah tidak dipakai beserta komponen turunannya, template lama, placeholder kosong, dan beberapa icon/helper. Daftar ada di bawah. Salinan sebelum penghapusan tersedia sementara di `/tmp/askin-dev/deleted-frontend`; versi awal tetap tersedia di Git.
- 188 binding import yang tidak dipakai dihapus dari 65 komponen. Import PostCSS yang hanya cocok dengan pemanggilan `JSON.stringify` juga dihapus secara manual.
- Enam dependency langsung yang tidak dipakai dihapus: `@pyscript/core`, `@sveltejs/adapter-node`, `@sveltejs/adapter-auto`, `async`, `@codemirror/lang-javascript`, dan `vitest`. Perintah Vitest yang tidak memiliki test aktif dihapus; suite Cypress dipertahankan.
- Lima paket CodeMirror yang diimpor langsung sekarang dideklarasikan langsung, sehingga frontend tidak bergantung pada kebetulan dependency transitif.
- Mermaid hanya diimpor ketika ada diagram; render diserialkan untuk menghindari pemrosesan node berulang. Highlight.js hanya diimpor ketika ada blok kode. Pyodide dan worker hanya dimuat saat pengguna menjalankan Python.
- Persiapan Pyodide disederhanakan menjadi penyalinan aset lokal. Fungsi unduhan paket yang tidak pernah dipanggil dihapus; kegagalan penyalinan kini membuat startup gagal dengan jelas.
- Output mock changelog disesuaikan dengan struktur yang dibaca modal. Fallback nama model diperbaiki agar tidak menampilkan Undefined. Mock streaming membersihkan timer saat response ditutup, bukan saat request selesai; endpoint chat completed mengembalikan daftar pesan. Update judul chat menggabungkan isi chat agar riwayat tidak terhapus oleh update parsial.
- Audit import dapat diulang dengan `npm run audit:frontend`.

## Ukuran yang diukur

Angka JavaScript berasal dari output build, termasuk semua chunk fitur opsional. Gzip dihitung per file; angka ini bukan ukuran unduhan awal halaman.

| Bagian | Awal | Setelah cleanup |
| --- | ---: | ---: |
| Source frontend | 2,638,653 byte | 2,543,388 byte |
| Chunk Messages | 1,677,033 byte | 417,943 byte |
| Chunk Messages, gzip | 511,398 byte | 120,322 byte |
| Semua JavaScript | 8,313,685 byte | 8,224,146 byte |
| Semua JavaScript, gzip | 2,660,378 byte | 2,634,150 byte |

Chunk Messages berkurang sekitar 75.1%. Total JavaScript berkurang sekitar 1.1%; sebagian besar manfaat berasal dari pemindahan library berat ke chunk yang dimuat sesuai kebutuhan. `node_modules` lokal masih sekitar 403 MB; penghapusan deklarasi dependency bukan bukti pengurangan seluruh instalasi transitif.

## Validasi

- Build sebelum dan setelah cleanup berhasil dengan adapter static.
- Browser membuktikan logo termuat dengan naturalWidth 235 pada login, sidebar, dan percakapan contoh.
- Frontend tetap listen pada `0.0.0.0:3003`.
- Mock stream diuji sampai record `done: true` dan koneksi selesai.
- Update judul chat diuji melalui API: messages dan history tetap sama. Chat dibuka ulang di browser; blok TypeScript memiliki elemen syntax highlighting dan tidak ada gambar rusak.
- Workspace prompts dibuka di browser: judul Prompts | AskIn, tidak ada branding lama pada teks halaman, dan tidak ada gambar rusak.
- Audit setelah penghapusan melaporkan nol modul tak terjangkau, nol import lokal tidak ter-resolve, dan nol paket langsung yang belum dideklarasikan.
- Perbandingan typecheck dengan source checkout awal: awal 2.731 error dan 52 warning; pemeriksaan setelah cleanup pertama 2.542 error dan 51 warning. Source awal diperiksa dalam direktori sementara dengan instalasi dependency yang sama. Ini bukan bukti semua tipe sudah bersih. Satu diagnostic baru di CodeBlock diperbaiki dengan tipe eksplisit. Pemeriksaan akhir: 2.539 error dan 51 warning; tidak ada signature diagnostic baru atau bertambah dibanding source awal.
- Tidak ada diff pada `backend/`, `backend-go/`, `pyproject.toml`, Dockerfile, atau berkas Compose.

## Yang masih bikin gemuk / perlu ditangani

1. **Library aktif tetap besar.** Diagram ELK sekitar 1,45 MB, seluruh dukungan bahasa Highlight.js sekitar 979 KB, CodeMirror sekitar 468 KB. Semuanya masih melayani fitur yang terpakai. Pembatasan tipe diagram, bahasa kode, atau penghapusan eksekusi Python memerlukan keputusan fitur; belum dilakukan dalam cleanup ini.
2. **Banyak error tipe.** Store/context i18n bertipe unknown/any, bentuk API tidak konsisten, dan props komponen kurang jelas. Refactor bertahap sebaiknya dimulai dari tipe store, user, model, chat, dan response API. Build sukses tidak sama dengan typecheck bersih.
3. **Mock tidak mencakup semua fitur.** Generic fallback `/api/*` kadang mengembalikan objek kosong atau status sukses tanpa shape yang diminta UI. Admin, upload, voice/call, model management, serta sebagian CRUD perlu kontrak mock khusus sebelum bisa disebut berfungsi penuh.
4. **Socket.IO masih mencoba koneksi backend.** Route `/ws/socket.io` belum diimplementasikan dalam demo. Ini menimbulkan request 404/retry; frontend tetap bisa menampilkan chat. Untuk mode demo, gunakan adapter event lokal atau lifecycle socket yang dinonaktifkan khusus demo.
5. **Build statis tidak membawa mock Vite.** `configureServer` hanya berlaku pada development. Publishing frontend mandiri memerlukan mock browser/adaptor data yang ikut dibundel; build dan preview belum dianggap demo lengkap.
6. **Locale masih 38 bahasa.** Berkas locale dimuat dinamis dan tetap dipakai pemilih bahasa, sehingga tidak dihapus hanya untuk mengecilkan source.
7. **Sanitasi markdown perlu audit terpisah.** Beberapa output `marked.parse` dipasang lewat `@html`; helper sanitasi yang ada belum dibuktikan sebagai sanitizer HTML untuk seluruh input. Fallback blok kode dan label bahasa kini dirender sebagai teks, tetapi semua rendering markdown belum diaudit sebagai fitur keamanan.
8. **Workflow screenshot disesuaikan dengan lockfile.** CI sekarang memasang dependency melalui `bun install --frozen-lockfile` dan menyiapkan aset Pyodide sebelum Vite dijalankan. Script screenshot portfolio lama masih memiliki sebagian fixture/API interception era lama. Capture showcase lokal yang baru membaca langsung UI dev dan menghasilkan enam screenshot 1920×1080. Hasil CI remote tidak digunakan sebagai bukti capture lokal.
9. **Dokumentasi dan infrastruktur backend lama tetap ada.** Nama paket, image, environment variable, dan instruksi deployment yang terkait backend masih dapat memakai nama asal. UI, locale, dan package frontend sudah bersih dari branding tersebut; backend dan lisensi dipertahankan sesuai scope.

## Modul yang dihapus

- `src/lib/components/chat/Settings/Models.svelte`
- `src/lib/components/chat/TagChatModal.svelte`
- `src/lib/components/common/Overlay.svelte`
- `src/lib/components/common/Selector.svelte`
- `src/lib/components/documents/Settings/ChunkParams.svelte`
- `src/lib/components/documents/Settings/QueryParams.svelte`
- `src/lib/components/documents/Settings/WebParams.svelte`
- `src/lib/components/documents/SettingsModal.svelte`
- `src/lib/components/icons/ChatBubble.svelte`
- `src/lib/components/icons/ChevronUpDown.svelte`
- `src/lib/components/icons/EllipsisVertical.svelte`
- `src/lib/components/icons/Lifebuoy.svelte`
- `src/lib/components/playground/TextCompletion.svelte`
- `src/lib/index.ts`
- `src/lib/utils/_template_old.ts`
- `src/lib/utils/rag/index.ts`
