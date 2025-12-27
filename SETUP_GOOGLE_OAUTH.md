# 🔐 Panduan Setup Google OAuth untuk CaseMed

## ✅ Persyaratan
- Akun Google/Gmail (GRATIS, tidak perlu credit card!)
- 5-10 menit waktu setup

---

## 📝 Langkah-Langkah Setup

### **1. Buka Google Cloud Console**
1. Buka browser dan kunjungi: https://console.cloud.google.com
2. Login menggunakan akun Google Anda

### **2. Buat Project Baru**
1. Klik dropdown "Select a project" di bagian atas
2. Klik tombol **"New Project"**
3. Isi informasi project:
   - **Project Name**: `CaseMed` atau `Tryout Online`
   - **Organization**: Kosongkan (pilih "No organization")
4. Klik **"Create"**
5. Tunggu beberapa detik sampai project selesai dibuat

### **3. Enable Google+ API (Opsional tapi Direkomendasikan)**

⚠️ **PENTING:** Hanya enable API ini jika diminta. Jika tidak ada masalah, skip langkah ini.

1. Di sidebar kiri, klik **"APIs & Services"** > **"Library"**
2. Cari "Google People API" (BUKAN yang lain seperti Cloud Build, Compute, dll)
3. Klik pada "Google People API"
4. Klik tombol **"Enable"**

🚫 **JANGAN ENABLE:**
- Cloud Build, Artifact Registry, Compute Engine, Container Registry, Cloud Run
- Semua ini TIDAK DIPERLUKAN dan butuh billing account!

### **4. Konfigurasi OAuth Consent Screen**
1. Di sidebar kiri, klik **"APIs & Services"** > **"OAuth consent screen"**
2. Pilih **"External"** (untuk semua user Google)
3. Klik **"Create"**

**Isi Form OAuth Consent Screen:**

#### **App Information:**
- **App name**: `CaseMed`
- **User support email**: Pilih email Anda dari dropdown
- **App logo**: (Opsional - skip dulu)

#### **App domain** (Opsional - bisa diisi nanti):
- **Application home page**: `https://yourdomain.com` (atau kosongkan dulu)
- **Application privacy policy link**: `https://yourdomain.com/privacy-policy`
- **Application terms of service link**: `https://yourdomain.com/terms`

#### **Developer contact information:**
- **Email addresses**: Masukkan email Anda

4. Klik **"Save and Continue"**

#### **Scopes** (Langkah 2):
1. Klik **"Add or Remove Scopes"**
2. Pilih scopes berikut:
   - `userinfo.email`
   - `userinfo.profile`
   - `openid`
3. Klik **"Update"**
4. Klik **"Save and Continue"**

#### **Test Users** (Langkah 3):
1. Klik **"Add Users"**
2. Masukkan email Anda dan email teman yang akan test (maksimal 100 email untuk testing)
3. Klik **"Add"**
4. Klik **"Save and Continue"**

5. **Summary** - Review dan klik **"Back to Dashboard"**

### **5. Buat OAuth 2.0 Credentials**
1. Di sidebar kiri, klik **"APIs & Services"** > **"Credentials"**
2. Klik tombol **"+ Create Credentials"** di atas
3. Pilih **"OAuth client ID"**

**Konfigurasi OAuth Client ID:**

#### **Application Type:**
- Pilih **"Web application"**

#### **Name:**
- Masukkan: `CaseMed Web Client`

#### **Authorized JavaScript origins:**
Klik **"+ Add URI"** dan masukkan:
- **Development**: `http://localhost:3000`
- **Production** (nanti): `https://yourdomain.com`

#### **Authorized redirect URIs:**
Klik **"+ Add URI"** dan masukkan:
- **Development**: `http://localhost:3000/api/auth/callback/google`
- **Production** (nanti): `https://yourdomain.com/api/auth/callback/google`

4. Klik **"Create"**

### **6. Copy Client ID & Client Secret** ⚠️
Setelah dibuat, popup akan muncul dengan:
- **Client ID**: Copy nilai ini (contoh: `123456789-abc.apps.googleusercontent.com`)
- **Client Secret**: Copy nilai ini (contoh: `GOCSPX-abc123xyz`)

**PENTING:** Simpan kedua nilai ini dengan aman!

---

## 🔧 Update File .env

1. Buka file `.env` di root project Anda
2. Ganti nilai berikut dengan kredensial yang Anda copy:

```env
# Google OAuth
GOOGLE_CLIENT_ID="paste-client-id-anda-di-sini.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="paste-client-secret-anda-di-sini"
```

3. **Save** file `.env`

---

## 🚀 Testing

### **1. Restart Development Server**
```bash
# Tekan Ctrl+C untuk stop server yang sedang jalan
# Kemudian jalankan lagi:
npm run dev
```

### **2. Test Login dengan Google**
1. Buka browser: http://localhost:3000/login
2. Klik tombol **"Lanjutkan dengan Google"**
3. Pilih akun Google Anda
4. Izinkan akses (klik "Allow")
5. Anda akan di-redirect ke dashboard

### **3. Test Register dengan Google**
1. Buka browser: http://localhost:3000/register
2. Klik tombol **"Daftar dengan Google"**
3. Pilih akun Google Anda
4. Anda akan otomatis terdaftar dan masuk ke dashboard

---

## ⚠️ Troubleshooting

### **Error: "Billing account required"**
**Penyebab:** Anda tidak sengaja mencoba enable services yang butuh billing (Cloud Build, Compute Engine, dll)

**Solusi:**
- ❌ **JANGAN** enable services tersebut
- ✅ Tutup popup/error tersebut
- ✅ Anda **HANYA** butuh OAuth Consent Screen + OAuth Client ID
- ✅ OAuth 2.0 adalah **100% GRATIS** tanpa billing

### **Error: "Access blocked: This app's request is invalid"**
**Solusi:**
- Pastikan Authorized redirect URIs sudah benar: `http://localhost:3000/api/auth/callback/google`
- Pastikan tidak ada typo atau spasi
- Tunggu 1-2 menit setelah update credentials (cache)

### **Error: "redirect_uri_mismatch"**
**Solusi:**
- Check apakah redirect URI di Google Console sama persis dengan: `http://localhost:3000/api/auth/callback/google`
- Pastikan tidak ada trailing slash (/) di akhir URL
- Pastikan menggunakan `http://` untuk localhost (bukan `https://`)

### **Error: "Client ID not found"**
**Solusi:**
- Copy ulang Client ID dari Google Console
- Pastikan tidak ada spasi atau karakter hidden
- Restart development server

### **Google Sign-In tidak muncul**
**Solusi:**
- Check file `.env` apakah sudah save
- Restart development server (`Ctrl+C` lalu `npm run dev`)
- Clear browser cache dan reload halaman

---

## 🌐 Deploy ke Production (Vercel)

### **1. Update Google Console untuk Production**
1. Kembali ke Google Cloud Console
2. Buka **"Credentials"** > Edit OAuth Client ID
3. Tambahkan production URLs:

**Authorized JavaScript origins:**
- `https://your-app-name.vercel.app`

**Authorized redirect URIs:**
- `https://your-app-name.vercel.app/api/auth/callback/google`

4. Klik **"Save"**

### **2. Update Vercel Environment Variables**
1. Buka Vercel Dashboard
2. Pilih project Anda
3. Pergi ke **Settings** > **Environment Variables**
4. Tambahkan:
   - `GOOGLE_CLIENT_ID` = `(same value dari .env)`
   - `GOOGLE_CLIENT_SECRET` = `(same value dari .env)`
   - `NEXTAUTH_URL` = `https://your-app-name.vercel.app`
   - `NEXTAUTH_SECRET` = `(generate dengan: openssl rand -base64 32)`

5. Redeploy aplikasi Anda

---

## 📋 Checklist Final

- [ ] Project dibuat di Google Cloud Console
- [ ] OAuth Consent Screen dikonfigurasi
- [ ] OAuth Client ID dibuat
- [ ] Client ID & Secret di-copy ke `.env`
- [ ] Authorized redirect URIs sudah benar
- [ ] Development server di-restart
- [ ] Test login berhasil
- [ ] Test register berhasil

---

## 💡 Tips Keamanan

1. **JANGAN** commit file `.env` ke Git
2. **JANGAN** share Client Secret ke public
3. Gunakan `.env.example` untuk dokumentasi (tanpa nilai sebenarnya)
4. Rotate Client Secret secara berkala (setiap 6-12 bulan)

---

## 🆘 Butuh Bantuan?

Jika mengalami masalah:
1. Check error message di browser console (F12)
2. Check terminal output untuk error server
3. Pastikan semua environment variables sudah benar
4. Restart development server

---

## ✅ Selesai!

Sekarang aplikasi CaseMed Anda sudah support **Google OAuth**! 🎉

Users bisa:
- ✨ Login dengan 1 klik menggunakan Google
- 🚀 Register tanpa perlu mengisi form panjang
- 🔐 Lebih aman karena tidak perlu password

**Selamat mencoba!** 🎊
