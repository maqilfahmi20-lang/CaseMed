# 🎯 PANDUAN AUTO-VERIFICATION SANDBOX MIDTRANS

## ❌ MASALAH YANG ANDA ALAMI

1. Payment muncul di Midtrans Dashboard tapi status pending
2. Tidak ada tombol "Change Status" di dashboard (hanya "Refund")
3. Subscription tidak auto-aktif
4. Harus manual pakai script di VS Code

## 💡 PENJELASAN

**Kenapa tidak ada "Change Status"?**
- Anda pakai **Midtrans Snap** (QR code payment)
- Snap transaction **TIDAK BISA** manual change status di dashboard
- Tombol "Change Status" hanya untuk **API transaction** (bukan Snap)

**Untuk Snap sandbox, ada 3 cara:**
1. ✅ **Bayar dengan test card** (auto send webhook)
2. ✅ **Gunakan simulator API** (auto send webhook)  
3. ✅ **Approve via Midtrans API** (kami sediakan script)

---

## ✅ SOLUSI 1: BAYAR DENGAN TEST CARD (PALING MUDAH)

Ketika user klik "Berlangganan Sekarang" dan QR muncul:

### **Option A: Credit Card Test**

Di Snap payment page, pilih **Credit Card**:
- **Card Number:** `4811 1111 1111 1114`
- **CVV:** `123`
- **Expiry:** `01/29` (any future date)
- **OTP/3DS:** `112233`

Setelah klik Pay:
- ✅ Payment auto-settlement
- ✅ Midtrans auto-send webhook
- ✅ Subscription auto-aktif

### **Option B: Bank Transfer/VA**

Di Snap payment page, pilih **Bank Transfer**:
- Pilih bank (BCA/BNI/BRI/Mandiri)
- Copy VA number
- **Di sandbox**, payment auto-complete setelah 1-2 menit
- ✅ Webhook auto-sent

### **Option C: QRIS**

- Scan QR atau copy code
- **Di sandbox**, auto-complete setelah timeout
- ✅ Webhook auto-sent

---

## ✅ SOLUSI 2: AUTO-COMPLETE SCRIPT (RECOMMENDED)

Saya sudah buatkan script untuk **AUTO-COMPLETE payment pending**:

### **Step 1: Pastikan ada payment pending**

```bash
node scripts/check-webhook-logs.js user@example.com
```

Jika ada payment pending, lanjut ke step 2.

### **Step 2: Auto-complete semua payment pending**

```bash
node scripts/auto-complete-payments.js
```

Script ini akan:
- ✅ Cari semua payment pending
- ✅ Hit Midtrans API untuk approve payment
- ✅ Midtrans auto-send webhook
- ✅ Subscription auto-aktif

### **Step 3: Verify subscription aktif**

```bash
node scripts/check-webhook-logs.js user@example.com
```

Harus show:
```
✅ ALL GOOD!
Payment is PAID and subscription is ACTIVE
```

---

## ✅ SOLUSI 3: SIMULATE WEBHOOK MANUAL

Jika solusi 1 & 2 tidak work:

```bash
# 1. Start server (jika belum running)
npm run dev

# 2. Di terminal lain, simulate webhook
node scripts/simulate-webhook-for-order.js ORDER_ID

# 3. Verify
node scripts/check-webhook-logs.js user@example.com
```

---

## 🎯 TESTING WORKFLOW (COMPLETE)

### **Untuk User Baru:**

1. **User register & login**
2. **User klik "Berlangganan Sekarang"**
3. **QR muncul dari Midtrans Snap**

**Option A - Test Card (RECOMMENDED):**
4. Pilih Credit Card
5. Input test card: `4811 1111 1111 1114`
6. CVV: `123`, Expiry: `01/29`, OTP: `112233`
7. Klik Pay
8. ✅ Auto-settlement → ✅ Webhook sent → ✅ Subscription active

**Option B - Auto Script:**
4. Payment stuck di pending
5. Run: `node scripts/auto-complete-payments.js`
6. Wait 5 seconds
7. ✅ Webhook sent → ✅ Subscription active

**Option C - Manual Webhook:**
4. Payment stuck di pending
5. Run: `node scripts/simulate-webhook-for-order.js ORDER_ID`
6. ✅ Subscription active

---

## 📋 CHECKLIST UNTUK PRODUCTION

Untuk deploy ke production (bukan sandbox):

### **1. Update Environment:**
```env
MIDTRANS_SERVER_KEY=Mid-server-PRODUCTION-KEY
MIDTRANS_IS_PRODUCTION=true
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=Mid-client-PRODUCTION-KEY
```

### **2. Configure Webhook URL:**
- Login Midtrans Production Dashboard
- Settings → Configuration
- Payment Notification URL: `https://your-domain.com/api/midtrans-webhook`
- Finish Redirect URL: `https://your-domain.com/subscription/success`

### **3. Test Real Payment:**
- User bayar dengan REAL card/VA/QRIS
- Payment success
- Midtrans auto-send webhook
- Subscription auto-aktif

---

## 🚨 IMPORTANT NOTES

### **Di Sandbox:**
- ✅ Payment auto-complete dengan test card
- ✅ Webhook auto-sent setelah payment
- ✅ Subscription auto-aktif via webhook
- ⚠️ Jika stuck, gunakan script auto-complete

### **Di Production:**
- ✅ Real payment (user bayar beneran)
- ✅ Midtrans auto-send webhook setelah settlement
- ✅ Subscription auto-aktif via webhook
- ✅ No manual intervention needed

### **Webhook Handler:**
- ✅ Sudah fixed dengan dual signature verification
- ✅ Comprehensive logging
- ✅ Robust error handling
- ✅ Auto-activate subscription on settlement

---

## 🎓 SUMMARY

**Problem:** Tidak bisa manual change status di Midtrans Dashboard (Snap transaction)

**Solution:**
1. ✅ **Bayar dengan test card** `4811 1111 1111 1114` → Auto-settlement
2. ✅ **Run script** `node scripts/auto-complete-payments.js` → Auto-approve
3. ✅ **Simulate webhook** `node scripts/simulate-webhook-for-order.js` → Manual webhook

**Production:** User bayar real → Midtrans auto-webhook → Subscription auto-aktif

**Status:**
- ✅ Webhook handler: FIXED
- ✅ Auto-verification: AVAILABLE (via test card atau script)
- ✅ Production ready: YES

---

**Recommended untuk testing sekarang:**
```bash
# Jika ada payment pending baru:
node scripts/auto-complete-payments.js

# Lalu verify:
node scripts/check-webhook-logs.js user@example.com
```

Ini akan auto-complete payment dan trigger webhook, jadi subscription langsung aktif tanpa manual!
