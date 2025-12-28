# 🚀 Production Deployment Guide

## Overview

Panduan lengkap untuk deploy sistem subscription ke production dengan Midtrans payment gateway.

---

## 📋 Pre-Deployment Checklist

### 1. Database Migration

Pastikan migration sudah di-apply di production:

```bash
# Di Railway console atau via railway CLI
npx prisma migrate deploy
```

**Migration yang harus applied:**
- `20251228153625_add_subscription_fields` - Adds subscription fields to User model

### 2. Environment Variables (Railway)

Set di Railway Dashboard → Variables:

```env
# Database (Railway auto-generated)
DATABASE_URL=mysql://user:password@host:port/database

# Midtrans PRODUCTION Keys
MIDTRANS_SERVER_KEY=<your_production_server_key>
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=<your_production_client_key>
MIDTRANS_IS_PRODUCTION=true

# App URL
NEXT_PUBLIC_BASE_URL=https://your-app.up.railway.app

# NextAuth
NEXTAUTH_URL=https://your-app.up.railway.app
NEXTAUTH_SECRET=<your_secret_key>

# Google OAuth (if enabled)
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
```

### 3. Midtrans Dashboard Configuration

Login ke [https://dashboard.midtrans.com](https://dashboard.midtrans.com):

**a) Switch to Production Environment**
- Klik dropdown di pojok kanan atas
- Pilih "Production"

**b) Configure Payment Notification (Webhook)**
1. Go to: **Settings → Configuration**
2. Set **Payment Notification URL**:
   ```
   https://your-app.up.railway.app/api/midtrans-webhook
   ```
3. Save changes

**c) Enable Payment Methods**
1. Go to: **Settings → Snap Preferences**
2. Enable payment channels:
   - ✅ Bank Transfer (BCA, Mandiri, BNI, BRI, Permata)
   - ✅ E-Wallet (GoPay, ShopeePay, QRIS)
   - ✅ Credit/Debit Card (Visa, Mastercard) - Optional
   - ✅ Convenience Store (Alfamart, Indomaret) - Optional

3. Set **minimum payment** if needed
4. Configure **expiry time** (default: 24 hours)

**d) Get Production Keys**
1. Go to: **Settings → Access Keys**
2. Copy:
   - **Server Key** → untuk `MIDTRANS_SERVER_KEY`
   - **Client Key** → untuk `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY`

---

## 🔧 Deployment Steps

### Step 1: Push Code to Repository

```bash
git add .
git commit -m "feat: Add Netflix-style subscription system"
git push origin main
```

Railway akan auto-deploy setelah push.

### Step 2: Apply Database Migration

```bash
# Via Railway CLI
railway run npx prisma migrate deploy

# Or via Railway console
# Open project → Service → Shell
npx prisma migrate deploy
```

### Step 3: Verify Deployment

Check Railway logs:
```bash
railway logs
```

Pastikan tidak ada error pada startup.

### Step 4: Test Webhook Connectivity

Test webhook dari Midtrans:

1. Buat test payment di production
2. Bayar dengan nominal kecil (Rp 10.000)
3. Check Railway logs untuk webhook received
4. Verify subscription activated

---

## ✅ Testing Production Payment Flow

### Test Scenario 1: QRIS Payment

1. User klik "Subscribe" → Rp 55.000
2. Pilih **QRIS**
3. Scan QR dengan app (GoPay/OVO/Dana/LinkAja)
4. Confirm payment
5. Wait 5-10 seconds
6. Refresh browser → Subscription active ✅

### Test Scenario 2: Bank Transfer

1. User klik "Subscribe"
2. Pilih **Bank Transfer BCA**
3. Copy virtual account number
4. Transfer via mobile banking
5. Wait 1-2 minutes (webhook processing)
6. Refresh browser → Subscription active ✅

### Test Scenario 3: E-Wallet

1. User klik "Subscribe"
2. Pilih **GoPay**
3. Redirect ke GoPay app
4. Confirm payment
5. Redirect back to success page
6. Subscription active ✅

---

## 🔍 Monitoring & Debugging

### Check Payment Status

```bash
# Login to production server (Railway shell)
node scripts/check-latest-payments.js
```

### Check User Access

```bash
node scripts/show-user-access.js user@email.com
```

### Manual Subscription Activation (Emergency Only)

```bash
# Jika webhook gagal, bisa manual activate:
node scripts/activate-subscription.js user@email.com
```

### Railway Logs

```bash
# Real-time logs
railway logs --tail

# Filter webhook logs
railway logs | grep "midtrans-webhook"
```

---

## 🚨 Common Issues & Solutions

### Issue 1: Webhook Not Received

**Symptoms:**
- Payment success di Midtrans
- Subscription tidak aktif di app

**Solutions:**
1. Check webhook URL di Midtrans dashboard
2. Verify HTTPS endpoint accessible
3. Check Railway logs for errors
4. Manually trigger webhook test dari Midtrans dashboard

**Manual fix:**
```bash
node scripts/simulate-payment-success.js user@email.com
```

### Issue 2: Invalid Signature Error

**Symptoms:**
- Webhook received but returns 401
- Logs: "Invalid signature"

**Solutions:**
1. Verify `MIDTRANS_SERVER_KEY` is **production** key
2. Check `MIDTRANS_IS_PRODUCTION=true`
3. Restart Railway service after env var change

### Issue 3: Database Connection Error

**Symptoms:**
- Webhook fails with Prisma error
- Cannot update payment status

**Solutions:**
1. Check `DATABASE_URL` correct
2. Verify database migration applied
3. Check database connection limit
4. Restart Railway service

### Issue 4: Payment Success but Subscription Not Active

**Symptoms:**
- Payment status = "paid"
- isPremium still false
- subscriptionStatus = "inactive"

**Debug:**
```bash
# Check payment record
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); (async () => { const payment = await prisma.payment.findFirst({ where: { order_id: 'ORDER_ID' }, include: { user: true } }); console.log(payment); await prisma.$disconnect(); })()"
```

**Manual fix:**
```bash
node scripts/activate-subscription.js user@email.com
```

---

## 📊 Admin Monitoring

### View Recent Payments

1. Login admin: `https://your-app.up.railway.app/admin/login`
2. Go to: **Payments**
3. View all transactions with:
   - User info
   - Payment status
   - Subscription type
   - Timestamp

### View Users

1. Go to: **Users**
2. See all registered users with:
   - Subscription status
   - Expiry date
   - Premium status

---

## 🎯 Success Metrics

### Key Metrics to Monitor

1. **Payment Success Rate**
   - Target: >95% success rate
   - Monitor via admin dashboard

2. **Webhook Response Time**
   - Target: <3 seconds
   - Check Railway logs

3. **Subscription Activation Time**
   - Target: <10 seconds after payment
   - User feedback + logs

4. **Failed Payments**
   - Track via admin dashboard
   - Follow up with users if needed

---

## 🔐 Security Best Practices

### 1. Webhook Signature Verification
✅ Already implemented in `/api/midtrans-webhook/route.ts`

### 2. Environment Variables
- ✅ Never commit `.env` files
- ✅ Use Railway secrets for sensitive data

### 3. HTTPS Only
- ✅ Railway provides auto-HTTPS
- ✅ Midtrans requires HTTPS for webhooks

### 4. Database Security
- ✅ Use connection pooling
- ✅ Limit database access
- ✅ Regular backups (Railway auto-backup)

---

## 📞 Support & Maintenance

### Regular Tasks

**Daily:**
- Check Railway logs for errors
- Monitor payment success rate

**Weekly:**
- Review failed payments
- Check subscription expiry notifications

**Monthly:**
- Database backup verification
- Security audit
- Performance optimization

### Getting Help

**Midtrans Support:**
- Email: support@midtrans.com
- Dashboard: Live chat available
- Docs: https://docs.midtrans.com

**Railway Support:**
- Discord: https://discord.gg/railway
- Docs: https://docs.railway.app

---

## ✅ Production Readiness Checklist

Before going live, ensure:

- [ ] Database migration applied in production
- [ ] All environment variables set correctly
- [ ] Midtrans production keys configured
- [ ] Webhook URL set in Midtrans dashboard
- [ ] Payment methods enabled in Midtrans
- [ ] Test payment flow end-to-end
- [ ] Admin dashboard accessible
- [ ] Monitoring tools ready
- [ ] Backup strategy in place
- [ ] Support contact info prepared

---

## 🎉 You're Ready for Production!

Once all items checked:
1. Deploy to production
2. Test 2-3 real payments (small amount)
3. Monitor for 24-48 hours
4. Announce to users
5. Scale as needed

**Questions?** Check logs, admin dashboard, or refer to this guide.

---

## 📚 Additional Resources

- [Midtrans Documentation](https://docs.midtrans.com)
- [Railway Documentation](https://docs.railway.app)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)

**Last Updated:** December 28, 2025
