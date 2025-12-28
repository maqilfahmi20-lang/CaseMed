# 🔧 Database Setup Scripts

Script untuk setup database dan membuat user awal.

## 📋 Prerequisites

1. MySQL server sudah running
2. Database sudah dibuat (nama: `tryout_db` atau sesuai .env)
3. Dependencies sudah terinstall: `npm install`
4. Prisma sudah di-generate: `npx prisma generate`
5. Database schema sudah di-push: `npx prisma db push`

## 🚀 Cara Penggunaan

### 1. Buat Admin User

```bash
node scripts/create-admin.js
```

**Output:**
```
✅ Admin berhasil dibuat!
📧 Email: admin@tryout.com
🔑 Password: admin123
```

**Login Admin:**
- URL: http://localhost:3000/admin/login
- Email: `admin@tryout.com`
- Password: `admin123`

---

### 2. Buat Test User (User Biasa)

```bash
node scripts/create-test-user.js
```

**Output:**
```
✅ User test berhasil dibuat!
📧 Email: user@test.com
🔑 Password: user123
```

**Login User:**
- URL: http://localhost:3000/login
- Email: `user@test.com`
- Password: `user123`

---

## 💎 Subscription Management Scripts (Development)

### simulate-payment-success.js
**🔥 GUNAKAN INI UNTUK TESTING SUBSCRIPTION!**

Simulate Midtrans payment success untuk complete pending payments dan aktivasi subscription.

```bash
# Menggunakan email (akan ambil pending payment terbaru)
node scripts/simulate-payment-success.js user@email.com

# Menggunakan order ID
node scripts/simulate-payment-success.js SUB-cmjpxryr-1766938935742
```

**Kapan digunakan:**
- User baru subscribe tapi payment stuck di "pending"
- Testing subscription flow di development
- Midtrans sandbox tidak auto-complete payment

**Output:**
```
✅ Payment marked as paid!
💎 Subscription Activated!
   User: user@email.com
   Duration: 30 days
🎉 User now has access to ALL premium packages!
```

---

### auto-complete-payments.js
Auto-complete **SEMUA** pending subscription payments sekaligus.

```bash
node scripts/auto-complete-payments.js
```

**Gunakan untuk:** Bulk testing - activate semua pending subscriptions

---

### activate-subscription.js
Manually activate subscription untuk user (tanpa payment).

```bash
node scripts/activate-subscription.js user@email.com
```

---

### show-user-access.js
Lihat package mana saja yang bisa diakses user.

```bash
node scripts/show-user-access.js user@email.com
```

---

### check-latest-payments.js
Lihat 10 transaksi pembayaran terbaru.

```bash
node scripts/check-latest-payments.js
```

---

## 🧪 Development Workflow: Testing Subscription

1. **User register** dan klik tombol **"Subscribe"**
2. Payment dibuat tapi status **"pending"** (Midtrans sandbox tidak auto-complete)
3. **Jalankan script simulation:**
   ```bash
   node scripts/simulate-payment-success.js user@email.com
   ```
4. User **refresh browser** → Semua premium packages terbuka! ✅

---

## 🔍 Troubleshooting

### Error: "Can't reach database server"
```
❌ Error: Can't reach database server at `localhost:3306`
```

**Solusi:**
1. Pastikan MySQL server running
2. Cek connection string di `.env`:
   ```env
   DATABASE_URL="mysql://root:password@localhost:3306/tryout_db"
   ```
3. Test connection: `npx prisma db push`

---

### Error: "Unknown database"
```
❌ Error: Unknown database 'tryout_db'
```

**Solusi:**
Buat database dulu di MySQL:
```bash
# Masuk ke MySQL
mysql -u root -p

# Buat database
CREATE DATABASE tryout_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Keluar
exit;
```

Atau pakai MySQL Workbench / phpMyAdmin.

---

### Error: "Unique constraint failed"
```
❌ Error: Unique constraint failed on the fields: (`email`)
```

**Artinya:** User dengan email tersebut sudah ada di database.

**Solusi:** Script akan otomatis detect dan menampilkan info user yang sudah ada.

---

## 📊 Cek Data di Database

### Pakai Prisma Studio (Recommended)
```bash
npx prisma studio
```
Browser akan buka di: http://localhost:5555

### Pakai MySQL CLI
```bash
mysql -u root -p

USE tryout_db;

# Lihat semua users
SELECT id, nama, email, role, createdAt FROM users;

# Lihat admin
SELECT * FROM users WHERE role = 'admin';

# Lihat user biasa
SELECT * FROM users WHERE role = 'user';
```

---

## 🔐 Security Notes

**⚠️ PENTING untuk Production:**

1. **Ganti password default** setelah login pertama kali
2. **Jangan commit** file `.env` ke Git
3. **Gunakan password kuat** untuk database production
4. **Set AUTH_SECRET** dengan string random minimal 32 karakter:
   ```bash
   # Generate random string
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

---

## 📝 Custom User

Jika ingin buat user dengan data custom, edit file script atau pakai Prisma Studio.

**Contoh edit `create-admin.js`:**
```javascript
const admin = await prisma.user.create({
  data: {
    nama: 'Your Name',           // Ganti nama
    email: 'your@email.com',      // Ganti email
    password: hashedPassword,     // Password tetap di-hash
    role: 'admin'                 // 'admin' atau 'user'
  }
});
```

---

## 🧹 Reset Database

Jika ingin reset semua data:
```bash
# Hapus semua data
npx prisma migrate reset

# Push schema lagi
npx prisma db push

# Buat admin baru
node scripts/create-admin.js
```

**⚠️ Warning:** Ini akan **menghapus semua data** di database!
