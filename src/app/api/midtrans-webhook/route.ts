import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { SUBSCRIPTION_DURATION_DAYS } from '@/lib/constants';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // 🔥 CRITICAL: Log FULL payload untuk debugging
    console.log('\n========================================');
    console.log('🔔 MIDTRANS WEBHOOK RECEIVED');
    console.log('Timestamp:', new Date().toISOString());
    console.log('========================================');
    console.log('FULL PAYLOAD:');
    console.log(JSON.stringify(body, null, 2));
    console.log('========================================\n');
    
    const {
      order_id,
      status_code,
      transaction_status,
      fraud_status,
      signature_key,
      gross_amount,
      payment_type,
    } = body;

    // Log extracted fields
    console.log('📋 EXTRACTED FIELDS:');
    console.log('- order_id:', order_id);
    console.log('- status_code:', status_code);
    console.log('- transaction_status:', transaction_status);
    console.log('- fraud_status:', fraud_status);
    console.log('- gross_amount:', gross_amount, '(type:', typeof gross_amount, ')');
    console.log('- signature_key:', signature_key);
    console.log('- payment_type:', payment_type);

    // Validasi field wajib
    if (!order_id || !transaction_status || !gross_amount || !signature_key) {
      console.error('❌ Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 🔥 SIGNATURE VERIFICATION - Try BOTH methods
    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
    console.log('\n🔐 SIGNATURE VERIFICATION:');
    console.log('Server Key Length:', serverKey.length);
    
    // Convert gross_amount to string without decimal
    const grossAmountStr = String(gross_amount).split('.')[0];
    console.log('Gross Amount (processed):', grossAmountStr);
    
    // METHOD 1: Using status_code (if exists)
    if (status_code) {
      const signatureString1 = `${order_id}${status_code}${grossAmountStr}${serverKey}`;
      const hash1 = crypto.createHash('sha512').update(signatureString1).digest('hex');
      console.log('\nMethod 1 (status_code):');
      console.log('  String:', signatureString1);
      console.log('  Hash:', hash1);
      console.log('  Match:', hash1 === signature_key ? '✅' : '❌');
      
      if (hash1 === signature_key) {
        console.log('✅ Signature verified with status_code');
        // Continue processing
      } else {
        // Try method 2
        const signatureString2 = `${order_id}${transaction_status}${grossAmountStr}${serverKey}`;
        const hash2 = crypto.createHash('sha512').update(signatureString2).digest('hex');
        console.log('\nMethod 2 (transaction_status):');
        console.log('  String:', signatureString2);
        console.log('  Hash:', hash2);
        console.log('  Match:', hash2 === signature_key ? '✅' : '❌');
        
        if (hash2 !== signature_key) {
          console.error('\n❌ SIGNATURE VERIFICATION FAILED (BOTH METHODS)');
          console.error('Received signature:', signature_key);
          return NextResponse.json(
            { error: 'Invalid signature' },
            { status: 401 }
          );
        }
        console.log('✅ Signature verified with transaction_status');
      }
    } else {
      // Only method 2 available
      const signatureString = `${order_id}${transaction_status}${grossAmountStr}${serverKey}`;
      const hash = crypto.createHash('sha512').update(signatureString).digest('hex');
      console.log('\nSignature String:', signatureString);
      console.log('Generated Hash:', hash);
      console.log('Received Signature:', signature_key);
      console.log('Match:', hash === signature_key ? '✅' : '❌');
      
      if (hash !== signature_key) {
        console.error('\n❌ INVALID SIGNATURE');
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
      console.log('✅ Signature verified successfully');
    }

    // Find payment record
    console.log('\n🔍 SEARCHING PAYMENT:');
    console.log('Looking for order_id:', order_id);
    
    const payment = await prisma.payment.findUnique({
      where: { order_id },
      include: { user: true }
    });

    if (!payment) {
      console.error('❌ Payment not found in database');
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    console.log('✅ Payment found:');
    console.log('  Payment ID:', payment.id);
    console.log('  User ID:', payment.user_id);
    console.log('  User Email:', payment.user.email);
    console.log('  Payment Type:', payment.paymentType);
    console.log('  Current Status:', payment.status);
    console.log('  Amount:', payment.jumlah);

    // 🔥 CRITICAL: Determine new status based on transaction_status
    let newStatus = payment.status;
    console.log('\n📊 DETERMINING STATUS:');
    console.log('Current transaction_status:', transaction_status);
    console.log('Current fraud_status:', fraud_status);

    if (transaction_status === 'capture') {
      console.log('→ Transaction is CAPTURE');
      if (fraud_status === 'accept') {
        newStatus = 'paid';
        console.log('→ Fraud status ACCEPT → Setting to PAID');
      } else if (fraud_status === 'challenge') {
        newStatus = 'pending';
        console.log('→ Fraud status CHALLENGE → Setting to PENDING');
      } else {
        newStatus = 'failed';
        console.log('→ Fraud status DENIED → Setting to FAILED');
      }
    } else if (transaction_status === 'settlement') {
      newStatus = 'paid';
      console.log('→ Transaction is SETTLEMENT → Setting to PAID');
    } else if (transaction_status === 'pending') {
      newStatus = 'pending';
      console.log('→ Transaction is PENDING');
    } else if (
      transaction_status === 'deny' ||
      transaction_status === 'expire' ||
      transaction_status === 'cancel'
    ) {
      newStatus = 'failed';
      console.log('→ Transaction is', transaction_status.toUpperCase(), '→ Setting to FAILED');
    }

    console.log('Final Status:', newStatus);

    // 🔥 CRITICAL: Update payment in database
    console.log('\n💾 UPDATING PAYMENT:');
    try {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: newStatus,
          paid_at: newStatus === 'paid' ? new Date() : null,
        }
      });
      console.log('✅ Payment updated successfully');
    } catch (dbError: any) {
      console.error('❌ Database update error:', dbError.message);
      throw dbError;
    }

    // 🔥 CRITICAL: Activate subscription if payment is successful
    if (newStatus === 'paid' && payment.paymentType === 'subscription') {
      console.log('\n🚀 ACTIVATING SUBSCRIPTION:');
      console.log('User ID:', payment.user_id);
      
      const subscriptionStart = new Date();
      const subscriptionEnd = new Date();
      subscriptionEnd.setDate(subscriptionEnd.getDate() + SUBSCRIPTION_DURATION_DAYS);

      console.log('Subscription Start:', subscriptionStart.toISOString());
      console.log('Subscription End:', subscriptionEnd.toISOString());
      console.log('Duration:', SUBSCRIPTION_DURATION_DAYS, 'days');

      try {
        const updatedUser = await prisma.user.update({
          where: { id: payment.user_id },
          data: {
            isPremium: true,
            subscriptionStatus: 'active',
            subscriptionStart: subscriptionStart,
            subscriptionEnd: subscriptionEnd,
          }
        });

        console.log('✅✅✅ SUBSCRIPTION ACTIVATED SUCCESSFULLY ✅✅✅');
        console.log('User Email:', updatedUser.email);
        console.log('isPremium:', updatedUser.isPremium);
        console.log('subscriptionStatus:', updatedUser.subscriptionStatus);
        console.log('subscriptionEnd:', updatedUser.subscriptionEnd);
      } catch (dbError: any) {
        console.error('❌ Failed to activate subscription:', dbError.message);
        console.error('Error details:', dbError);
        throw dbError;
      }
    } else {
      console.log('\n⚠️ Subscription NOT activated:');
      if (newStatus !== 'paid') {
        console.log('  Reason: Payment status is', newStatus, '(not paid)');
      }
      if (payment.paymentType !== 'subscription') {
        console.log('  Reason: Payment type is', payment.paymentType, '(not subscription)');
      }
    }

    console.log('\n========================================');
    console.log('✅ WEBHOOK PROCESSED SUCCESSFULLY');
    console.log('========================================\n');

    return NextResponse.json({ 
      success: true,
      order_id,
      status: newStatus,
      subscriptionActivated: newStatus === 'paid' && payment.paymentType === 'subscription'
    });
  } catch (error: any) {
    console.error('\n========================================');
    console.error('❌❌❌ WEBHOOK ERROR ❌❌❌');
    console.error('========================================');
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    console.error('========================================\n');
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
