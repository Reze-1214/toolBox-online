// Tool name translations keyed by slug
export const toolNames: Record<string, Record<string, string>> = {
  'qr-generator': { en: 'QR Code Generator', id: 'Pembuat Kode QR' },
  'password-generator': { en: 'Password Generator', id: 'Pembuat Kata Sandi' },
  'json-formatter': { en: 'JSON Formatter', id: 'Pemformat JSON' },
  'uuid-generator': { en: 'UUID Generator', id: 'Pembuat UUID' },
  'word-counter': { en: 'Word Counter', id: 'Penghitung Kata' },
  'image-compressor': { en: 'Image Compressor', id: 'Pemampat Gambar' },
  'base64-encoder': { en: 'Base64 Encoder / Decoder', id: 'Enkoder / Dekoder Base64' },
  'timestamp-converter': { en: 'Timestamp Converter', id: 'Konverter Timestamp' },
  'markdown-preview': { en: 'Markdown Preview', id: 'Pratinjau Markdown' },
  'lorem-ipsum-generator': { en: 'Lorem Ipsum Generator', id: 'Pembuat Lorem Ipsum' },
  'color-picker': { en: 'Color Picker', id: 'Pemilih Warna' },
  'url-encoder': { en: 'URL Encoder / Decoder', id: 'Enkoder / Dekoder URL' },
  'hash-generator': { en: 'Hash Generator', id: 'Pembuat Hash' },
  'case-converter': { en: 'Case Converter', id: 'Konverter Huruf' },
  'diff-checker': { en: 'Diff Checker', id: 'Pembanding Teks' },
  'image-resizer': { en: 'Image Resizer', id: 'Pengubah Ukuran Gambar' },
  'number-base-converter': { en: 'Number Base Converter', id: 'Konverter Basis Bilangan' },
  'pomodoro-timer': { en: 'Pomodoro Timer', id: 'Timer Pomodoro' },
  'character-counter': { en: 'Character Counter', id: 'Penghitung Karakter' },
  'regex-tester': { en: 'Regex Tester', id: 'Penguji Regex' },
}

export const toolDescriptions: Record<string, Record<string, string>> = {
  'qr-generator': { en: 'Generate QR codes from any text, URL, or data. Download as PNG or SVG.', id: 'Buat kode QR dari teks, URL, atau data apa pun. Unduh sebagai PNG atau SVG.' },
  'password-generator': { en: 'Generate strong, secure passwords with customizable length and character sets.', id: 'Buat kata sandi yang kuat dan aman dengan panjang dan set karakter yang dapat disesuaikan.' },
  'json-formatter': { en: 'Format, validate, and beautify JSON data with syntax highlighting.', id: 'Format, validasi, dan perindah data JSON dengan penyorotan sintaks.' },
  'uuid-generator': { en: 'Generate unique UUIDs (v4) instantly. Copy to clipboard with one click.', id: 'Buat UUID (v4) unik secara instan. Salin ke papan klip dengan satu klik.' },
  'word-counter': { en: 'Count words, characters, sentences, and paragraphs in your text.', id: 'Hitung kata, karakter, kalimat, dan paragraf dalam teks Anda.' },
  'image-compressor': { en: 'Compress images directly in your browser. No upload required.', id: 'Kompres gambar langsung di browser Anda. Tanpa perlu unggah.' },
  'base64-encoder': { en: 'Encode text to Base64 or decode Base64 back to plain text.', id: 'Enkode teks ke Base64 atau dekode Base64 kembali ke teks biasa.' },
  'timestamp-converter': { en: 'Convert between Unix timestamps and human-readable dates.', id: 'Konversi antara timestamp Unix dan tanggal yang dapat dibaca.' },
  'markdown-preview': { en: 'Write Markdown and see a live preview of the rendered output.', id: 'Tulis Markdown dan lihat pratinjau langsung dari output yang dihasilkan.' },
  'lorem-ipsum-generator': { en: 'Generate placeholder text for your designs and layouts.', id: 'Buat teks placeholder untuk desain dan tata letak Anda.' },
  'color-picker': { en: 'Pick colors and convert between HEX, RGB, and HSL formats.', id: 'Pilih warna dan konversi antara format HEX, RGB, dan HSL.' },
  'url-encoder': { en: 'Encode or decode URLs and query parameters.', id: 'Enkode atau dekode URL dan parameter kueri.' },
  'hash-generator': { en: 'Generate MD5, SHA-1, and SHA-256 hashes from any text.', id: 'Buat hash MD5, SHA-1, dan SHA-256 dari teks apa pun.' },
  'case-converter': { en: 'Convert text between uppercase, lowercase, title case, and more.', id: 'Konversi teks antara huruf besar, kecil, judul, dan lainnya.' },
  'diff-checker': { en: 'Compare two texts and highlight the differences between them.', id: 'Bandingkan dua teks dan sorot perbedaannya.' },
  'image-resizer': { en: 'Resize images to any dimension. Supports JPG, PNG, and WebP.', id: 'Ubah ukuran gambar ke dimensi apa pun. Mendukung JPG, PNG, dan WebP.' },
  'number-base-converter': { en: 'Convert numbers between binary, octal, decimal, and hexadecimal.', id: 'Konversi bilangan antara biner, oktal, desimal, dan heksadesimal.' },
  'pomodoro-timer': { en: 'Stay focused with a customizable Pomodoro work timer.', id: 'Tetap fokus dengan timer kerja Pomodoro yang dapat disesuaikan.' },
  'character-counter': { en: 'Count characters with and without spaces. Perfect for social media limits.', id: 'Hitung karakter dengan dan tanpa spasi. Sempurna untuk batas media sosial.' },
  'regex-tester': { en: 'Test regular expressions with real-time matching and highlighting.', id: 'Uji ekspresi reguler dengan pencocokan dan penyorotan waktu nyata.' },
}

export const categoryNames: Record<string, Record<string, string>> = {
  'text-tools': { en: 'Text Tools', id: 'Alat Teks' },
  'image-tools': { en: 'Image Tools', id: 'Alat Gambar' },
  'developer-tools': { en: 'Developer Tools', id: 'Alat Pengembang' },
  'pdf-tools': { en: 'PDF Tools', id: 'Alat PDF' },
  'converter-tools': { en: 'Converter Tools', id: 'Alat Konverter' },
  'productivity-tools': { en: 'Productivity Tools', id: 'Alat Produktivitas' },
}

export const categoryDescriptions: Record<string, Record<string, string>> = {
  'text-tools': { en: 'Manipulate and analyze text content', id: 'Manipulasi dan analisis konten teks' },
  'image-tools': { en: 'Convert, compress, and edit images', id: 'Konversi, kompres, dan edit gambar' },
  'developer-tools': { en: 'Essential utilities for developers', id: 'Utilitas penting untuk pengembang' },
  'pdf-tools': { en: 'Work with PDF documents', id: 'Bekerja dengan dokumen PDF' },
  'converter-tools': { en: 'Convert between different formats', id: 'Konversi antara format berbeda' },
  'productivity-tools': { en: 'Boost your daily productivity', id: 'Tingkatkan produktivitas harian Anda' },
}

export function getToolName(slug: string, locale: string): string {
  return toolNames[slug]?.[locale] || toolNames[slug]?.en || slug
}

export function getToolDescription(slug: string, locale: string): string {
  return toolDescriptions[slug]?.[locale] || toolDescriptions[slug]?.en || ''
}

export function getCategoryName(slug: string, locale: string): string {
  return categoryNames[slug]?.[locale] || categoryNames[slug]?.en || slug
}

export function getCategoryDescription(slug: string, locale: string): string | null {
  return categoryDescriptions[slug]?.[locale] || categoryDescriptions[slug]?.en || null
}