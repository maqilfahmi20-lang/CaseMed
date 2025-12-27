# 🚀 PANDUAN IMPLEMENTASI SISTEM TRYOUT MVP

## 📦 Instalasi Dependencies

```bash
npm install @prisma/client prisma bcryptjs jose
npm install -D @types/bcryptjs
```

## 🗄️ Setup Database

### 1. Buat Database MySQL
```sql
CREATE DATABASE tryout_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Update .env
```env
DATABASE_URL="mysql://root:password@localhost:3306/tryout_db"
AUTH_SECRET="gunakan-string-random-yang-sangat-panjang-minimal-32-karakter"
```

### 3. Jalankan Prisma Migration
```bash
npx prisma generate
npx prisma db push
```

### 4. Buat Akun Admin Manual
```bash
# Masuk ke MySQL
mysql -u root -p

# Gunakan database
USE tryout_db;

# Insert admin (password: admin123)
INSERT INTO users (id, nama, email, password, role, createdAt, updatedAt)
VALUES (
  'admin001',
  'Administrator',
  'admin@tryout.com',
  '$2a$10$xQZ3vZBXxN9vGxKZvHZGK.YxJVqL8K9yZX/xqZGKxZBXxN9vGxKZv',
  'admin',
  NOW(),
  NOW()
);
```

**Password hash untuk 'admin123'**: Generate dengan script ini:
```javascript
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('admin123', 10);
console.log(hash);
```

## 📁 Struktur File yang Sudah Dibuat

✅ `prisma/schema.prisma` - Database schema
✅ `src/lib/prisma.ts` - Prisma client singleton
✅ `src/lib/auth.ts` - Auth functions (login, register, session)
✅ `src/middleware.ts` - Route protection middleware
✅ `src/app/actions/auth.ts` - Server actions untuk auth
✅ `src/app/login/page.tsx` - Halaman login (UPDATED)
✅ `src/app/register/page.tsx` - Halaman register

## 🔨 File yang Perlu Dibuat Selanjutnya

### ADMIN SECTION

1. **Admin Dashboard** (`src/app/admin/dashboard/page.tsx`)
   - Statistik: total soal, total paket, total user
   - Link ke kelola soal dan paket

2. **Kelola Soal** (`src/app/admin/soal/page.tsx`)
   - List soal dengan pagination (20/page)
   - Search & filter kategori
   - Tombol tambah, edit, hapus
   
3. **Tambah/Edit Soal** (`src/app/admin/soal/[id]/page.tsx`)
   - Form input soal
   - Server action: createQuestion, updateQuestion

4. **Kelola Paket** (`src/app/admin/paket/page.tsx`)
   - List paket
   - Tombol tambah, edit, aktif/nonaktif

5. **Buat Paket** (`src/app/admin/paket/buat/page.tsx`)
   - Form: nama, tipe, harga, max_attempt
   - Pilih soal random dari bank soal
   - Server action: createPackage

### USER SECTION

6. **User Dashboard** (`src/app/user/dashboard/page.tsx`)
   - Tab: Paket Latihan & Paket UKMPPD
   - List paket dengan status (tersedia/terkunci)
   - Tombol mulai/beli

7. **Kerjakan Soal** (`src/app/user/ujian/[attemptId]/page.tsx`)
   - Load attempt dengan soal random
   - Form jawaban per soal
   - Submit jawaban

8. **Hasil Ujian** (`src/app/user/hasil/[attemptId]/page.tsx`)
   - Tampilkan nilai
   - Pembahasan soal

### PAYMENT

9. **Checkout Payment** (`src/app/user/checkout/[packageId]/page.tsx`)
   - Generate Midtrans QRIS
   - Tampilkan QR code

10. **Webhook Midtrans** (`src/app/api/midtrans/webhook/route.ts`)
    - Terima callback
    - Verifikasi signature
    - Update status payment

## 🔐 Cara Kerja Autentikasi

1. User input email & password
2. Server action `loginAction` memanggil `auth.login()`
3. Verifikasi password dengan bcrypt
4. Buat JWT token dengan `jose`
5. Set httpOnly cookie 'session'
6. Middleware cek cookie di setiap request
7. Redirect sesuai role (admin/user)

## 🛡️ Keamanan

- ✅ Password di-hash dengan bcryptjs (10 rounds)
- ✅ JWT token untuk session
- ✅ httpOnly cookie (tidak bisa diakses JavaScript)
- ✅ Middleware proteksi route berdasarkan role
- ✅ Server-side validation di semua API

## 📝 Contoh Penggunaan Auth di Server Component

```typescript
import { requireAuth, requireAdmin } from '@/lib/auth';

// Di server component
export default async function AdminPage() {
  const user = await requireAdmin(); // Throw error jika bukan admin
  
  return <div>Halo Admin {user.nama}</div>;
}
```

## 📝 Contoh Server Action

```typescript
'use server';

import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function createQuestion(formData: FormData) {
  await requireAdmin(); // Pastikan admin
  
  const data = {
    kategori: formData.get('kategori'),
    pertanyaan: formData.get('pertanyaan'),
    // ...
  };
  
  const question = await prisma.question.create({ data });
  return { success: true, question };
}
```

## 🎯 Flow Sistem

### Flow User Beli Paket & Kerjakan Soal:

1. User login → Dashboard
2. Lihat paket tersedia
3. Klik "Beli Paket" → Generate QR Midtrans
4. User bayar via QRIS
5. Midtrans kirim webhook
6. Sistem update status payment → "paid"
7. User bisa mulai ujian
8. Sistem generate attempt baru dengan soal random
9. User kerjakan soal, submit jawaban
10. Sistem hitung nilai, simpan hasil
11. User lihat hasil & pembahasan

### Flow Admin Kelola Soal & Paket:

1. Admin login → Admin Dashboard
2. Tambah soal ke bank soal (bisa hingga 10.000)
3. Buat paket (latihan/ukmppd)
4. Sistem random pilih soal sesuai kategori & jumlah
5. Set harga, max_attempt, status aktif
6. Paket muncul di dashboard user

## ⚡ Optimasi untuk 10.000 Soal

1. **Indexing** - Sudah diatur di schema.prisma
2. **Pagination** - 20 soal per halaman di admin
3. **Random Efficient** - Pakai `ORDER BY RAND() LIMIT n` atau ID random
4. **Caching** - Pakai `unstable_cache` Next.js untuk soal
5. **Database** - MySQL dengan InnoDB engine

## 🔄 Random Soal Strategy

```typescript
// Di server action createAttempt
const randomQuestions = await prisma.question.findMany({
  where: { kategori: package.tipe_paket },
  take: package.total_soal,
  orderBy: { id: 'asc' },
  skip: Math.floor(Math.random() * 1000), // Random offset
});

// Atau pakai ID random
const allIds = await prisma.question.findMany({
  where: { kategori: package.tipe_paket },
  select: { id: true },
});
const shuffled = allIds.sort(() => 0.5 - Math.random());
const selectedIds = shuffled.slice(0, package.total_soal);
```

## 🧪 Testing

### Test Login
```bash
# Buat user test
INSERT INTO users (id, nama, email, password, role) 
VALUES ('user001', 'Test User', 'user@test.com', '$2a$10$hash', 'user');

# Test login di browser
http://localhost:3000/login
Email: user@test.com
Password: (password yang di-hash)
```

## 📚 Resources

- Prisma Docs: https://www.prisma.io/docs
- Next.js Server Actions: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions
- Jose JWT: https://github.com/panva/jose
- Midtrans Docs: https://docs.midtrans.com

---

**Status Implementasi:**
✅ Database Schema
✅ Authentication System
✅ Middleware Role Protection
✅ Login & Register Pages

**Next Steps:**
🔜 Admin: Kelola Soal
🔜 Admin: Kelola Paket
🔜 User: Dashboard & List Paket
🔜 User: Kerjakan Soal & Hitung Nilai
🔜 Payment: Midtrans Integration
