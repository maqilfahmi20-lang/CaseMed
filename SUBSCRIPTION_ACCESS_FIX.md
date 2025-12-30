# Fix: Subscription Access untuk Paket Premium

## Masalah
User yang sudah berlangganan (subscribe) masih tidak bisa mengakses paket premium. Ketika klik "Mulai Ujian", muncul pesan error **"Anda belum membeli paket ini"** meskipun status subscription sudah aktif dan tanggal akhir subscription sudah muncul di dashboard.

## Penyebab
Logic access control di `src/app/actions/ujian.ts` pada function `startAttempt()` **hanya mengecek payment untuk paket spesifik**, tidak mengecek apakah user memiliki subscription aktif.

### Code Lama (Bug):
```typescript
// Check if package is paid and user has paid
if (!pkg.is_free && pkg.harga && pkg.harga > 0) {
  const payment = await prisma.payment.findFirst({
    where: {
      user_id: user.id,
      package_id: packageId,
      status: 'paid'
    }
  });

  if (!payment) {
    return { error: 'Anda belum membeli paket ini' };
  }
}
```

**Problem**: Hanya mengecek `payment` untuk paket spesifik, tidak ada pengecekan subscription.

## Solusi
Update logic access control untuk mengecek **subscription aktif ATAU payment paket spesifik**.

### Code Baru (Fixed):
```typescript
// Check if package is paid and user has access
if (!pkg.is_free && pkg.harga && pkg.harga > 0) {
  // Get user subscription status
  const currentUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      subscriptionStatus: true,
      subscriptionEnd: true,
    }
  });

  // Check if subscription is active
  const isSubscriptionActive = currentUser?.subscriptionStatus === 'active' 
    && currentUser?.subscriptionEnd 
    && new Date(currentUser.subscriptionEnd) > new Date();

  // Check if user has paid specifically for this package
  const hasPackagePayment = await prisma.payment.findFirst({
    where: {
      user_id: user.id,
      package_id: packageId,
      status: 'paid'
    }
  });

  // User must either have active subscription OR have paid for this specific package
  if (!isSubscriptionActive && !hasPackagePayment) {
    return { error: 'Anda belum membeli paket ini atau berlangganan premium' };
  }
}
```

## Perubahan

### File yang Diupdate:
- `src/app/actions/ujian.ts` - Function `startAttempt()`

### Logic Baru:
1. **Cek subscription status** dari database
2. **Validasi subscription aktif**: 
   - Status = 'active'
   - subscriptionEnd masih di masa depan
3. **Cek payment paket spesifik** (untuk pembelian individual)
4. **User bisa akses jika**:
   - Punya subscription aktif, ATAU
   - Sudah bayar paket spesifik ini

## Testing
Untuk memastikan fix bekerja dengan benar:

### Test Case 1: User dengan Subscription Aktif
1. ✅ User subscribe premium
2. ✅ Status subscription = 'active'
3. ✅ subscriptionEnd masih valid
4. ✅ User bisa akses semua paket premium tanpa beli satuan

### Test Case 2: User dengan Pembelian Paket Individual
1. ✅ User tidak subscribe
2. ✅ User beli paket spesifik (payment status = 'paid')
3. ✅ User hanya bisa akses paket yang dibeli

### Test Case 3: User Tanpa Akses
1. ✅ User tidak subscribe
2. ✅ User tidak beli paket
3. ✅ Muncul error yang jelas
4. ✅ User diarahkan untuk subscribe atau beli paket

## Hasil
- ✅ User dengan subscription aktif bisa akses semua paket premium
- ✅ User dengan pembelian individual tetap bisa akses paket yang dibeli
- ✅ Error message lebih jelas: "Anda belum membeli paket ini atau berlangganan premium"
- ✅ Logic konsisten dengan display di halaman paket

## Catatan Penting
- Fix ini **tidak mengubah** logic pembayaran atau subscription
- Fix ini **hanya memperbaiki** validasi akses saat mulai ujian
- Display di halaman paket (`src/app/paket/[id]/page.tsx`) sudah benar dan tidak perlu diubah
- Logic yang sama diterapkan untuk semua jenis paket (simulasi & latihan)
