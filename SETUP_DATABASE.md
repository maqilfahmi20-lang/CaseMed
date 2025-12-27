# 🚀 SETUP DATABASE - LANGKAH DEMI LANGKAH

## ⚠️ Sebelum Mulai

Script `create-admin.js` error karena database belum siap. Ikuti langkah ini dengan teliti.

---

## 📝 STEP 1: Install & Start MySQL Server

### Opsi A: Pakai XAMPP (Paling Mudah)
1. Download XAMPP: https://www.apachefriends.org/download.html
2. Install XAMPP
3. Buka XAMPP Control Panel
4. Klik **Start** pada MySQL
5. Tunggu hingga status jadi hijau

### Opsi B: Pakai MySQL Installer
1. Download MySQL: https://dev.mysql.com/downloads/installer/
2. Install MySQL Server
3. Set root password (ingat password ini!)
4. Start MySQL Service dari Services (Windows)

### Opsi C: Pakai Docker
```bash
docker run --name mysql-tryout -e MYSQL_ROOT_PASSWORD=root123 -p 3306:3306 -d mysql:8.0
```

---

## 📝 STEP 2: Cek MySQL Running

### Cara 1: Pakai CMD/PowerShell
```bash
# Test connection
mysql -u root -p
# Masukkan password MySQL Anda
# Jika berhasil, akan muncul "mysql>"

# Keluar
exit;
```

### Cara 2: Pakai XAMPP Shell (jika pakai XAMPP)
```bash
# Buka XAMPP Shell, ketik:
mysql -u root
# Jika XAMPP default, biasanya tanpa password
```

### Cara 3: Cek Port 3306
```bash
# Windows PowerShell
netstat -ano | findstr :3306
# Jika ada output, berarti MySQL running
```

---

## 📝 STEP 3: Buat Database

### Cara 1: Pakai MySQL CLI
```bash
# Masuk MySQL
mysql -u root -p

# Buat database
CREATE DATABASE tryout_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Cek database sudah ada
SHOW DATABASES;
# Harusnya ada "tryout_db" di list

# Keluar
exit;
```

### Cara 2: Pakai phpMyAdmin (jika pakai XAMPP)
1. Buka browser: http://localhost/phpmyadmin
2. Klik tab "Databases"
3. Database name: `tryout_db`
4. Collation: `utf8mb4_unicode_ci`
5. Klik "Create"

### Cara 3: Pakai MySQL Workbench
1. Buka MySQL Workbench
2. Connect ke localhost
3. Klik icon "Create Schema"
4. Name: `tryout_db`
5. Charset: `utf8mb4`, Collation: `utf8mb4_unicode_ci`
6. Apply

---

## 📝 STEP 4: Update File .env

Sesuaikan connection string dengan setup MySQL Anda:

### Jika pakai XAMPP (biasanya tanpa password):
```env
DATABASE_URL="mysql://root@localhost:3306/tryout_db"
```

### Jika pakai MySQL dengan password:
```env
DATABASE_URL="mysql://root:YourPassword@localhost:3306/tryout_db"
```

**Ganti `YourPassword` dengan password MySQL Anda!**

### Format lengkap:
```
mysql://USERNAME:PASSWORD@HOST:PORT/DATABASE
```

Contoh:
- Username: `root`
- Password: `admin123`
- Host: `localhost`
- Port: `3306`
- Database: `tryout_db`

Menjadi:
```env
DATABASE_URL="mysql://root:admin123@localhost:3306/tryout_db"
```

---

## 📝 STEP 5: Push Schema ke Database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema (buat tabel-tabel)
npx prisma db push
```

**Output yang benar:**
```
✔ Generated Prisma Client to ./node_modules/@prisma/client
🚀 Your database is now in sync with your Prisma schema.
```

**Jika error "Can't reach database":**
- Cek MySQL running (Step 2)
- Cek DATABASE_URL di .env (Step 4)
- Cek database sudah dibuat (Step 3)

---

## 📝 STEP 6: Buat Admin User

```bash
node scripts/create-admin.js
```

**Output yang benar:**
```
🔍 Checking existing admin...
📝 Creating admin user...
✅ Admin berhasil dibuat!
📧 Email: admin@tryout.com
🔑 Password: admin123
```

---

## 📝 STEP 7: Buat Test User (Opsional)

```bash
node scripts/create-test-user.js
```

---

## 📝 STEP 8: Verifikasi Data

### Cara 1: Pakai Prisma Studio
```bash
npx prisma studio
# Browser akan buka di http://localhost:5555
# Klik "User" untuk lihat data
```

### Cara 2: Pakai MySQL CLI
```bash
mysql -u root -p
USE tryout_db;
SELECT * FROM users;
```

**Harusnya ada:**
- 1 admin (admin@tryout.com)
- 1 user (user@test.com) - jika sudah jalankan step 7

---

## 📝 STEP 9: Test Login

### Admin:
1. Buka: http://localhost:3000/admin/login
2. Email: `admin@tryout.com`
3. Password: `admin123`
4. Klik Login
5. Harusnya redirect ke `/admin/dashboard`

### User:
1. Buka: http://localhost:3000/login
2. Email: `user@test.com`
3. Password: `user123`
4. Klik Login
5. Harusnya redirect ke `/dashboard` (atau `/user/dashboard`)

---

## ❌ TROUBLESHOOTING

### Error: "Can't reach database server"
**Solusi:**
1. Pastikan MySQL running (cek XAMPP Control Panel)
2. Cek DATABASE_URL di .env
3. Test: `mysql -u root -p` di terminal

---

### Error: "Unknown database 'tryout_db'"
**Solusi:**
Database belum dibuat. Ikuti Step 3.

---

### Error: "Access denied for user 'root'@'localhost'"
**Solusi:**
Password salah di DATABASE_URL. Edit .env:
```env
DATABASE_URL="mysql://root:PasswordYangBenar@localhost:3306/tryout_db"
```

---

### Error: "Table 'tryout_db.users' doesn't exist"
**Solusi:**
Schema belum di-push. Jalankan:
```bash
npx prisma db push
```

---

### Error: "Unique constraint failed on email"
**Solusi:**
Admin sudah ada. Cek dengan:
```bash
npx prisma studio
```
Atau hapus user lama:
```sql
DELETE FROM users WHERE email = 'admin@tryout.com';
```

---

## 🎯 CHECKLIST

Sebelum lanjut, pastikan semua ini ✅:

- [ ] MySQL server running
- [ ] Database `tryout_db` sudah dibuat
- [ ] File `.env` sudah diupdate dengan connection string yang benar
- [ ] `npx prisma generate` berhasil
- [ ] `npx prisma db push` berhasil (ada 7 tabel: users, questions, packages, dll)
- [ ] `node scripts/create-admin.js` berhasil
- [ ] Admin bisa login di http://localhost:3000/admin/login
- [ ] `npm run dev` berjalan tanpa error

---

## 📞 Butuh Bantuan?

Jika masih error, kirim screenshot error message lengkap beserta:
1. Output dari `npx prisma db push`
2. Isi file `.env` (sensor password!)
3. Error message dari terminal
