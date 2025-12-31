# Panduan SEO - Agar Website Tampil di Google

Website CaseMed sudah dikonfigurasi untuk SEO (Search Engine Optimization) agar bisa ditemukan di Google oleh pengguna umum.

## ✅ Yang Sudah Dilakukan

### 1. **robots.txt** (`public/robots.txt`)
File ini memberitahu Google bot halaman mana yang boleh di-crawl:
- ✅ Halaman publik: `/`, `/about`, `/contact`, `/paket/*`, `/login`, `/register`, `/subscription`
- ❌ Halaman privat: `/admin/*`, `/dashboard`, `/ujian/*`, `/hasil/*`

### 2. **Sitemap.xml** (`src/app/sitemap.ts`)
Daftar semua halaman penting di website untuk Google:
- Homepage
- About
- Contact
- Subscription
- Login & Register
- Privacy Policy, Terms, Refund Policy

### 3. **SEO Metadata** (`src/app/layout.tsx`)
Metadata lengkap untuk SEO:
- **Title**: CaseMed - Platform Latihan UKMPPD Online Terbaik
- **Description**: Platform latihan soal UKMPPD online terlengkap
- **Keywords**: UKMPPD, latihan UKMPPD, soal UKMPPD, simulasi UKMPPD, dll
- **Open Graph Tags**: Untuk social media sharing (Facebook, WhatsApp)
- **Twitter Card**: Untuk Twitter sharing
- **Robots Meta**: Mengizinkan Google mengindex website

### 4. **Structured Data (JSON-LD)**
Metadata terstruktur untuk rich snippets di Google Search

## 🚀 Langkah Selanjutnya (Manual)

### 1. Deploy Website ke Production
```bash
# Deploy ke Vercel/Railway/Netlify
git add .
git commit -m "Add SEO optimization"
git push origin main
```

### 2. Dapatkan Domain (Opsional tapi Recommended)
- Beli domain di Niagahoster, Domainesia, atau GoDaddy
- Contoh: `www.casemed.com` atau `casemed.id`
- Hubungkan domain ke hosting Anda

### 3. Setup Google Search Console

#### Langkah-langkah:
1. **Buka Google Search Console**
   - Kunjungi: https://search.google.com/search-console
   - Login dengan akun Google

2. **Tambahkan Property (Website)**
   - Klik "Add Property"
   - Pilih "URL prefix"
   - Masukkan URL website: `https://your-domain.com`
   - Klik "Continue"

3. **Verifikasi Kepemilikan Website**
   
   **Metode 1: HTML Tag (Recommended)**
   - Copy verification code dari Google
   - Buka file `src/app/layout.tsx`
   - Ganti `'your-google-verification-code'` dengan code Anda:
   ```typescript
   verification: {
     google: 'abc123xyz...', // Paste verification code di sini
   },
   ```
   - Deploy ulang website
   - Klik "Verify" di Google Search Console

   **Metode 2: HTML File**
   - Download file HTML dari Google
   - Upload ke folder `public/`
   - Klik "Verify"

4. **Submit Sitemap**
   - Setelah terverifikasi, klik "Sitemaps" di menu kiri
   - Masukkan URL sitemap: `https://your-domain.com/sitemap.xml`
   - Klik "Submit"
   - ✅ Google akan mulai meng-crawl website Anda

5. **Monitor Indexing**
   - Klik "URL Inspection" di menu atas
   - Masukkan URL halaman Anda
   - Klik "Request Indexing" untuk indexing cepat
   - Tunggu 1-3 hari untuk muncul di Google

### 4. Setup Google Analytics (Opsional)

1. **Buat Google Analytics Account**
   - Kunjungi: https://analytics.google.com
   - Buat property baru

2. **Tambahkan Tracking Code**
   - Copy Measurement ID (contoh: G-XXXXXXXXXX)
   - Tambahkan script di `src/app/layout.tsx`:
   ```typescript
   <head>
     <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
     <script dangerouslySetInnerHTML={{
       __html: `
         window.dataLayer = window.dataLayer || [];
         function gtag(){dataLayer.push(arguments);}
         gtag('js', new Date());
         gtag('config', 'G-XXXXXXXXXX');
       `
     }} />
   </head>
   ```

### 5. Optimasi Konten untuk SEO

#### Tambahkan Konten Berkualitas:
- ✅ Blog/artikel tentang tips UKMPPD
- ✅ FAQ (Frequently Asked Questions)
- ✅ Testimonial dari user
- ✅ Update regular (minimal 1x seminggu)

#### Best Practices:
- Gunakan heading tags (H1, H2, H3) dengan benar
- Tambahkan alt text pada gambar
- Internal linking antar halaman
- Mobile-friendly (sudah ✅)
- Fast loading speed (perlu dicek)

### 6. Social Media & Backlinks

#### Promosi di Social Media:
- Facebook Page
- Instagram
- Twitter
- TikTok
- YouTube (video tutorial)

#### Dapatkan Backlinks:
- Submit ke direktori website kedokteran
- Guest posting di blog kesehatan
- Forum/grup mahasiswa kedokteran
- Partnership dengan kampus kedokteran

## 📊 Monitoring & Maintenance

### Tools untuk Monitor SEO:
1. **Google Search Console** - Tracking indexing & performance
2. **Google Analytics** - Traffic & user behavior
3. **PageSpeed Insights** - Loading speed
4. **Mobile-Friendly Test** - Mobile compatibility

### Cek Regular (Mingguan):
- [ ] Berapa banyak halaman yang terindex?
- [ ] Keyword apa yang membawa traffic?
- [ ] Error/masalah dari Google?
- [ ] Posisi ranking untuk keyword utama

### Update Content (Bulanan):
- [ ] Tambah soal baru
- [ ] Update blog/artikel
- [ ] Perbaiki broken links
- [ ] Optimasi keyword

## 🎯 Target Keywords

### Primary Keywords (Paling Penting):
- UKMPPD
- Latihan UKMPPD
- Soal UKMPPD
- Simulasi UKMPPD
- Tryout UKMPPD

### Secondary Keywords:
- CBT UKMPPD
- Persiapan UKMPPD online
- Bank soal UKMPPD
- Platform UKMPPD
- Belajar UKMPPD

### Long-tail Keywords:
- "cara persiapan UKMPPD yang efektif"
- "latihan soal UKMPPD gratis"
- "platform tryout UKMPPD terbaik"
- "simulasi CBT UKMPPD online"

## ⏱️ Timeline

### Minggu 1-2:
- ✅ Deploy website
- ✅ Setup Google Search Console
- ✅ Submit sitemap
- ✅ Request indexing

### Minggu 3-4:
- Website mulai muncul di Google (posisi belakang)
- Monitor dan optimasi

### Bulan 2-3:
- Ranking mulai naik
- Traffic mulai stabil

### Bulan 4-6:
- Posisi di halaman 1 Google (jika optimasi bagus)
- Traffic organik meningkat

## 💡 Tips Sukses

1. **Sabar** - SEO butuh waktu 2-6 bulan untuk hasil optimal
2. **Konsisten** - Update content regular
3. **Quality over Quantity** - Konten berkualitas > banyak tapi jelek
4. **User Experience** - Website cepat, mudah digunakan
5. **Mobile-First** - Mayoritas user pakai HP
6. **Build Authority** - Dapatkan backlinks dari website terpercaya

## 📝 Checklist Final

Sebelum submit ke Google, pastikan:
- [x] Website sudah live/production
- [x] robots.txt accessible: `https://your-domain.com/robots.txt`
- [x] sitemap.xml accessible: `https://your-domain.com/sitemap.xml`
- [x] All pages load properly
- [x] Mobile responsive
- [ ] Google Search Console verified
- [ ] Sitemap submitted
- [ ] At least 5-10 quality pages
- [ ] Content unique & valuable

## 🆘 Troubleshooting

### Website tidak muncul di Google setelah 2 minggu?
- Cek Google Search Console untuk error
- Pastikan robots.txt tidak block semua
- Request indexing manual
- Cek apakah ada duplicate content

### Traffic masih rendah?
- Optimasi keyword
- Tambah content lebih banyak
- Build backlinks
- Promosi di social media
- Improve page speed

### Ranking turun?
- Cek competition (pesaing)
- Update content yang outdated
- Perbaiki technical SEO issues
- Improve user experience

## 📞 Support

Jika ada pertanyaan tentang SEO:
- Google Search Central: https://developers.google.com/search
- SEO Guide: https://moz.com/beginners-guide-to-seo
- Reddit: r/SEO

---

**Good luck! Semoga website CaseMed cepat viral di Google! 🚀**
