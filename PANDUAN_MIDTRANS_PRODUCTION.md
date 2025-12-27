# 📋 Panduan Submit Midtrans Production

## 🎯 Persiapan

### Data yang Perlu Disiapkan:
- ✅ **Live URL**: https://ui-admin-one.vercel.app
- ✅ **Nama Bisnis**: Sistem Tryout Online
- ✅ **Email Bisnis**: support@sistemtryout.com
- ✅ **Nomor Telepon**: +62 812-3456-7890
- ✅ **Alamat Lengkap**: (Update jika perlu)
- ✅ **Jenis Produk**: Platform Tryout/Ujian Online
- ✅ **Harga Produk**: Rp 50,000 - Rp 150,000

---

## 📝 Langkah-langkah Submit Production

### 1. Login ke Midtrans Dashboard
- Buka: https://dashboard.midtrans.com/
- Login dengan akun Anda (yang sekarang masih Sandbox)

### 2. Request Production Access
- Klik menu **"Settings"** di sidebar
- Pilih **"Access Keys"** atau **"Production Settings"**
- Klik tombol **"Request Production Access"** / **"Go Production"**

### 3. Isi Form Bisnis

#### A. Informasi Bisnis Dasar
```
Nama Bisnis/Brand    : Sistem Tryout Online
Website URL          : https://ui-admin-one.vercel.app
Email Bisnis         : support@sistemtryout.com
Nomor Telepon        : +62 812-3456-7890
```

#### B. Alamat Bisnis
```
Alamat Lengkap       : (Isi alamat kantor/operasional Anda)
Kota                 : (Kota Anda)
Provinsi             : (Provinsi Anda)
Kode Pos             : (Kode pos Anda)
```

#### C. Detail Produk/Layanan
```
Jenis Produk         : Platform Edukasi / Tryout Online
Deskripsi Produk     : Platform tryout dan ujian online untuk persiapan 
                       ujian masuk perguruan tinggi dan tes kompetensi
Range Harga          : Rp 50,000 - Rp 150,000
Estimasi Transaksi   : 100-500 transaksi/bulan (sesuaikan dengan target Anda)
```

#### D. Informasi Legal (Jika Ditanya)
- **Terms & Conditions**: https://ui-admin-one.vercel.app/terms
- **Refund Policy**: https://ui-admin-one.vercel.app/refund-policy
- **Privacy Policy**: https://ui-admin-one.vercel.app/privacy-policy
- **Contact Page**: https://ui-admin-one.vercel.app/contact

### 4. Upload Dokumen (Jika Diminta)

Midtrans mungkin meminta dokumen berikut:
- ☐ **KTP Pemilik Bisnis**
- ☐ **NPWP** (jika ada)
- ☐ **Dokumen Legalitas** (SIUP/NIB/Akta - jika berbadan hukum)
- ☐ **Rekening Bank** untuk settlement

> **Note**: Jika bisnis personal/belum berbadan hukum, cukup KTP + NPWP biasanya

### 5. Tunggu Verifikasi

**Timeline:**
- ⏰ Review awal: 1-2 hari kerja
- ⏰ Verifikasi lengkap: 3-5 hari kerja
- ⏰ Jika ada revisi: tambahan 1-2 hari

**Yang Akan Dicek Midtrans:**
1. ✅ Website bisa diakses
2. ✅ Produk jelas (paket tryout terlihat)
3. ✅ Terms & Conditions ada
4. ✅ Refund Policy ada
5. ✅ Contact info jelas
6. ✅ Payment flow tidak redirect keluar site
7. ✅ Tidak ada konten illegal/prohibited

---

## ⚠️ Tips Agar Cepat Di-Approve

### ✅ DO (Lakukan):
1. **Pastikan semua halaman legal bisa diakses**
   - Test: https://ui-admin-one.vercel.app/terms
   - Test: https://ui-admin-one.vercel.app/refund-policy
   - Test: https://ui-admin-one.vercel.app/privacy-policy
   - Test: https://ui-admin-one.vercel.app/contact

2. **Pastikan ada contoh paket/produk yang visible**
   - Login sebagai user
   - Pastikan ada paket yang bisa dilihat
   - Screenshot untuk dokumentasi

3. **Pastikan contact info konsisten**
   - Email sama di semua halaman
   - Phone sama di semua halaman
   - Alamat sama di semua halaman

4. **Response cepat jika ada pertanyaan dari Midtrans**
   - Cek email berkala
   - Response dalam 24 jam

### ❌ DON'T (Hindari):
1. ❌ Menggunakan email gratisan (gmail.com) untuk bisnis - gunakan domain sendiri
2. ❌ Alamat atau nomor HP palsu
3. ❌ Website masih broken/error
4. ❌ Tidak ada produk/paket yang terlihat
5. ❌ Terms/refund policy copas mentah dari tempat lain

---

## 🔄 Setelah Approved

### 1. Dapatkan Production Keys
```
MIDTRANS_SERVER_KEY=Mid-server-xxxxx (PRODUCTION)
MIDTRANS_CLIENT_KEY=Mid-client-xxxxx (PRODUCTION)
MIDTRANS_IS_PRODUCTION=true
```

### 2. Update Environment Variables di Vercel
```bash
# Di dashboard Vercel atau via CLI:
vercel env rm MIDTRANS_SERVER_KEY production
vercel env rm MIDTRANS_CLIENT_KEY production
vercel env rm MIDTRANS_IS_PRODUCTION production

# Add production keys
vercel env add MIDTRANS_SERVER_KEY production
vercel env add MIDTRANS_CLIENT_KEY production
vercel env add MIDTRANS_IS_PRODUCTION production
# Set value: true
```

### 3. Redeploy
```bash
vercel --prod
```

### 4. Test Payment Production
- Gunakan kartu kredit/debit REAL
- Gunakan nominal kecil untuk test (Rp 10,000)
- Cek apakah payment masuk ke dashboard Midtrans
- Cek apakah webhook berfungsi

---

## 🆘 Troubleshooting

### Jika Ditolak (Rejected)

**Alasan Umum:**
1. **"Website tidak bisa diakses"**
   - Solusi: Pastikan tidak ada error 500/404
   - Test semua halaman legal

2. **"Informasi kontak tidak valid"**
   - Solusi: Gunakan nomor HP aktif
   - Gunakan email domain sendiri

3. **"Terms/Refund policy tidak memadai"**
   - Solusi: Sudah ada di website, tinggal tunjukkan URL

4. **"Bisnis tidak jelas"**
   - Solusi: Tambahkan deskripsi jelas di About page
   - Pastikan ada paket/produk yang visible

### Jika Butuh Revisi
1. Perbaiki sesuai feedback Midtrans
2. Reply email mereka dengan:
   - Konfirmasi perbaikan sudah dilakukan
   - Link halaman yang diperbaiki
   - Screenshot jika perlu
3. Tunggu re-review (1-2 hari)

---

## 📞 Kontak Midtrans

Jika butuh bantuan:
- **Email Support**: support@midtrans.com
- **WhatsApp**: +62 812-8899-5577
- **Dashboard**: https://dashboard.midtrans.com/
- **Dokumentasi**: https://docs.midtrans.com/

---

## ✅ Checklist Sebelum Submit

Pastikan semua ini sudah:
- [ ] Website live dan bisa diakses
- [ ] Semua halaman legal ada dan bisa dibuka
- [ ] Contact info valid dan konsisten
- [ ] Ada minimal 3-5 paket produk yang visible
- [ ] Test user bisa register dan login
- [ ] Sandbox payment sudah pernah dicoba dan sukses
- [ ] Punya dokumen identitas (KTP/NPWP)
- [ ] Punya rekening bank untuk settlement

**Jika semua sudah ✅, langsung submit!**

---

## 🎉 Setelah Production Live

1. **Monitor transaksi** di dashboard Midtrans
2. **Cek settlement** (pencairan dana) biasanya D+1 atau D+7
3. **Update status manual** jika webhook gagal
4. **Customer support** siap handle complain/refund

**Good luck! 🚀**
